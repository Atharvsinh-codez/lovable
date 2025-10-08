import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Buscar análise detalhada
    const [htmlResponse, cssResponse] = await Promise.all([
      fetch('https://www.segurosimediato.com.br', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }),
      fetch('https://www.segurosimediato.com.br', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
    ]);

    const html = await htmlResponse.text();
    
    // Extrair estrutura exata
    const structure = extractExactStructure(html);
    
    // Gerar componentes React baseados na estrutura exata
    const reactComponents = generateReactComponents(structure);
    
    // Extrair CSS e converter para Tailwind/estilos
    const styles = extractAndConvertStyles(html);
    
    return NextResponse.json({
      structure,
      reactComponents,
      styles,
      originalHtml: html
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao gerar clonagem pixel-perfect', details: error.message },
      { status: 500 }
    );
  }
}

function extractExactStructure(html: string): any {
  return {
    title: extractTitle(html),
    metaDescription: extractMetaDescription(html),
    header: extractHeaderExact(html),
    main: extractMainExact(html),
    footer: extractFooterExact(html),
    forms: extractFormsExact(html),
    scripts: extractScriptsExact(html),
    styles: extractStylesExact(html)
  };
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return match ? match[1].trim() : '';
}

function extractMetaDescription(html: string): string {
  const match = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  return match ? match[1].trim() : '';
}

function extractHeaderExact(html: string): any {
  const headerMatch = html.match(/<header[^>]*>(.*?)<\/header>/is);
  if (!headerMatch) return null;
  
  const headerContent = headerMatch[1];
  
  return {
    html: headerMatch[0],
    content: headerContent,
    classes: extractAttribute(headerMatch[0], 'class'),
    id: extractAttribute(headerMatch[0], 'id'),
    navigation: extractNavigationExact(headerContent),
    logo: extractLogo(headerContent),
    menu: extractMenu(headerContent)
  };
}

function extractMainExact(html: string): any {
  const mainMatch = html.match(/<main[^>]*>(.*?)<\/main>/is);
  if (!mainMatch) return null;
  
  const mainContent = mainMatch[1];
  
  return {
    html: mainMatch[0],
    content: mainContent,
    classes: extractAttribute(mainMatch[0], 'class'),
    id: extractAttribute(mainMatch[0], 'id'),
    sections: extractSectionsExact(mainContent),
    hero: extractHero(mainContent),
    forms: extractFormsInMain(mainContent)
  };
}

function extractFooterExact(html: string): any {
  const footerMatch = html.match(/<footer[^>]*>(.*?)<\/footer>/is);
  if (!footerMatch) return null;
  
  return {
    html: footerMatch[0],
    content: footerMatch[1],
    classes: extractAttribute(footerMatch[0], 'class'),
    id: extractAttribute(footerMatch[0], 'id'),
    links: extractFooterLinks(footerMatch[1]),
    contact: extractFooterContact(footerMatch[1])
  };
}

function extractFormsExact(html: string): any[] {
  const forms = [];
  const formRegex = /<form[^>]*>(.*?)<\/form>/gis;
  let match;
  
  while ((match = formRegex.exec(html)) !== null) {
    const formHtml = match[0];
    const formContent = match[1];
    
    forms.push({
      html: formHtml,
      content: formContent,
      action: extractAttribute(formHtml, 'action'),
      method: extractAttribute(formHtml, 'method') || 'GET',
      classes: extractAttribute(formHtml, 'class'),
      id: extractAttribute(formHtml, 'id'),
      inputs: extractInputsExact(formContent),
      buttons: extractButtonsExact(formContent),
      labels: extractLabelsExact(formContent),
      selects: extractSelectsExact(formContent)
    });
  }
  
  return forms;
}

function extractInputsExact(formContent: string): any[] {
  const inputs = [];
  const inputRegex = /<input[^>]*>/gi;
  let match;
  
  while ((match = inputRegex.exec(formContent)) !== null) {
    const inputHtml = match[0];
    inputs.push({
      html: inputHtml,
      type: extractAttribute(inputHtml, 'type') || 'text',
      name: extractAttribute(inputHtml, 'name'),
      id: extractAttribute(inputHtml, 'id'),
      class: extractAttribute(inputHtml, 'class'),
      placeholder: extractAttribute(inputHtml, 'placeholder'),
      value: extractAttribute(inputHtml, 'value'),
      required: inputHtml.includes('required'),
      disabled: inputHtml.includes('disabled'),
      readonly: inputHtml.includes('readonly'),
      maxlength: extractAttribute(inputHtml, 'maxlength'),
      pattern: extractAttribute(inputHtml, 'pattern')
    });
  }
  
  return inputs;
}

function extractButtonsExact(formContent: string): any[] {
  const buttons = [];
  const buttonRegex = /<button[^>]*>(.*?)<\/button>/gis;
  let match;
  
  while ((match = buttonRegex.exec(formContent)) !== null) {
    const buttonHtml = match[0];
    buttons.push({
      html: buttonHtml,
      content: match[1],
      type: extractAttribute(buttonHtml, 'type') || 'button',
      class: extractAttribute(buttonHtml, 'class'),
      id: extractAttribute(buttonHtml, 'id'),
      disabled: buttonHtml.includes('disabled')
    });
  }
  
  return buttons;
}

function extractLabelsExact(formContent: string): any[] {
  const labels = [];
  const labelRegex = /<label[^>]*>(.*?)<\/label>/gis;
  let match;
  
  while ((match = labelRegex.exec(formContent)) !== null) {
    const labelHtml = match[0];
    labels.push({
      html: labelHtml,
      content: match[1],
      for: extractAttribute(labelHtml, 'for'),
      class: extractAttribute(labelHtml, 'class'),
      id: extractAttribute(labelHtml, 'id')
    });
  }
  
  return labels;
}

function extractSelectsExact(formContent: string): any[] {
  const selects = [];
  const selectRegex = /<select[^>]*>(.*?)<\/select>/gis;
  let match;
  
  while ((match = selectRegex.exec(formContent)) !== null) {
    const selectHtml = match[0];
    selects.push({
      html: selectHtml,
      content: match[1],
      name: extractAttribute(selectHtml, 'name'),
      id: extractAttribute(selectHtml, 'id'),
      class: extractAttribute(selectHtml, 'class'),
      options: extractOptionsExact(match[1])
    });
  }
  
  return selects;
}

function extractOptionsExact(selectContent: string): any[] {
  const options = [];
  const optionRegex = /<option[^>]*>(.*?)<\/option>/gis;
  let match;
  
  while ((match = optionRegex.exec(selectContent)) !== null) {
    const optionHtml = match[0];
    options.push({
      html: optionHtml,
      content: match[1],
      value: extractAttribute(optionHtml, 'value'),
      selected: optionHtml.includes('selected'),
      disabled: optionHtml.includes('disabled')
    });
  }
  
  return options;
}

function generateReactComponents(structure: any): any {
  return {
    header: generateHeaderComponent(structure.header),
    main: generateMainComponent(structure.main),
    footer: generateFooterComponent(structure.footer),
    forms: structure.forms.map((form: any, index: number) => 
      generateFormComponent(form, index)
    )
  };
}

function generateHeaderComponent(header: any): string {
  if (!header) return '';
  
  return `
export function ExactHeader() {
  return (
    <header className="${header.classes || ''}">
      ${header.content}
    </header>
  );
}`;
}

function generateMainComponent(main: any): string {
  if (!main) return '';
  
  return `
export function ExactMain() {
  return (
    <main className="${main.classes || ''}">
      ${main.content}
    </main>
  );
}`;
}

function generateFooterComponent(footer: any): string {
  if (!footer) return '';
  
  return `
export function ExactFooter() {
  return (
    <footer className="${footer.classes || ''}">
      ${footer.content}
    </footer>
  );
}`;
}

function generateFormComponent(form: any, index: number): string {
  return `
export function ExactForm${index + 1}() {
  return (
    <form 
      action="${form.action || '#'}" 
      method="${form.method}"
      className="${form.classes || ''}"
      id="${form.id || ''}"
    >
      ${form.content}
    </form>
  );
}`;
}

function extractAndConvertStyles(html: string): any {
  const styles = {
    colors: extractColors(html),
    fonts: extractFonts(html),
    spacing: extractSpacing(html),
    layout: extractLayout(html),
    components: extractComponentStyles(html)
  };
  
  return styles;
}

function extractColors(html: string): any {
  const colors = {
    primary: [],
    secondary: [],
    accent: [],
    neutral: [],
    semantic: {
      success: [],
      warning: [],
      error: [],
      info: []
    }
  };

  // Extrair cores hex
  const hexRegex = /#[0-9a-fA-F]{3,6}/g;
  const hexColors = html.match(hexRegex) || [];
  
  // Categorizar cores
  hexColors.forEach(color => {
    if (color.includes('006') || color.includes('007') || color.includes('008')) {
      colors.primary.push(color);
    } else if (color.includes('999') || color.includes('666') || color.includes('333')) {
      colors.neutral.push(color);
    } else if (color.includes('00a') || color.includes('00b') || color.includes('00c')) {
      colors.accent.push(color);
    }
  });

  // Remover duplicatas
  Object.keys(colors).forEach(key => {
    if (typeof colors[key] === 'object' && !Array.isArray(colors[key])) {
      Object.keys(colors[key]).forEach(subKey => {
        colors[key][subKey] = [...new Set(colors[key][subKey])];
      });
    } else {
      colors[key] = [...new Set(colors[key])];
    }
  });

  return colors;
}

function extractFonts(html: string): any {
  const fonts = {
    families: [],
    sizes: [],
    weights: [],
    styles: []
  };

  // Extrair fontes
  const familyRegex = /font-family:\s*([^;]+)/gi;
  let match;
  while ((match = familyRegex.exec(html)) !== null) {
    fonts.families.push(match[1].trim());
  }

  // Extrair tamanhos
  const sizeRegex = /font-size:\s*([^;]+)/gi;
  while ((match = sizeRegex.exec(html)) !== null) {
    fonts.sizes.push(match[1].trim());
  }

  // Remover duplicatas
  Object.keys(fonts).forEach(key => {
    fonts[key] = [...new Set(fonts[key])];
  });

  return fonts;
}

function extractSpacing(html: string): any {
  const spacing = {
    margins: [],
    paddings: [],
    gaps: []
  };

  // Extrair margins
  const marginRegex = /margin[^:]*:\s*([^;]+)/gi;
  let match;
  while ((match = marginRegex.exec(html)) !== null) {
    spacing.margins.push(match[1].trim());
  }

  // Extrair paddings
  const paddingRegex = /padding[^:]*:\s*([^;]+)/gi;
  while ((match = paddingRegex.exec(html)) !== null) {
    spacing.paddings.push(match[1].trim());
  }

  // Remover duplicatas
  Object.keys(spacing).forEach(key => {
    spacing[key] = [...new Set(spacing[key])];
  });

  return spacing;
}

function extractLayout(html: string): any {
  const layout = {
    containers: [],
    grids: [],
    flexbox: [],
    responsive: []
  };

  // Identificar containers
  if (html.includes('container')) {
    layout.containers.push('Container detected');
  }
  if (html.includes('grid')) {
    layout.grids.push('Grid layout detected');
  }
  if (html.includes('flex')) {
    layout.flexbox.push('Flexbox layout detected');
  }
  if (html.includes('@media')) {
    layout.responsive.push('Responsive design detected');
  }

  return layout;
}

function extractComponentStyles(html: string): any {
  const components = {
    buttons: [],
    inputs: [],
    cards: [],
    navigation: []
  };

  // Identificar estilos de componentes
  if (html.includes('btn') || html.includes('button')) {
    components.buttons.push('Button styles detected');
  }
  if (html.includes('input') || html.includes('form-control')) {
    components.inputs.push('Input styles detected');
  }
  if (html.includes('card')) {
    components.cards.push('Card styles detected');
  }
  if (html.includes('nav') || html.includes('menu')) {
    components.navigation.push('Navigation styles detected');
  }

  return components;
}

// Funções auxiliares
function extractAttribute(html: string, attribute: string): string {
  const regex = new RegExp(`${attribute}=["']([^"']*)["']`, 'i');
  const match = regex.exec(html);
  return match ? match[1] : '';
}

function extractNavigationExact(content: string): any {
  const navMatch = content.match(/<nav[^>]*>(.*?)<\/nav>/is);
  if (!navMatch) return null;
  
  return {
    content: navMatch[1],
    classes: extractAttribute(navMatch[0], 'class'),
    id: extractAttribute(navMatch[0], 'id'),
    links: extractLinks(navMatch[1])
  };
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

function extractMenu(content: string): any {
  const menuMatch = content.match(/<ul[^>]*>(.*?)<\/ul>/is);
  if (!menuMatch) return null;
  
  return {
    content: menuMatch[1],
    classes: extractAttribute(menuMatch[0], 'class'),
    items: extractMenuItems(menuMatch[1])
  };
}

function extractMenuItems(content: string): any[] {
  const items = [];
  const itemRegex = /<li[^>]*>(.*?)<\/li>/gis;
  let match;
  
  while ((match = itemRegex.exec(content)) !== null) {
    items.push({
      content: match[1],
      classes: extractAttribute(match[0], 'class')
    });
  }
  
  return items;
}

function extractSectionsExact(content: string): any[] {
  const sections = [];
  const sectionRegex = /<section[^>]*>(.*?)<\/section>/gis;
  let match;
  
  while ((match = sectionRegex.exec(content)) !== null) {
    sections.push({
      content: match[1],
      classes: extractAttribute(match[0], 'class'),
      id: extractAttribute(match[0], 'id'),
      style: extractAttribute(match[0], 'style')
    });
  }
  
  return sections;
}

function extractHero(content: string): any {
  const heroMatch = content.match(/<div[^>]*class=["'][^"']*hero[^"']*["'][^>]*>(.*?)<\/div>/is);
  if (!heroMatch) return null;
  
  return {
    content: heroMatch[1],
    classes: extractAttribute(heroMatch[0], 'class'),
    id: extractAttribute(heroMatch[0], 'id')
  };
}

function extractFormsInMain(content: string): any[] {
  const forms = [];
  const formRegex = /<form[^>]*>(.*?)<\/form>/gis;
  let match;
  
  while ((match = formRegex.exec(content)) !== null) {
    forms.push({
      content: match[1],
      classes: extractAttribute(match[0], 'class'),
      id: extractAttribute(match[0], 'id')
    });
  }
  
  return forms;
}

function extractFooterLinks(content: string): any[] {
  const links = [];
  const linkRegex = /<a[^>]*>(.*?)<\/a>/gis;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    links.push({
      content: match[1],
      href: extractAttribute(match[0], 'href'),
      class: extractAttribute(match[0], 'class')
    });
  }
  
  return links;
}

function extractFooterContact(content: string): any {
  const contactMatch = content.match(/<div[^>]*class=["'][^"']*contact[^"']*["'][^>]*>(.*?)<\/div>/is);
  if (!contactMatch) return null;
  
  return {
    content: contactMatch[1],
    classes: extractAttribute(contactMatch[0], 'class')
  };
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

function extractScriptsExact(html: string): any[] {
  const scripts = [];
  const scriptRegex = /<script[^>]*>(.*?)<\/script>/gis;
  let match;
  
  while ((match = scriptRegex.exec(html)) !== null) {
    const scriptHtml = match[0];
    scripts.push({
      html: scriptHtml,
      content: match[1],
      src: extractAttribute(scriptHtml, 'src'),
      type: extractAttribute(scriptHtml, 'type') || 'text/javascript',
      async: scriptHtml.includes('async'),
      defer: scriptHtml.includes('defer')
    });
  }
  
  return scripts;
}

function extractStylesExact(html: string): any {
  const styles = {
    inline: [],
    external: [],
    embedded: []
  };

  // Estilos inline
  const inlineRegex = /style=["']([^"']*)["']/gi;
  let match;
  while ((match = inlineRegex.exec(html)) !== null) {
    styles.inline.push(match[1]);
  }

  // CSS externo
  const externalRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']*)["']/gi;
  while ((match = externalRegex.exec(html)) !== null) {
    styles.external.push(match[1]);
  }

  // CSS embedido
  const embeddedRegex = /<style[^>]*>(.*?)<\/style>/gis;
  while ((match = embeddedRegex.exec(html)) !== null) {
    styles.embedded.push(match[1]);
  }

  return styles;
}
