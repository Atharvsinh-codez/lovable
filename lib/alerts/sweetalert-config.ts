import Swal from 'sweetalert2';

/**
 * Configuração customizada do SweetAlert2 para o tema da marca
 * Baseado no código original do Webflow
 */

// Configuração base do tema
const themeConfig = {
  // Cores da marca
  primary: '#004A8D',
  accent: '#009FE3',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Configurações de estilo
  borderRadius: '14px',
  boxShadow: '0 16px 50px rgba(0, 74, 141, 0.25)',
  padding: '22px'
};

// Configuração global do SweetAlert2
Swal.mixin({
  customClass: {
    popup: 'swal2-popup-custom',
    title: 'swal2-title-custom',
    htmlContainer: 'swal2-content-custom',
    confirmButton: 'swal2-confirm-custom',
    cancelButton: 'swal2-cancel-custom',
    actions: 'swal2-actions-custom'
  },
  buttonsStyling: false,
  allowOutsideClick: false,
  allowEscapeKey: true,
  reverseButtons: true
});

// Estilos CSS customizados
const customStyles = `
  <style id="swal2-brand-theme">
    :root {
      --brand-primary: ${themeConfig.primary};
      --brand-accent: ${themeConfig.accent};
      --brand-text: ${themeConfig.primary};
    }

    /* Overlay com leve tint azul e sempre centralizado */
    .swal2-container {
      background-color: rgba(0, 74, 141, 0.35) !important;
      z-index: 99999 !important;
    }

    .swal2-popup {
      border-radius: ${themeConfig.borderRadius} !important;
      box-shadow: ${themeConfig.boxShadow} !important;
      padding-top: ${themeConfig.padding} !important;
    }

    .swal2-title {
      color: var(--brand-text) !important;
      font-weight: 700 !important;
    }

    .swal2-html-container {
      color: #2b3a4a !important;
      line-height: 1.45 !important;
      text-align: center !important;
      white-space: pre-wrap;
    }

    /* ========= ÍCONES ========= */
    /* WARNING → círculo azul escuro, borda igual, ponto de exclamação branco */
    .swal2-icon.swal2-warning {
      border-color: var(--brand-primary) !important;
      background-color: var(--brand-primary) !important;
      color: #fff !important;
    }

    .swal2-icon.swal2-warning .swal2-icon-content {
      color: #fff !important;
      font-weight: 800 !important;
    }

    /* INFO / SUCCESS (mantêm paleta da marca) */
    .swal2-icon.swal2-info {
      border-color: var(--brand-accent) !important;
      color: var(--brand-accent) !important;
    }

    .swal2-icon.swal2-success {
      border-color: rgba(0,159,227,.35) !important;
      color: var(--brand-accent) !important;
    }

    /* ========= BOTÕES ========= */
    .swal2-actions {
      gap: 10px !important;
    }

    .swal2-styled.swal2-cancel {
      color: var(--brand-primary) !important;
      background: #fff !important;
      border: 2px solid var(--brand-primary) !important;
      border-radius: 10px !important;
      font-weight: 600 !important;
      min-width: 170px !important;
      padding: 10px 16px !important;
    }

    .swal2-styled.swal2-confirm {
      color: #fff !important;
      background: linear-gradient(180deg, var(--brand-accent) 0%, var(--brand-primary) 100%) !important;
      border: 0 !important;
      border-radius: 10px !important;
      font-weight: 600 !important;
      min-width: 170px !important;
      padding: 10px 16px !important;
    }
  </style>
`;

// Injetar estilos no DOM
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('swal2-brand-theme');
  if (!existingStyle) {
    document.head.insertAdjacentHTML('beforeend', customStyles);
  }
}

// Funções de alerta customizadas
export const AlertUtils = {
  /**
   * Alerta de aviso com opção de cancelar
   */
  warnConfirmCancel: (options: {
    title: string;
    html?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }) => {
    return Swal.fire({
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || 'Corrigir',
      cancelButtonText: options.cancelButtonText || 'Não',
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
      title: options.title,
      html: options.html,
      text: options.text
    });
  },

  /**
   * Alerta de informação com opção de prosseguir
   */
  infoConfirmCancel: (options: {
    title: string;
    html?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }) => {
    return Swal.fire({
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || 'Prosseguir assim mesmo',
      cancelButtonText: options.cancelButtonText || 'Corrigir',
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
      title: options.title,
      html: options.html,
      text: options.text
    });
  },

  /**
   * Alerta de sucesso
   */
  success: (options: {
    title: string;
    html?: string;
    text?: string;
    confirmButtonText?: string;
  }) => {
    return Swal.fire({
      icon: 'success',
      confirmButtonText: options.confirmButtonText || 'OK',
      title: options.title,
      html: options.html,
      text: options.text
    });
  },

  /**
   * Alerta de erro
   */
  error: (options: {
    title: string;
    html?: string;
    text?: string;
    confirmButtonText?: string;
  }) => {
    return Swal.fire({
      icon: 'error',
      confirmButtonText: options.confirmButtonText || 'OK',
      title: options.title,
      html: options.html,
      text: options.text
    });
  },

  /**
   * Loading/Progress
   */
  loading: (title: string = 'Carregando...') => {
    return Swal.fire({
      title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  },

  /**
   * Fechar loading
   */
  closeLoading: () => {
    Swal.close();
  },

  /**
   * Alerta de validação de formulário
   */
  validationError: (errors: string[]) => {
    const errorList = errors.map(error => `• ${error}`).join('\n');
    
    return Swal.fire({
      icon: 'info',
      title: 'Atenção!',
      html: `⚠️ Os campos CPF, CEP, PLACA, CELULAR e E-MAIL corretamente preenchidos são necessários para efetuar o cálculo do seguro.<br><br>Campos com problema:<br><br>${errorList}<br><br>Caso decida prosseguir assim mesmo, um especialista entrará em contato para coletar esses dados.`,
      showCancelButton: true,
      confirmButtonText: 'Prosseguir assim mesmo',
      cancelButtonText: 'Corrigir',
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: true
    });
  },

  /**
   * Confirmação de envio de formulário
   */
  confirmSubmission: () => {
    return Swal.fire({
      icon: 'success',
      title: 'Cotação Enviada!',
      html: 'Sua solicitação de cotação foi enviada com sucesso.<br><br>Nossa equipe entrará em contato em breve para fornecer a melhor proposta.',
      confirmButtonText: 'OK'
    });
  }
};

// Exportar configuração para uso em outros componentes
export { themeConfig };
export default Swal;
