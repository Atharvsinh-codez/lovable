export interface ValidacaoResult {
  ok: boolean;
  reason?: 'formato' | 'nao_encontrado' | 'erro_api' | 'invalido';
  parsed?: {
    // CPF
    sexo?: string;
    dataNascimento?: string;
    estadoCivil?: string;
    
    // CEP
    cidade?: string;
    estado?: string;
    endereco?: string;
    bairro?: string;
    
    // Placa
    marcaTxt?: string;
    anoModelo?: string;
    tipoVeiculo?: string;
    modelo?: string;
    combustivel?: string;
    
    // Telefone
    formato?: string;
    operadora?: string;
    tipoTelefone?: string;
    
    // Email
    dominio?: string;
    tipoEmail?: string;
    risco?: string;
  };
  raw?: any;
}

export interface ValidacaoConfig {
  cpf: {
    usarAPI: boolean;
    preencherAutomatico: boolean;
  };
  cep: {
    usarAPI: boolean;
    preencherAutomatico: boolean;
  };
  placa: {
    usarAPI: boolean;
    preencherAutomatico: boolean;
  };
  telefone: {
    usarAPI: boolean;
    validarFormato: boolean;
  };
  email: {
    usarSafetyMails: boolean;
    validarRegex: boolean;
  };
}
