import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Buscar conteúdo do site original
    const response = await fetch('https://www.segurosimediato.com.br', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // Extrair informações de design
    const designSystem = {
      colors: extractColorPalette(html),
      typography: extractTypography(html),
      spacing: extractSpacing(html),
      components: extractComponentStyles(html),
      layout: extractLayoutStructure(html),
      forms: extractFormStyles(html),
      buttons: extractButtonStyles(html)
    };

    return NextResponse.json(designSystem);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao extrair design system', details: error.message },
      { status: 500 }
    );
  }
}

function extractColorPalette(html: string): any {
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

  // Extrair cores do CSS inline e estilos
  const colorRegex = /#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)/g;
  const allColors = html.match(colorRegex) || [];
  
  // Categorizar cores por contexto
  allColors.forEach(color => {
    const context = html.substring(Math.max(0, html.indexOf(color) - 100), html.indexOf(color) + 100);
    
    if (context.includes('primary') || context.includes('main')) {
      colors.primary.push(color);
    } else if (context.includes('secondary')) {
      colors.secondary.push(color);
    } else if (context.includes('accent')) {
      colors.accent.push(color);
    } else if (context.includes('success') || context.includes('green')) {
      colors.semantic.success.push(color);
    } else if (context.includes('warning') || context.includes('yellow')) {
      colors.semantic.warning.push(color);
    } else if (context.includes('error') || context.includes('red')) {
      colors.semantic.error.push(color);
    } else if (context.includes('info') || context.includes('blue')) {
      colors.semantic.info.push(color);
    } else {
      colors.neutral.push(color);
    }
  });

  // Remover duplicatas e limitar
  Object.keys(colors).forEach(key => {
    if (typeof colors[key] === 'object' && !Array.isArray(colors[key])) {
      Object.keys(colors[key]).forEach(subKey => {
        colors[key][subKey] = [...new Set(colors[key][subKey])].slice(0, 5);
      });
    } else {
      colors[key] = [...new Set(colors[key])].slice(0, 10);
    }
  });

  return colors;
}

function extractTypography(html: string): any {
  const typography = {
    fonts: [],
    sizes: [],
    weights: [],
    lineHeights: []
  };

  // Extrair fontes
  const fontRegex = /font-family:\s*([^;]+)/gi;
  let match;
  while ((match = fontRegex.exec(html)) !== null) {
    typography.fonts.push(match[1].trim());
  }

  // Extrair tamanhos
  const sizeRegex = /font-size:\s*([^;]+)/gi;
  while ((match = sizeRegex.exec(html)) !== null) {
    typography.sizes.push(match[1].trim());
  }

  // Extrair pesos
  const weightRegex = /font-weight:\s*([^;]+)/gi;
  while ((match = weightRegex.exec(html)) !== null) {
    typography.weights.push(match[1].trim());
  }

  // Remover duplicatas
  Object.keys(typography).forEach(key => {
    typography[key] = [...new Set(typography[key])].slice(0, 10);
  });

  return typography;
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

  // Extrair gaps
  const gapRegex = /gap:\s*([^;]+)/gi;
  while ((match = gapRegex.exec(html)) !== null) {
    spacing.gaps.push(match[1].trim());
  }

  // Remover duplicatas
  Object.keys(spacing).forEach(key => {
    spacing[key] = [...new Set(spacing[key])].slice(0, 10);
  });

  return spacing;
}

function extractComponentStyles(html: string): any {
  const components = {
    cards: [],
    buttons: [],
    forms: [],
    navigation: []
  };

  // Identificar estilos de componentes por classe ou estrutura
  if (html.includes('card')) {
    components.cards.push('Card component detected');
  }
  if (html.includes('btn') || html.includes('button')) {
    components.buttons.push('Button component detected');
  }
  if (html.includes('form')) {
    components.forms.push('Form component detected');
  }
  if (html.includes('nav') || html.includes('menu')) {
    components.navigation.push('Navigation component detected');
  }

  return components;
}

function extractLayoutStructure(html: string): any {
  const layout = {
    containers: [],
    grids: [],
    flexbox: [],
    responsive: []
  };

  // Identificar estruturas de layout
  if (html.includes('container')) {
    layout.containers.push('Container detected');
  }
  if (html.includes('grid')) {
    layout.grids.push('Grid layout detected');
  }
  if (html.includes('flex')) {
    layout.flexbox.push('Flexbox layout detected');
  }
  if (html.includes('@media') || html.includes('responsive')) {
    layout.responsive.push('Responsive design detected');
  }

  return layout;
}

function extractFormStyles(html: string): any {
  const forms = {
    inputs: [],
    labels: [],
    validation: [],
    submit: []
  };

  // Extrair estilos de formulário
  const inputRegex = /<input[^>]*class=["']([^"']*)["']/gi;
  let match;
  while ((match = inputRegex.exec(html)) !== null) {
    forms.inputs.push(match[1]);
  }

  const labelRegex = /<label[^>]*class=["']([^"']*)["']/gi;
  while ((match = labelRegex.exec(html)) !== null) {
    forms.labels.push(match[1]);
  }

  if (html.includes('required') || html.includes('validation')) {
    forms.validation.push('Validation detected');
  }

  if (html.includes('submit') || html.includes('button[type="submit"]')) {
    forms.submit.push('Submit button detected');
  }

  return forms;
}

function extractButtonStyles(html: string): any {
  const buttons = {
    styles: [],
    sizes: [],
    variants: []
  };

  // Extrair estilos de botão
  const buttonRegex = /<button[^>]*class=["']([^"']*)["']/gi;
  let match;
  while ((match = buttonRegex.exec(html)) !== null) {
    buttons.styles.push(match[1]);
  }

  // Identificar variantes comuns
  if (html.includes('primary')) buttons.variants.push('primary');
  if (html.includes('secondary')) buttons.variants.push('secondary');
  if (html.includes('outline')) buttons.variants.push('outline');
  if (html.includes('ghost')) buttons.variants.push('ghost');

  return buttons;
}
