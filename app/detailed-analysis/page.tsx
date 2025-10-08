"use client";

import { useState, useEffect } from 'react';

export default function DetailedAnalysisPage() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showHtml, setShowHtml] = useState(false);

  useEffect(() => {
    fetch('/api/detailed-analysis')
      .then(response => response.json())
      .then(data => {
        setAnalysis(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao analisar site:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analisando site original em detalhes...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro na Análise</h1>
          <p className="text-gray-600">Não foi possível analisar o site original</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Análise Detalhada do Site Original</h1>
          <p className="text-gray-600">Análise completa para clonagem pixel-perfect</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral' },
              { id: 'structure', label: 'Estrutura' },
              { id: 'forms', label: 'Formulários' },
              { id: 'styles', label: 'Estilos' },
              { id: 'html', label: 'HTML Completo' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título:</label>
                  <p className="text-gray-900">{analysis.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descrição:</label>
                  <p className="text-gray-900">{analysis.metaDescription || 'Não encontrada'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analysis.forms?.length || 0}</div>
                  <div className="text-sm text-gray-600">Formulários</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{analysis.images?.length || 0}</div>
                  <div className="text-sm text-gray-600">Imagens</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{analysis.scripts?.length || 0}</div>
                  <div className="text-sm text-gray-600">Scripts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{analysis.styles?.external?.length || 0}</div>
                  <div className="text-sm text-gray-600">CSS Externos</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'structure' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Estrutura HTML</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Header:</h3>
                  <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                    {analysis.structure?.header ? 
                      `${analysis.structure.header.substring(0, 200)}...` : 
                      'Não encontrado'
                    }
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Main:</h3>
                  <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                    {analysis.structure?.main ? 
                      `${analysis.structure.main.substring(0, 200)}...` : 
                      'Não encontrado'
                    }
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Footer:</h3>
                  <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                    {analysis.structure?.footer ? 
                      `${analysis.structure.footer.substring(0, 200)}...` : 
                      'Não encontrado'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forms' && (
          <div className="space-y-6">
            {analysis.forms?.map((form: any, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Formulário {index + 1}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Campos de Input:</h3>
                    <div className="space-y-2">
                      {form.inputs?.map((input: any, i: number) => (
                        <div key={i} className="bg-gray-100 p-2 rounded text-sm">
                          <div><strong>Tipo:</strong> {input.type || 'text'}</div>
                          <div><strong>Nome:</strong> {input.name || 'N/A'}</div>
                          <div><strong>Placeholder:</strong> {input.placeholder || 'N/A'}</div>
                          <div><strong>Classe:</strong> {input.class || 'N/A'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Botões:</h3>
                    <div className="space-y-2">
                      {form.buttons?.map((button: any, i: number) => (
                        <div key={i} className="bg-gray-100 p-2 rounded text-sm">
                          <div><strong>Tipo:</strong> {button.type || 'button'}</div>
                          <div><strong>Texto:</strong> {button.text || 'N/A'}</div>
                          <div><strong>Classe:</strong> {button.class || 'N/A'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'styles' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Cores Identificadas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analysis.colors?.hex?.slice(0, 12).map((color: string, index: number) => (
                  <div key={index} className="text-center">
                    <div 
                      className="w-16 h-16 rounded border mx-auto mb-2" 
                      style={{ backgroundColor: color }}
                    ></div>
                    <div className="text-xs font-mono">{color}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Fontes</h2>
              <div className="space-y-2">
                {analysis.fonts?.families?.slice(0, 5).map((font: string, index: number) => (
                  <div key={index} className="bg-gray-100 p-2 rounded text-sm font-mono">
                    {font}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">CSS Externos</h2>
              <div className="space-y-2">
                {analysis.styles?.external?.map((css: string, index: number) => (
                  <div key={index} className="bg-gray-100 p-2 rounded text-sm font-mono">
                    {css}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'html' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">HTML Completo</h2>
                <button
                  onClick={() => setShowHtml(!showHtml)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  {showHtml ? 'Ocultar' : 'Mostrar'} HTML
                </button>
              </div>
              
              {showHtml && (
                <div className="bg-gray-900 text-green-400 p-4 rounded text-xs font-mono overflow-auto max-h-96">
                  <pre>{analysis.fullHtml}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
