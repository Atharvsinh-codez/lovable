"use client";

import { useState, useEffect } from 'react';

export default function PixelPerfectClone() {
  const [htmlStructure, setHtmlStructure] = useState<any>(null);
  const [cssContent, setCssContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [htmlResponse, cssResponse] = await Promise.all([
          fetch('/api/extract-html-structure'),
          fetch('/api/extract-css')
        ]);

        const htmlData = await htmlResponse.json();
        const cssData = await cssResponse.json();

        setHtmlStructure(htmlData);
        setCssContent(cssData);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Extraindo HTML e CSS exatos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Clonagem Pixel-Perfect</h1>
          <p className="text-gray-600">Baseada na análise exata do site original</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'preview', label: 'Preview' },
              { id: 'html', label: 'HTML Estruturado' },
              { id: 'css', label: 'CSS Extraído' },
              { id: 'forms', label: 'Formulários' }
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
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Preview da Clonagem</h2>
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src="/seg-imediato"
                  className="w-full h-96"
                  title="Site Original"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Site original para comparação
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Estatísticas da Extração</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {htmlStructure?.forms?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Formulários</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {cssContent?.external?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">CSS Externos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {cssContent?.inline?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">CSS Inline</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {htmlStructure?.scripts?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Scripts</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'html' && htmlStructure && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Estrutura HTML</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Head:</h3>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <div><strong>Título:</strong> {htmlStructure.head?.title}</div>
                    <div><strong>Meta Tags:</strong> {htmlStructure.head?.meta?.length || 0}</div>
                    <div><strong>Links:</strong> {htmlStructure.head?.links?.length || 0}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Header:</h3>
                  <div className="bg-gray-100 p-3 rounded text-sm font-mono max-h-32 overflow-auto">
                    {htmlStructure.header?.content?.substring(0, 500)}...
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Main:</h3>
                  <div className="bg-gray-100 p-3 rounded text-sm font-mono max-h-32 overflow-auto">
                    {htmlStructure.main?.content?.substring(0, 500)}...
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Footer:</h3>
                  <div className="bg-gray-100 p-3 rounded text-sm font-mono max-h-32 overflow-auto">
                    {htmlStructure.footer?.content?.substring(0, 500)}...
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'css' && cssContent && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">CSS Externos</h2>
              <div className="space-y-4">
                {cssContent.external?.map((css: any, index: number) => (
                  <div key={index} className="border rounded p-4">
                    <div className="font-medium text-gray-900 mb-2">
                      CSS {index + 1}: {css.url}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Tamanho: {css.size} caracteres
                    </div>
                    <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono max-h-32 overflow-auto">
                      <pre>{css.content.substring(0, 1000)}...</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">CSS Embedido</h2>
              <div className="space-y-4">
                {cssContent.embedded?.map((css: any, index: number) => (
                  <div key={index} className="border rounded p-4">
                    <div className="font-medium text-gray-900 mb-2">
                      CSS Embedido {index + 1}
                    </div>
                    <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono max-h-32 overflow-auto">
                      <pre>{css.content.substring(0, 1000)}...</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forms' && htmlStructure && (
          <div className="space-y-6">
            {htmlStructure.forms?.map((form: any, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Formulário {index + 1}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Informações do Formulário:</h3>
                    <div className="bg-gray-100 p-3 rounded text-sm space-y-1">
                      <div><strong>Action:</strong> {form.action || 'N/A'}</div>
                      <div><strong>Method:</strong> {form.method}</div>
                      <div><strong>Classes:</strong> {form.classes || 'N/A'}</div>
                      <div><strong>ID:</strong> {form.id || 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Campos ({form.inputs?.length || 0}):</h3>
                    <div className="space-y-2 max-h-64 overflow-auto">
                      {form.inputs?.map((input: any, i: number) => (
                        <div key={i} className="bg-gray-100 p-2 rounded text-sm">
                          <div><strong>Tipo:</strong> {input.type}</div>
                          <div><strong>Nome:</strong> {input.name || 'N/A'}</div>
                          <div><strong>Placeholder:</strong> {input.placeholder || 'N/A'}</div>
                          <div><strong>Classes:</strong> {input.class || 'N/A'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Botões ({form.buttons?.length || 0}):</h3>
                  <div className="space-y-2">
                    {form.buttons?.map((button: any, i: number) => (
                      <div key={i} className="bg-gray-100 p-2 rounded text-sm">
                        <div><strong>Tipo:</strong> {button.type}</div>
                        <div><strong>Texto:</strong> {button.content}</div>
                        <div><strong>Classes:</strong> {button.class || 'N/A'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Botão para Ver Resultado */}
        <div className="mt-8 text-center">
          <a 
            href="/pixel-perfect-result"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Ver Clonagem Pixel-Perfect
          </a>
        </div>
      </div>
    </div>
  );
}
