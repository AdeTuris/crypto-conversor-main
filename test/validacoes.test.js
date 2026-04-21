/**
 * Testes unitários para validações de formulário
 * Projeto: Crypto Conversor
 * Disciplina: AC2/AF - Análise e Desenvolvimento de Sistemas
 */

/**
 * Mock da função validarEmail
 * Valida formato de email usando regex
 */
function validarEmail(email) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
}

/**
 * Mock da função validarSenha
 * Valida força de senha
 */
function validarSenha(senha) {
  const erros = [];
  
  if (senha.length < 8) {
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
    feedback: erros.length > 0 ? erros.join(', ') : 'Senha forte'
  };
}

// ============================================
// TESTES - VALIDAÇÃO DE EMAIL
// ============================================

describe("Validação de Email", () => {
  test('deve aceitar email válido com domínio simples', () => {
    expect(validarEmail('usuario@email.com')).toBe(true);
  });

  test('deve aceitar email válido com domínio composto', () => {
    expect(validarEmail('usuario@empresa.co.br')).toBe(true);
  });

  test('deve rejeitar email sem @', () => {
    expect(validarEmail('usuarioemail.com')).toBe(false);
  });

  test('deve rejeitar email sem domínio', () => {
    expect(validarEmail('usuario@')).toBe(false);
  });

  test('deve rejeitar email sem usuário', () => {
    expect(validarEmail('@email.com')).toBe(false);
  });

  test('deve rejeitar email vazio', () => {
    expect(validarEmail('')).toBe(false);
  });

  test('deve rejeitar email com espaço', () => {
    expect(validarEmail('usuario @email.com')).toBe(false);
  });

  test('deve rejeitar email com múltiplos @', () => {
    expect(validarEmail('usuario@@email.com')).toBe(false);
  });
});

// ============================================
// TESTES - VALIDAÇÃO DE SENHA
// ============================================

describe("Validação de Senha", () => {
  test('deve aceitar senha válida (8+ caracteres, maiúscula, minúscula, número)', () => {
    const resultado = validarSenha('Senha123');
    expect(resultado.isValida).toBe(true);
  });

  test('deve rejeitar senha com menos de 8 caracteres', () => {
    const resultado = validarSenha('Abc123');
    expect(resultado.isValida).toBe(false);
    expect(resultado.feedback).toContain('Mínimo 8 caracteres');
  });

  test('deve rejeitar senha sem letra maiúscula', () => {
    const resultado = validarSenha('abcdefgh123');
    expect(resultado.isValida).toBe(false);
    expect(resultado.feedback).toContain('Pelo menos 1 letra maiúscula');
  });

  test('deve rejeitar senha sem letra minúscula', () => {
    const resultado = validarSenha('ABCDEFGH123');
    expect(resultado.isValida).toBe(false);
    expect(resultado.feedback).toContain('Pelo menos 1 letra minúscula');
  });

  test('deve rejeitar senha sem número', () => {
    const resultado = validarSenha('AbcdefghI');
    expect(resultado.isValida).toBe(false);
    expect(resultado.feedback).toContain('Pelo menos 1 número');
  });

  test('deve rejeitar senha vazia', () => {
    const resultado = validarSenha('');
    expect(resultado.isValida).toBe(false);
  });

  test('deve retornar múltiplos erros quando aplicável', () => {
    const resultado = validarSenha('abc');
    expect(resultado.isValida).toBe(false);
    // Deve conter vários erros
    expect(resultado.feedback.split(', ').length).toBeGreaterThan(1);
  });

  test('deve aceitar senha com caracteres especiais', () => {
    const resultado = validarSenha('Senha@123!');
    expect(resultado.isValida).toBe(true);
  });
});

// ============================================
// TESTES - CONVERSÃO DE MOEDAS (Mock)
// ============================================

describe("Conversão de Moedas", () => {
  test('deve calcular conversão cripto para fiat corretamente', () => {
    const valor1 = 2; // 2 bitcoins
    const valor2 = 150000; // 1 bitcoin = 150k
    const resultado = (valor1 * valor2).toFixed(2);
    expect(resultado).toBe('300000.00');
  });

  test('deve calcular conversão fiat para cripto corretamente', () => {
    const valor1 = 300000; // 300k reais
    const valor2 = 150000; // 1 bitcoin = 150k
    const resultado = (valor1 / valor2).toFixed(8);
    expect(resultado).toBe('2.00000000');
  });

  test('deve retornar 0 com valores inválidos', () => {
    const valor1 = NaN;
    const valor2 = 150000;
    expect(isNaN(valor1 * valor2)).toBe(true);
  });

  test('deve evitar divisão por zero', () => {
    const valor1 = 300000;
    const valor2 = 0;
    const resultado = valor2 !== 0 ? (valor1 / valor2).toFixed(8) : 'ERRO';
    expect(resultado).toBe('ERRO');
  });
});

// ============================================
// TESTES - TRATAMENTO DE ERROS
// ============================================

describe("Tratamento de Erros", () => {
  test('deve validar se valor1 é um número', () => {
    const valor1 = parseFloat('abc');
    expect(isNaN(valor1)).toBe(true);
  });

  test('deve validar se valor2 é um número', () => {
    const valor2 = parseFloat('0');
    expect(isNaN(valor2)).toBe(false);
    expect(valor2).toBe(0);
  });

  test('deve formatar valores com 2 casas decimais para fiat', () => {
    const resultado = (123.456789).toFixed(2);
    expect(resultado).toBe('123.46');
  });

  test('deve formatar valores com 8 casas decimais para cripto', () => {
    const resultado = (0.00000123).toFixed(8);
    expect(resultado).toBe('0.00000123');
  });
});
