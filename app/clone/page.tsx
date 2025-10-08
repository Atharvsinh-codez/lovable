"use client";

import { useState, useEffect } from 'react';

export default function ClonePage() {
  const [originalContent, setOriginalContent] = useState<any>(null);
  const [designSystem, setDesignSystem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [extractingDesign, setExtractingDesign] = useState(false);

  useEffect(() => {
    // Carregar análise do site original
    fetch('/api/analyze-original')
      .then(response => response.json())
      .then(analysis => {
        setOriginalContent(analysis);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao analisar site original:', error);
        setIsLoading(false);
      });
  }, []);

  const extractDesignSystem = async () => {
    setExtractingDesign(true);
    try {
      const response = await fetch('/api/extract-design');
      const design = await response.json();
      setDesignSystem(design);
    } catch (error) {
      console.error('Erro ao extrair design system:', error);
    } finally {
      setExtractingDesign(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analisando site original...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de Análise */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Análise do Site Original</h1>
          <p className="text-gray-600">Conteúdo carregado para análise e clonagem</p>
        </div>
      </div>

      {/* Preview do Site Original */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Preview do Site Original</h2>
          <div className="border rounded-lg overflow-hidden">
            <iframe
              src="/seg-imediato"
              className="w-full h-96"
              title="Site Original"
            />
          </div>
        </div>

        {/* Análise de Componentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Análise do Site Original</h3>
            {originalContent && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Título:</h4>
                  <p className="text-sm text-gray-600">{originalContent.title || 'Não encontrado'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Descrição:</h4>
                  <p className="text-sm text-gray-600">{originalContent.metaDescription || 'Não encontrada'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Componentes Identificados:</h4>
                  <div className="flex flex-wrap gap-2">
                    {originalContent.components?.map((component: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {component}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Formulários:</h4>
                  <p className="text-sm text-gray-600">
                    {originalContent.forms?.length || 0} formulário(s) encontrado(s)
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Próximos Passos</h3>
            <div className="space-y-3">
              <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                <h4 className="font-medium text-blue-900">1. Extrair CSS e Design System</h4>
                <p className="text-sm text-blue-700">Identificar cores, tipografia e componentes</p>
              </div>
              <div className="p-3 border-l-4 border-green-500 bg-green-50">
                <h4 className="font-medium text-green-900">2. Criar Componentes React</h4>
                <p className="text-sm text-green-700">Replicar cada seção como componente</p>
              </div>
              <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                <h4 className="font-medium text-purple-900">3. Implementar Funcionalidades</h4>
                <p className="text-sm text-purple-700">Formulários, validações e APIs</p>
              </div>
              <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
                <h4 className="font-medium text-orange-900">4. Teste e Refinamento</h4>
                <p className="text-sm text-orange-700">Comparar com original e ajustar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Design System Extraído */}
        {designSystem && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Design System Extraído</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Paleta de Cores:</h4>
                <div className="space-y-2">
                  {designSystem.colors?.primary?.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-600">Primárias:</span>
                      <div className="flex gap-2 mt-1">
                        {designSystem.colors.primary.slice(0, 5).map((color: string, index: number) => (
                          <div key={index} className="w-8 h-8 rounded border" style={{ backgroundColor: color }} title={color}></div>
                        ))}
                      </div>
                    </div>
                  )}
                  {designSystem.colors?.semantic?.success?.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-600">Sucesso:</span>
                      <div className="flex gap-2 mt-1">
                        {designSystem.colors.semantic.success.slice(0, 3).map((color: string, index: number) => (
                          <div key={index} className="w-8 h-8 rounded border" style={{ backgroundColor: color }} title={color}></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tipografia:</h4>
                <div className="space-y-2">
                  {designSystem.typography?.fonts?.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-600">Fontes:</span>
                      <div className="text-sm text-gray-800">
                        {designSystem.typography.fonts.slice(0, 3).join(', ')}
                      </div>
                    </div>
                  )}
                  {designSystem.typography?.sizes?.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-600">Tamanhos:</span>
                      <div className="text-sm text-gray-800">
                        {designSystem.typography.sizes.slice(0, 5).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="mt-8 text-center space-x-4">
          <button 
            onClick={extractDesignSystem}
            disabled={extractingDesign}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {extractingDesign ? 'Extraindo...' : 'Extrair Design System'}
          </button>
          
          <button 
            onClick={() => {
              // Aqui iniciaremos o processo de clonagem
              console.log('Iniciando processo de clonagem...');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Iniciar Processo de Clonagem
          </button>
          
          <a 
            href="/clone-result"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Ver Resultado da Clonagem
          </a>
          
          <a 
            href="/detailed-analysis"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Análise Detalhada (Pixel-Perfect)
          </a>
          
          <a 
            href="/pixel-perfect"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Clonagem Pixel-Perfect
          </a>
          
          <a 
            href="/pixel-perfect-result"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Resultado Pixel-Perfect
          </a>
        </div>
      </div>
    </div>
  );
}
