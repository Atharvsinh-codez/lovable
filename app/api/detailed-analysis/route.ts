import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Buscar conteúdo completo do site original
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
    
    // Extrair informações detalhadas
    const detailedAnalysis = {
      title: extractTitle(html),
      metaDescription: extractMetaDescription(html),
      fullHtml: html,
      structure: extractStructure(html),
      styles: extractAllStyles(html),
      scripts: extractAllScripts(html),
      forms: extractDetailedForms(html),
      images: extractImages(html),
      layout: extractLayoutDetails(html),
      colors: extractDetailedColors(html),
      fonts: extractDetailedFonts(html)
    };

    return NextResponse.json(detailedAnalysis);
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

function extractStructure(html: string): any {
  const structure = {
    header: extractSection(html, 'header'),
    main: extractSection(html, 'main'),
    footer: extractSection(html, 'footer'),
    sections: extractAllSections(html),
    navigation: extractNavigation(html)
  };
  return structure;
}

function extractSection(html: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'gis');
  const match = regex.exec(html);
  return match ? match[1] : '';
}

function extractAllSections(html: string): string[] {
  const sections = [];
  const regex = /<section[^>]*>(.*?)<\/section>/gis;
  let match;
  while ((match = regex.exec(html)) !== null) {
    sections.push(match[1]);
  }
  return sections;
}

function extractNavigation(html: string): string {
  const regex = /<nav[^>]*>(.*?)<\/nav>/gis;
  const match = regex.exec(html);
  return match ? match[1] : '';
}

function extractAllStyles(html: string): any {
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

function extractAllScripts(html: string): string[] {
  const scripts = [];
  const regex = /<script[^>]*src=["']([^"']*)["']/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  return scripts;
}

function extractDetailedForms(html: string): any[] {
  const forms = [];
  const formRegex = /<form[^>]*>(.*?)<\/form>/gis;
  let match;
  
  while ((match = formRegex.exec(html)) !== null) {
    const formHtml = match[0];
    const formData = {
      html: formHtml,
      inputs: extractFormInputs(formHtml),
      selects: extractFormSelects(formHtml),
      textareas: extractFormTextareas(formHtml),
      buttons: extractFormButtons(formHtml),
      labels: extractFormLabels(formHtml)
    };
    forms.push(formData);
  }
  
  return forms;
}

function extractFormInputs(formHtml: string): any[] {
  const inputs = [];
  const inputRegex = /<input[^>]*>/gi;
  let match;
  
  while ((match = inputRegex.exec(formHtml)) !== null) {
    const inputHtml = match[0];
    const inputData = {
      html: inputHtml,
      type: extractAttribute(inputHtml, 'type'),
      name: extractAttribute(inputHtml, 'name'),
      placeholder: extractAttribute(inputHtml, 'placeholder'),
      required: inputHtml.includes('required'),
      class: extractAttribute(inputHtml, 'class'),
      id: extractAttribute(inputHtml, 'id')
    };
    inputs.push(inputData);
  }
  
  return inputs;
}

function extractFormSelects(formHtml: string): any[] {
  const selects = [];
  const selectRegex = /<select[^>]*>(.*?)<\/select>/gis;
  let match;
  
  while ((match = selectRegex.exec(formHtml)) !== null) {
    const selectHtml = match[0];
    const selectData = {
      html: selectHtml,
      name: extractAttribute(selectHtml, 'name'),
      class: extractAttribute(selectHtml, 'class'),
      id: extractAttribute(selectHtml, 'id'),
      options: extractSelectOptions(selectHtml)
    };
    selects.push(selectData);
  }
  
  return selects;
}

function extractFormTextareas(formHtml: string): any[] {
  const textareas = [];
  const textareaRegex = /<textarea[^>]*>(.*?)<\/textarea>/gis;
  let match;
  
  while ((match = textareaRegex.exec(formHtml)) !== null) {
    const textareaHtml = match[0];
    const textareaData = {
      html: textareaHtml,
      name: extractAttribute(textareaHtml, 'name'),
      placeholder: extractAttribute(textareaHtml, 'placeholder'),
      class: extractAttribute(textareaHtml, 'class'),
      id: extractAttribute(textareaHtml, 'id')
    };
    textareas.push(textareaData);
  }
  
  return textareas;
}

function extractFormButtons(formHtml: string): any[] {
  const buttons = [];
  const buttonRegex = /<button[^>]*>(.*?)<\/button>/gis;
  let match;
  
  while ((match = buttonRegex.exec(formHtml)) !== null) {
    const buttonHtml = match[0];
    const buttonData = {
      html: buttonHtml,
      type: extractAttribute(buttonHtml, 'type'),
      class: extractAttribute(buttonHtml, 'class'),
      id: extractAttribute(buttonHtml, 'id'),
      text: match[1]
    };
    buttons.push(buttonData);
  }
  
  return buttons;
}

function extractFormLabels(formHtml: string): any[] {
  const labels = [];
  const labelRegex = /<label[^>]*>(.*?)<\/label>/gis;
  let match;
  
  while ((match = labelRegex.exec(formHtml)) !== null) {
    const labelHtml = match[0];
    const labelData = {
      html: labelHtml,
      for: extractAttribute(labelHtml, 'for'),
      class: extractAttribute(labelHtml, 'class'),
      text: match[1]
    };
    labels.push(labelData);
  }
  
  return labels;
}

function extractSelectOptions(selectHtml: string): any[] {
  const options = [];
  const optionRegex = /<option[^>]*>(.*?)<\/option>/gis;
  let match;
  
  while ((match = optionRegex.exec(selectHtml)) !== null) {
    const optionHtml = match[0];
    const optionData = {
      html: optionHtml,
      value: extractAttribute(optionHtml, 'value'),
      text: match[1]
    };
    options.push(optionData);
  }
  
  return options;
}

function extractAttribute(html: string, attribute: string): string {
  const regex = new RegExp(`${attribute}=["']([^"']*)["']`, 'i');
  const match = regex.exec(html);
  return match ? match[1] : '';
}

function extractImages(html: string): any[] {
  const images = [];
  const imgRegex = /<img[^>]*>/gi;
  let match;
  
  while ((match = imgRegex.exec(html)) !== null) {
    const imgHtml = match[0];
    const imgData = {
      html: imgHtml,
      src: extractAttribute(imgHtml, 'src'),
      alt: extractAttribute(imgHtml, 'alt'),
      class: extractAttribute(imgHtml, 'class'),
      width: extractAttribute(imgHtml, 'width'),
      height: extractAttribute(imgHtml, 'height')
    };
    images.push(imgData);
  }
  
  return images;
}

function extractLayoutDetails(html: string): any {
  const layout = {
    containers: [],
    grids: [],
    flexbox: [],
    responsive: []
  };

  // Identificar containers
  const containerRegex = /class=["'][^"']*container[^"']*["']/gi;
  let match;
  while ((match = containerRegex.exec(html)) !== null) {
    layout.containers.push(match[0]);
  }

  // Identificar grids
  const gridRegex = /class=["'][^"']*grid[^"']*["']/gi;
  while ((match = gridRegex.exec(html)) !== null) {
    layout.grids.push(match[0]);
  }

  // Identificar flexbox
  const flexRegex = /class=["'][^"']*flex[^"']*["']/gi;
  while ((match = flexRegex.exec(html)) !== null) {
    layout.flexbox.push(match[0]);
  }

  return layout;
}

function extractDetailedColors(html: string): any {
  const colors = {
    hex: [],
    rgb: [],
    rgba: [],
    hsl: [],
    named: []
  };

  // Cores hex
  const hexRegex = /#[0-9a-fA-F]{3,6}/g;
  colors.hex = [...new Set(html.match(hexRegex) || [])];

  // Cores RGB
  const rgbRegex = /rgb\([^)]+\)/g;
  colors.rgb = [...new Set(html.match(rgbRegex) || [])];

  // Cores RGBA
  const rgbaRegex = /rgba\([^)]+\)/g;
  colors.rgba = [...new Set(html.match(rgbaRegex) || [])];

  // Cores HSL
  const hslRegex = /hsl\([^)]+\)/g;
  colors.hsl = [...new Set(html.match(hslRegex) || [])];

  return colors;
}

function extractDetailedFonts(html: string): any {
  const fonts = {
    families: [],
    sizes: [],
    weights: [],
    styles: []
  };

  // Font families
  const familyRegex = /font-family:\s*([^;]+)/gi;
  let match;
  while ((match = familyRegex.exec(html)) !== null) {
    fonts.families.push(match[1].trim());
  }

  // Font sizes
  const sizeRegex = /font-size:\s*([^;]+)/gi;
  while ((match = sizeRegex.exec(html)) !== null) {
    fonts.sizes.push(match[1].trim());
  }

  // Font weights
  const weightRegex = /font-weight:\s*([^;]+)/gi;
  while ((match = weightRegex.exec(html)) !== null) {
    fonts.weights.push(match[1].trim());
  }

  // Font styles
  const styleRegex = /font-style:\s*([^;]+)/gi;
  while ((match = styleRegex.exec(html)) !== null) {
    fonts.styles.push(match[1].trim());
  }

  // Remover duplicatas
  Object.keys(fonts).forEach(key => {
    fonts[key] = [...new Set(fonts[key])];
  });

  return fonts;
}
