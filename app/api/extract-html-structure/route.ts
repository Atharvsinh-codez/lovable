import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Buscar conteúdo do site original
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
    
    // Extrair estrutura HTML exata
    const structure = {
      head: extractHead(html),
      body: extractBody(html),
      header: extractHeader(html),
      main: extractMain(html),
      footer: extractFooter(html),
      forms: extractFormsDetailed(html),
      scripts: extractScriptsDetailed(html),
      meta: extractMetaTags(html)
    };

    return NextResponse.json(structure);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao extrair HTML estruturado', details: error.message },
      { status: 500 }
    );
  }
}

function extractHead(html: string): any {
  const headMatch = html.match(/<head[^>]*>(.*?)<\/head>/is);
  if (!headMatch) return null;
  
  const headContent = headMatch[1];
  
  return {
    title: extractTitle(headContent),
    meta: extractMetaTags(headContent),
    links: extractLinks(headContent),
    scripts: extractScripts(headContent),
    styles: extractStyles(headContent),
    raw: headContent
  };
}

function extractBody(html: string): any {
  const bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/is);
  if (!bodyMatch) return null;
  
  return {
    content: bodyMatch[1],
    classes: extractAttribute(bodyMatch[0], 'class'),
    id: extractAttribute(bodyMatch[0], 'id'),
    style: extractAttribute(bodyMatch[0], 'style')
  };
}

function extractHeader(html: string): any {
  const headerMatch = html.match(/<header[^>]*>(.*?)<\/header>/is);
  if (!headerMatch) return null;
  
  return {
    content: headerMatch[1],
    classes: extractAttribute(headerMatch[0], 'class'),
    id: extractAttribute(headerMatch[0], 'id'),
    style: extractAttribute(headerMatch[0], 'style'),
    navigation: extractNavigation(headerMatch[1])
  };
}

function extractMain(html: string): any {
  const mainMatch = html.match(/<main[^>]*>(.*?)<\/main>/is);
  if (!mainMatch) return null;
  
  return {
    content: mainMatch[1],
    classes: extractAttribute(mainMatch[0], 'class'),
    id: extractAttribute(mainMatch[0], 'id'),
    style: extractAttribute(mainMatch[0], 'style'),
    sections: extractSections(mainMatch[1])
  };
}

function extractFooter(html: string): any {
  const footerMatch = html.match(/<footer[^>]*>(.*?)<\/footer>/is);
  if (!footerMatch) return null;
  
  return {
    content: footerMatch[1],
    classes: extractAttribute(footerMatch[0], 'class'),
    id: extractAttribute(footerMatch[0], 'id'),
    style: extractAttribute(footerMatch[0], 'style')
  };
}

function extractFormsDetailed(html: string): any[] {
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
      inputs: extractFormInputs(formContent),
      buttons: extractFormButtons(formContent),
      labels: extractFormLabels(formContent),
      selects: extractFormSelects(formContent),
      textareas: extractFormTextareas(formContent)
    });
  }
  
  return forms;
}

function extractFormInputs(formContent: string): any[] {
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
      readonly: inputHtml.includes('readonly')
    });
  }
  
  return inputs;
}

function extractFormButtons(formContent: string): any[] {
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

function extractFormLabels(formContent: string): any[] {
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

function extractFormSelects(formContent: string): any[] {
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
      options: extractSelectOptions(match[1])
    });
  }
  
  return selects;
}

function extractFormTextareas(formContent: string): any[] {
  const textareas = [];
  const textareaRegex = /<textarea[^>]*>(.*?)<\/textarea>/gis;
  let match;
  
  while ((match = textareaRegex.exec(formContent)) !== null) {
    const textareaHtml = match[0];
    textareas.push({
      html: textareaHtml,
      content: match[1],
      name: extractAttribute(textareaHtml, 'name'),
      id: extractAttribute(textareaHtml, 'id'),
      class: extractAttribute(textareaHtml, 'class'),
      placeholder: extractAttribute(textareaHtml, 'placeholder'),
      rows: extractAttribute(textareaHtml, 'rows'),
      cols: extractAttribute(textareaHtml, 'cols')
    });
  }
  
  return textareas;
}

function extractSelectOptions(selectContent: string): any[] {
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

function extractNavigation(content: string): any {
  const navMatch = content.match(/<nav[^>]*>(.*?)<\/nav>/is);
  if (!navMatch) return null;
  
  return {
    content: navMatch[1],
    classes: extractAttribute(navMatch[0], 'class'),
    id: extractAttribute(navMatch[0], 'id'),
    links: extractLinks(navMatch[1])
  };
}

function extractSections(content: string): any[] {
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

function extractScriptsDetailed(html: string): any[] {
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

function extractMetaTags(content: string): any[] {
  const metaTags = [];
  const metaRegex = /<meta[^>]*>/gi;
  let match;
  
  while ((match = metaRegex.exec(content)) !== null) {
    const metaHtml = match[0];
    metaTags.push({
      html: metaHtml,
      name: extractAttribute(metaHtml, 'name'),
      content: extractAttribute(metaHtml, 'content'),
      property: extractAttribute(metaHtml, 'property'),
      charset: extractAttribute(metaHtml, 'charset')
    });
  }
  
  return metaTags;
}

function extractLinks(content: string): any[] {
  const links = [];
  const linkRegex = /<link[^>]*>/gi;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const linkHtml = match[0];
    links.push({
      html: linkHtml,
      href: extractAttribute(linkHtml, 'href'),
      rel: extractAttribute(linkHtml, 'rel'),
      type: extractAttribute(linkHtml, 'type')
    });
  }
  
  return links;
}

function extractStyles(content: string): any[] {
  const styles = [];
  const styleRegex = /<style[^>]*>(.*?)<\/style>/gis;
  let match;
  
  while ((match = styleRegex.exec(content)) !== null) {
    styles.push({
      content: match[1],
      type: extractAttribute(match[0], 'type') || 'text/css'
    });
  }
  
  return styles;
}

function extractTitle(content: string): string {
  const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : '';
}

function extractAttribute(html: string, attribute: string): string {
  const regex = new RegExp(`${attribute}=["']([^"']*)["']`, 'i');
  const match = regex.exec(html);
  return match ? match[1] : '';
}
