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
    
    // Extrair CSS externos
    const cssFiles = await extractExternalCSS(html);
    
    // Extrair CSS inline
    const inlineCSS = extractInlineCSS(html);
    
    // Extrair CSS embedido
    const embeddedCSS = extractEmbeddedCSS(html);
    
    // Combinar todos os CSS
    const allCSS = {
      external: cssFiles,
      inline: inlineCSS,
      embedded: embeddedCSS,
      combined: combineAllCSS(cssFiles, inlineCSS, embeddedCSS)
    };

    return NextResponse.json(allCSS);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao extrair CSS', details: error.message },
      { status: 500 }
    );
  }
}

async function extractExternalCSS(html: string): Promise<any[]> {
  const cssFiles = [];
  const linkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']*)["']/gi;
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    const cssUrl = match[1];
    
    // Se for URL relativa, tornar absoluta
    const fullUrl = cssUrl.startsWith('http') ? cssUrl : `https://www.segurosimediato.com.br${cssUrl.startsWith('/') ? '' : '/'}${cssUrl}`;
    
    try {
      const cssResponse = await fetch(fullUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (cssResponse.ok) {
        const cssContent = await cssResponse.text();
        cssFiles.push({
          url: fullUrl,
          content: cssContent,
          size: cssContent.length
        });
      }
    } catch (error) {
      console.error(`Erro ao buscar CSS ${fullUrl}:`, error);
    }
  }
  
  return cssFiles;
}

function extractInlineCSS(html: string): any[] {
  const inlineStyles = [];
  const styleRegex = /style=["']([^"']*)["']/gi;
  let match;
  
  while ((match = styleRegex.exec(html)) !== null) {
    inlineStyles.push({
      content: match[1],
      context: getContextAroundMatch(html, match.index, 100)
    });
  }
  
  return inlineStyles;
}

function extractEmbeddedCSS(html: string): any[] {
  const embeddedStyles = [];
  const styleRegex = /<style[^>]*>(.*?)<\/style>/gis;
  let match;
  
  while ((match = styleRegex.exec(html)) !== null) {
    embeddedStyles.push({
      content: match[1],
      type: extractAttribute(match[0], 'type') || 'text/css'
    });
  }
  
  return embeddedStyles;
}

function combineAllCSS(externalCSS: any[], inlineCSS: any[], embeddedCSS: any[]): string {
  let combined = '';
  
  // Adicionar CSS externos
  externalCSS.forEach(css => {
    combined += `/* CSS Externo: ${css.url} */\n${css.content}\n\n`;
  });
  
  // Adicionar CSS embedido
  embeddedCSS.forEach(css => {
    combined += `/* CSS Embedido */\n${css.content}\n\n`;
  });
  
  // Adicionar CSS inline como comentários
  inlineCSS.forEach((css, index) => {
    combined += `/* CSS Inline ${index + 1} */\n/* ${css.context} */\n/* ${css.content} */\n\n`;
  });
  
  return combined;
}

function getContextAroundMatch(text: string, index: number, contextLength: number): string {
  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + contextLength);
  return text.substring(start, end);
}

function extractAttribute(html: string, attribute: string): string {
  const regex = new RegExp(`${attribute}=["']([^"']*)["']`, 'i');
  const match = regex.exec(html);
  return match ? match[1] : '';
}
