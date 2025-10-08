"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function SegurosImediatoWebflowClone() {
  const [formData, setFormData] = useState({
    nome: "",
    dddCelular: "",
    celular: "",
    email: "",
    cep: "",
    cpf: "",
    placa: "",
    ano: "",
    marca: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulário Webflow enviado:", formData);
  };

  return (
    <>
      {/* CSS Original do Webflow */}
      <style jsx global>{`
        @import url('https://cdn.prod.website-files.com/59eb807f9d16950001e202af/css/segurosimediato.shared.2c3efc89a.min.css');
        @import url('https://cdn.prod.website-files.com/59eb807f9d16950001e202af/css/segurosimediato.59eb807f9d16950001e202b2-2fa8a5b6f.min.css');
        
        /* Garantir que as classes Webflow funcionem */
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
        
        .w-col-7 {
          flex: 0 0 58.333333%;
        }
        
        .w-col-5 {
          flex: 0 0 41.666667%;
        }
        
        .w-col-6 {
          flex: 0 0 50%;
        }
        
        /* Formulário Webflow */
        .w-form {
          position: relative;
        }
        
        .w-input {
          width: 100%;
          height: 38px;
          padding: 8px 12px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 0;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .w-button {
          display: inline-block;
          padding: 9px 15px;
          background-color: #3898ec;
          color: white;
          border: 0;
          line-height: inherit;
          text-decoration: none;
          cursor: pointer;
          border-radius: 0;
        }
        
        /* Layout específico do site */
        .brand-new-header {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          color: white;
          padding: 1rem 0;
        }
        
        .hero {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          padding: 4rem 0;
        }
        
        .container_padrao {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        /* Preço destacado */
        .div-preco {
          display: flex;
          align-items: baseline;
          justify-content: center;
        }
        
        .preco {
          font-size: 3rem;
          font-weight: bold;
          color: #fbbf24;
        }
        
        .centavos-preco {
          font-size: 1.5rem;
          font-weight: bold;
          color: #fbbf24;
        }
        
        .div-pre-preco {
          text-align: center;
          margin-bottom: 0.5rem;
        }
        
        .pre-preco {
          font-size: 1rem;
          color: white;
        }
        
        /* Formulário específico */
        .form_auto {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .field {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        
        .field:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .submit-button {
          width: 100%;
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
        
        .submit-button:hover {
          background: #059669;
          transform: translateY(-2px);
        }
        
        /* Grid de seguros */
        .w-layout-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .grid-7 {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
        
        /* Responsivo */
        @media (max-width: 768px) {
          .w-col-7, .w-col-5 {
            flex: 0 0 100%;
          }
          
          .hero {
            padding: 2rem 0;
          }
          
          .preco {
            font-size: 2rem;
          }
          
          .centavos-preco {
            font-size: 1rem;
          }
        }
      `}</style>

      {/* Estrutura HTML Idêntica ao Webflow */}
      <div className="body" page="home">
        {/* Header Webflow */}
        <div id="new-header" section="new-header" className="brand-new-header">
          <div className="container-15 w-container">
            <div className="dvblksess2-2">
              <div className="div-block-38">
                <a href="/" id="link-home" aria-current="page" className="link-image-header-2 w-inline-block w--current">
                  <Image
                    src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5f845624fe08f9f0d0573fee_logotipo-imediato-seguros.svg"
                    alt="Imediato Seguros"
                    width={200}
                    height={60}
                    className="image-30"
                    loading="lazy"
                  />
                </a>
              </div>
              
              <div className="div-block-37">
                <div className="dvblkhdr2-2">
                  <div className="dvblkstd1">
                    <h2 className="heading-19">São Paulo:</h2>
                  </div>
                  <div className="dvblkstd11">
                    <Image
                      src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5caf3d1c5db33b3cc3ee36c1_fone%20azul.svg"
                      alt="Icone Telefone svg"
                      width={20}
                      height={20}
                      className="image-26"
                    />
                  </div>
                  <div className="dvblkstd12">
                    <a href="tel:+551132301422" id="sp-fone-link" telefone="telefone-1" className="fone-link top sp">
                      (11) 3230-1422
                    </a>
                  </div>
                </div>
                
                <div className="dvblkhdr2-2">
                  <div className="dvblkstd1">
                    <h2 className="heading-19">Rio de Janeiro:</h2>
                  </div>
                  <div className="dvblkstd11">
                    <Image
                      src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5caf3d1c5db33b3cc3ee36c1_fone%20azul.svg"
                      alt="Icone Telefone svg"
                      width={20}
                      height={20}
                      className="image-26"
                    />
                  </div>
                  <div className="dvblkstd12">
                    <a href="tel:+552140421811" id="rj-fone-link-header" className="fone-link top sp">
                      (21) 4042-1811
                    </a>
                  </div>
                </div>
                
                <div className="dvblkhdr2-2">
                  <div className="dvblkstd1">
                    <h2 className="heading-19">Whatsapp:</h2>
                  </div>
                  <div className="dvblkstd11">
                    <Image
                      src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5caf62fd9e5e1c4c2811e865_whatsapp%20azul%202.svg"
                      alt="Icone whatsapp svg"
                      width={20}
                      height={20}
                      className="image-26"
                    />
                  </div>
                  <div className="dvblkstd12">
                    <a href="#" id="whatsappfone1" className="whatsapplink">
                      (11) 3230-1422
                    </a>
                  </div>
                </div>
                
                <div className="dvblkhdr2-2">
                  <div className="dvblkstd1">
                    <h2 className="heading-19">Emergência:</h2>
                  </div>
                  <div className="dvblkstd11">
                    <Image
                      src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5caf3d1c5db33b3cc3ee36c1_fone%20azul.svg"
                      alt="Icone Telefone svg"
                      width={20}
                      height={20}
                      className="image-26"
                    />
                  </div>
                  <div className="dvblkstd12">
                    <a href="tel:+5511953288466" id="sp-cellfone-link" telefone="telefone-1" className="fone-link-copy top sp">
                      (11) 95328-8466
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section Webflow */}
        <div className="hero hero-auto auto">
          <div className="container_padrao menina w-container">
            <div className="text-block-16">
              25 ANOS DE EXPERIÊNCIA.<br/>
              ESPECIALISTAS EM<br/>
              SEGUROS DE AUTO.<br/>
              ATENDIMENTO EM TODO<br/>
              O TERRITÓRIO NACIONAL.
            </div>
            
            <div id="submit_button" whenClicked="set" className="wrapper w-form">
              <div className="cabecalho-form">
                <div className="row-form w-row">
                  <div className="col-form cotacao-form auto-form w-col w-col-7 w-col-medium-6 w-col-small-6 w-col-tiny-6">
                    <div className="div-main-title-esq auto">
                      <div className="brand-new-text-title-form-esq auto">SEGURO</div>
                    </div>
                    <div className="div-main-title-esq auto">
                      <div className="brand-new-text-title-form-esq auto">DE AUTO</div>
                    </div>
                    <div className="div-sub-title">
                      <div className="sub-text-form-esq auto">CÁLCULO ONLINE</div>
                    </div>
                    <div className="div-sub-title">
                      <div className="sub-text-form-esq auto">COTAÇÃO EM 16 SEGURADORAS</div>
                    </div>
                  </div>
                  
                  <div className="col-form dir w-col w-col-5 w-col-medium-6 w-col-small-6 w-col-tiny-6">
                    <div className="div-pre-preco">
                      <div className="pre-preco">A PARTIR DE</div>
                    </div>
                    <div className="div-preco">
                      <div className="preco caminhao">R$ 79</div>
                      <div className="centavos-preco">90</div>
                    </div>
                    <div className="div-pre-preco">
                      <div className="pre-preco">MENSAIS</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Formulário Webflow Original */}
              <form 
                id="wf-form-Home-Seguro-Auto" 
                name="wf-form-Home-Seguro-Auto" 
                data-name="Home Seguro Auto" 
                redirect="/sucesso" 
                data-redirect="/sucesso" 
                method="post" 
                className="form_auto w-clearfix"
                onSubmit={handleSubmit}
              >
                <input 
                  className="field nome w-input" 
                  maxLength={256} 
                  name="nome" 
                  data-name="NOME" 
                  placeholder="Nome" 
                  type="text" 
                  id="NOME" 
                  value={formData.nome}
                  onChange={handleInputChange}
                  required 
                />
                
                <div className="div-block-3"></div>
                
                <div className="brand-new-text-alert">
                  Preencha o <strong>DDD</strong>, o <strong className="bold-text-5">Celular, </strong>o <strong>CEP </strong>e o<strong> CPF</strong> só com números. 
                  Caso prefira não informar o <strong>CPF, </strong>o <strong className="bold-text-4">CEP </strong>e a <strong>PLACA</strong> do veículo, 
                  entraremos em contato para coletar essas informações.
                </div>
                
                <input 
                  className="field ddd-fone w-input" 
                  maxLength={256} 
                  name="dddCelular" 
                  data-name="DDD-CELULAR" 
                  placeholder="DDD" 
                  type="text" 
                  id="DDD-CELULAR" 
                  value={formData.dddCelular}
                  onChange={handleInputChange}
                  required 
                />
                
                <input 
                  className="field celular noauto w-input" 
                  maxLength={256} 
                  name="celular" 
                  data-name="CELULAR" 
                  placeholder="CELULAR" 
                  type="text" 
                  id="CELULAR" 
                  value={formData.celular}
                  onChange={handleInputChange}
                  required 
                />
                
                <input 
                  className="field email w-input" 
                  maxLength={256} 
                  name="email" 
                  data-name="Email" 
                  placeholder="Email" 
                  type="email" 
                  id="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
                
                <input 
                  className="field cep w-input" 
                  maxLength={256} 
                  name="cep" 
                  data-name="CEP" 
                  placeholder="CEP DA RESIDÊNCIA" 
                  type="text" 
                  id="CEP" 
                  value={formData.cep}
                  onChange={handleInputChange}
                />
                
                <input 
                  className="field cidade noauto w-input" 
                  maxLength={256} 
                  name="cpf" 
                  data-name="CPF" 
                  placeholder="CPF" 
                  type="text" 
                  id="CPF" 
                  value={formData.cpf}
                  onChange={handleInputChange}
                />
                
                <input 
                  className="field estado w-input" 
                  maxLength={256} 
                  name="placa" 
                  data-name="PLACA" 
                  placeholder="PLACA DO VEÍCULO" 
                  type="text" 
                  id="PLACA" 
                  value={formData.placa}
                  onChange={handleInputChange}
                />
                
                <input 
                  className="field ano w-input" 
                  maxLength={256} 
                  name="ano" 
                  data-name="ANO" 
                  placeholder="ANO DO MODELO DO VEÍCULO" 
                  type="number" 
                  id="ANO" 
                  value={formData.ano}
                  onChange={handleInputChange}
                />
                
                <input 
                  className="field veiculo w-input" 
                  maxLength={256} 
                  name="marca" 
                  data-name="MARCA" 
                  placeholder="Fabricante / Marca / Modelo  Ex: FIAT UNO VIVACE 1.4 flex" 
                  type="text" 
                  id="MARCA" 
                  value={formData.marca}
                  onChange={handleInputChange}
                />
                
                <input 
                  type="submit" 
                  data-wait="Aguarde..." 
                  id="submit_button_auto" 
                  whenClicked="set" 
                  className="submit-button w-button" 
                  value="CALCULE AGORA!" 
                />
                
                <div className="html-embed w-embed">
                  <input id="GCLID_FLD" name="GCLID_FLD" />
                </div>
                <div className="html-embed-3 w-embed">
                  <input id="SEQUENCIA_FLD" name="SEQUENCIA_FLD" />
                </div>
              </form>
              
              <div className="box-sucesso w-form-done">
                <div>
                  Obrigado!<br/>
                  Sua mensagem foi enviada com sucesso e em breve retornaremos com as melhores opções de seguros pra você.
                </div>
              </div>
              
              <div className="w-form-fail">
                <div>
                  Desculpe. Algo está errado no preenchimento do formulário.<br/>
                  Tente novamente.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Seguros */}
        <div className="sessao-menu menu-auto bg-dots">
          <div className="w-container">
            <div className="titulo-principal-isolado">escolha o seu seguro</div>
            <div className="w-layout-grid grid-7">
              <div className="dvblkseguro">
                <a href="/seguro-auto" className="link-blk-seg w-inline-block">
                  <div className="dvblksegurologo">
                    <Image
                      src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5cc34fffffd30f2ab3bdf3f1_logo-auto-sem-linha.svg"
                      alt=""
                      width={50}
                      height={50}
                      className="imglogoseguro lazyload"
                      loading="lazy"
                    />
                  </div>
                  <div className="dvblksegurodescpreco">
                    <div className="dvblkseguropreo">
                      <h1 className="headsegdescricao">Auto</h1>
                    </div>
                    <div className="dvblksegurodescricao">
                      <div className="txtblksegpreco">
                        A partir de<br/>R$ 79,90 <br/>mensais
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              
              <div className="dvblkseguro caminhao">
                <a href="/seguro-caminhao" className="link-blk-seg w-inline-block">
                  <div className="dvblksegurologo">
                    <Image
                      src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/6123b64c567800209abed277_caminhao-0.svg"
                      alt=""
                      width={50}
                      height={50}
                      className="imglogoseguro lazyload"
                      loading="lazy"
                    />
                  </div>
                  <div className="dvblksegurodescpreco">
                    <div className="dvblkseguropreo">
                      <h1 className="headsegdescricao">Caminhão</h1>
                    </div>
                    <div className="dvblksegurodescricao">
                      <div className="txtblksegpreco">
                        A partir de<br/>R$ 99,90 <br/>mensais
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              
              <div className="dvblkseguro uber">
                <a href="/seguro-uber" className="link-blk-seg w-inline-block">
                  <div className="dvblksegurologo">
                    <Image
                      src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5cc34fff3d71025a487e4863_logo-uber-sem-linha.svg"
                      alt="Seguro de Aplicativo svg"
                      width={50}
                      height={50}
                      className="imglogoseguro lazyload"
                      loading="lazy"
                    />
                  </div>
                  <div className="dvblksegurodescpreco">
                    <div className="dvblkseguropreo">
                      <h1 className="headsegdescricao">Uber</h1>
                    </div>
                    <div className="dvblksegurodescricao">
                      <div className="txtblksegpreco">
                        A partir de<br/>R$ 84,90<br/>mensais
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              
              <div className="dvblkseguro motos">
                <a href="/seguro-motos" className="link-blk-seg w-inline-block">
                  <div className="dvblksegurologo">
                    <Image
                      src="https://cdn.prod.website-files.com/59eb807f9d16950001e202af/5cc34fffa34976d27b97d375_logo-moto-sem-linha.svg"
                      alt="Seguro de Moto svg"
                      width={50}
                      height={50}
                      className="imglogoseguro lazyload"
                      loading="lazy"
                    />
                  </div>
                  <div className="dvblksegurodescpreco">
                    <div className="dvblkseguropreo">
                      <h1 className="headsegdescricao">Motos</h1>
                    </div>
                    <div className="dvblksegurodescricao">
                      <div className="txtblksegpreco">
                        A partir de<br/>R$ 49,90 <br/>mensais
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="calculo-auto footer">
          <div className="container_padrao footer w-container">
            <div className="row footer w-row">
              <div className="col rodape w-col w-col-5 w-col-medium-6 w-col-small-6">
                <p className="paragraph">
                  <strong className="bold-text">IMEDIATO SOLUÇÕES CORRETORA DE SEGUROS LTDA.</strong>
                </p>
                <p className="paragraph-sub">
                  MAIS DE 35 ANOS DE EXPERIÊNCIA.<br/>
                  ESPECIALISTA EM SEGUROS DE AUTO.
                </p>
                <div className="div-block-43">
                  <div className="div-block-44">
                    <div className="text-block-48">
                      Registro na SUSEP: <strong className="bold-text-3">222137462</strong>
                    </div>
                  </div>
                </div>
                <div className="text-block-49">
                  CPNJ: <strong className="bold-text-2">45.998.165/0001-32</strong>
                </div>
                <p className="paragraph-text">
                  Rua Barão de Itapetininga, 125 - 6o andar<br/>
                  <span className="thin">CEP 01042-001 - Centro - São Paulo – SP</span>
                </p>
              </div>
              
              <div className="col rodape w-col w-col-7 w-col-medium-6 w-col-small-6">
                <div className="div-block-39">
                  <div className="dvblkfone">
                    <div className="text-block-12 rod">São Paulo:</div>
                    <a href="tel:+551132301422" id="sp-fone-link-footer" className="fone-link sp">
                      (11) 3230-1422
                    </a>
                  </div>
                  <div className="dvblkfone">
                    <div className="text-block-12 rod">Rio de Janeiro:</div>
                    <a href="tel:+552140421811" id="rj-fone-link" className="fone-link rj">
                      (21) 4042-1811
                    </a>
                  </div>
                  <div className="dvblkfone whatsapp">
                    <div className="text-block-12 rod">Whatsapp:</div>
                    <a href="#" id="whatsappfone2" className="whatsapp-link wp">
                      (11) 4171-8837
                    </a>
                  </div>
                  <div className="dvblkfone">
                    <a href="mailto:CONTATO@IMEDIATOSEGUROS.COM.BR" className="link-header mail">
                      contato@imediatoseguros.com.br
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
