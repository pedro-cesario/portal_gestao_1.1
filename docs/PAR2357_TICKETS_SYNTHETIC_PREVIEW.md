# PAR2357 — Prévia de chamados conectada (somente sintética)

## Estado de entrega

A branch `feat/par2357-readonly-api-transport` contém uma nova visualização opcional de Chamados. **Padrão: desligada.** Nenhum merge, deploy, acesso produtivo ou troca das demais telas foi executado.

Para homologar em uma instância isolada cuja API PAR2357 esteja configurada com `PORTAL_DEMO_SYNTHETIC=1`, compilar o web com:

```env
VITE_PAR2357_TICKETS_PREVIEW=true
VITE_PAR2357_API_BASE_URL=
```

Base vazia significa **mesma origem** por trás de proxy local configurado. Para usar outro endereço, configure uma origem de API explicitamente autorizada. **Nunca habilite este preview em produção**. O componente rejeita `source` ou `origem_dados` que não sejam `SYNTHETIC_DEMO`.

O preview consulta `GET /v1/auth/me` primeiro; login fictício da UI não é identidade do servidor. A API deve fornecer sessão autenticada via cookie HttpOnly; respostas 401/403 não fazem fallback para mocks. Então consulta `GET /v1/tickets?page=N&page_size=6`, valida DTO, origem, status, prioridade e paginação. Erros ficam explícitos. Não altera dados.

## UX preservada

- Visualização padrão `TicketsView` permanece inalterada quando a flag está desligada.
- Prévia habilitada mantém cards compactos, paginação e detalhamento sob clique.
- Campos sem contrato verificado (última ação humana, impacto assistencial, lacunas de evidência, classificação gerencial, local hospitalar) **não são preenchidos nem inferidos**.
- Não mistura páginas API com mock ao ocorrer erro ou falta de sessão.
- Outros módulos continuam em demonstração até migração explícita.

## Arquivos

- `src/integrations/portalApiClient.ts`: transporte opt-in, credenciais de sessão, GET somente.
- `src/integrations/par2357Dtos.ts`: validação de envelopes e mapeamento GLPI status 1–6; prioridade 6 fica sem equivalente visual.
- `src/components/views/Par2357TicketsPreviewView.tsx`: cards sintéticos do backend e detalhamento por clique, sem dados gerenciais inventados.
- `src/App.tsx`: roteamento condicional pela flag de build, padrão anterior intacto.
- `tests/par2357Dtos.test.ts`, `tests/portalApiClient.test.ts`: testes sintéticos de validação e HTTP.

## Gates antes de integrar produção

1. Executar `npm run lint`, `npm run build` e `node --import tsx --test tests/par2357Dtos.test.ts tests/portalApiClient.test.ts` com dependências instaladas.
2. Confirmar que o servidor sintético tem autenticação funcional para `GET /v1/auth/me`, sem usar identidade mock.
3. Confirmar origem sintética e campos reais da resposta de `/v1/tickets` em ambiente isolado.
4. Revisar flags, CORS, CSRF, cookies, proxy e tratamento 401/403/503.
5. Expandir o DTO de detalhe com timeline/updates e evidências verdadeiras antes de substituir a tela de produção.
6. Revisão humana e PR separada para merges e deploy.

**Nenhum resultado de build, CI ou navegação end-to-end deve ser presumido sem evidência.**

## Próximo estágio: indicadores sintéticos

A branch também contém `Par2357IndicatorsPreviewView`, ativada exclusivamente no build com:

```env
VITE_PAR2357_INDICATORS_PREVIEW=true
```

O componente consulta sessão real do backend, então `GET /v1/indicators/overview` com seleção de modo snapshot/realtime, e rejeita qualquer resposta cuja origem não seja `SYNTHETIC_DEMO`. Mostra apenas dois contadores cujo nome foi confirmado no envelope (`total_concluidos_hoje`, `total_concluidos_periodo_30d`), quando `availability_status=AVAILABLE`; caso contrário mostra indisponibilidade explícita. Os demais KPIs do mock original não são apresentados como verdadeiros, nem calculados com base em campos não verificados.

A tela atual de `IndicatorsView` permanece padrão e inalterada. Não existe aprovação para consumo de métricas reais nem publicação. Falta validar o conteúdo efetivo de resposta sintética de `/v1/indicators/overview` e homologar o navegador antes de ativar a flag.

## Validação HTTP sintética em Matrix (8/11/2026)

A etapa de testes HTTP foi destravada **apenas no harness de contrato**. Uma prova isolada confirmou que, na sandbox do worker, rotas assíncronas de um FastAPI mínimo respondem, mas rotas síncronas travam no executor AnyIO `to_thread.run_sync`. Não há evidência de falha do adaptador sintético ou da API produtiva.

Um monkeypatch de execução inline, restrito ao teste `backend/contracts/test_http_synthetic_integration.py` na cópia isolada do Matrix, permite exercitar a rota FastAPI real `GET /v1/tickets?page=1&page_size=2` com `SyntheticDemoAdapter` e identidade sintética, sem lifespan nem SQLite persistente. Ele **não substitui homologação da execução real de threads ou navegador**.

Validação independente MCP 2.0, tarefa `heal20-a403ed2534354a058361e633fa89ae0f`:
- `15 passed in 0.58s`, sem skips, exit 0 (contratos Python + HTTP sintético);
- `AST_OK`, exit 0;
- nenhuma modificação realizada pela tarefa de auditoria.

Pendências: verificar threadpool do worker em ambiente autorizado sem contornar a sandbox; homologar login/sessão e navegador em infraestrutura sintética própria; não confundir teste de contrato in-process com E2E real.

## Visão Geral sintética — terceira etapa web

O arquivo `src/components/views/Par2357OverviewPreviewView.tsx` implementa uma Visão Geral executiva separada, habilitada **somente em build isolado** com:

```env
VITE_PAR2357_OVERVIEW_PREVIEW=true
```

Padrão **desligado**. A Visão Geral original `OverviewView` permanece intacta.

- Verifica `GET /v1/auth/me` e então busca `GET /v1/tickets?page=1&page_size=6`; ambas origem do envelope e origem de cada item devem ser `SYNTHETIC_DEMO`.
- Utiliza `total` do envelope paginado como total reportado pelo servidor; não estima total a partir dos seis itens retornados.
- Consulta `GET /v1/indicators/overview?mode=SNAPSHOT_04H` separadamente. Exibe somente os contadores com fonte `SYNTHETIC_DEMO`, status `AVAILABLE` e números válidos; caso contrário mostra `Indisponível` sem influenciar a listagem de chamados.
- Painel sintético primeiro e detalhes do chamado ao clicar. Não atribui última ação humana, impacto assistencial, prioridade gerencial, POP ou avaliação de SLA sem dados confirmados.
- Sem deploy, acesso GLPI produtivo, merge, nem ativação implícita de flags.

### Diagnóstico do worker — sem alterar segurança

No worker isolado, rota assíncrona mínima FastAPI/ASGI passou, rota síncrona mínima expirou em `anyio.to_thread.run_sync`. Em diagnóstico separado, uma thread Python simples executou e encerrou normalmente, o que **não prova indisponibilidade geral de threads**. `NoNewPrivs=1` e seccomp ativo são observados, mas nenhuma causalidade foi confirmada.

O harness inline, limitado aos testes Python sintéticos, já validou o contrato HTTP, mas **não** homologou threadpool real, navegador, login, sessão, ou operação produtiva. Corrigir ou reproduzir a falha sem mexer na sandbox/serviços e, então, validar a cadeia de autenticação sintética em banco descartável antes do próximo gate de release.

## Fase 4.1 / 4.2 — Evidências em 08/11/2026

### Login e logout com banco descartável

- O teste `backend/contracts/test_auth_cookie_ephemeral.py` foi corrigido por tarefa MCP `heal20-d601e56b953248c39e77f585fbf014fe`, após manter CSRF intacto e enviar `Origin` permitido e `X-CSRF-Token` da sessão fictícia.
- Execução na sandbox de desenvolvimento com diretório temporário permitido: `1 passed` (exit 0). Respostas verificadas: health 200, login 200, /v1/auth/me 200, /v1/tickets 200, logout 200, /v1/auth/me após logout 401.
- **Limite de auditoria:** regressão independente sob política somente leitura: 15 testes de contrato passaram, mas o teste que cria SQLite temporário falhou no mkdir com `Read-only file system`. Tentativas de liberar escrita só em `.tmp/par2357_auth_harness/` foram bloqueadas pela política MCP (`blocked_scope:unsafe_scope_flag`); não houve execução nem bypass. O `1 passed` acima é evidência do worker com escrita isolada, não validação independente de toda a regressão em readonly.

### Navegador Chromium + Playwright com API inteiramente simulada

- Configuração `playwright.synthetic.config.ts` liga as três flags opt-in exclusivamente no servidor de teste.
- `tests/browser/par2357.synthetic.spec.ts` intercepta `/v1/**` no navegador com respostas sintéticas e verifica Visão Geral, Chamados, Indicadores, bloqueio de 401 e rejeição de origem não sintética. **Não acessa GLPI/TASY nem backend HTTP real.**
- CI `.github/workflows/par2357-preview-checks.yml` agora contém job `browser` e job `checks`; browser baixa Chromium isolado e retém artefatos de falha.
- GitHub Actions execução **42456298375**, commit `cc22a1e7a41edca8d70d0b61dca81d573ac664ee`: **5 passed (4.4 s)** no Chromium, type-check PASS, testes TS PASS, build padrão PASS, build com flags ligadas PASS.

**Status:** interface e fluxo de contrato mockado homologados no navegador; autenticação e leitura sintética comprovadas em harness ASGI com SQLite descartável; resta homologação integrada browser → FastAPI sintético real sem mock, e verificação do comportamento threadpool operacional fora da limitação de sandbox.
