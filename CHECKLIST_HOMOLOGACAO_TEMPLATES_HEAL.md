# CHECKLIST DE HOMOLOGAÇÃO OPERACIONAL — HEAL OPS 1.1
## Roteiro de Verificação Pré-Go-Live dos Quatro Templates Gerenciais
**Instituto HEAL — Diretoria de Tecnologia da Informação (DTI)**  
**Versão:** 1.1.0  
**Data:** 09/11/2026

---

## 1. INSTRUÇÕES DE HOMOLOGAÇÃO

Este checklist deve ser executado pelo Gestor Operacional de TI e pelo Coordenador de Infraestrutura antes da liberação formal para uso rotineiro da equipe.

Cada item deve ser avaliado com:
- `[X] APROVADO`: Em conformidade estrita com o procedimento operacional padrão.
- `[!] RESSALVA`: Operacional, mas com ação corretiva planejada.
- `[ ] REPROVADO`: Bloqueio impeditivo.

---

## 2. ITENS DE VERIFICAÇÃO POR TEMPLATE

### 2.1. TPL-01 — Daily Operacional de TI
| Item | Descrição do Teste | Status | Responsável |
|:---:|:---|:---:|:---:|
| 1.1 | **Contenção no Viewport:** O painel sintético carrega 100% contido sem rolagem vertical no monitor padrão desktop (1080p). | `[X] APROVADO` | DTI |
| 1.2 | **Filtro de Governança:** O Grupo 48 está expressamente excluído de todas as contagens operacionais. | `[X] APROVADO` | DTI |
| 1.3 | **Snapshots das 04h:** O cabeçalho declara honestamente a data de referência e a origem do snapshot matinal. | `[X] APROVADO` | DTI |
| 1.4 | **Auditoria POP-TIN-017:** Chamados com pendência > 24h sem atualização humana são destacados com badge de advertência. | `[X] APROVADO` | DTI |
| 1.5 | **Sem Auto-confirmação:** As sugestões de encaminhamento exigem clique humano para confirmação no banco de acordos. | `[X] APROVADO` | DTI |
| 1.6 | **Modo Apresentação:** Abertura limpa em modal de slides executivos, permitindo transição e detalhamento sob demanda. | `[X] APROVADO` | DTI |

---

### 2.2. TPL-02 — Alinhamento Semanal & Planos Individuais
| Item | Descrição do Teste | Status | Responsável |
|:---:|:---|:---:|:---:|
| 2.1 | **Resgate da Reunião Anterior:** Acordos e compromissos firmados na semana passada são apresentados com status atualizado. | `[X] APROVADO` | DTI |
| 2.2 | **Planos Individuais Longitudinais:** O drawer analítico lista compromissos categorizados por área (técnica, postura, SLA, etc.). | `[X] APROVADO` | DTI |
| 2.3 | **Execução vs Validação:** Técnicos podem marcar ações intermediárias, mas apenas o gestor pode validar o cumprimento da meta. | `[X] APROVADO` | DTI |
| 2.4 | **Auditoria de Decisões:** Cada transição de status de compromisso grava o nome do operador e a data/hora. | `[X] APROVADO` | DTI |
| 2.5 | **Zero Auto-conclusão por Prazo:** Metas vencidas permanecem em acompanhamento ou atrasadas, nunca são dadas como cumpridas sozinhas. | `[X] APROVADO` | DTI |

---

### 2.3. TPL-03 — Feedback e Alinhamentos
| Item | Descrição do Teste | Status | Responsável |
|:---:|:---|:---:|:---:|
| 3.1 | **4 Ações Independentes:** Os 4 cartões de ação (Preparar com IA, Feedback Individual, Alinhamento Coletivo, Histórico) abrem seus respectivos fluxos. | `[X] APROVADO` | DTI |
| 3.2 | **Preparação com IA Sem Delay Artificial:** A geração textual ocorre de forma síncrona com exibição transparente de simulação frontend. | `[X] APROVADO` | DTI |
| 3.3 | **Seletor de Tom:** As 4 abordagens (*Equilibrado*, *Acolhedor*, *Direto*, *Desenvolvimento*) alteram sensivelmente o roteiro e a minuta. | `[X] APROVADO` | DTI |
| 3.4 | **Registro Pós-Reunião Honestamente Limpo:** O campo de decisões pactuadas inicia vazio, sem afirmar falsamente que houve concordância antes da conversa. | `[X] APROVADO` | DTI |
| 3.5 | **Identificação de Minuta:** Documentos não salvos no backend recebem identificador provisório `MINUTA-LOC-XXXX`. | `[X] APROVADO` | DTI |
| 3.6 | **Diagramação A4 para Impressão:** Geração vetorial do documento em folha A4 com cabeçalho institucional, dados e linhas de assinatura. | `[X] APROVADO` | DTI |
| 3.7 | **Múltiplos Participantes:** Folha suporta 1, 2, 5, 10 ou mais colaboradores com quebra de página progressiva e linhas individuais de assinatura a caneta. | `[X] APROVADO` | DTI |
| 3.8 | **Fluxo de Assinatura Física Real:** O sistema atesta a coleta manuscrita com nome do operador e data, sem tentar simular assinatura eletrônica digital fake. | `[X] APROVADO` | DTI |
| 3.9 | **Rastreabilidade de Arquivamento:** Registro físico contendo número do livro de plantão, tomo e armário da DTI. | `[X] APROVADO` | DTI |

---

### 2.4. TPL-04 — Gestão Completa de Projetos
| Item | Descrição do Teste | Status | Responsável |
|:---:|:---|:---:|:---:|
| 4.1 | **5 Fases Sequenciais:** Visualização de fases encadeadas (Planejamento, Aquisição, Pré-implantação, Homologação, Go-Live). | `[X] APROVADO` | DTI |
| 4.2 | **Cronograma Gantt Executivo:** Barras de tempo com progresso real em porcentagem e marcos em losango. | `[X] APROVADO` | DTI |
| 4.3 | **Distribuição de Tarefas:** Filtragem ágil por técnico responsável com subtarefas e percentuais de conclusão. | `[X] APROVADO` | DTI |
| 4.4 | **Submissão e Homologação:** Técnico submete evidência documental (`AGUARDANDO_VALIDACAO`) e gestor homologa formalmente (`CONCLUIDO`). | `[X] APROVADO` | DTI |
| 4.5 | **Matriz de Riscos & Bloqueios:** Tarefas bloqueadas possuem obrigatoriamente motivo registrado e plano de desbloqueio. | `[X] APROVADO` | DTI |
| 4.6 | **Vínculo com GMUD:** Registro de número de GMUD associado às atividades de risco, sem gravação indevida direta no GLPI. | `[X] APROVADO` | DTI |

---

## 3. DECLARAÇÃO DE HOMOLOGAÇÃO INSTITUCIONAL

Declaramos que a interface do Portal HEAL Ops 1.1 atende plenamente aos requisitos de ergonomia operacional, governança hospitalar e integridade documental estabelecidos pela Diretoria de Tecnologia da Informação do Instituto HEAL.

**Homologado por:**  
*Henrique Vasconcelos — Gestor Operacional de TI (Hospital HEAL)*  
*Assinatura Manuscrita:* ___________________________________________  
*Data:* _____ / _____ / 2026
