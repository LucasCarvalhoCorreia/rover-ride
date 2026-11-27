/**
 * Camada de acesso a dados para preparação e limpeza de massa de testes (tabelas `rovers` e `orders`).
 *
 * Regras de segurança:
 * - Nunca armazene strings de conexão ou senhas neste arquivo.
 * - Configure `DATABASE_URL` no `.env` local (Session pooler do Supabase) e nos Secrets do GitHub Actions.
 *
 * Para conectar ao PostgreSQL/Supabase, instale `pg` (ou `kysely` + `pg`) e implemente as consultas
 * usando `getDatabaseUrl()` abaixo.
 */

export function getDatabaseUrl(): string {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('Defina DATABASE_URL no arquivo .env (veja .env.example).')
  }
  return connectionString
}
