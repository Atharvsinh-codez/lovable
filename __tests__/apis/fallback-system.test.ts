# __tests__/apis/fallback-system.test.ts

import { 
  APIFallbackManager, 
  validarCPFComFallback, 
  validarCEPComFallback,
  API_FALLBACK_CONFIGS 
} from '@/lib/apis/fallback-system';
import { mockAPISuccess, mockAPIFailure, mockAPITimeout } from '../setup/test-utils';

describe('APIFallbackManager', () => {
  let fallbackManager: APIFallbackManager;

  beforeEach(() => {
    fallbackManager = APIFallbackManager.getInstance();
    jest.clearAllMocks();
  });

  describe('executeWithFallback', () => {
    it('deve executar com sucesso na primeira tentativa', async () => {
      mockAPISuccess({ success: true, data: { cpf: '12345678901' } });

      const config = {
        primary: 'https://api1.com',
        fallbacks: ['https://api2.com'],
        timeout: 5000,
        retries: 3
      };

      const result = await fallbackManager.executeWithFallback(
        config,
        async (url) => {
          const response = await fetch(url);
          return await response.json();
        }
      );

      expect(result).toEqual({ success: true, data: { cpf: '12345678901' } });
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('deve tentar fallback quando API principal falha', async () => {
      mockAPIFailure(500);
      mockAPISuccess({ success: true, data: { cpf: '12345678901' } });

      const config = {
        primary: 'https://api1.com',
        fallbacks: ['https://api2.com'],
        timeout: 5000,
        retries: 3
      };

      const result = await fallbackManager.executeWithFallback(
        config,
        async (url) => {
          const response = await fetch(url);
          return await response.json();
        }
      );

      expect(result).toEqual({ success: true, data: { cpf: '12345678901' } });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('deve falhar quando todas as APIs falham', async () => {
      mockAPIFailure(500);
      mockAPIFailure(500);

      const config = {
        primary: 'https://api1.com',
        fallbacks: ['https://api2.com'],
        timeout: 5000,
        retries: 3
      };

      await expect(
        fallbackManager.executeWithFallback(
          config,
          async (url) => {
            const response = await fetch(url);
            return await response.json();
          }
        )
      ).rejects.toThrow('Todas as APIs falharam');
    });

    it('deve respeitar timeout configurado', async () => {
      mockAPITimeout();

      const config = {
        primary: 'https://api1.com',
        fallbacks: ['https://api2.com'],
        timeout: 100,
        retries: 3
      };

      await expect(
        fallbackManager.executeWithFallback(
          config,
          async () => {
            await new Promise(resolve => setTimeout(resolve, 200));
            return { success: true };
          }
        )
      ).rejects.toThrow('Timeout');
    });
  });

  describe('cache', () => {
    it('deve usar cache para requisições repetidas', async () => {
      mockAPISuccess({ success: true, data: { cached: true } });

      const config = {
        primary: 'https://api1.com',
        fallbacks: [],
        timeout: 5000,
        retries: 3
      };

      // Primeira chamada
      const result1 = await fallbackManager.executeWithFallback(
        config,
        async (url) => {
          const response = await fetch(url);
          return await response.json();
        }
      );

      // Segunda chamada (deve usar cache)
      const result2 = await fallbackManager.executeWithFallback(
        config,
        async (url) => {
          const response = await fetch(url);
          return await response.json();
        }
      );

      expect(result1).toEqual(result2);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});

describe('validarCPFComFallback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve validar CPF com sucesso usando API principal', async () => {
    mockAPISuccess({
      codigo: 1,
      data: {
        sexo: 1,
        data_nascimento: '1990-01-01',
        estado_civil: 1
      }
    });

    const result = await validarCPFComFallback('11144477735');

    expect(result.ok).toBe(true);
    expect(result.parsed?.sexo).toBe('Masculino');
    expect(result.parsed?.estadoCivil).toBe('Casado');
    expect(result.parsed?.dataNascimento).toBe('01/01/1990');
  });

  it('deve usar fallback local quando APIs falham', async () => {
    mockAPIFailure(500);
    mockAPIFailure(500);
    mockAPIFailure(500);

    const result = await validarCPFComFallback('11144477735');

    expect(result.ok).toBe(true); // Algoritmo local deve validar
    expect(result.reason).toBe('formato');
    expect(result.parsed?.sexo).toBe('');
  });

  it('deve falhar para CPF inválido', async () => {
    mockAPIFailure(500);
    mockAPIFailure(500);
    mockAPIFailure(500);

    const result = await validarCPFComFallback('11111111111');

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('formato');
  });
});

describe('validarCEPComFallback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve validar CEP com sucesso', async () => {
    mockAPISuccess({
      cep: '01310-100',
      logradouro: 'Avenida Paulista',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP'
    });

    const result = await validarCEPComFallback('01310-100');

    expect(result.ok).toBe(true);
    expect(result.parsed?.cidade).toBe('São Paulo');
    expect(result.parsed?.estado).toBe('SP');
    expect(result.parsed?.endereco).toBe('Avenida Paulista');
  });

  it('deve falhar para CEP inválido', async () => {
    const result = await validarCEPComFallback('123');

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('formato');
  });

  it('deve falhar para CEP não encontrado', async () => {
    mockAPISuccess({ erro: true });

    const result = await validarCEPComFallback('00000-000');

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('nao_encontrado');
  });
});

describe('API_FALLBACK_CONFIGS', () => {
  it('deve ter configurações válidas para todas as APIs', () => {
    expect(API_FALLBACK_CONFIGS.cpf).toBeDefined();
    expect(API_FALLBACK_CONFIGS.cep).toBeDefined();
    expect(API_FALLBACK_CONFIGS.placa).toBeDefined();
    expect(API_FALLBACK_CONFIGS.telefone).toBeDefined();
    expect(API_FALLBACK_CONFIGS.email).toBeDefined();

    // Verificar se todas têm fallbacks
    Object.values(API_FALLBACK_CONFIGS).forEach(config => {
      expect(config.primary).toBeDefined();
      expect(config.fallbacks).toBeInstanceOf(Array);
      expect(config.fallbacks.length).toBeGreaterThan(0);
      expect(config.timeout).toBeGreaterThan(0);
      expect(config.retries).toBeGreaterThan(0);
    });
  });
});
