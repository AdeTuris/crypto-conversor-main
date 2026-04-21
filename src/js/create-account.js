/**
 * Valida formato de email usando regex
 * @param {string} email - Email a validar
 * @returns {boolean} true se válido, false caso contrário
 */\nfunction validarEmail(email) {
  const regexEmail = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return regexEmail.test(email);
}

/**
 * Valida força de senha
 * - Mínimo 8 caracteres
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 letra minúscula
 * - Pelo menos 1 número
 * @param {string} senha - Senha a validar
 * @returns {Object} Objeto com isValida e feedback
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
  if (!/\\d/.test(senha)) {
    erros.push('Pelo menos 1 número');
  }
  
  return {
    isValida: erros.length === 0,
    feedback: erros.length > 0 ? erros.join(', ') : 'Senha forte'
  };
}

/**
 * Valida todos os dados do formulário
 */
function confereDados() {
  const email = document.querySelector('input[name=email]');
  const confirma = document.querySelector('input[name=email2]');
  const senha = document.querySelector('input[name=senha]');
  const confirmaSenha = document.querySelector('input[name=senha2]');

  // Verificar se elementos existem
  if (!email || !confirma || !senha || !confirmaSenha) {
    console.error('Alguns campos do formulário não foram encontrados');
    return;
  }

  let formularioValido = true;

  // Validar email
  if (!validarEmail(email.value)) {
    email.setCustomValidity('Email inválido. Use formato: exemplo@email.com');
    formularioValido = false;
  } else if (email.value !== confirma.value) {
    confirma.setCustomValidity('Os e-mails não conferem');
    formularioValido = false;
  } else {
    email.setCustomValidity('');
    confirma.setCustomValidity('');
  }

  // Validar senha
  const validacaoSenha = validarSenha(senha.value);
  if (!validacaoSenha.isValida) {
    senha.setCustomValidity(`Senha fraca: ${validacaoSenha.feedback}`);
    formularioValido = false;
  } else if (senha.value !== confirmaSenha.value) {
    confirmaSenha.setCustomValidity('As senhas não conferem');
    formularioValido = false;
  } else {
    senha.setCustomValidity('');
    confirmaSenha.setCustomValidity('');
  }

  return formularioValido;
}

// Adicionar validação em tempo real (input event)
document.addEventListener('DOMContentLoaded', function() {
  const campos = document.querySelectorAll('input[name=\"email\"], input[name=\"email2\"], input[name=\"senha\"], input[name=\"senha2\"]');
  campos.forEach(campo => {
    campo.addEventListener('input', confereDados);
  });
});


