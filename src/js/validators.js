/**
 * @file validators.js
 * @description Módulo de validação para formulários e dados
 * @author Crypto Conversor Project (AC2/AF)
 */

/**
 * Validadores para o projeto Crypto Conversor
 * Exporta funções de validação reutilizáveis
 */
const Validators = {
  /**
   * Valida formato de email
   * @param {string} email - Email a validar
   * @returns {boolean} true se válido
   */
  validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  },

  /**
   * Valida força de senha
   * Requisitos:
   * - Mínimo 8 caracteres
   * - Pelo menos 1 letra maiúscula
   * - Pelo menos 1 letra minúscula
   * - Pelo menos 1 número
   * @param {string} senha - Senha a validar
   * @returns {Object} { isValida, feedback, erros[] }
   */
  validarSenha(senha) {
    const erros = [];
    
    if (!senha || senha.length < 8) {
      erros.push('Mínimo 8 caracteres');
    }
    if (!/[A-Z]/.test(senha)) {
      erros.push('Pelo menos 1 letra maiúscula');
    }
    if (!/[a-z]/.test(senha)) {
      erros.push('Pelo menos 1 letra minúscula');
    }
    if (!/\d/.test(senha)) {
      erros.push('Pelo menos 1 número');
    }
    
    return {
      isValida: erros.length === 0,
      feedback: erros.length > 0 ? erros.join(', ') : 'Senha forte',
      erros: erros
    };
  },

  /**
   * Valida número (quantidade de moeda)
   * @param {string|number} valor - Valor a validar
   * @returns {Object} { isValido, valor, erro }
   */
  validarNumero(valor) {
    const numero = parseFloat(valor);
    
    if (isNaN(numero)) {
      return {
        isValido: false,
        valor: 0,
        erro: 'Valor deve ser um número'
      };
    }
    
    if (numero < 0) {
      return {
        isValido: false,
        valor: 0,
        erro: 'Valor não pode ser negativo'
      };
    }
    
    return {
      isValido: true,
      valor: numero,
      erro: null
    };
  },

  /**
   * Valida taxa de câmbio
   * @param {number} taxa - Taxa a validar
   * @returns {boolean} true se válida
   */
  validarTaxa(taxa) {
    return typeof taxa === 'number' && taxa > 0 && isFinite(taxa);
  },

  /**
   * Valida estrutura de resposta da API
   * @param {Object} response - Resposta da API
   * @returns {boolean} true se estrutura é válida
   */
  validarRespostaAPI(response) {
    return response &&
           response.ticker &&
           typeof response.ticker.buy === 'number' &&
           response.ticker.buy > 0;
  },

  /**
   * Sanitiza entrada de texto (previne XSS básico)
   * @param {string} texto - Texto a sanitizar
   * @returns {string} Texto sanitizado
   */
  sanitizarTexto(texto) {
    if (typeof texto !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }
};

// Exportação para ambiente Node.js (testes)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Validators;
}
