export interface DadosCotacao {
  // Dados pessoais
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  sexo: 'Masculino' | 'Feminino';
  estadoCivil: 'Solteiro' | 'Casado' | 'Divorciado' | 'Viúvo';
  
  // Dados do veículo
  placa: string;
  marca: string;
  modelo?: string;
  ano: string;
  tipoVeiculo: 'carro' | 'moto';
  usoVeiculo: 'particular' | 'comercial' | 'uber' | 'taxi';
  
  // Dados de endereço
  cep: string;
  cidade: string;
  estado: string;
  endereco: string;
  numero: string;
  complemento?: string;
  
  // Dados de seguro
  tipoSeguro: 'auto' | 'moto' | 'frotas' | 'uber';
  cobertura: 'basica' | 'completa' | 'premium';
  franquia?: string;
  
  // Tracking e marketing
  gclid?: string;
  gbraid?: string;
  fonte: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  
  // Metadados
  timestamp: string;
  userAgent: string;
  ip?: string;
  referrer?: string;
}

export interface CotacaoResponse {
  success: boolean;
  cotacaoId?: string;
  message: string;
  errors?: string[];
  dados?: DadosCotacao;
}
