/**
 * @file api.js
 * @description Módulo centralizador de chamadas à API Mercado Bitcoin
 * @author Crypto Conversor Project (AC2/AF)
 */

/**
 * Configuração e constantes de API
 */
const ApiConfig = {
  BASE_URL: 'https://www.mercadobitcoin.net/api',
  TIMEOUT_MS: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
};

/**
 * Classe para gerenciar requisições à API Mercado Bitcoin
 */
class CryptoAPI {
  /**
   * Construtor
   */
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 60000; // 1 minuto
  }

  /**
   * Busca valor de uma criptomoeda com retry automático
   * @param {string} codigo - Código da moeda (ex: BTC, ETH)
   * @param {number} tentativas - Tentativas restantes
   * @returns {Promise<Object>} Dados da moeda { nome, codigo, valor, timestamp }
   * @throws {Error} Se falhar após retry_attempts
   */
  async buscarMoeda(codigo, tentativas = ApiConfig.RETRY_ATTEMPTS) {
    // Verificar cache
    const cacheKey = `${codigo}-${Date.now() - (Date.now() % this.cacheExpiry)}`;
    if (this.cache.has(cacheKey)) {
      console.log(`[CACHE HIT] ${codigo}`);
      return this.cache.get(cacheKey);
    }

    try {
      const url = `${ApiConfig.BASE_URL}/${codigo}/ticker`;
      const response = await this._fetchComTimeout(url, ApiConfig.TIMEOUT_MS);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Validar estrutura
      if (!this._validarEstrutura(data)) {
        throw new Error(`Estrutura inválida para ${codigo}`);
      }

      const resultado = {
        codigo: codigo,
        valor: parseFloat(data.ticker.buy),
        timestamp: new Date().toISOString(),
        preco_venda: parseFloat(data.ticker.sell),
        variacao: parseFloat(data.ticker.var_perc || 0)
      };

      // Armazenar em cache
      this.cache.set(cacheKey, resultado);

      console.log(`[API OK] ${codigo}: R$ ${resultado.valor}`);
      return resultado;

    } catch (error) {
      console.error(`[ERRO] ${codigo} (tentativa ${ApiConfig.RETRY_ATTEMPTS - tentativas + 1}):`, error.message);

      // Retry logic
      if (tentativas > 1) {
        await this._delay(ApiConfig.RETRY_DELAY_MS);
        return this.buscarMoeda(codigo, tentativas - 1);
      }

      return {
        codigo: codigo,
        valor: 0,
        erro: true,
        mensagem: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Busca múltiplas moedas em paralelo
   * @param {string[]} codigos - Array de códigos de moedas
   * @returns {Promise<Object[]>} Array com dados das moedas
   */
  async buscarMultiplas(codigos) {
    try {
      const promessas = codigos.map(codigo => this.buscarMoeda(codigo));
      const resultados = await Promise.allSettled(promessas);

      return resultados
        .map((resultado, index) => {
          if (resultado.status === 'fulfilled') {
            return resultado.value;
          } else {
            return {
              codigo: codigos[index],
              valor: 0,
              erro: true,
              mensagem: resultado.reason.message
            };
          }
        })
        .filter(r => !r.erro || r.erro === false); // Filtrar apenas sucesso
    } catch (error) {
      console.error('[ERRO] buscarMultiplas:', error);
      return [];
    }
  }

  /**
   * Fetch com timeout
   * @param {string} url - URL a requisitar
   * @param {number} timeout - Timeout em ms
   * @returns {Promise<Response>}
   * @private
   */
  _fetchComTimeout(url, timeout) {
    return Promise.race([
      fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
        headers: {
          'Accept': 'application/json'
        }
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout após ${timeout}ms`)), timeout)
      )
    ]);
  }

  /**
   * Valida estrutura da resposta da API
   * @param {Object} data - Dados da resposta
   * @returns {boolean}
   * @private
   */
  _validarEstrutura(data) {
    return data &&
           data.ticker &&
           typeof data.ticker.buy === 'number' &&
           data.ticker.buy > 0;
  }

  /**
   * Delay assíncrono
   * @param {number} ms - Milissegundos
   * @returns {Promise<void>}
   * @private
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Limpa cache
   */
  limparCache() {
    this.cache.clear();
    console.log('[CACHE LIMPO]');
  }

  /**
   * Obtém tamanho do cache
   * @returns {number}
   */
  getTamanhoCahce() {
    return this.cache.size;
  }
}

// Criar instância global
const api = new CryptoAPI();

// Exportação para ambiente Node.js (testes)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CryptoAPI, api, ApiConfig };
}
