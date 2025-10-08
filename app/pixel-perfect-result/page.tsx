"use client";

import { useState } from "react";
import Image from "next/image";

export default function SegurosImediatoPixelPerfect() {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    cpf: "",
    cep: "",
    placa: "",
    marca: "",
    modelo: "",
    ano: "",
    valorVeiculo: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode implementar a lógica de envio
    console.log("Formulário enviado:", formData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header com Contatos */}
      <header className="bg-blue-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            {/* Logo */}
            <div className="mb-4 lg:mb-0">
              <Image
                src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5f845624fe08f9f0d0573fee_logotipo-imediato-seguros.svg"
                alt="Imediato Seguros"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            </div>
            
            {/* Contatos */}
            <div className="flex flex-col sm:flex-row gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Image
                  src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5caf3d1c5db33b3cc3ee36c1_fone%20azul.svg"
                  alt="Telefone"
                  width={20}
                  height={20}
                />
                <span>São Paulo: (11) 3230-1422</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5caf3d1c5db33b3cc3ee36c1_fone%20azul.svg"
                  alt="Telefone"
                  width={20}
                  height={20}
                />
                <span>Rio de Janeiro: (21) 3230-1422</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5caf62fd9e5e1c4c2811e865_whatsapp%20azul%202.svg"
                  alt="WhatsApp"
                  width={20}
                  height={20}
                />
                <span>WhatsApp: (11) 99999-9999</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              25 ANOS DE EXPERIÊNCIA
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold mb-4">
              ESPECIALISTAS EM SEGUROS DE AUTO
            </h2>
            <p className="text-xl mb-8">
              ATENDIMENTO EM TODO O BRASIL
            </p>
            <div className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg inline-block font-bold text-2xl">
              R$ 79⁹⁰ MENSAIS
            </div>
          </div>
        </div>
      </section>

      {/* Formulário Principal */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Coluna Esquerda - Formulário */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                COTAÇÃO GRÁTIS E COMPLETA
              </h3>
              <p className="text-gray-600 mb-8 text-center">
                SEM COMPROMISSO
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados Pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      required
                      placeholder="(11) 99999-9999"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF *
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      required
                      placeholder="000.000.000-00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP *
                  </label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    required
                    placeholder="00000-000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Dados do Veículo */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    DADOS DO VEÍCULO
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Placa *
                      </label>
                      <input
                        type="text"
                        name="placa"
                        value={formData.placa}
                        onChange={handleInputChange}
                        required
                        placeholder="ABC-1234"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marca *
                      </label>
                      <select
                        name="marca"
                        value={formData.marca}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione a marca</option>
                        <option value="chevrolet">Chevrolet</option>
                        <option value="volkswagen">Volkswagen</option>
                        <option value="ford">Ford</option>
                        <option value="fiat">Fiat</option>
                        <option value="toyota">Toyota</option>
                        <option value="honda">Honda</option>
                        <option value="hyundai">Hyundai</option>
                        <option value="nissan">Nissan</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Modelo *
                      </label>
                      <input
                        type="text"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ano *
                      </label>
                      <input
                        type="number"
                        name="ano"
                        value={formData.ano}
                        onChange={handleInputChange}
                        required
                        min="1990"
                        max="2024"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor do Veículo *
                    </label>
                    <input
                      type="number"
                      name="valorVeiculo"
                      value={formData.valorVeiculo}
                      onChange={handleInputChange}
                      required
                      placeholder="R$ 0,00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
                >
                  SOLICITAR COTAÇÃO GRÁTIS
                </button>
              </form>
            </div>

            {/* Coluna Direita - Benefícios */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  POR QUE ESCOLHER A IMEDIATO?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">25 anos de experiência no mercado</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Atendimento em todo o Brasil</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Melhores preços do mercado</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Suporte especializado 24/7</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-8">
                <h4 className="text-xl font-bold text-blue-900 mb-4">
                  ATENDIMENTO DE EMERGÊNCIA
                </h4>
                <p className="text-blue-800 mb-4">
                  Estamos sempre prontos para ajudar você em qualquer situação.
                </p>
                <div className="flex items-center">
                  <Image
                    src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5caf3d1c5db33b3cc3ee36c1_fone%20azul.svg"
                    alt="Telefone"
                    width={24}
                    height={24}
                    className="mr-3"
                  />
                  <span className="text-blue-900 font-semibold">(11) 99999-9999</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Image
              src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5f845624fe08f9f0d0573fee_logotipo-imediato-seguros.svg"
              alt="Imediato Seguros"
              width={200}
              height={60}
              className="h-12 w-auto mx-auto mb-4"
            />
            <p className="text-gray-400 mb-4">
              © 2024 Imediato Seguros. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-sm">
              Corretora de Seguros autorizada pela SUSEP
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}