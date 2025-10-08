import { ValidacaoResult } from '@/types/validation';

/**
 * Sistema de fallbacks para APIs externas
 * Mitiga riscos de downtime e mudanças em APIs
 */

export interface APIFallbackConfig {
  primary: string;
  fallbacks: string[];
  timeout: number;
  retries: number;
}

export class APIFallbackManager {
  private static instance: APIFallbackManager;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  static getInstance(): APIFallbackManager {
    if (!APIFallbackManager.instance) {
      APIFallbackManager.instance = new APIFallbackManager();
    }
    return APIFallbackManager.instance;
  }

  /**
   * Executa chamada com fallbacks automáticos
   */
  async executeWithFallback<T>(
    config: APIFallbackConfig,
    requestFn: (url: string) => Promise<T>
  ): Promise<T> {
    const cacheKey = `${config.primary}-${JSON.stringify(config)}`;
    
    // Verificar cache primeiro
    const cached = this.getFromCache<T>(cacheKey);
    if (cached) {
      return cached;
    }

    const urls = [config.primary, ...config.fallbacks];
    
    for (let i = 0; i < urls.length; i++) {
      try {
        const result = await this.executeWithTimeout(
          () => requestFn(urls[i]),
          config.timeout
        );
        
        // Salvar no cache
        this.setCache(cacheKey, result);
        return result;
      } catch (error) {
        console.warn(`API ${urls[i]} falhou:`, error);
        
        if (i === urls.length - 1) {
          throw new Error('Todas as APIs falharam');
        }
      }
    }
    
    throw new Error('Nenhuma API disponível');
  }

  private async executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ]);
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data as T;
    }
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

/**
 * Configurações de fallback para cada API
 */
export const API_FALLBACK_CONFIGS = {
  cpf: {
    primary: 'https://mdmidia.com.br/cpf-validate.php',
    fallbacks: [
      'https://api.serpro.gov.br/cpf/v1/consulta',
      'https://api.cpfcnpj.com.br/cpf'
    ],
    timeout: 5000,
    retries: 3
  },
  cep: {
    primary: 'https://viacep.com.br/ws',
    fallbacks: [
      'https://api.postmon.com.br/v1/cep',
      'https://cep.awesomeapi.com.br/json'
    ],
    timeout: 3000,
    retries: 2
  },
  placa: {
    primary: 'https://mdmidia.com.br/placa-validate.php',
    fallbacks: [
      'https://api.fipe.org.br/api/v1/carros/marcas',
      'https://api.veiculos.fipe.org.br/api/veiculos'
    ],
    timeout: 5000,
    retries: 3
  },
  telefone: {
    primary: 'https://apilayer.net/api/validate',
    fallbacks: [
      'https://api.numverify.com/v1/validate',
      'https://api.abstractapi.com/v1/phone'
    ],
    timeout: 4000,
    retries: 2
  },
  email: {
    primary: 'https://optin.safetymails.com',
    fallbacks: [
      'https://api.emailhunter.co/v2/verify',
      'https://api.zerobounce.net/v2/validate'
    ],
    timeout: 3000,
    retries: 2
  }
};

/**
 * Validação de CPF com fallbacks
 */
export async function validarCPFComFallback(cpf: string): Promise<ValidacaoResult> {
  const fallbackManager = APIFallbackManager.getInstance();
  
  try {
    // Tentar API principal primeiro
    const result = await fallbackManager.executeWithFallback(
      API_FALLBACK_CONFIGS.cpf,
      async (url) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cpf: cpf.replace(/\D/g, '') })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
      }
    );
    
    return {
      ok: true,
      parsed: {
        sexo: mapearSexo(result.data?.sexo),
        dataNascimento: formatarData(result.data?.data_nascimento),
        estadoCivil: mapearEstadoCivil(result.data?.estado_civil)
      },
      raw: result
    };
  } catch (error) {
    console.error('Todas as APIs de CPF falharam:', error);
    
    // Fallback para validação local apenas
    return {
      ok: validarCPFAlgoritmo(cpf),
      reason: 'formato',
      parsed: {
        sexo: '',
        dataNascimento: '',
        estadoCivil: ''
      }
    };
  }
}

/**
 * Validação de CEP com fallbacks
 */
export async function validarCEPComFallback(cep: string): Promise<ValidacaoResult> {
  const fallbackManager = APIFallbackManager.getInstance();
  const cepLimpo = cep.replace(/\D/g, '');
  
  if (cepLimpo.length !== 8) {
    return { ok: false, reason: 'formato' };
  }
  
  try {
    const result = await fallbackManager.executeWithFallback(
      API_FALLBACK_CONFIGS.cep,
      async (url) => {
        const response = await fetch(`${url}/${cepLimpo}/json/`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
      }
    );
    
    if (result.erro) {
      return { ok: false, reason: 'nao_encontrado' };
    }
    
    return {
      ok: true,
      parsed: {
        cidade: result.localidade,
        estado: result.uf,
        endereco: result.logradouro,
        bairro: result.bairro
      },
      raw: result
    };
  } catch (error) {
    console.error('Todas as APIs de CEP falharam:', error);
    return { ok: false, reason: 'erro_api' };
  }
}

// Funções auxiliares
function validarCPFAlgoritmo(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) {
    return false;
  }
  
  let soma = 0;
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfLimpo[i-1]) * (11 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo[9])) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfLimpo[i-1]) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  
  return resto === parseInt(cpfLimpo[10]);
}

function mapearSexo(sexo: number): string {
  switch (sexo) {
    case 1: return 'Masculino';
    case 2: return 'Feminino';
    default: return '';
  }
}

function mapearEstadoCivil(estadoCivil: number): string {
  switch (estadoCivil) {
    case 0: return 'Solteiro';
    case 1: return 'Casado';
    case 2: return 'Divorciado';
    case 3: return 'Viúvo';
    default: return '';
  }
}

function formatarData(dataISO: string): string {
  try {
    const date = new Date(dataISO);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dataISO;
  }
}
