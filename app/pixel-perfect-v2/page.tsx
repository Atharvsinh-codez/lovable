"use client";

import { useState, useEffect } from "react";
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
    console.log("Formulário enviado:", formData);
  };

  return (
    <>
      {/* CSS Original do Site */}
      <style jsx global>{`
        /* CSS Original do Seguros Imediato */
        @import url('https://cdn.prod.website-files.com/59eb807f9d16950001e202af/css/segurosimediato.shared.2c3efc89a.min.css');
        @import url('https://cdn.prod.website-files.com/59eb807f9d16950001e202af/css/segurosimediato.59eb807f9d16950001e202b2-2fa8a5b6f.min.css');
        
        /* Garantir que o layout seja idêntico */
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
        }
        
        /* Preservar classes originais do Webflow */
        .w-container {
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .w-row {
          display: flex;
          flex-wrap: wrap;
        }
        
        .w-col {
          flex: 1;
        }
        
        /* Header específico */
        .header-section {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          color: white;
          padding: 1rem 0;
        }
        
        /* Hero section */
        .hero-section {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          padding: 4rem 0;
          text-align: center;
        }
        
        /* Formulário */
        .form-section {
          background: #f8fafc;
          padding: 3rem 0;
        }
        
        .form-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          padding: 2rem;
        }
        
        /* Botões */
        .btn-primary {
          background: #10b981;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: bold;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          background: #059669;
          transform: translateY(-2px);
        }
        
        /* Inputs */
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        /* Grid responsivo */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        /* Preço destacado */
        .price-highlight {
          background: #fbbf24;
          color: #1f2937;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.5rem;
          font-weight: bold;
          display: inline-block;
          margin: 1rem 0;
        }
        
        /* Benefícios */
        .benefits-section {
          background: white;
          padding: 3rem 0;
        }
        
        .benefit-item {
          display: flex;
          align-items: center;
          margin: 1rem 0;
        }
        
        .benefit-icon {
          width: 24px;
          height: 24px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          color: white;
        }
        
        /* Responsivo */
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .hero-section {
            padding: 2rem 0;
          }
          
          .price-highlight {
            font-size: 1.2rem;
            padding: 0.75rem 1.5rem;
          }
        }
      `}</style>

      {/* Estrutura HTML Idêntica ao Original */}
      <div className="w-container">
        {/* Header com Contatos */}
        <header className="header-section">
          <div className="w-container">
            <div className="w-row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Logo */}
              <div className="w-col" style={{ flex: '0 0 auto' }}>
                <Image
                  src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5f845624fe08f9f0d0573fee_logotipo-imediato-seguros.svg"
                  alt="Imediato Seguros"
                  width={200}
                  height={60}
                  style={{ height: '60px', width: 'auto' }}
                />
              </div>
              
              {/* Contatos */}
              <div className="w-col" style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Image
                      src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5caf3d1c5db33b3cc3ee36c1_fone%20azul.svg"
                      alt="Telefone"
                      width={20}
                      height={20}
                    />
                    <span>São Paulo: (11) 3230-1422</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Image
                      src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5caf3d1c5db33b3cc3ee36c1_fone%20azul.svg"
                      alt="Telefone"
                      width={20}
                      height={20}
                    />
                    <span>Rio de Janeiro: (21) 3230-1422</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="w-container">
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              25 ANOS DE EXPERIÊNCIA
            </h1>
            <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem' }}>
              ESPECIALISTAS EM SEGUROS DE AUTO
            </h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
              ATENDIMENTO EM TODO O BRASIL
            </p>
            <div className="price-highlight">
              R$ 79⁹⁰ MENSAIS
            </div>
          </div>
        </section>

        {/* Formulário Principal */}
        <section className="form-section">
          <div className="w-container">
            <div className="w-row" style={{ gap: '3rem' }}>
              {/* Coluna Esquerda - Formulário */}
              <div className="w-col" style={{ flex: '1' }}>
                <div className="form-container">
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>
                    COTAÇÃO GRÁTIS E COMPLETA
                  </h3>
                  <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
                    SEM COMPROMISSO
                  </p>
                  
                  <form onSubmit={handleSubmit}>
                    {/* Dados Pessoais */}
                    <div className="form-grid">
                      <div>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          name="nome"
                          value={formData.nome}
                          onChange={handleInputChange}
                          required
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleInputChange}
                          required
                          placeholder="(11) 99999-9999"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                          E-mail *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                          CPF *
                        </label>
                        <input
                          type="text"
                          name="cpf"
                          value={formData.cpf}
                          onChange={handleInputChange}
                          required
                          placeholder="000.000.000-00"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                        CEP *
                      </label>
                      <input
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleInputChange}
                        required
                        placeholder="00000-000"
                        className="form-input"
                      />
                    </div>

                    {/* Dados do Veículo */}
                    <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                        DADOS DO VEÍCULO
                      </h4>
                      
                      <div className="form-grid">
                        <div>
                          <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                            Placa *
                          </label>
                          <input
                            type="text"
                            name="placa"
                            value={formData.placa}
                            onChange={handleInputChange}
                            required
                            placeholder="ABC-1234"
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                            Marca *
                          </label>
                          <select
                            name="marca"
                            value={formData.marca}
                            onChange={handleInputChange}
                            required
                            className="form-input"
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

                      <div className="form-grid">
                        <div>
                          <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                            Modelo *
                          </label>
                          <input
                            type="text"
                            name="modelo"
                            value={formData.modelo}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
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
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                          Valor do Veículo *
                        </label>
                        <input
                          type="number"
                          name="valorVeiculo"
                          value={formData.valorVeiculo}
                          onChange={handleInputChange}
                          required
                          placeholder="R$ 0,00"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ width: '100%', marginTop: '2rem' }}
                    >
                      SOLICITAR COTAÇÃO GRÁTIS
                    </button>
                  </form>
                </div>
              </div>

              {/* Coluna Direita - Benefícios */}
              <div className="w-col" style={{ flex: '1' }}>
                <div className="benefits-section">
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    POR QUE ESCOLHER A IMEDIATO?
                  </h3>
                  <div>
                    <div className="benefit-item">
                      <div className="benefit-icon">✓</div>
                      <span>25 anos de experiência no mercado</span>
                    </div>
                    <div className="benefit-item">
                      <div className="benefit-icon">✓</div>
                      <span>Atendimento em todo o Brasil</span>
                    </div>
                    <div className="benefit-item">
                      <div className="benefit-icon">✓</div>
                      <span>Melhores preços do mercado</span>
                    </div>
                    <div className="benefit-item">
                      <div className="benefit-icon">✓</div>
                      <span>Suporte especializado 24/7</span>
                    </div>
                  </div>

                  <div style={{ background: '#dbeafe', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '1rem' }}>
                      ATENDIMENTO DE EMERGÊNCIA
                    </h4>
                    <p style={{ color: '#1e40af', marginBottom: '1rem' }}>
                      Estamos sempre prontos para ajudar você em qualquer situação.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Image
                        src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5caf3d1c5db33b3cc3ee36c1_fone%20azul.svg"
                        alt="Telefone"
                        width={24}
                        height={24}
                        style={{ marginRight: '0.75rem' }}
                      />
                      <span style={{ color: '#1e40af', fontWeight: '600' }}>(11) 99999-9999</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: '#1f2937', color: 'white', padding: '2rem 0', textAlign: 'center' }}>
          <div className="w-container">
            <Image
              src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5f845624fe08f9f0d0573fee_logotipo-imediato-seguros.svg"
              alt="Imediato Seguros"
              width={200}
              height={60}
              style={{ height: '60px', width: 'auto', marginBottom: '1rem' }}
            />
            <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
              © 2024 Imediato Seguros. Todos os direitos reservados.
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Corretora de Seguros autorizada pela SUSEP
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
