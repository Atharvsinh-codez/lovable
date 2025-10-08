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
    
    // Extrair informações importantes
    const analysis = {
      title: extractTitle(html),
      metaDescription: extractMetaDescription(html),
      colors: extractColors(html),
      fonts: extractFonts(html),
      components: extractComponents(html),
      forms: extractForms(html),
      scripts: extractScripts(html),
      styles: extractStyles(html)
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

function extractColors(html: string): string[] {
  const colorRegex = /#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)/g;
  const colors = html.match(colorRegex) || [];
  return [...new Set(colors)].slice(0, 20); // Limitar a 20 cores únicas
}

function extractFonts(html: string): string[] {
  const fontRegex = /font-family:\s*([^;]+)/gi;
  const fonts = [];
  let match;
  while ((match = fontRegex.exec(html)) !== null) {
    fonts.push(match[1].trim());
  }
  return [...new Set(fonts)];
}

function extractComponents(html: string): string[] {
  const components = [];
  
  // Identificar componentes comuns
  if (html.includes('header')) components.push('Header');
  if (html.includes('nav')) components.push('Navigation');
  if (html.includes('hero')) components.push('Hero Section');
  if (html.includes('form')) components.push('Forms');
  if (html.includes('button')) components.push('Buttons');
  if (html.includes('card')) components.push('Cards');
  if (html.includes('footer')) components.push('Footer');
  
  return components;
}

function extractForms(html: string): any[] {
  const formRegex = /<form[^>]*>(.*?)<\/form>/gis;
  const forms = [];
  let match;
  
  while ((match = formRegex.exec(html)) !== null) {
    const formHtml = match[0];
    const inputs = (formHtml.match(/<input[^>]*>/gi) || []).length;
    const selects = (formHtml.match(/<select[^>]*>/gi) || []).length;
    const textareas = (formHtml.match(/<textarea[^>]*>/gi) || []).length;
    
    forms.push({
      inputs,
      selects,
      textareas,
      totalFields: inputs + selects + textareas
    });
  }
  
  return forms;
}

function extractScripts(html: string): string[] {
  const scriptRegex = /<script[^>]*src=["']([^"']*)["']/gi;
  const scripts = [];
  let match;
  
  while ((match = scriptRegex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  
  return scripts;
}

function extractStyles(html: string): string[] {
  const styleRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']*)["']/gi;
  const styles = [];
  let match;
  
  while ((match = styleRegex.exec(html)) !== null) {
    styles.push(match[1]);
  }
  
  return styles;
}
