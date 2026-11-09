# ROADMAP DE IMPLEMENTAÇÃO E CONCILIAÇÃO BACKEND — HEAL OPS 1.1
## Diretrizes de Integração FastAPI & Luna CLI para os Quatro Templates Gerenciais
**Instituto HEAL — Diretoria de Tecnologia da Informação (DTI)**  
**Versão:** 1.1.0  
**Autor:** Engenharia Frontend AI Studio  
**Público-Alvo:** Equipe Matrix / Desenvolvedores Luna CLI

---

## 1. VISÃO GERAL DA ARQUITETURA

O frontend do Portal HEAL Ops 1.1 foi desenvolvido como uma Single Page Application (SPA) reativa e desacoplada. Toda a interface opera atualmente com dados estruturados em conformidade com contratos TypeScript tipados (`src/types/index.ts`).

A missão do backend FastAPI gerenciado via Luna CLI é implementar a persistência relacional, a autenticação de operadores e a orquestração de IA (via agente AGY), substituindo progressivamente os mocks locais sem quebrar nenhuma interação aprovada no frontend.

```
+-----------------------------------------------------------------------+
|                        FRONTEND REACT 18 SPA                          |
|  (Sintético Primeiro, Analítico Sob Demanda, Zero-Scroll no Viewport)  |
+-----------------------------------+-----------------------------------+
                                    | REST JSON / Bearer JWT
                                    v
+-----------------------------------------------------------------------+
|                         BACKEND FASTAPI                               |
|  - Routers Modulares (/api/v1/templates, /api/v1/alignments, etc.)    |
|  - Camada de Serviços de Governança & Validação de Regras             |
|  - Orquestrador de IA (Luna CLI / AGY / Gemini Flash)                 |
+-------------------+-----------------------------------+---------------+
                    |                                   |
                    v                                   v
+-------------------------------+   +-----------------------------------+
|     BANCO RELACIONAL APP      |   |       RÉPLICA GLPI MARIADB        |
|  (PostgreSQL / SQLite DTI)    |   |  - Read-Only às 04:00 (Snapshot)  |
|  - Atas, Feedbacks, Assinaturas|   |  - Chamados, Grupos, Técnicos     |
|  - Planos Individuais, GMUDs  |   +-----------------------------------+
+-------------------------------+
```

---

## 2. FASES DE IMPLEMENTAÇÃO POR TEMPLATE

### FASE 1 — CONCILIAÇÃO DO TPL-01 (Daily Operacional)
* **Objetivo:** Alimentar o painel matinal com métricas reais da réplica GLPI.
* **Tarefas Técnicas:**
  1. Configurar rotina cron assíncrona diária às 04:00 para materializar a view `glpi_snapshot_04h`.
  2. Implementar endpoint `GET /api/v1/templates/daily/latest`:
     - Retorna contagem de chamados abertos, pendentes e sem técnico nominal atribuído.
     - Aplica filtro estrito de exclusão do Grupo 48 (`glpi_groups_id != 48`).
     - Identifica chamados sem atualização há mais de 24 horas (Auditoria POP-TIN-017).
  3. Implementar endpoint `GET /api/v1/templates/daily/history` para consulta a Dailies anteriores.
  4. Endpoints de Acordos e Encaminhamentos:
     - `POST /api/v1/agreements`: Registro de novos acordos da reunião com autor auditado.
     - `PATCH /api/v1/agreements/{id}/status`: Transição de status (`AGUARDANDO_CONFIRMACAO` -> `CONFIRMADO` -> `CONCLUIDO`).

---

### FASE 2 — CONCILIAÇÃO DO TPL-02 (Alinhamento Semanal & Planos Individuais)
* **Objetivo:** Rastreabilidade longitudinal de compromissos e desenvolvimento da equipe técnica.
* **Tarefas Técnicas:**
  1. Implementar endpoints de consolidação semanal:
     - `GET /api/v1/templates/weekly/summary`: Comparativo da semana anterior contra a semana corrente.
  2. Tabela relacional `development_commitments`:
     - Armazena compromissos individuais pactuados em alinhamentos.
  3. Endpoints de governança de compromissos:
     - `GET /api/v1/development-plans`: Listagem com filtros por colaborador, status e área.
     - `POST /api/v1/development-plans`: Cadastro de novo compromisso individual.
     - `PATCH /api/v1/development-plans/{id}/actions/{action_id}`: Alternância de ações práticas (execução pelo técnico).
     - `POST /api/v1/development-plans/{id}/validate`: Validação formal do gestor (`CUMPRIDO`, `PARCIAL`, `NAO_CUMPRIDO`), exigindo nota de feedback e bloqueando alteração posterior sem trilha de auditoria.

---

### FASE 3 — CONCILIAÇÃO DO TPL-03 (Feedback e Alinhamentos)
* **Objetivo:** Persistência de atas, dossiês de colaboradores, controle de assinaturas físicas e IA de redação.
* **Tarefas Técnicas:**
  1. Endpoints do Agente AGY / Redação com IA:
     - `POST /api/v1/ai/alignment-preparation`: Recebe anotações do gestor e tom selecionado (`EQUILIBRADO`, `ACOLHEDOR`, `DIRETO`, `DESENVOLVIMENTO`).
     - Invoca modelo de linguagem via agente Luna CLI AGY retornando roteiro de 7 passos, minuta preliminar e metas sugeridas.
  2. Endpoints de Atas e Documentos Formais:
     - `POST /api/v1/alignments`: Salva ata formal gerando numeração institucional sequencial (`ALN-2026-XXXX`).
     - `GET /api/v1/alignments`: Listagem com status de assinaturas e paginação.
     - `GET /api/v1/alignments/{id}`: Detalhe completo da ata e histórico de revisões.
  3. Workflow de Coleta de Assinaturas Físicas:
     - `POST /api/v1/alignments/{id}/signatures/collect`: Registra que o colaborador assinou fisicamente em papel (operador que testemunhou, data/hora e observações).
     - `POST /api/v1/alignments/{id}/signatures/manager-sign`: Registra a assinatura manuscrita do gestor.
  4. Repositório e Arquivamento Físico:
     - `POST /api/v1/alignments/{id}/archive-physical`: Registra o arquivamento da folha impressa (número do livro de plantão, tomo e armário físico na DTI).
     - Suporte opcional a upload do PDF digitalizado assinado (`multipart/form-data`).

---

### FASE 4 — CONCILIAÇÃO DO TPL-04 (Gestão Completa de Projetos)
* **Objetivo:** Governança dos projetos estratégicos de infraestrutura e sistemas hospitalares.
* **Tarefas Técnicas:**
  1. Tabelas relacionais: `projects`, `project_phases`, `project_tasks`, `project_milestones`, `project_risks`.
  2. Endpoints de consulta e governança:
     - `GET /api/v1/projects/{id}`: Estrutura completa das 5 fases, marcos e cronograma Gantt.
     - `PATCH /api/v1/projects/tasks/{task_id}/progress`: Atualização de progresso e checklist pelo técnico.
     - `POST /api/v1/projects/tasks/{task_id}/submit-validation`: Técnico submete entrega com evidência documental (`AGUARDANDO_VALIDACAO`).
     - `POST /api/v1/projects/tasks/{task_id}/manager-validate`: Gestor homologa entrega (`CONCLUIDO`) ou solicita correções (`AJUSTES_SOLICITADOS`).
     - `POST /api/v1/projects/tasks/{task_id}/report-block`: Registro de bloqueio com causa e plano de contingência.
  3. Integração com GMUD:
     - Endpoint para anexar número de GMUD a entregas críticas de infraestrutura, registrando em tabela própria de auditoria da DTI sem tentar escrita direta na base do GLPI.

---

## 3. MODELO DE SEGURANÇA E AUDITORIA

1. **Autenticação:** JWT Bearer Token emitido no login ou conciliado via SSO institucional HEAL.
2. **Autorização por Perfis (RBAC):**
   - `GESTOR_DTI`: Acesso total, homologação de painéis, validação de metas e registro de arquivamento físico.
   - `COORDENADOR_TI`: Condução de Dailies, registro de acordos, proposição de feedbacks e encaminhamentos.
   - `TECNICO_OPERACIONAL`: Visualização de suas próprias atribuições, marcação de execução de ações e tarefas, submissão de evidências.
3. **Imutabilidade de Atas Formalizadas:**
   - Uma vez que uma ata é marcada como `FORMALIZADA`, seu texto base torna-se somente-leitura. Quaisquer adendos devem ser registrados como revisões com versionamento formal (`v1.1`, `v2.0`).
