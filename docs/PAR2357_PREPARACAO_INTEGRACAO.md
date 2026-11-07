# PAR2357 — Preparação verificável de integração (sem deploy)

Data: 2026-11-07. Status: **preparação em branch — NÃO é homologação de backend**.

## Fontes inspecionadas

- Web: `portal_gestao_1.1/src/App.tsx` inicializa usuário e dados de `MOCK_USERS`, `MOCK_TICKETS`, `MOCK_TECHNICIANS`, `MOCK_PENDINGS`, `MOCK_AUDITS`; atualizar/auditar usam timers simulados.
- Web: `src/components/views/TicketsView.tsx` já possui cartões compactos e detalhe sob demanda; preservar esse desenho.
- Mobile: `apk_portal_gestao_1.0/src/context/AppContext.tsx` consome `INITIAL_*` de mockData e simula VPN, sync e respostas do agente.
- Web: `Ticket.id` é `number`; mobile: `GLPITicket.id` é `string`.
- Status e prioridades divergentes; `resolvido` / `solucionado`, `critica` / `muito_alta` **não** são automaticamente equivalentes.
- Fonte de verdade de endpoints, autorização, dados e migrações: **código efetivo do backend PAR2357**, ainda não inspecionado pelo executor MCP.

## O que esta branch entrega

- `src/integrations/ticketContractBoundary.ts`: camada **sem efeitos colaterais** para examinar diferenças de protótipos. Não faz chamadas HTTP, não acessa GLPI e não altera telas.
- `tests/ticketContractBoundary.test.ts`: testes de preservação de ID numérico/string, zeros à esquerda e campos sem mapeamento.

Não transformar a função `inspectPrototypeTicket` em adaptador de API de produção até que o DTO real seja validado. O retorno `backendContractVerified: false` é intencional.

Para testes locais em checkout isolado com dependências instaladas: `npx tsx --test tests/ticketContractBoundary.test.ts` e `npm run lint`. **Ainda não executados neste branch por esta operação remota.**

## Gate 1 — Workspace seguro para a PAR2357

O HEAL MCP 2.0 foi homologado para a sandbox `/var/lib/heal-mcp/sandbox/portal_gestao`. A tentativa do ChatGPT de agendar leitura do checkout operacional `/home/matrix/HEAL_AGENT_HUB/portal_gestao` foi negada. Uma tentativa de escrita pelo MCP também foi bloqueada pelo gate `blocked_scope:unsafe_scope_flag`.

O caminho preferencial é criar **uma cópia derivada de snapshot sanitizado do backend**, com dependências/artefatos versionados e DB SQLite totalmente sintético, em diretório dedicado e restrito à identidade `matrix`. Antes de tocar `/etc/heal-mcp/authorized-projects.json`:
1. Identificar conteúdo/exclusões do snapshot: nenhuma credencial, banco produtivo, upload com PII/PHI, arquivos `.env` reais, caches `auth.json` ou backups sensíveis.
2. Verificar `realpath`, proprietário, permissões, ausência de symlinks inesperados e separação estrita do diretório do Portal operacional.
3. Gerar e validar backup da configuração anterior da allowlist (metadados, hash, rollback) e confirmar que ampliação de projeto está suportada pelas políticas existentes.
4. Submeter modificação de allowlist e perfil de execução a **autorização específica**; nunca improvisar ampliação via parâmetros de tarefa, `root` ou bypass.
5. Reiniciar somente serviços que necessitem carregar configuração, depois de autorização de restart, preflight e rollback.
6. Validar com tarefa READ-ONLY primeiro; só então habilitar writes na cópia isolada com gate correto.
7. Nunca montar checkout operacional dentro da sandbox ou apontar allowlist para diretórios contendo produção.

## Gate 2 — Migrações/integração

- Testar V001→V002→V003 apenas em DB sintético isolado; `PRAGMA integrity_check`, `PRAGMA foreign_key_check`, schema version, rollback/restauração.
- Inventariar contratos reais de autenticação, entidade GLPI, tickets, indicadores, auditorias, Daily, agente, SSE e painel.
- Matriz backend DTO ↔ web ↔ mobile, explicitando desconhecidos, enums, timezone, autoria humana, identidades e privilégios.
- Integrar sob controle de feature flag ou ambiente de homologação; mocks devem ser sinalizados como DEMO.
- Testar HTTPS/SSE e browser apenas no ambiente homologado; nunca inferir endpoint.
- PAR2342 publicada permanece intacta; PAR2357 não deve ser implantada automaticamente.

## Critério de pronto para a próxima etapa

Documento dos DTOs extraído do código da PAR2357; cópia isolada com hash, sem segredos/dados reais; gate correto aprovado; testes V002/V003 íntegros; no-touch produção confirmado. Somente depois disso iniciar integração do cliente e validação técnica da candidata.

Issue de rastreio: #1.
