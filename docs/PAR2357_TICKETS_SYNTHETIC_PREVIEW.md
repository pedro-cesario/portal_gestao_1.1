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
