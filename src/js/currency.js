const API_ENDPOINT = `https://www.mercadobitcoin.net/api/<coin>/ticker`;

const currentCryptoCoins = [
  { name: "Cardano", code: "ADA" },
  { name: "Cosmos", code: "ATOM" },
  { name: "Axie Infinity", code: "AXS" },
  { name: "Basic Attention token", code: "BAT" },
  { name: "Bitcoin Cash", code: "BCH" },
  { name: "Bitcoin", code: "BTC" },
  { name: "Dogecoin", code: "DOGE" },
  { name: "Polkadot", code: "DOT" },
  { name: "Ethereum Name Service", code: "ENS" },
  { name: "Ethereum", code: "ETH" },
  { name: "Floki Inu", code: "FLOKI" },
  { name: "Gala", code: "GALA" },
  { name: "The Graph", code: "GRT" },
  { name: "MANA (Decentraland)", code: "MANA" },
  { name: "Polygon", code: "MATIC" },
  { name: "Solana", code: "SOL" },
  { name: "USD Coin", code: "USDC" },
  { name: "Wrapped LUNA Token", code: "WLUNA" },
  { name: "Stellar", code: "XLM" },
  { name: "XRP", code: "XRP" },
];

/**
 * Busca valor de uma criptomoeda da API Mercado Bitcoin
 * @param {Object} coin - Objeto com propriedades name e code
 * @returns {Promise<Object>} Objeto com nome, código e valor em BRL
 */
const getCurrencyValues = async (coin) => {
  const options = { method: "GET", mode: "cors", cache: "default" };
  try {
    const response = await fetch(API_ENDPOINT.replace("<coin>", coin.code), options);
    
    if (!response.ok) {
      throw new Error(`API retornou status ${response.status}`);
    }
    
    const data = await response.json();
    const precoCompra = Number.parseFloat(data?.ticker?.buy);

    if (!data.ticker || Number.isNaN(precoCompra) || precoCompra <= 0) {
      throw new Error(`Estrutura inválida para ${coin.code}`);
    }
    
    return {
      coin: coin.name,
      code: coin.code,
      value: precoCompra.toFixed(2),
    };
  } catch (error) {
    console.error(`Erro ao buscar ${coin.code}:`, error.message);
    return null; // Filtrar depois
  }
};

/**
 * Carrega todos os valores das moedas
 * @returns {Promise<Array>} Array com dados das moedas
 */
const loadCoinValues = async () => {
  try {
    const promises = currentCryptoCoins.map((coin) => getCurrencyValues(coin));
    const values = await Promise.all(promises);
    // Filtrar valores nulos (erros)
    return values.filter(v => v !== null);
  } catch (error) {
    console.error("Erro ao carregar valores:", error);
    return [];
  }
};

/**
 * Gera tabela dinâmica com cotações de moedas
 */
const generateTable = async () => {
  const article = document.getElementById("cotacao");
  
  if (!article) {
    console.error("Elemento #cotacao não encontrado");
    return;
  }
  
  try {
    // Limpar conteúdo anterior
    article.innerHTML = "";
    
    const tableHeaders = ["Nome da moeda", "Código", "Valor (BRL)"];
    const rows = await loadCoinValues();
    
    if (rows.length === 0) {
      article.innerHTML = '<p class="alert alert-warning">Falha ao carregar cotações. Tente novamente mais tarde.</p>';
      return;
    }
    
    // Criar tabela
    const table = document.createElement("table");
    table.className = "table table-striped table-hover";
    
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    
    tableHeaders.forEach(item => {
      const th = document.createElement("th");
      th.textContent = item;
      th.scope = "col";
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    
    const tbody = document.createElement("tbody");
    rows.forEach(row => {
      const tr = document.createElement("tr");
      
      const coin = document.createElement("td");
      coin.textContent = row.coin;
      
      const code = document.createElement("td");
      code.textContent = row.code;
      
      const value = document.createElement("td");
      value.textContent = `R$ ${row.value}`;
      
      tr.appendChild(coin);
      tr.appendChild(code);
      tr.appendChild(value);
      tbody.appendChild(tr);
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    article.appendChild(table);
  } catch (error) {
    console.error("Erro ao gerar tabela:", error);
    article.innerHTML = '<p class="alert alert-danger">Erro ao gerar tabela. Verifique o console.</p>';
  }
};

// Aguardar DOM estar pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", generateTable);
} else {
  generateTable();
}
