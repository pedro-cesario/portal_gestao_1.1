# ROADMAP DE IMPLEMENTAÇÃO E CONCILIAÇÃO BACKEND — HEAL OPS 1.1
## Diretrizes de Integração FastAPI & Luna CLI para os Quatro Templates Gerenciais
**Instituto HEAL — Diretoria de Tecnologia da Informação (DTI)**  
**Versão:** 1.1.0 (Revisão Etapa 9.1.6.2)  
**Autor:** ChatGPT Arquiteto & Engenharia Frontend AI Studio  
**Público-Alvo:** Equipe Matrix / Desenvolvedores Luna CLI

---

## 1. VISÃO GERAL E PRESERVAÇÃO DA ARQUITETURA EXISTENTE

A conciliação com o backend FastAPI pela Matrix via Luna CLI deve respeitar estritamente a infraestrutura e os mecanismos de segurança já aprovados e operacionais no Portal HEAL:

1. **Autenticação e Sessão:** Preservar a autenticação existente por **sessão/cookie HTTP-only** com proteção contra **CSRF**. Não introduzir novo sistema de autenticação nem presumir JWT Bearer sem necessidade demonstrada.
2. **Controle de Acesso (RBAC):** Preservar os perfis e permissões já em uso na aplicação (`Gestor`, `Coordenador`, `Técnico`).
3. **Banco de Dados de Staging:** Preservar a base **SQLite V004** como referência atual de staging da DTI. Não impor migração para PostgreSQL sem justificativa técnica prévia aprovada pela DTI.
4. **Integração GLPI:** Preservar a integração somente-leitura (read-only) com o GLPI para auditoria e indicadores. Não presumir obrigatoriedade de réplica MariaDB isolada; o acesso deve ocorrer através dos conectores e rotinas já homologadas.
5. **Gateway AGY:** Preservar o isolamento do gateway do Agente Gerencial (AGY), garantindo que as sugestões de IA permaneçam desacopladas das decisões formais da gestão.
6. **Regra do Grupo 48 TI > Gestão:** O backend deve aplicar a regra institucional de incluir todos os técnicos nominais nos rankings e indicadores operacionais, preservando a identificação do grupo sem exclusões automáticas.

```
+-----------------------------------------------------------------------+
|                        FRONTEND REACT 18 SPA                          |
|  (Sintético Primeiro, Analítico Sob Demanda, Zero-Scroll no Viewport)  |
+-----------------------------------+-----------------------------------+
                                    | Sessão Cookie HTTP-only + CSRF
                                    v
+-----------------------------------------------------------------------+
|                         BACKEND FASTAPI                               |
|  - Routers Modulares Existentes & Propostos                           |
|  - Middleware de Sessão, RBAC e CSRF Existente                        |
|  - Gateway AGY Isolado (Agente Gerencial de Redação)                  |
+-------------------+-----------------------------------+---------------+
                    |                                   |
                    v                                   v
+-------------------------------+   +-----------------------------------+
|      BASE STAGING ATUAL       |   |      GLPI INSTITUCIONAL HEAL      |
|         (SQLite V004)         |   |     (Integração Read-Only)        |
|  - Atas, Feedbacks, Assinaturas|   |  - Chamados, Grupos, Técnicos     |
|  - Planos Individuais, GMUDs  |   |  - Snapshot Diário das 04:00      |
+-------------------------------+   +-----------------------------------+
```

---

## 2. CLASSIFICAÇÃO DOS ENDPOINTS E MATRIZ DE CONCILIAÇÃO

Cada endpoint sugerido para suportar os templates é classificado formalmente:

* **[EC] Existente e confirmado:** Endpoint em operação no backend atual.
* **[EA] Existente com ajuste necessário:** Endpoint ativo, mas que requer adaptação contratual.
* **[CP] Contrato proposto:** Especificação desenhada pelo frontend aguardando implementação no FastAPI.
* **[NI] Não implementado:** Funcionalidade nova sem endpoint correspondente.
* **[DG] Dependente de gate institucional:** Requer chancela formal da DTI para autorização de fluxo.
* **[NV] Não verificado no backend:** Estado do endpoint no servidor remoto não acessível diretamente pelo AI Studio.

---

### 2.1. TPL-01 — Daily Operacional de TI
| Método | Endpoint | Classificação | Descrição & Ação Necessária |
|:---:|:---|:---:|:---|
| `GET` | `/api/v1/tickets/open` | `[NV] Não verificado no backend` | Consulta chamados abertos. Garantir que técnicos do Grupo 48 constem no retorno. |
| `GET` | `/api/v1/tickets/stalled-24h` | `[NV] Não verificado no backend` | Auditoria POP-TIN-017 de chamados sem evolução humana observável há mais de 24h. |
| `GET` | `/api/v1/templates/daily/latest` | `[CP] Contrato proposto` | Retorna o artefato sintético consolidado do Daily baseado no snapshot das 04h. |
| `POST` | `/api/v1/agreements` | `[CP] Contrato proposto` | Registra novo acordo deliberado na reunião Daily com autoria auditada. |
| `PATCH` | `/api/v1/agreements/{id}/status` | `[CP] Contrato proposto` | Transição de status do acordo (`AGUARDANDO_CONFIRMACAO` $\to$ `CONFIRMADO` $\to$ `CONCLUIDO`). |

---

### 2.2. TPL-02 — Alinhamento Semanal & Planos Individuais
| Método | Endpoint | Classificação | Descrição & Ação Necessária |
|:---:|:---|:---:|:---|
| `GET` | `/api/v1/templates/weekly/summary` | `[CP] Contrato proposto` | Comparativo consolidado da semana corrente contra a semana anterior. |
| `GET` | `/api/v1/development-plans` | `[CP] Contrato proposto` | Listagem longitudinal de compromissos individuais de desenvolvimento. |
| `POST` | `/api/v1/development-plans` | `[CP] Contrato proposto` | Cadastro de novo compromisso individual pactuado em alinhamento. |
| `PATCH` | `/api/v1/development-plans/{id}/actions/{act_id}` | `[CP] Contrato proposto` | Marcação de execução de ações práticas intermediárias pelo técnico. |
| `POST` | `/api/v1/development-plans/{id}/validate` | `[CP] Contrato proposto` | Validação formal exclusiva do gestor (`CUMPRIDO`, `PARCIAL`, `NAO_CUMPRIDO`) com parecer. |

---

### 2.3. TPL-03 — Feedback e Alinhamentos
| Método | Endpoint | Classificação | Descrição & Ação Necessária |
|:---:|:---|:---:|:---|
| `POST` | `/api/v1/ai/alignment-preparation` | `[CP] Contrato proposto` | Gateway AGY: recebe anotações espontâneas e gera roteiro de 7 passos e minuta preliminar. |
| `POST` | `/api/v1/alignments` | `[CP] Contrato proposto` | Salva ata formal com numeração `ALN-2026-XXXX`. Não aceita decisões presumidas. |
| `GET` | `/api/v1/alignments` | `[CP] Contrato proposto` | Repositório de atas formais com filtros por colaborador, data e status de arquivamento. |
| `GET` | `/api/v1/alignments/{id}` | `[CP] Contrato proposto` | Detalhe da ata com histórico auditável de revisões. |
| `POST` | `/api/v1/alignments/{id}/signatures/collect` | `[CP] Contrato proposto` | Registra a coleta de assinatura física em papel pelo operador (sem assinatura digital simulada). |
| `POST` | `/api/v1/alignments/{id}/archive-physical` | `[CP] Contrato proposto` | Registra a guarda física no livro/tomo e armário da DTI. |

---

### 2.4. TPL-04 — Gestão Completa de Projetos
| Método | Endpoint | Classificação | Descrição & Ação Necessária |
|:---:|:---|:---:|:---|
| `GET` | `/api/v1/projects/{id}` | `[CP] Contrato proposto` | Estrutura completa do projeto: 5 fases, marcos, entregas e cronograma Gantt. |
| `PATCH` | `/api/v1/projects/tasks/{task_id}/progress` | `[CP] Contrato proposto` | Atualização de progresso e checklist pelo técnico responsável. |
| `POST` | `/api/v1/projects/tasks/{task_id}/submit-validation` | `[CP] Contrato proposto` | Técnico submete entrega com evidência documental (`AGUARDANDO_VALIDACAO`). |
| `POST` | `/api/v1/projects/tasks/{task_id}/manager-validate` | `[CP] Contrato proposto` | Gestor homologa entrega (`CONCLUIDO`) ou devolve (`AJUSTES_SOLICITADOS`). |
| `POST` | `/api/v1/projects/tasks/{task_id}/report-block` | `[CP] Contrato proposto` | Registro formal de bloqueio com causa e plano de contingência. |
| `POST` | `/api/v1/projects/gmud-link` | `[DG] Dependente de gate institucional` | Vinculação de GMUD a entregas críticas. Registra em tabela própria sem escrita no GLPI. |

---

## 3. DIRETRIZES DE IMPLEMENTAÇÃO PELA MATRIX / LUNA CLI

1. **Evitar Duplicação:** Verificar se roteadores existentes no FastAPI já atendem parcialmente a `/api/v1/tickets` ou `/api/v1/settings` antes de instanciar novos arquivos de rota.
2. **Preservar Modelo SQLite V004:** Toda a persistência inicial de atas, acordos e planos individuais deve ser implementada como tabelas adicionais no SQLite de staging (`staging_heal_v004.db`).
3. **Não Quebrar Contratos do Frontend:** Os nomes dos campos JSON devem seguir rigorosamente o padrão `camelCase` esperado pelo TypeScript ou possuir alias no Pydantic (`by_alias=True`).
4. **Isolamento de IA:** O endpoint `/api/v1/ai/alignment-preparation` deve retornar a minuta preliminar sinalizada com `is_simulation: false` apenas quando gerado por modelo real, mantendo os campos de decisões pós-reunião sempre vazios para preenchimento pelo gestor.
