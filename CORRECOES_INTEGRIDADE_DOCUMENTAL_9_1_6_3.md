# PORTAL DE GESTÃO OPERACIONAL HEAL
## RELATÓRIO DE CORREÇÕES DE INTEGRIDADE DOCUMENTAL E TRANSIÇÕES DE ESTADO
### ETAPA 9.1.6.3 — DESACOPLAMENTO DE CIÊNCIA E ASSINATURA, SANEAMENTO DE IDENTIDADES E TESTES DE PRODUÇÃO

**Data:** 09/11/2026  
**Ambiente:** Google AI Studio Frontend (`portal_gestao_1.1`)  
**Commit de Referência:** `fa5005576fd4f383abb08e1cd77a8608cdc82e13`  
**Destino de Conciliação:** Equipe Matrix / Luna CLI (Backend FastAPI)  
**Status da Entrega:** CONCLUÍDO E HOMOLOGADO EM DEMONSTRAÇÃO COM 45 TESTES APROVADOS  

---

## 1. SUMÁRIO EXECUTIVO

A Etapa 9.1.6.3 resolveu em definitivo as inconformidades apontadas na auditoria arquitetural independente sobre integridade documental, transições de estado e integridade das rotinas do TPL-03 (Feedback e Alinhamentos Formais):

1. **P0 — Desacoplamento Estrito entre Ciência e Assinatura Manuscrita:**
   - No código legado, `handleConfirmScience` invocava `handleCollectPhysicalSignature`, e esta última modificava conjuntamente `scienceStatus: 'CIENTE'` e `signatureStatus: 'ASSINATURA_FISICA_COLETADA'`.
   - Essa associação foi totalmente extinta. Foram criadas operações puras e independentes: `confirmParticipantScience` (atualiza unicamente a ciência, sem alterar assinatura nem afirmar concordância), `collectParticipantPhysicalSignature` (atualiza unicamente o registro de assinatura física conferida em via A4, sem alterar ciência), `refuseParticipantScience` (recusa de ciência sem equiparação a aceite) e `refuseParticipantPhysicalSignature` (recusa de assinatura manuscrita sem promover documento a formalizado).

2. **P0 — Máquina de Estados e Bloqueio de Transições Indevidas:**
   - Um documento com assinaturas coletadas transita para `ASSINATURAS_COLETADAS`, mas **NUNCA** é promovido automaticamente para `ARQUIVADO_FISICO` por impressão de PDF ou conferência de firmas.
   - O arquivamento físico exige ação própria com validação de livro/tomo, localização (armário/pasta) e operador autenticado.
   - Reuniões não confirmadas como realizadas pelo gestor humano permanecem com status `AGUARDANDO_REALIZACAO`, sem data ou hora forjadas.

3. **P1 — Saneamento de Identidades Fictícias e Autenticação Obrigatória:**
   - Remoção de todos os fallbacks compulsórios para `"Henrique Vasconcelos"` quando `currentUser` for nulo ou ausente.
   - Qualquer operação sensível (confirmar ciência, registrar assinatura manuscrita, registrar recusa, cadastrar alinhamento/feedback ou registrar arquivamento físico) verifica a autenticação do operador via `validateActionAuthentication(currentUser)`. Caso ausente, a ação é bloqueada com mensagem explícita.
   - Campos de livro e pasta física agora iniciam vazios (`undefined` / `''`), impedindo que dados demonstrativos sejam tomados como evidências arquivísticas institucionais pré-existentes.

4. **P1 — Testes Automatizados Conectados ao Código Real de Produção:**
   - As regras de negócio foram extraídas para o módulo reutilizável `src/utils/documentGovernance.ts`.
   - A suíte de testes `src/tests/templatesGovernance.test.ts` foi reescrita para importar e executar diretamente as funções utilizadas pelo aplicativo, cobrindo integralmente os 12 requisitos obrigatórios com **45 asserções aprovadas (100% de sucesso)**.

---

## 2. ARQUIVOS ALTERADOS E CRIADOS

| Arquivo | Natureza | Descrição da Modificação |
| :--- | :---: | :--- |
| `src/utils/documentGovernance.ts` | **Novo** | Módulo puro de governança com as funções `confirmParticipantScience`, `refuseParticipantScience`, `collectParticipantPhysicalSignature`, `refuseParticipantPhysicalSignature`, `collectManagerPhysicalSignature`, `archiveDocumentPhysical`, `validateActionAuthentication`, `resolveFinalDecisions` e `resolveMeetingPreparation`. |
| `src/types/index.ts` | **Alterado** | Inclusão de `'RECUSOU_CIENCIA'` em `AlignmentScienceStatus` e `'COM_RECUSA_ASSINATURA'` em `FormalDocumentStatus`. |
| `src/App.tsx` | **Alterado** | Substituição da chamada cruzada entre ciência e assinatura por handlers desacoplados que checam `validateActionAuthentication`; extinção dos fallbacks para identidade fictícia. |
| `src/components/panels/DocumentPreviewModal.tsx` | **Alterado** | Desacoplamento dos botões de ciência, assinatura física e recusa; campos de arquivamento iniciam vazios; bloqueio de ações quando sem operador autenticado. |
| `src/components/panels/FeedbackAndAlignmentsDrawer.tsx` | **Alterado** | Separação das colunas de "Ciência Formal" e "Assinatura Manuscrita A4" na aba de assinaturas com botões independentes. |
| `src/components/panels/RegisterAlignmentModal.tsx` | **Alterado** | Remoção de default user hardcoded; presença inicial fixada em `PRESENCA_NAO_CONFIRMADA`; bloqueio se não autenticado; campos de arquivamento limpos. |
| `src/components/panels/RegisterFeedbackModal.tsx` | **Alterado** | Remoção de default user hardcoded; dados de arquivamento limpos; validação de operador autenticado no submit. |
| `src/components/panels/AiAlignmentPreparationModal.tsx` | **Alterado** | Remoção de default user hardcoded; dados de arquivamento limpos; preservação de integridade de autoria. |
| `src/tests/templatesGovernance.test.ts` | **Alterado** | Reescrita conectada 100% às funções de `documentGovernance.ts`, cobrindo os 12 requisitos obrigatórios da auditoria. |
| `CORRECOES_INTEGRIDADE_DOCUMENTAL_9_1_6_3.md` | **Novo** | Este relatório executivo consolidado. |
| `CONTRATOS_TPL03_PRONTOS_PARA_MATRIX.md` | **Novo** | Especificação técnica de DTOs, payloads, RBAC e CSRF para conciliação no FastAPI via Luna CLI. |

---

## 3. COMPROVAÇÃO DOS 12 REQUISITOS DA AUDITORIA

A execução de `npm test` valida diretamente no código-fonte a conformidade de cada requisito:

```
> react-example@0.0.0 test
> tsx src/tests/templatesGovernance.test.ts

=== INICIANDO BATERIA DE TESTES DE INTEGRIDADE DOCUMENTAL HEAL OPS 9.1.6.3 ===

1. TESTE: Confirmar ciência não altera assinatura física
  ✓ PASS: Ciência do participante foi atualizada para CIENTE
  ✓ PASS: Assinatura física permaneceu ASSINATURA_FISICA_PENDENTE inalterada
  ✓ PASS: Nenhum registro de assinatura física foi criado

2. TESTE: Registrar assinatura física não altera automaticamente ciência
  ✓ PASS: Assinatura física foi registrada como ASSINATURA_FISICA_COLETADA
  ✓ PASS: Ciência do participante permaneceu PENDENTE sem alteração automática
  ✓ PASS: Metadados de operador que coletou a assinatura foram gravados

3. TESTE: Registrar assinatura não arquiva o documento
  ✓ PASS: Quando todos assinam, status avança para ASSINATURAS_COLETADAS
  ✓ PASS: Documento com todas assinaturas coletadas NÃO avança para ARQUIVADO_FISICO
  ✓ PASS: archivingInfo.isArchivedPhysical permanece false

4. TESTE: Ausência de usuário autenticado bloqueia ação sensível
  ✓ PASS: Usuário nulo é bloqueado
  ✓ PASS: Retorna mensagem de bloqueio explicativa
  ✓ PASS: Usuário com nome vazio ou espaços é bloqueado
  ✓ PASS: Operador autenticado é aceito com sucesso
  ✓ PASS: Nome do operador autenticado é preservado

5. TESTE: Participante inicialmente não é considerado presente
  ✓ PASS: Todos os participantes iniciam rigorosamente com PRESENCA_NAO_CONFIRMADA
  ✓ PASS: Nenhum participante é presumido como PRESENTE

6. TESTE: Decisões vazias não produzem concordância fictícia
  ✓ PASS: Array vazio retorna texto padronizado exato
  ✓ PASS: Array com espaços em branco é tratado como ausência de decisões
  ✓ PASS: Não contém pactuações fictícias
  ✓ PASS: Não contém alegações de aprovação
  ✓ PASS: Decisão informada pelo gestor é preservada fielmente

7. TESTE: Reunião não realizada mantém status adequado
  ✓ PASS: Reunião não confirmada mantém status AGUARDANDO_REALIZACAO
  ✓ PASS: Não inventa data ou hora de condução retroativa
  ✓ PASS: Reunião confirmada como realizada avança para EM_REVISAO
  ✓ PASS: Data real informada é atribuída à ata

8. TESTE: Metas sugeridas não viram compromissos sem confirmação
  ✓ PASS: Apenas 1 meta foi confirmada
  ✓ PASS: Apenas a meta selecionada explicitamente entrou no plano
  ✓ PASS: Meta não selecionada NÃO vira compromisso

9. TESTE: Grupo 48 permanece incluído
  ✓ PASS: Existem técnicos do Grupo 48 cadastrados
  ✓ PASS: excludeManagementGroup48 está false por padrão
  ✓ PASS: excludedGroupIds está vazio por padrão

10. TESTE: Dados demonstrativos não são identificados como realtime
  ✓ PASS: Alinhamento em memória tem isSimulation=true
  ✓ PASS: Documento demonstrativo não se declara FORMALIZADO sem backend

11. TESTE: Arquivamento exige confirmação explícita
  ✓ PASS: Arquivamento sem livro é rejeitado
  ✓ PASS: Arquivamento sem localização é rejeitado
  ✓ PASS: Arquivamento sem operador é rejeitado
  ✓ PASS: Arquivamento com todos os campos é aceito com sucesso
  ✓ PASS: Status é promovido para ARQUIVADO_FISICO
  ✓ PASS: Número do tomo registrado
  ✓ PASS: isArchivedPhysical é confirmado como true

12. TESTE: Recusa e ausência de assinatura não produzem falso aceite
  ✓ PASS: Status do participante registra RECUSOU_CIENCIA
  ✓ PASS: Recusa NÃO é equiparada a ciência confirmada
  ✓ PASS: Status do participante registra RECUSOU_ASSINATURA
  ✓ PASS: Recusa NÃO é equiparada a assinatura coletada
  ✓ PASS: Documento reflete que houve recusa de assinatura (COM_RECUSA_ASSINATURA)

=============================================================
RESULTADO DOS TESTES DE GOVERNANÇA 9.1.6.3: 45 PASSOU | 0 FALHOU
=============================================================
```

---

## 4. PADRONIZAÇÃO DAS CLASSIFICAÇÕES NOS DOCUMENTOS

Todos os documentos de arquitetura e roadmap operam sob a mesma taxonomia formal:
- `[EC]` — Existente e confirmado.
- `[EA]` — Existente com ajuste necessário.
- `[CP]` — Contrato proposto.
- `[NI]` — Não implementado.
- `[DG]` — Dependente de gate institucional.
- `[NV]` — Não verificado no backend.

Nenhuma validação técnica do frontend ou revisão por agentes foi atribuída como homologação institucional humana. A homologação do sistema permanece a cargo da Diretoria de TI e da Comissão de Governança Hospitalar do Instituto HEAL.
