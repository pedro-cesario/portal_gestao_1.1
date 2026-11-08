# PAR2357 — Homologação E2E integrada sem mocks

## Objetivo e estado

Este é um **harness novo e opt-in**, diferente da suíte Playwright simulada. O navegador Chromium consulta um Vite local na porta 4174; Vite encaminha apenas `/v1` e `/health` para **FastAPI verdadeiro em 127.0.0.1:8788**, em uma máquina de homologação isolada.

**Não foi executado ainda contra o backend real.** O GitHub contém o frontend, mas não o backend privado completo. Não transferir código privado, credenciais ou bancos reais para GitHub nem abrir portas externas apenas para executar o teste.

## Requisitos obrigatórios

- Código-fonte frontend desta branch e backend PAR2357 verdadeiro disponível **na mesma máquina de homologação**, por método institucional autorizado.
- Python, dependências FastAPI/uvicorn, Node 22, npm, Playwright/Chromium.
- Banco SQLite **novo e exclusivo** em diretório temporário com permissões restritivas; NUNCA `data/portal_par2357_synthetic.db` preexistente ou banco hospitalar.
- Variáveis de backend **definidas antes de qualquer import**:
  - `PORTAL_DB_PATH=<caminho-absoluto-para-db-descartavel>/portal.db`
  - `PORTAL_DATA_DIR=<caminho-absoluto-para-db-descartavel>/data`
  - `PORTAL_MANAGER_PASSWORD=<senha-aleatoria-ficticia-de-teste>`
  - `PORTAL_DEMO_SYNTHETIC=1`
  - `PORTAL_ALLOW_EXTERNAL_INTEGRATION=0`
  - `PORTAL_TEST_MODE=1`
  - `PORTAL_REQUIRE_HTTPS_AUTH=0` apenas para localhost na homologação
  - `PORTAL_ALLOWED_ORIGINS=http://127.0.0.1:4174`
  - `PORTAL_CORS_ORIGINS=http://127.0.0.1:4174`, se aplicável
- Após aplicar **somente migrações explicitamente previstas para o banco descartável**, iniciar backend exclusivamente em `127.0.0.1:8788` com launcher Uvicorn verificado. Não alterar serviços systemd, produção ou SQLite existente.
- Mesmo valor de senha fictícia, nunca salvo no repositório, passado ao teste por `PAR2357_E2E_PASSWORD`; informar `PAR2357_E2E_SYNTHETIC=1` e `PAR2357_E2E_DB_ISOLATED=1` somente após verificar de fato os dois requisitos. Não reutilizar senhas de uso real.

## Comando frontend

Com o FastAPI já rodando corretamente na porta 8788, na cópia do frontend:

```bash
npm install --ignore-scripts --no-audit --no-fund
npx playwright install chromium
PAR2357_E2E_SYNTHETIC=1 \
PAR2357_E2E_DB_ISOLATED=1 \
PAR2357_E2E_PASSWORD='<senha-sintetica-efemera>' \
npm run test:e2e:integrated
```

Não inserir segredo literal em histórico de shell; preferir variável de ambiente injetada por cofre de homologação. O exemplo acima apenas ilustra os parâmetros.

## Arquivos

- `vite.integrated.config.ts`: proxy **fixo** loopback /v1 e /health para o backend verdadeiro, nenhuma conexão externa.
- `playwright.integrated.config.ts`: Playwright com flags sintéticas, sem mocks.
- `tests/browser/par2357.integrated.spec.ts`: sequência 401 sem sessão, login, /me, GET tickets, origem sintética, renderização Visão Geral/Chamados/Indicadores, logout com CSRF e revogação da sessão.
- Os testes existentes `tests/browser/par2357.synthetic.spec.ts` usam `page.route` e **não** demonstram uma conexão E2E real.

## Critério GO

- FastAPI deve estar realmente iniciado no mesmo host em modo totalmente sintético, com banco novo descartável.
- A execução `npm run test:e2e:integrated` deve retornar exit 0 sem `page.route`, skips, respostas mockadas ou acesso real.
- Verificar origem e ausência de qualquer chamada à rede hospitalar.
- Conferir limpeza e encerramento de processos e banco temporário; registrar evidência sem tokens/segredos.
- Falha no bootstrap, fluxo CSRF, threadpool, proxy ou sessão **é NO-GO** até correção; nunca marcar o teste como aprovado apenas porque a suíte simulada passou.
- Nenhum merge, deploy, credencial real ou ampliação de privilégios é autorizada por este documento.
