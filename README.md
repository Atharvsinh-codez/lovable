# Open Lovable - Seguros Imediato

## 🎯 Objetivo do Projeto

Este projeto tem como objetivo replicar o website **https://www.segurosimediato.com.br** (atualmente hospedado no Webflow) utilizando **Next.js** e hospedando no **Vercel**. O site é uma corretora de seguros especializada em seguros de auto, moto e frotas.

## 📋 Análise do Website Atual

### Estrutura Principal
- **Domínio**: segurosimediato.com.br
- **Plataforma atual**: Webflow
- **Tipo de negócio**: Corretora de seguros
- **Foco**: Seguros de auto, moto, utilitários, frotas, Uber/Taxi

### Funcionalidades Identificadas
1. **Formulários de cotação** com validação avançada
2. **Integração com WhatsApp** para atendimento
3. **Sistema de tracking** (Google Ads, GTM)
4. **Validação de dados** via APIs externas
5. **Webhooks** para integração com sistemas externos
6. **Chat online** (CollectChat)
7. **Sistema de cookies** e consentimento

## 🔧 Modificações Necessárias no Código

### 1. **Estrutura de Páginas**

#### Páginas Principais a Criar:
```
app/
├── page.tsx                    # Homepage
├── seguro-auto/
│   └── page.tsx               # Seguro de Auto
├── seguro-moto/
│   └── page.tsx               # Seguro de Moto
├── seguro-frotas/
│   └── page.tsx               # Seguro de Frotas
├── seguro-uber/
│   └── page.tsx               # Seguro para Uber/Taxi
├── cotacao/
│   └── page.tsx               # Formulário de Cotação
├── sobre/
│   └── page.tsx               # Sobre a Empresa
└── contato/
    └── page.tsx               # Contato
```

### 2. **Componentes Específicos**

#### Formulário de Cotação (`components/cotacao/`)
```typescript
// FormulárioPrincipal.tsx
interface FormularioCotacaoProps {
  tipoSeguro: 'auto' | 'moto' | 'frotas' | 'uber';
  onSubmit: (dados: DadosCotacao) => void;
}

// ValidaçãoUnificada.tsx
interface ValidacaoProps {
  campos: {
    cpf: boolean;
    cep: boolean;
    placa: boolean;
    celular: boolean;
    email: boolean;
  };
}
```

#### Integração WhatsApp (`components/whatsapp/`)
```typescript
// WhatsAppButton.tsx
interface WhatsAppProps {
  telefone: string;
  mensagem: string;
  gclid?: string;
}
```

### 3. **APIs e Integrações**

#### APIs Externas Identificadas:
```typescript
// lib/apis/
├── cpf-validation.ts          # API PH3A para CPF
├── cep-validation.ts          # ViaCEP para CEP
├── placa-validation.ts       # API Placa Fipe
├── telefone-validation.ts    # Apilayer para telefone
└── email-validation.ts       # SafetyMails para email
```

#### Webhooks a Implementar:
```typescript
// app/api/webhooks/
├── travelangels/
│   └── route.ts              # https://mdmidia.com.br/add_travelangels.php
└── webflow-octa/
    └── route.ts              # https://mdmidia.com.br/add_webflow_octa.php
```

### 4. **Sistema de Tracking**

#### Google Tag Manager
```typescript
// components/analytics/
├── GTM.tsx                   # Google Tag Manager
├── GA4.tsx                   # Google Analytics 4
└── GoogleAds.tsx             # Google Ads Conversion
```

#### Cookies e Consentimento
```typescript
// lib/cookies/
├── cookie-manager.ts         # Gerenciamento de cookies
├── gclid-tracker.ts         # Tracking GCLID/GBRAID
└── consent-manager.ts        # CookieYes integration
```

### 5. **Validações Específicas**

#### Validação de CPF com API PH3A
```typescript
// lib/validations/cpf.ts
export async function validarCPFCompleto(cpf: string) {
  // 1. Validação local (algoritmo)
  // 2. Consulta API PH3A
  // 3. Preenchimento automático de campos
  // 4. Tratamento de erros
}
```

#### Validação de Placa com API Fipe
```typescript
// lib/validations/placa.ts
export async function validarPlacaCompleta(placa: string) {
  // 1. Validação formato (antigo/mercosul)
  // 2. Consulta API Fipe
  // 3. Preenchimento automático marca/ano/tipo
}
```

### 6. **Estilos e Design System**

#### Cores da Marca
```css
:root {
  --brand-primary: #004A8D;    /* Azul escuro */
  --brand-accent: #009FE3;     /* Azul claro */
  --brand-success: #10B981;    /* Verde */
  --brand-warning: #F59E0B;    /* Amarelo */
}
```

#### Componentes de UI
```typescript
// components/ui/
├── SweetAlert.tsx            # Alertas customizados
├── LoadingOverlay.tsx        # Loading com spinner
├── FormField.tsx            # Campos de formulário
└── WhatsAppButton.tsx       # Botão WhatsApp
```

### 7. **Configurações de Ambiente**

#### Variáveis de Ambiente (`.env.local`)
```env
# APIs
PH3A_API_KEY=your_ph3a_key
APILAYER_KEY=dce92fa84152098a3b5b7b8db24debbc
SAFETYMAILS_BASE=https://optin.safetymails.com/main/safetyoptin/...

# Tracking
GTM_ID=GTM-PD6J398
GA4_MEASUREMENT_ID=your_ga4_id
GOOGLE_ADS_ID=your_ads_id

# WhatsApp
WHATSAPP_PHONE=551141718837
WHATSAPP_PHONE_ALT=551132301422

# Webhooks
TRAVELANGELS_WEBHOOK=https://mdmidia.com.br/add_travelangels.php
WEBFLOW_OCTA_WEBHOOK=https://mdmidia.com.br/add_webflow_octa.php
```

### 8. **Funcionalidades Específicas**

#### Sistema de Máscaras
```typescript
// lib/masks/
├── cpf-mask.ts              # 000.000.000-00
├── cep-mask.ts              # 00000-000
├── placa-mask.ts            # SSS-0A00 (antigo/mercosul)
├── telefone-mask.ts         # (00) 00000-0000
└── email-validation.ts      # Regex + SafetyMails
```

#### SweetAlert2 Customizado
```typescript
// lib/alerts/sweetalert-config.ts
export const swalConfig = {
  theme: {
    primary: '#004A8D',
    accent: '#009FE3',
    borderRadius: '14px'
  },
  icons: {
    warning: 'blue-circle-with-exclamation'
  }
};
```

### 9. **Estrutura de Dados**

#### Tipos TypeScript
```typescript
// types/cotacao.ts
interface DadosCotacao {
  // Dados pessoais
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  
  // Dados do veículo
  placa: string;
  marca: string;
  ano: string;
  tipoVeiculo: 'carro' | 'moto';
  
  // Dados de endereço
  cep: string;
  cidade: string;
  estado: string;
  
  // Tracking
  gclid?: string;
  fonte: string;
}
```

### 10. **Implementação dos Webhooks**

#### Webhook TravelAngels
```typescript
// app/api/webhooks/travelangels/route.ts
export async function POST(request: Request) {
  const dados = await request.json();
  
  // Enviar para https://mdmidia.com.br/add_travelangels.php
  const response = await fetch('https://mdmidia.com.br/add_travelangels.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  
  return Response.json({ success: true });
}
```

#### Webhook Webflow Octa
```typescript
// app/api/webhooks/webflow-octa/route.ts
export async function POST(request: Request) {
  const dados = await request.json();
  
  // Enviar para https://mdmidia.com.br/add_webflow_octa.php
  const response = await fetch('https://mdmidia.com.br/add_webflow_octa.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  
  return Response.json({ success: true });
}
```

## 🚀 Próximos Passos

### ✅ Fase 1: Estrutura Base (CONCLUÍDA)
1. ✅ Configurar Next.js com TypeScript
2. ✅ Implementar sistema de roteamento
3. ✅ Configurar Tailwind CSS com tema da marca
4. ✅ Implementar componentes base
5. ✅ **Clonagem Webflow pixel-perfect v1.1.0**

### 🎯 Fase 2: Refinamento Visual (EM ANDAMENTO)
1. 🎯 **v1.2.0**: Ajustar cores e tipografia exatas
2. 🎯 **v1.2.0**: Layout pixel-perfect
3. 🎯 **v1.2.0**: Elementos visuais refinados
4. 🎯 **v1.3.0**: Animações e interações

### ⏳ Fase 3: Funcionalidades Core (PLANEJADA)
1. ⏳ Implementar formulários de cotação
2. ⏳ Integrar validações de CPF, CEP, Placa
3. ⏳ Configurar sistema de tracking (GTM, GA4)
4. ⏳ Implementar integração WhatsApp

### ⏳ Fase 4: Integrações Avançadas (PLANEJADA)
1. ⏳ Configurar webhooks
2. ⏳ Implementar sistema de cookies
3. ⏳ Integrar CollectChat
4. ⏳ Configurar SweetAlert2 customizado

### ⏳ Fase 5: Otimização e Deploy (PLANEJADA)
1. ⏳ Otimizar performance
2. ⏳ Configurar SEO
3. ⏳ Deploy no Vercel
4. ⏳ Configurar domínio personalizado

## 📊 Status Atual

- ✅ **Build funcionando** sem erros críticos
- ✅ **Warnings minimizados** (apenas 1 warning aceitável)
- ✅ **Performance otimizada** com hooks corretos
- ✅ **Estrutura base** configurada
- ✅ **Clonagem Webflow pixel-perfect v1.1.0** implementada
- ✅ **Sistema de aprimoramento incremental** criado
- ✅ **Versão salva no GitHub** com tag v1.1.0
- 🎯 **Próximo**: Refinamento Visual (v1.2.0)

## 🎨 Design System

### Paleta de Cores
- **Primária**: #004A8D (Azul escuro)
- **Secundária**: #009FE3 (Azul claro)
- **Sucesso**: #10B981 (Verde)
- **Aviso**: #F59E0B (Amarelo)
- **Erro**: #EF4444 (Vermelho)

### Tipografia
- **Fonte principal**: System UI / Inter
- **Fonte mono**: Geist Mono (para códigos)

### Componentes
- **Botões**: Gradiente azul com bordas arredondadas
- **Formulários**: Campos com validação em tempo real
- **Alertas**: SweetAlert2 com tema customizado
- **Loading**: Spinner com overlay azul

## 🔗 Links Importantes

- **Website atual**: https://www.segurosimediato.com.br
- **Nossa clonagem**: http://localhost:3001/webflow-clone
- **Deploy**: https://open-lovable.vercel.app
- **Repositório**: https://github.com/LucianoOtero/open-lovable
- **Tag atual**: v1.1.0
- **Roadmap**: ROADMAP_APRIMORAMENTO.md

---

**Desenvolvido por**: Luciano Rodrigues Otero  
**Email**: lrotero@gmail.com  
**Empresa**: Imediato Soluções em Seguros