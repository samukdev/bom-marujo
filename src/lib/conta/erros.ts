/** Mensagens do Supabase Auth em português (pelo `code` do erro; cai no texto original se não conhecermos). */
const MENSAGENS: Record<string, string> = {
  invalid_credentials: 'E-mail ou senha incorretos.',
  email_not_confirmed: 'Confirme seu e-mail primeiro: o link está na sua caixa de entrada.',
  user_already_exists: 'Já existe uma conta com esse e-mail. Tente entrar.',
  email_exists: 'Já existe uma conta com esse e-mail. Tente entrar.',
  weak_password: 'Senha fraca: use pelo menos 6 caracteres.',
  same_password: 'A nova senha precisa ser diferente da atual.',
  over_email_send_rate_limit: 'Muitos e-mails enviados. Espere alguns minutos e tente de novo.',
  over_request_rate_limit: 'Muitas tentativas. Espere um pouco e tente de novo.',
  email_address_invalid: 'Esse e-mail não parece válido.',
  validation_failed: 'Confira os dados digitados.',
  signup_disabled: 'Cadastros estão fechados no momento.',
  session_not_found: 'Sua sessão expirou. Entre de novo.',
};

export function mensagemDeErro(erro: unknown): string {
  if (erro && typeof erro === 'object') {
    const { code, message } = erro as { code?: string; message?: string };
    if (code && MENSAGENS[code]) return MENSAGENS[code];
    if (message?.includes('Failed to fetch')) return 'Sem conexão. Confira a internet e tente de novo.';
    if (message) return message;
  }
  return 'Algo deu errado. Tente de novo.';
}
