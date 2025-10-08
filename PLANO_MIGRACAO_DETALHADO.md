# 📋 Plano de Migração Detalhado - Seguros Imediato

## 🎯 **Visão Geral do Projeto**

**Objetivo**: Migrar o website https://www.segurosimediato.com.br do Webflow para Next.js, aproveitando a estrutura base do repositório [open-lovable](https://github.com/LucianoOtero/open-lovable).

**Repositório Base**: https://github.com/LucianoOtero/open-lovable  
**Fork Original**: firecrawl/open-lovable  
**Tecnologias**: Next.js 15, TypeScript, Tailwind CSS, Vercel

---

## 📊 **Análise do Estado Atual**

### **✅ Estrutura Existente (open-lovable)**
- **Next.js 15** com App Router configurado
- **TypeScript** com tipagem completa (94.8% do código)
- **Tailwind CSS** para estilização responsiva
- **Sistema de componentes** bem estruturado
- **APIs integradas** (Firecrawl, múltiplos LLMs)
- **Sistema de sandbox** para desenvolvimento
- **Build otimizado** e deploy no Vercel

### **🎯 CONQUISTAS RECENTES (v1.1.0)**
- **✅ Clonagem Webflow pixel-perfect** implementada
- **✅ Estrutura HTML idêntica** ao Webflow original
- **✅ CSS original importado** diretamente do Webflow
- **✅ Formulário Webflow funcional** com validação React
- **✅ Sistema de aprimoramento incremental** criado
- **✅ Versão salva no GitHub** com tag v1.1.0
- **✅ Roadmap detalhado** v1.2.0 → v1.5.0

### **⚠️ Limitações Identificadas**
- **Foco em scraping**: Estrutura voltada para clonagem de sites
- **Falta de formulários complexos**: Não possui sistema de validação avançada
- **Ausência de tracking**: Sem integração com GTM/GA4
- **Sem webhooks**: Não possui sistema de integração externa
- **API externas limitadas**: Apenas Firecrawl e LLMs

### **🎯 Website Atual (segurosimediato.com.br)**
- **Plataforma**: Webflow com custom codes complexos
- **Funcionalidades**: Formulários de cotação, validações, tracking
- **Integrações**: APIs PH3A, Fipe, ViaCEP, Apilayer, SafetyMails
- **Webhooks**: TravelAngels e Webflow Octa
- **Tracking**: GTM, GA4, Google Ads, GCLID

---

## 🛠️ **Arquitetura Técnica Detalhada**

### **1. Estrutura de Pastas Modificada**

```
app/
├── (marketing)/                    # Grupo de rotas de marketing
│   ├── page.tsx                   # Homepage (/)
│   ├── sobre/
│   │   └── page.tsx              # Página sobre (/sobre)
│   └── contato/
│       └── page.tsx              # Página contato (/contato)
├── (seguros)/                     # Grupo de rotas de seguros
│   ├── seguro-auto/
│   │   └── page.tsx             # Seguro de auto (/seguro-auto)
│   ├── seguro-moto/
│   │   └── page.tsx             # Seguro de moto (/seguro-moto)
│   ├── seguro-frotas/
│   │   └── page.tsx             # Seguro de frotas (/seguro-frotas)
│   └── seguro-uber/
│       └── page.tsx             # Seguro Uber/Taxi (/seguro-uber)
├── cotacao/
│   ├── page.tsx                  # Formulário principal (/cotacao)
│   ├── sucesso/
│   │   └── page.tsx            # Página de sucesso (/cotacao/sucesso)
│   └── loading/
│       └── page.tsx            # Página de loading (/cotacao/loading)
├── api/
│   ├── webhooks/
│   │   ├── travelangels/
│   │   │   └── route.ts        # Webhook TravelAngels
│   │   └── webflow-octa/
│   │       └── route.ts        # Webhook Webflow Octa
│   ├── validate/
│   │   ├── cpf/
│   │   │   └── route.ts        # Validação CPF via PH3A
│   │   ├── cep/
│   │   │   └── route.ts        # Validação CEP via ViaCEP
│   │   ├── placa/
│   │   │   └── route.ts        # Validação placa via Fipe
│   │   ├── telefone/
│   │   │   └── route.ts        # Validação telefone via Apilayer
│   │   └── email/
│   │       └── route.ts        # Validação email via SafetyMails
│   └── submit/
│       └── cotacao/
│           └── route.ts         # Submissão de cotação
├── globals.css                  # Estilos globais
├── layout.tsx                   # Layout principal
└── page.tsx                     # Página inicial

components/
├── ui/                          # Componentes base (reutilizar existentes)
│   ├── button.tsx              # Botão customizado
│   ├── input.tsx               # Input com máscaras
│   ├── select.tsx              # Select customizado
│   ├── textarea.tsx            # Textarea
│   ├── alert.tsx               # Alertas
│   ├── loading.tsx             # Loading spinner
│   └── modal.tsx               # Modal/SweetAlert
├── forms/                       # Componentes de formulário
│   ├── FormularioCotacao.tsx   # Formulário principal
│   ├── FormularioContato.tsx   # Formulário de contato
│   ├── FormularioValidacao.tsx # Sistema de validação
│   └── FormularioSteps.tsx     # Formulário em etapas
├── layout/                      # Componentes de layout
│   ├── Header.tsx              # Cabeçalho
│   ├── Footer.tsx              # Rodapé
│   ├── Navigation.tsx         # Navegação
│   └── Sidebar.tsx            # Sidebar (se necessário)
├── sections/                    # Seções da página
│   ├── HeroSection.tsx        # Seção hero
│   ├── ServicosSection.tsx    # Seção de serviços
│   ├── DepoimentosSection.tsx # Seção de depoimentos
│   ├── FormularioSection.tsx  # Seção de formulário
│   └── ContatoSection.tsx     # Seção de contato
├── integrations/                # Integrações externas
│   ├── WhatsAppButton.tsx     # Botão WhatsApp
│   ├── CollectChat.tsx        # Chat online
│   ├── CookieConsent.tsx      # Consentimento cookies
│   └── TrackingScripts.tsx    # Scripts de tracking
└── analytics/                   # Analytics e tracking
    ├── GTM.tsx                 # Google Tag Manager
    ├── GA4.tsx                 # Google Analytics 4
    ├── GoogleAds.tsx          # Google Ads
    └── GCLIDTracker.tsx       # Tracking GCLID

lib/
├── validations/                 # Validações específicas
│   ├── cpf.ts                  # Validação CPF + PH3A
│   ├── cep.ts                  # Validação CEP + ViaCEP
│   ├── placa.ts                # Validação placa + Fipe
│   ├── telefone.ts             # Validação telefone + Apilayer
│   ├── email.ts                # Validação email + SafetyMails
│   └── index.ts                # Exportações centralizadas
├── masks/                       # Máscaras de input
│   ├── cpf-mask.ts             # Máscara CPF
│   ├── cep-mask.ts             # Máscara CEP
│   ├── placa-mask.ts           # Máscara placa
│   ├── telefone-mask.ts        # Máscara telefone
│   └── index.ts                # Exportações centralizadas
├── apis/                        # Integrações com APIs externas
│   ├── ph3a.ts                 # API PH3A para CPF
│   ├── viacep.ts               # ViaCEP para endereços
│   ├── fipe.ts                 # API Fipe para placas
│   ├── apilayer.ts             # Apilayer para telefones
│   ├── safetymails.ts          # SafetyMails para emails
│   └── index.ts                # Exportações centralizadas
├── tracking/                    # Sistema de tracking
│   ├── gtm.ts                  # Google Tag Manager
│   ├── gclid.ts                # Tracking GCLID/GBRAID
│   ├── cookies.ts              # Gerenciamento de cookies
│   └── index.ts                # Exportações centralizadas
├── alerts/                      # Sistema de alertas
│   ├── sweetalert-config.ts    # Configuração SweetAlert2
│   ├── alert-types.ts          # Tipos de alertas
│   └── index.ts                # Exportações centralizadas
├── utils/                       # Utilitários (reutilizar existentes)
│   ├── cn.ts                   # Class names utility
│   ├── format.ts               # Formatação de dados
│   ├── constants.ts            # Constantes do projeto
│   └── validation.ts           # Validações gerais
└── sandbox/                     # Sistema de sandbox (manter existente)
    ├── factory.ts
    ├── sandbox-manager.ts
    └── types.ts

types/
├── cotacao.ts                   # Tipos para cotação
├── validation.ts                # Tipos para validação
├── tracking.ts                  # Tipos para tracking
├── api.ts                       # Tipos para APIs
└── index.ts                     # Exportações centralizadas
```

### **2. Configurações de Ambiente**

#### **Variáveis de Ambiente (.env.local)**
```env
# =================================================================
# REQUIRED - APIs Externas
# =================================================================
PH3A_API_KEY=your_ph3a_api_key
APILAYER_KEY=dce92fa84152098a3b5b7b8db24debbc
SAFETYMAILS_BASE=https://optin.safetymails.com/main/safetyoptin/20a7a1c297e39180bd80428ac13c363e882a531f/9bab7f0c2711c5accfb83588c859dc1103844a94/

# =================================================================
# TRACKING & ANALYTICS
# =================================================================
GTM_ID=GTM-PD6J398
GA4_MEASUREMENT_ID=your_ga4_measurement_id
GOOGLE_ADS_ID=your_google_ads_id

# =================================================================
# WHATSAPP INTEGRATION
# =================================================================
WHATSAPP_PHONE_PRIMARY=551141718837
WHATSAPP_PHONE_SECONDARY=551132301422

# =================================================================
# WEBHOOKS
# =================================================================
TRAVELANGELS_WEBHOOK_URL=https://mdmidia.com.br/add_travelangels.php
WEBFLOW_OCTA_WEBHOOK_URL=https://mdmidia.com.br/add_webflow_octa.php

# =================================================================
# COLLECTCHAT
# =================================================================
COLLECTCHAT_API_KEY=your_collectchat_api_key

# =================================================================
# DOMAIN & URLS
# =================================================================
NEXT_PUBLIC_SITE_URL=https://www.segurosimediato.com.br
NEXT_PUBLIC_DEV_URL=http://localhost:3000

# =================================================================
# EXISTING FIRECRAWL & AI (manter existente)
# =================================================================
FIRECRAWL_API_KEY=your_firecrawl_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
MORPH_API_KEY=your_morphllm_api_key

# =================================================================
# SANDBOX PROVIDER (manter existente)
# =================================================================
SANDBOX_PROVIDER=vercel
VERCEL_OIDC_TOKEN=auto_generated_by_vercel_env_pull
```

### **3. Tipos TypeScript Detalhados**

#### **types/cotacao.ts**
```typescript
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
```

#### **types/validation.ts**
```typescript
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
    tipo?: string;
    
    // Email
    dominio?: string;
    tipo?: string;
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
```

### **4. Sistema de Validação Detalhado**

#### **lib/validations/cpf.ts**
```typescript
import { ValidacaoResult } from '@/types/validation';

// Validação local do algoritmo CPF
export function validarCPFAlgoritmo(cpf: string): boolean {
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

// Validação completa com API PH3A
export async function validarCPFCompleto(cpf: string): Promise<ValidacaoResult> {
  // 1. Validação local primeiro
  if (!validarCPFAlgoritmo(cpf)) {
    return { ok: false, reason: 'formato' };
  }
  
  try {
    // 2. Consulta API PH3A
    const response = await fetch('/api/validate/cpf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf: cpf.replace(/\D/g, '') })
    });
    
    const data = await response.json();
    
    if (data.success && data.data) {
      return {
        ok: true,
        parsed: {
          sexo: mapearSexo(data.data.sexo),
          dataNascimento: formatarData(data.data.data_nascimento),
          estadoCivil: mapearEstadoCivil(data.data.estado_civil)
        },
        raw: data
      };
    }
    
    return { ok: false, reason: 'nao_encontrado' };
  } catch (error) {
    console.error('Erro na validação CPF:', error);
    return { ok: false, reason: 'erro_api' };
  }
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
```

### **5. Sistema de Tracking Detalhado**

#### **lib/tracking/gclid.ts**
```typescript
export interface GCLIDData {
  gclid?: string;
  gbraid?: string;
  gclsrc?: string;
  timestamp: string;
  source: 'url' | 'cookie' | 'localStorage';
}

export class GCLIDTracker {
  private static instance: GCLIDTracker;
  private gclidData: GCLIDData | null = null;
  
  static getInstance(): GCLIDTracker {
    if (!GCLIDTracker.instance) {
      GCLIDTracker.instance = new GCLIDTracker();
    }
    return GCLIDTracker.instance;
  }
  
  // Capturar GCLID da URL
  captureFromURL(): GCLIDData | null {
    const urlParams = new URLSearchParams(window.location.search);
    const gclid = urlParams.get('gclid');
    const gbraid = urlParams.get('gbraid');
    const gclsrc = urlParams.get('gclsrc');
    
    if (gclid || gbraid) {
      const trackingId = gclid || gbraid;
      
      // Salvar cookie por 90 dias
      this.setCookie('gclid', trackingId, 90);
      
      // Salvar localStorage
      localStorage.setItem('gclid', trackingId);
      
      this.gclidData = {
        gclid: gclid || undefined,
        gbraid: gbraid || undefined,
        gclsrc: gclsrc || undefined,
        timestamp: new Date().toISOString(),
        source: 'url'
      };
      
      // Enviar para dataLayer
      this.sendToDataLayer();
      
      return this.gclidData;
    }
    
    return null;
  }
  
  // Recuperar GCLID do cookie
  getFromCookie(): string | null {
    return this.getCookie('gclid');
  }
  
  // Recuperar GCLID do localStorage
  getFromLocalStorage(): string | null {
    return localStorage.getItem('gclid');
  }
  
  // Obter GCLID atual (URL > Cookie > localStorage)
  getCurrentGCLID(): string | null {
    const urlGCLID = this.captureFromURL();
    if (urlGCLID) return urlGCLID.gclid || urlGCLID.gbraid;
    
    return this.getFromCookie() || this.getFromLocalStorage();
  }
  
  // Enviar para Google Tag Manager
  private sendToDataLayer(): void {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gclid': this.gclidData?.gclid || this.gclidData?.gbraid,
        'event': 'gclid_captured',
        'timestamp': this.gclidData?.timestamp
      });
    }
  }
  
  // Utilitários de cookie
  private setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }
  
  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}
```

### **6. Sistema de Webhooks**

#### **app/api/webhooks/travelangels/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { DadosCotacao } from '@/types/cotacao';

export async function POST(request: NextRequest) {
  try {
    const dados: DadosCotacao = await request.json();
    
    // Validar dados obrigatórios
    const camposObrigatorios = ['nome', 'cpf', 'email', 'telefone', 'placa'];
    const camposFaltando = camposObrigatorios.filter(campo => !dados[campo as keyof DadosCotacao]);
    
    if (camposFaltando.length > 0) {
      return NextResponse.json(
        { error: `Campos obrigatórios faltando: ${camposFaltando.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Preparar dados para API externa
    const dadosParaEnvio = {
      nome: dados.nome,
      cpf: dados.cpf.replace(/\D/g, ''),
      email: dados.email,
      telefone: dados.telefone.replace(/\D/g, ''),
      placa: dados.placa.toUpperCase().replace(/[^A-Z0-9]/g, ''),
      marca: dados.marca,
      ano: dados.ano,
      tipo_veiculo: dados.tipoVeiculo,
      cep: dados.cep.replace(/\D/g, ''),
      cidade: dados.cidade,
      estado: dados.estado,
      tipo_seguro: dados.tipoSeguro,
      gclid: dados.gclid,
      fonte: dados.fonte,
      timestamp: new Date().toISOString()
    };
    
    // Enviar para API externa
    const response = await fetch(process.env.TRAVELANGELS_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SegurosImediato/1.0'
      },
      body: JSON.stringify(dadosParaEnvio)
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API externa: ${response.status} ${response.statusText}`);
    }
    
    const resultado = await response.json();
    
    // Log para monitoramento
    console.log('Webhook TravelAngels enviado:', {
      timestamp: new Date().toISOString(),
      cpf: dados.cpf.replace(/\D/g, '').slice(0, 3) + '***',
      placa: dados.placa,
      sucesso: true
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Dados enviados com sucesso',
      webhookId: resultado.id || 'N/A'
    });
    
  } catch (error) {
    console.error('Erro no webhook TravelAngels:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
```

---

## 🗓️ **Cronograma de Implementação Detalhado**

### **✅ SEMANA 1: Preparação e Estrutura Base (CONCLUÍDA)**

#### **✅ Dia 1-2: Análise e Setup**
- [x] **Auditoria completa** do repositório atual
- [x] **Backup do código** existente
- [x] **Análise de dependências** e compatibilidade
- [x] **Setup do ambiente** de desenvolvimento
- [x] **Configuração de variáveis** de ambiente

#### **✅ Dia 3-4: Estrutura Base**
- [x] **Criação da estrutura** de pastas modificada
- [x] **Configuração do sistema** de roteamento
- [x] **Implementação do layout** principal
- [x] **Setup do sistema** de tipagem TypeScript
- [x] **Configuração do Tailwind** com tema da marca

#### **✅ Dia 5-7: Componentes Base**
- [x] **Implementação dos componentes** UI base
- [x] **Sistema de máscaras** para inputs
- [x] **Componente de loading** e estados
- [x] **Sistema de alertas** base
- [x] **Configuração do SweetAlert2** customizado

### **🎯 SEMANA 2: Clonagem Webflow Pixel-Perfect (CONCLUÍDA)**

#### **✅ Dia 8-10: Análise Webflow**
- [x] **Análise detalhada** do site Webflow original
- [x] **Identificação de classes** específicas (w-container, w-row, etc.)
- [x] **Extração de CSS** original do Webflow
- [x] **Mapeamento de estrutura** HTML complexa
- [x] **Identificação de formulários** Webflow específicos

#### **✅ Dia 11-12: Implementação Base**
- [x] **Estrutura HTML idêntica** ao Webflow
- [x] **CSS original importado** diretamente
- [x] **Formulário Webflow funcional** (wf-form-Home-Seguro-Auto)
- [x] **Layout responsivo** do Webflow
- [x] **Sistema de aprimoramento incremental**

#### **✅ Dia 13-14: Validação e Versionamento**
- [x] **Teste de funcionalidades** básicas
- [x] **Comparação visual** com original
- [x] **Commit e tag v1.1.0** no GitHub
- [x] **Documentação** do sistema incremental
- [x] **Roadmap detalhado** v1.2.0 → v1.5.0

### **SEMANA 2: Sistema de Validação**

#### **Dia 8-10: APIs de Validação**
- [ ] **Implementação da API PH3A** para CPF
- [ ] **Integração ViaCEP** para endereços
- [ ] **API Fipe** para validação de placas
- [ ] **Apilayer** para validação de telefones
- [ ] **SafetyMails** para validação de emails

#### **Dia 11-12: Sistema de Validação**
- [ ] **Validação em tempo real** nos formulários
- [ ] **Preenchimento automático** de campos
- [ ] **Tratamento de erros** e feedback
- [ ] **Sistema de confirmação** para dados inválidos
- [ ] **Loading states** durante validação

#### **Dia 13-14: Formulários Complexos**
- [ ] **Formulário principal** de cotação
- [ ] **Formulário em etapas** para UX melhorada
- [ ] **Validação unificada** de todos os campos
- [ ] **Sistema de persistência** de dados
- [ ] **Integração com SweetAlert2**

### **SEMANA 3: Tracking e Integrações**

#### **Dia 15-17: Sistema de Tracking**
- [ ] **Google Tag Manager** completo
- [ ] **Google Analytics 4** configurado
- [ ] **Google Ads Conversion** tracking
- [ ] **Sistema GCLID/GBRAID** completo
- [ ] **Gerenciamento de cookies** com CookieYes

#### **Dia 18-19: Integração WhatsApp**
- [ ] **Componente WhatsAppButton** dinâmico
- [ ] **Mensagens personalizadas** por tipo de seguro
- [ ] **Integração com tracking** GCLID
- [ ] **Múltiplos números** de telefone
- [ ] **Sistema de fallback** para diferentes cenários

#### **Dia 20-21: Webhooks e APIs**
- [ ] **Webhook TravelAngels** implementado
- [ ] **Webhook Webflow Octa** implementado
- [ ] **Sistema de retry** para falhas
- [ ] **Logging e monitoramento** de webhooks
- [ ] **Validação de dados** antes do envio

### **SEMANA 4: Páginas e Conteúdo**

#### **Dia 22-24: Páginas Principais**
- [ ] **Homepage** com hero section otimizada
- [ ] **Página Seguro Auto** com formulário específico
- [ ] **Página Seguro Moto** com formulário específico
- [ ] **Página Seguro Frotas** com formulário específico
- [ ] **Página Seguro Uber/Taxi** com formulário específico

#### **Dia 25-26: Páginas Institucionais**
- [ ] **Página Sobre** com informações da empresa
- [ ] **Página Contato** com formulário e informações
- [ ] **Página de Política** de Privacidade
- [ ] **Página de Termos** de Uso
- [ ] **Página de Cookies** e consentimento

#### **Dia 27-28: Otimização**
- [ ] **Otimização de imagens** com Next.js Image
- [ ] **Implementação de lazy loading**
- [ ] **Otimização de bundle** size
- [ ] **Testes de performance** e correções
- [ ] **SEO básico** implementado

### **SEMANA 5: Integrações Avançadas**

#### **Dia 29-30: CollectChat**
- [ ] **Configuração do CollectChat**
- [ ] **Integração com tracking** GCLID
- [ ] **Customização do tema** da marca
- [ ] **Configuração de atributos** personalizados
- [ ] **Sistema de fallback** para indisponibilidade

#### **Dia 31-32: Sistema de Cookies**
- [ ] **Implementação do CookieYes**
- [ ] **Banner de consentimento** customizado
- [ ] **Gerenciamento de preferências**
- [ ] **Integração condicional** com GTM
- [ ] **Sistema de opt-in/opt-out**

#### **Dia 33-35: Testes e Refinamentos**
- [ ] **Testes de integração** completos
- [ ] **Testes de validação** de formulários
- [ ] **Testes de tracking** e analytics
- [ ] **Testes de performance** em diferentes dispositivos
- [ ] **Correção de bugs** identificados

### **SEMANA 6: Deploy e Go-Live**

#### **Dia 36-37: Preparação para Deploy**
- [ ] **Configuração do domínio** personalizado
- [ ] **Setup de SSL** e certificados
- [ ] **Configuração de redirects** do Webflow
- [ ] **Backup completo** do website atual
- [ ] **Plano de rollback** detalhado

#### **Dia 38-39: Deploy e Monitoramento**
- [ ] **Deploy no Vercel** com domínio personalizado
- [ ] **Configuração de monitoramento** de erros
- [ ] **Setup de alertas** de performance
- [ ] **Testes finais** em produção
- [ ] **Verificação de todas** as funcionalidades

#### **Dia 40-42: Pós-Deploy**
- [ ] **Monitoramento de métricas** por 48h
- [ ] **Correção de issues** identificados
- [ ] **Otimizações finais** de performance
- [ ] **Documentação final** do projeto
- [ ] **Treinamento da equipe** de suporte

---

## ⚠️ **Análise de Riscos Detalhada**

### **Riscos Técnicos**

#### **Alto Risco**
1. **Incompatibilidade de APIs**
   - **Risco**: APIs externas podem mudar ou ficar indisponíveis
   - **Mitigação**: Implementar fallbacks e cache local
   - **Plano B**: Validação local quando APIs falharem

2. **Performance de Validações**
   - **Risco**: Múltiplas validações simultâneas podem causar lentidão
   - **Mitigação**: Debounce e validação assíncrona
   - **Plano B**: Validação apenas no submit

3. **Tracking e Analytics**
   - **Risco**: Perda de dados de tracking durante migração
   - **Mitigação**: Implementar tracking paralelo
   - **Plano B**: Backup de dados antes da migração

#### **Médio Risco**
1. **Compatibilidade de Navegadores**
   - **Risco**: Funcionalidades podem não funcionar em navegadores antigos
   - **Mitigação**: Polyfills e fallbacks
   - **Plano B**: Versão simplificada para navegadores antigos

2. **SEO e Indexação**
   - **Risco**: Perda de posicionamento no Google
   - **Mitigação**: Manter URLs e meta tags
   - **Plano B**: Redirects 301 e sitemap atualizado

#### **Baixo Risco**
1. **Responsividade**
   - **Risco**: Problemas em dispositivos móveis
   - **Mitigação**: Testes extensivos em diferentes dispositivos
   - **Plano B**: Ajustes rápidos pós-deploy

### **Riscos de Negócio**

#### **Alto Risco**
1. **Interrupção de Conversões**
   - **Risco**: Perda de leads durante migração
   - **Mitigação**: Deploy em horário de baixo tráfego
   - **Plano B**: Rollback rápido se necessário

2. **Problemas de Integração**
   - **Risco**: Webhooks podem falhar
   - **Mitigação**: Sistema de retry e logs detalhados
   - **Plano B**: Envio manual de dados críticos

#### **Médio Risco**
1. **Experiência do Usuário**
   - **Risco**: Mudanças podem confundir usuários
   - **Mitigação**: Manter design similar ao atual
   - **Plano B**: Feedback rápido e ajustes

2. **Custos Operacionais**
   - **Risco**: Aumento de custos com APIs
   - **Mitigação**: Monitoramento de uso e limites
   - **Plano B**: Otimização de chamadas de API

### **Riscos de Compliance**

#### **Alto Risco**
1. **LGPD e Cookies**
   - **Risco**: Não conformidade com leis de privacidade
   - **Mitigação**: Sistema de consentimento robusto
   - **Plano B**: Consultoria jurídica especializada

2. **Proteção de Dados**
   - **Risco**: Vazamento de dados pessoais
   - **Mitigação**: Criptografia e validação rigorosa
   - **Plano B**: Plano de resposta a incidentes

---

## 📊 **Métricas e KPIs Detalhados**

### **Métricas Técnicas**

#### **Performance**
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s
- **First Contentful Paint (FCP)**: < 1.8s

#### **SEO**
- **Lighthouse Performance Score**: > 90
- **Lighthouse SEO Score**: > 95
- **Lighthouse Accessibility Score**: > 90
- **Lighthouse Best Practices Score**: > 90

#### **Acessibilidade**
- **WCAG 2.1 AA Compliance**: 100%
- **Screen Reader Compatibility**: Testado
- **Keyboard Navigation**: Funcional
- **Color Contrast**: Mínimo 4.5:1

### **Métricas de Negócio**

#### **Conversão**
- **Taxa de conversão geral**: > 15%
- **Taxa de conversão por tipo de seguro**:
  - Auto: > 20%
  - Moto: > 15%
  - Frotas: > 25%
  - Uber: > 18%

#### **Engajamento**
- **Tempo médio na página**: > 2 minutos
- **Taxa de rejeição**: < 30%
- **Páginas por sessão**: > 3
- **Taxa de retorno**: > 25%

#### **Formulários**
- **Taxa de abandono**: < 30%
- **Taxa de conclusão**: > 70%
- **Tempo médio de preenchimento**: < 5 minutos
- **Taxa de erro**: < 5%

### **Métricas de Tracking**

#### **Analytics**
- **GCLID capture rate**: > 95%
- **GA4 event tracking**: 100% funcional
- **Google Ads conversion**: Rastreado
- **Custom events**: Implementados

#### **APIs**
- **Taxa de sucesso das validações**: > 98%
- **Tempo médio de resposta**: < 2s
- **Taxa de erro das APIs**: < 2%
- **Uptime das integrações**: > 99%

---

## 🔒 **Segurança e Compliance**

### **Proteção de Dados**

#### **Criptografia**
- **HTTPS**: Obrigatório em todas as páginas
- **TLS 1.3**: Versão mais recente
- **HSTS**: Headers de segurança
- **CSP**: Content Security Policy

#### **Validação de Input**
- **Sanitização**: Todos os inputs validados
- **XSS Protection**: Headers de proteção
- **CSRF Protection**: Tokens de segurança
- **Rate Limiting**: Proteção contra spam

### **LGPD Compliance**

#### **Consentimento**
- **Cookie Banner**: Implementado com CookieYes
- **Opt-in**: Consentimento explícito
- **Granularidade**: Controle por categoria
- **Retirada**: Opção de opt-out

#### **Transparência**
- **Política de Privacidade**: Atualizada
- **Termos de Uso**: Claros e acessíveis
- **Cookies Policy**: Detalhada
- **Direitos do Usuário**: Explicados

### **Backup e Recuperação**

#### **Estratégia de Backup**
- **Backup diário**: Dados de formulários
- **Backup semanal**: Código e configurações
- **Backup mensal**: Arquivos estáticos
- **Teste de restauração**: Mensal

#### **Disaster Recovery**
- **RTO**: Recovery Time Objective < 4h
- **RPO**: Recovery Point Objective < 1h
- **Plano de contingência**: Documentado
- **Equipe de resposta**: Definida

---

## 🚀 **Estratégia de Deploy**

### **Ambientes**

#### **Desenvolvimento**
- **Branch**: `develop`
- **URL**: `https://open-lovable-dev.vercel.app`
- **Deploy**: Automático a cada push
- **Banco**: Local/SQLite

#### **Staging**
- **Branch**: `staging`
- **URL**: `https://open-lovable-staging.vercel.app`
- **Deploy**: Manual via Vercel Dashboard
- **Banco**: Staging/PostgreSQL

#### **Produção**
- **Branch**: `main`
- **URL**: `https://www.segurosimediato.com.br`
- **Deploy**: Manual após aprovação
- **Banco**: Produção/PostgreSQL

### **Pipeline de Deploy**

#### **Pré-Deploy**
1. **Testes automatizados** passando
2. **Build de produção** sem erros
3. **Lighthouse scores** dentro dos limites
4. **Backup do ambiente** atual
5. **Aprovação** do Product Owner

#### **Deploy**
1. **Deploy no Vercel** com domínio personalizado
2. **Configuração de DNS** e SSL
3. **Verificação de funcionalidades** críticas
4. **Ativação de monitoramento**
5. **Notificação** da equipe

#### **Pós-Deploy**
1. **Monitoramento** por 48h
2. **Verificação de métricas** de negócio
3. **Correção** de issues identificados
4. **Documentação** de mudanças
5. **Feedback** dos usuários

### **Rollback Strategy**

#### **Critérios para Rollback**
- **Taxa de erro** > 5%
- **Tempo de resposta** > 10s
- **Taxa de conversão** < 5%
- **Problemas críticos** identificados

#### **Processo de Rollback**
1. **Identificação** do problema
2. **Decisão** de rollback (< 15min)
3. **Execução** do rollback (< 5min)
4. **Verificação** de funcionamento
5. **Comunicação** da equipe

---

## 📞 **Equipe e Responsabilidades**

### **Equipe Técnica**

#### **Tech Lead**
- **Responsabilidades**: Arquitetura, code review, decisões técnicas
- **Skills**: Next.js, TypeScript, React, Node.js
- **Tempo**: 100% dedicado ao projeto

#### **Frontend Developer**
- **Responsabilidades**: Componentes, UI/UX, integrações
- **Skills**: React, TypeScript, Tailwind CSS
- **Tempo**: 100% dedicado ao projeto

#### **Backend Developer**
- **Responsabilidades**: APIs, webhooks, validações
- **Skills**: Node.js, TypeScript, APIs REST
- **Tempo**: 80% dedicado ao projeto

#### **QA Engineer**
- **Responsabilidades**: Testes, validação, qualidade
- **Skills**: Testing, Cypress, Jest
- **Tempo**: 60% dedicado ao projeto

### **Stakeholders**

#### **Product Owner**
- **Nome**: Luciano Rodrigues Otero
- **Email**: lrotero@gmail.com
- **Responsabilidades**: Requisitos, aprovações, decisões de negócio

#### **Cliente**
- **Empresa**: Imediato Soluções em Seguros
- **Contato**: lrotero@gmail.com
- **Responsabilidades**: Feedback, validação, go-live

---

## 📋 **Checklist Final Detalhado**

### **Pré-Deploy**

#### **Técnico**
- [ ] Todos os testes unitários passando
- [ ] Testes de integração funcionando
- [ ] Testes E2E completos
- [ ] Performance otimizada (Lighthouse > 90)
- [ ] Acessibilidade validada (WCAG 2.1 AA)
- [ ] SEO configurado (meta tags, sitemap)
- [ ] Analytics funcionando (GA4, GTM)
- [ ] APIs externas testadas
- [ ] Webhooks funcionando
- [ ] Backup do site atual

#### **Funcional**
- [ ] Formulários de cotação funcionando
- [ ] Validações em tempo real operacionais
- [ ] Preenchimento automático funcionando
- [ ] WhatsApp integrado com tracking
- [ ] Chat online funcionando
- [ ] Sistema de cookies implementado
- [ ] Tracking GCLID operacional
- [ ] Todas as páginas responsivas
- [ ] Navegação funcionando
- [ ] Conteúdo atualizado

#### **Negócio**
- [ ] Taxa de conversão mantida ou melhorada
- [ ] Experiência do usuário validada
- [ ] Tempo de carregamento < 3s
- [ ] Funcionalidades críticas testadas
- [ ] Equipe treinada
- [ ] Documentação completa
- [ ] Plano de suporte definido

### **Deploy**

#### **Infraestrutura**
- [ ] Domínio configurado
- [ ] SSL ativo e válido
- [ ] DNS configurado corretamente
- [ ] Redirects do Webflow configurados
- [ ] Monitoramento ativo
- [ ] Alertas configurados
- [ ] Backup automático ativo

#### **Verificação**
- [ ] Site carregando corretamente
- [ ] Formulários funcionando
- [ ] APIs respondendo
- [ ] Analytics coletando dados
- [ ] Tracking funcionando
- [ ] WhatsApp funcionando
- [ ] Chat online funcionando
- [ ] Mobile funcionando
- [ ] Desktop funcionando

### **Pós-Deploy**

#### **Monitoramento (48h)**
- [ ] Métricas de performance estáveis
- [ ] Taxa de erro < 1%
- [ ] Tempo de resposta < 2s
- [ ] Taxa de conversão mantida
- [ ] Analytics coletando dados
- [ ] Webhooks funcionando
- [ ] APIs estáveis
- [ ] Feedback dos usuários positivo

#### **Otimização**
- [ ] Issues identificados corrigidos
- [ ] Performance otimizada
- [ ] UX melhorada
- [ ] Documentação atualizada
- [ ] Equipe treinada
- [ ] Suporte operacional

---

## 🎉 **CONQUISTAS RECENTES - v1.1.0**

### **✅ Clonagem Webflow Pixel-Perfect Implementada**

#### **Estrutura Base**
- **✅ Estrutura HTML idêntica** ao Webflow original
- **✅ Classes Webflow** (w-container, w-row, w-col-7, w-col-5, etc.)
- **✅ CSS original importado** diretamente do Webflow
- **✅ Layout responsivo** do Webflow implementado

#### **Formulário Webflow**
- **✅ Formulário funcional** (wf-form-Home-Seguro-Auto)
- **✅ Campos idênticos** ao original
- **✅ Validação React** implementada
- **✅ Estados de loading** e feedback

#### **Componentes Implementados**
- **✅ Header completo** com contatos (SP, RJ, WhatsApp, Emergência)
- **✅ Hero section** com preço destacado (R$ 79⁹⁰ MENSAIS)
- **✅ Seção de seguros** (Auto, Caminhão, Uber, Motos)
- **✅ Footer completo** (SUSEP, CNPJ, endereço)

#### **Sistema de Desenvolvimento**
- **✅ Sistema de aprimoramento incremental** criado
- **✅ Roadmap detalhado** v1.2.0 → v1.5.0
- **✅ Processo de desenvolvimento** documentado
- **✅ Métricas de sucesso** definidas

#### **Versionamento**
- **✅ Commit e926855** com clonagem base
- **✅ Tag v1.1.0** criada no GitHub
- **✅ Documentação** atualizada
- **✅ Próximos passos** definidos

### **🎯 Próximo Milestone: v1.2.0 - Refinamento Visual**

#### **Objetivos**
- **🎯 Cores exatas** do Webflow
- **🎯 Tipografia original** implementada
- **🎯 Layout pixel-perfect** refinado
- **🎯 Elementos visuais** otimizados

#### **Critérios de Sucesso**
- **🎯 Diferenças visuais** < 5%
- **🎯 Responsividade idêntica** ao original
- **🎯 Comparação lado a lado** satisfatória

---

**Documento criado em**: Janeiro 2025  
**Versão**: 2.1 (Atualizada com conquistas v1.1.0)  
**Próxima revisão**: Após Milestone v1.2.0  
**Repositório**: https://github.com/LucianoOtero/open-lovable  
**Tag Atual**: v1.1.0  
**Próxima Tag**: v1.2.0 (Refinamento Visual)
