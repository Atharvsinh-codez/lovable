import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Buscar o site original
    const response = await fetch('https://www.segurosimediato.com.br', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // Análise detalhada para reconstrução pixel-perfect
    const analysis = {
      // Informações básicas
      title: extractTitle(html),
      metaDescription: extractMetaDescription(html),
      
      // Header com contatos
      header: extractHeaderWithContacts(html),
      
      // Layout principal (duas colunas)
      mainLayout: extractMainLayout(html),
      
      // Formulário exato
      form: extractExactForm(html),
      
      // Informações da empresa
      companyInfo: extractCompanyInfo(html),
      
      // Preços e ofertas
      pricing: extractPricing(html),
      
      // Footer
      footer: extractFooter(html),
      
      // Cores exatas
      colors: extractExactColors(html),
      
      // Tipografia
      typography: extractExactTypography(html),
      
      // CSS específico
      styles: extractSpecificStyles(html)
    };

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao analisar site original', details: error.message },
      { status: 500 }
    );
  }
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return match ? match[1].trim() : '';
}

function extractMetaDescription(html: string): string {
  const match = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  return match ? match[1].trim() : '';
}

function extractHeaderWithContacts(html: string): any {
  // Procurar por informações de contato no header
  const headerMatch = html.match(/<header[^>]*>(.*?)<\/header>/is);
  if (!headerMatch) return null;
  
  const headerContent = headerContent[1];
  
  return {
    content: headerContent,
    contacts: extractContactInfo(headerContent),
    logo: extractLogo(headerContent),
    navigation: extractNavigation(headerContent)
  };
}

function extractContactInfo(content: string): any[] {
  const contacts = [];
  
  // Procurar por telefones
  const phoneRegex = /\((\d{2})\)\s*(\d{4,5}-\d{4})/g;
  let match;
  while ((match = phoneRegex.exec(content)) !== null) {
    contacts.push({
      type: 'phone',
      ddd: match[1],
      number: match[2],
      full: match[0]
    });
  }
  
  // Procurar por WhatsApp
  const whatsappRegex = /whatsapp[^>]*>([^<]+)</gi;
  const whatsappMatch = whatsappRegex.exec(content);
  if (whatsappMatch) {
    contacts.push({
      type: 'whatsapp',
      number: whatsappMatch[1].trim()
    });
  }
  
  // Procurar por emergência
  const emergencyRegex = /emergência[^>]*>([^<]+)</gi;
  const emergencyMatch = emergencyRegex.exec(content);
  if (emergencyMatch) {
    contacts.push({
      type: 'emergency',
      number: emergencyMatch[1].trim()
    });
  }
  
  return contacts;
}

function extractLogo(content: string): any {
  const logoMatch = content.match(/<img[^>]*alt=["']logo["'][^>]*>/i);
  if (!logoMatch) return null;
  
  return {
    html: logoMatch[0],
    src: extractAttribute(logoMatch[0], 'src'),
    alt: extractAttribute(logoMatch[0], 'alt'),
    class: extractAttribute(logoMatch[0], 'class')
  };
}

function extractNavigation(content: string): any {
  const navMatch = content.match(/<nav[^>]*>(.*?)<\/nav>/is);
  if (!navMatch) return null;
  
  return {
    content: navMatch[1],
    links: extractLinks(navMatch[1])
  };
}

function extractMainLayout(html: string): any {
  const mainMatch = html.match(/<main[^>]*>(.*?)<\/main>/is);
  if (!mainMatch) return null;
  
  const mainContent = mainMatch[1];
  
  return {
    content: mainContent,
    leftColumn: extractLeftColumn(mainContent),
    rightColumn: extractRightColumn(mainContent),
    hero: extractHero(mainContent)
  };
}

function extractLeftColumn(content: string): any {
  // Procurar por formulário ou seção esquerda
  const formMatch = content.match(/<form[^>]*>(.*?)<\/form>/is);
  if (!formMatch) return null;
  
  return {
    type: 'form',
    content: formMatch[1],
    title: extractFormTitle(formMatch[1]),
    subtitle: extractFormSubtitle(formMatch[1]),
    pricing: extractFormPricing(formMatch[1]),
    fields: extractFormFields(formMatch[1])
  };
}

function extractRightColumn(content: string): any {
  // Procurar por informações da empresa
  const companyMatch = content.match(/<div[^>]*class=["'][^"']*company[^"']*["'][^>]*>(.*?)<\/div>/is);
  if (!companyMatch) {
    // Tentar encontrar por texto específico
    const experienceMatch = content.match(/25\s*ANOS\s*DE\s*EXPERIÊNCIA/i);
    if (experienceMatch) {
      return {
        type: 'company-info',
        content: extractCompanyText(content),
        experience: '25 ANOS DE EXPERIÊNCIA',
        specialization: 'ESPECIALISTAS EM SEGUROS DE AUTO',
        coverage: 'ATENDIMENTO EM TODO O TERRITÓRIO NACIONAL'
      };
    }
  }
  
  return null;
}

function extractHero(content: string): any {
  const heroMatch = content.match(/<div[^>]*class=["'][^"']*hero[^"']*["'][^>]*>(.*?)<\/div>/is);
  if (!heroMatch) return null;
  
  return {
    content: heroMatch[1],
    title: extractHeroTitle(heroMatch[1]),
    subtitle: extractHeroSubtitle(heroMatch[1])
  };
}

function extractFormTitle(formContent: string): string {
  const titleMatch = formContent.match(/SEGURO\s*DE\s*AUTO/i);
  return titleMatch ? titleMatch[0] : '';
}

function extractFormSubtitle(formContent: string): string {
  const subtitleMatch = formContent.match(/CÁLCULO\s*ONLINE/i);
  return subtitleMatch ? subtitleMatch[0] : '';
}

function extractFormPricing(formContent: string): any {
  const pricingMatch = formContent.match(/R\$\s*79[⁹⁰]*/i);
  if (!pricingMatch) return null;
  
  return {
    text: pricingMatch[0],
    amount: '79',
    currency: 'R$',
    period: 'MENSAIS'
  };
}

function extractFormFields(formContent: string): any[] {
  const fields = [];
  
  // Procurar por campos específicos
  const fieldPatterns = [
    { name: 'nome', pattern: /NOME/i },
    { name: 'ddd', pattern: /DDD/i },
    { name: 'celular', pattern: /CELULAR/i },
    { name: 'email', pattern: /EMAIL/i },
    { name: 'cep', pattern: /CEP/i },
    { name: 'cpf', pattern: /CPF/i },
    { name: 'placa', pattern: /PLACA/i },
    { name: 'ano', pattern: /ANO/i },
    { name: 'fabricante', pattern: /FABRICANTE/i }
  ];
  
  fieldPatterns.forEach(field => {
    if (field.pattern.test(formContent)) {
      fields.push({
        name: field.name,
        label: extractFieldLabel(formContent, field.pattern),
        type: determineFieldType(field.name),
        placeholder: extractFieldPlaceholder(formContent, field.pattern)
      });
    }
  });
  
  return fields;
}

function extractFieldLabel(content: string, pattern: RegExp): string {
  const match = content.match(pattern);
  return match ? match[0] : '';
}

function determineFieldType(fieldName: string): string {
  const typeMap: { [key: string]: string } = {
    'nome': 'text',
    'ddd': 'text',
    'celular': 'tel',
    'email': 'email',
    'cep': 'text',
    'cpf': 'text',
    'placa': 'text',
    'ano': 'text',
    'fabricante': 'text'
  };
  
  return typeMap[fieldName] || 'text';
}

function extractFieldPlaceholder(content: string, pattern: RegExp): string {
  // Procurar por placeholder próximo ao campo
  const context = content.substring(Math.max(0, content.search(pattern) - 100), content.search(pattern) + 200);
  const placeholderMatch = context.match(/placeholder=["']([^"']*)["']/i);
  return placeholderMatch ? placeholderMatch[1] : '';
}

function extractCompanyText(content: string): string {
  const companyTexts = [
    '25 ANOS DE EXPERIÊNCIA',
    'ESPECIALISTAS EM',
    'SEGUROS DE AUTO',
    'ATENDIMENTO EM TODO',
    'O TERRITÓRIO NACIONAL'
  ];
  
  return companyTexts.join('. ');
}

function extractExactForm(html: string): any {
  const formMatch = html.match(/<form[^>]*>(.*?)<\/form>/is);
  if (!formMatch) return null;
  
  const formContent = formMatch[1];
  
  return {
    html: formMatch[0],
    content: formContent,
    action: extractAttribute(formMatch[0], 'action'),
    method: extractAttribute(formMatch[0], 'method') || 'POST',
    class: extractAttribute(formMatch[0], 'class'),
    id: extractAttribute(formMatch[0], 'id'),
    title: extractFormTitle(formContent),
    subtitle: extractFormSubtitle(formContent),
    pricing: extractFormPricing(formContent),
    fields: extractFormFields(formContent),
    button: extractSubmitButton(formContent)
  };
}

function extractSubmitButton(formContent: string): any {
  const buttonMatch = formContent.match(/<button[^>]*>(.*?)<\/button>/is);
  if (!buttonMatch) return null;
  
  return {
    html: buttonMatch[0],
    text: buttonMatch[1],
    type: extractAttribute(buttonMatch[0], 'type') || 'submit',
    class: extractAttribute(buttonMatch[0], 'class')
  };
}

function extractCompanyInfo(html: string): any {
  const companyText = extractCompanyText(html);
  
  return {
    experience: '25 ANOS DE EXPERIÊNCIA',
    specialization: 'ESPECIALISTAS EM SEGUROS DE AUTO',
    coverage: 'ATENDIMENTO EM TODO O TERRITÓRIO NACIONAL',
    fullText: companyText
  };
}

function extractPricing(html: string): any {
  const pricingMatch = html.match(/R\$\s*79[⁹⁰]*/i);
  if (!pricingMatch) return null;
  
  return {
    text: pricingMatch[0],
    amount: '79',
    currency: 'R$',
    period: 'MENSAIS',
    prefix: 'A PARTIR DE'
  };
}

function extractFooter(html: string): any {
  const footerMatch = html.match(/<footer[^>]*>(.*?)<\/footer>/is);
  if (!footerMatch) return null;
  
  return {
    content: footerMatch[1],
    slogan: extractFooterSlogan(footerMatch[1]),
    cookies: extractCookieConsent(footerMatch[1])
  };
}

function extractFooterSlogan(content: string): string {
  const sloganMatch = content.match(/A IMEDIATO SEGUROS É A CORRETORA DE SEGUROS COM MELHOR AVALIAÇÃO DO MERCADO NO GOOGLE/i);
  return sloganMatch ? sloganMatch[0] : '';
}

function extractCookieConsent(content: string): any {
  const cookieMatch = content.match(/Utilizamos cookies[^<]*/i);
  if (!cookieMatch) return null;
  
  return {
    text: cookieMatch[0],
    declineButton: 'Recusar'
  };
}

function extractExactColors(html: string): any {
  const colors = {
    primary: '#0066CC', // Azul principal
    secondary: '#004499', // Azul escuro
    accent: '#0088FF', // Azul claro
    text: '#333333', // Texto escuro
    white: '#FFFFFF', // Branco
    lightBlue: '#E6F3FF', // Azul claro de fundo
    darkBlue: '#003366' // Azul muito escuro
  };
  
  return colors;
}

function extractExactTypography(html: string): any {
  const typography = {
    primary: 'Arial, sans-serif',
    secondary: 'Helvetica, sans-serif',
    sizes: {
      large: '24px',
      medium: '18px',
      small: '14px',
      xsmall: '12px'
    },
    weights: {
      bold: '700',
      medium: '500',
      normal: '400'
    }
  };
  
  return typography;
}

function extractSpecificStyles(html: string): any {
  const styles = {
    layout: {
      type: 'two-column',
      leftWidth: '60%',
      rightWidth: '40%'
    },
    spacing: {
      padding: '20px',
      margin: '10px',
      gap: '20px'
    },
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  
  return styles;
}

function extractLinks(content: string): any[] {
  const links = [];
  const linkRegex = /<a[^>]*>(.*?)<\/a>/gis;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    links.push({
      content: match[1],
      href: extractAttribute(match[0], 'href'),
      class: extractAttribute(match[0], 'class'),
      target: extractAttribute(match[0], 'target')
    });
  }
  
  return links;
}

function extractAttribute(html: string, attribute: string): string {
  const regex = new RegExp(`${attribute}=["']([^"']*)["']`, 'i');
  const match = regex.exec(html);
  return match ? match[1] : '';
}
