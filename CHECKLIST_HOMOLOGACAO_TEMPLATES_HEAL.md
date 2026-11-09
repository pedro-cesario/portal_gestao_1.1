# CHECKLIST DE HOMOLOGAÇÃO OPERACIONAL — HEAL OPS 1.1
## Roteiro de Verificação Pré-Go-Live dos Quatro Templates Gerenciais
**Instituto HEAL — Diretoria de Tecnologia da Informação (DTI)**  
**Versão:** 1.1.0  
**Revisão:** Etapa 9.1.6.2 (ChatGPT Arquiteto / AI Studio)  
**Data da Revisão:** 09/11/2026

---

## 1. INSTRUÇÕES PARA HOMOLOGAÇÃO HUMANA

Este documento constitui o instrumento formal de conferência a ser preenchido por responsável técnico e gestor autorizado da DTI antes de qualquer liberação para ambiente de produção.

**Regras de Preenchimento:**
- A verificação técnica do frontend atesta apenas a conformidade do código-fonte e dos componentes de interface.
- A homologação operacional e institucional exige teste assistido com operadores reais e validação formal.
- **Nenhum item pode ser marcado como aprovado sem execução e evidência verificável correspondente.**

Legenda de Preenchimento:
- `[ ] PENDENTE`: Item ainda não verificado pelo avaliador humano.
- `[APROVADO]`: Verificado e aprovado sem ressalvas pelo avaliador.
- `[RESSALVA]`: Aprovado para teste controlado com pendência não-bloqueante.
- `[REPROVADO]`: Inconformidade identificada que bloqueia o go-live.

---

## 2. SEPARAÇÃO DOS NÍVEIS DE HOMOLOGAÇÃO

1. **Nível 1 — Verificação Técnica do Frontend:** Componentes renderizam no viewport sem erros de console, TypeScript compila (`tsc --noEmit`), e layout é responsivo e contido.
2. **Nível 2 — Teste Funcional Demonstrativo:** Modais, transições de estado, filtros e PDFs operam conforme esperado com dados locais.
3. **Nível 3 — Homologação Operacional:** Equipe de plantão e coordenadores validam se os fluxos atendem à rotina hospitalar.
4. **Nível 4 — Homologação Institucional:** Diretoria de TI e Comitê de Governança chancelam o modelo normativo.
5. **Nível 5 — Aprovação de Produção:** Gate final de implantação pela equipe Matrix via Luna CLI.

---

## 3. ITENS DE VERIFICAÇÃO POR TEMPLATE

### 3.1. TPL-01 — Daily Operacional de TI
| Item | Descrição do Teste | Verificação Frontend | Homologação Operacional | Assinatura Avaliador |
|:---:|:---|:---:|:---:|:---:|
| 1.1 | **Contenção no Viewport:** O painel sintético carrega contido sem rolagem vertical no desktop (1440x900 e 1080p). | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 1.2 | **Regra do Grupo 48:** Todos os técnicos entram no ranking e nas contagens nominais, inclusive os vinculados ao Grupo 48 TI > Gestão. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 1.3 | **Origem dos Indicadores:** Cabeçalho identifica dados como demonstrativos no frontend e vinculados ao snapshot das 04h no backend. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 1.4 | **Auditoria POP-TIN-017:** Chamados com pendência > 24h sem atualização humana são destacados com advertência visual. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 1.5 | **Sem Auto-confirmação:** Encaminhamentos sugeridos exigem clique humano para confirmação no banco de acordos. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 1.6 | **Modo Apresentação:** Modal executivo em slides opera sem quebrar navegação nem layout. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |

---

### 3.2. TPL-02 — Alinhamento Semanal & Planos Individuais
| Item | Descrição do Teste | Verificação Frontend | Homologação Operacional | Assinatura Avaliador |
|:---:|:---|:---:|:---:|:---:|
| 2.1 | **Resgate da Reunião Anterior:** Acordos e compromissos firmados na semana anterior são apresentados com status atualizado. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 2.2 | **Planos Individuais Longitudinais:** Gaveta analítica lista compromissos categorizados por área, elegíveis para toda a equipe. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 2.3 | **Execução vs Validação:** Técnicos marcam execução de ações práticas; validação final do cumprimento da meta exige parecer do gestor. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 2.4 | **Auditoria de Decisões:** Cada transição de status de compromisso grava operador, timestamp e parecer formal. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 2.5 | **Zero Auto-conclusão por Prazo:** Metas vencidas nunca são dadas como cumpridas por decurso de prazo. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |

---

### 3.3. TPL-03 — Feedback e Alinhamentos
| Item | Descrição do Teste | Verificação Frontend | Homologação Operacional | Assinatura Avaliador |
|:---:|:---|:---:|:---:|:---:|
| 3.1 | **4 Ações Independentes:** Os 4 cartões de ação (Preparar com IA, Feedback Individual, Alinhamento Coletivo, Histórico) abrem seus respectivos fluxos. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 3.2 | **Sem Delays Artificiais:** Geração da minuta opera de forma direta, com aviso transparente de preparação demonstrativa. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 3.3 | **Seletor de Tom:** As 4 abordagens (*Equilibrado*, *Acolhedor*, *Direto*, *Desenvolvimento*) ajustam o tom do roteiro sem travar a interface. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 3.4 | **Decisões Não Inventadas:** Quando decisões estão vazias, o documento registra estritamente: *"Não foram registradas decisões pactuadas nesta reunião."* | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 3.5 | **Presença Não Presumida:** Participantes iniciam com presença não confirmada, exigindo preenchimento explícito pelo gestor. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 3.6 | **Pactuação Explícita de Metas:** Sugestões da IA não se tornam compromissos sem seleção e confirmação do gestor. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 3.7 | **Reunião Não Presumida:** Sem confirmação humana de ocorrência, documento é classificado como `AGUARDANDO_REALIZACAO` sem data inventada. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 3.8 | **Diagramação A4 para Impressão:** Geração vetorial do documento em folha A4 com cabeçalho institucional, dados e linhas de assinatura. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 3.9 | **Múltiplos Participantes:** Folha suporta 1, 2, 5, 10 ou mais colaboradores com quebra de página progressiva e linhas individuais de assinatura a caneta. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 3.10 | **Fluxo de Assinatura Física Real:** O sistema atesta a coleta manuscrita com operador e data, sem simular assinatura eletrônica digital fake. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 3.11 | **Rastreabilidade de Arquivamento:** Registro físico contendo número do livro de plantão, tomo e armário da DTI. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |

---

### 3.4. TPL-04 — Gestão Completa de Projetos
| Item | Descrição do Teste | Verificação Frontend | Homologação Operacional | Assinatura Avaliador |
|:---:|:---|:---:|:---:|:---:|
| 4.1 | **5 Fases Sequenciais:** Visualização de fases encadeadas sem sobreposição gráfica. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 4.2 | **Cronograma Gantt Executivo:** Barras temporais com percentuais reais e marcos em losango. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 4.3 | **Distribuição de Tarefas:** Filtragem ágil por técnico responsável com subtarefas e percentuais de conclusão. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 4.4 | **Submissão e Homologação:** Técnico submete evidência (`AGUARDANDO_VALIDACAO`); gestor homologa formalmente (`CONCLUIDO`). | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 4.5 | **Matriz de Riscos & Bloqueios:** Tarefas bloqueadas exigem motivo registrado e plano de desbloqueio. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |
| 4.6 | **Vínculo com GMUD:** Registro de número de GMUD associado às atividades críticas, sem escrita não autorizada no GLPI. | `CONCLUÍDO (PASS)` | `[ ] PENDENTE` | ____________________ |

---

## 4. TERMO DE HOMOLOGAÇÃO INSTITUCIONAL (EM ABERTO)

*Os campos abaixo destinam-se exclusivamente ao preenchimento manual por autoridades da DTI durante a sessão formal de homologação.*

- **Data da Avaliação:** _____ / _____ / 2026
- **Ambiente Testado:** [ ] Staging (SQLite V004) &nbsp;&nbsp;&nbsp;&nbsp; [ ] Pré-produção Matrix
- **Parecer da DTI:** [ ] Aprovado para Produção &nbsp;&nbsp;&nbsp;&nbsp; [ ] Aprovado com Ressalvas &nbsp;&nbsp;&nbsp;&nbsp; [ ] Reprovado

### Responsáveis Autorizados:
1. **Avaliador Técnico (Engenharia de Sistemas):**  
   Nome: __________________________________________________  
   Assinatura: ___________________________________________ Data: _____/_____/2026

2. **Gestor Operacional de TI (Hospital HEAL):**  
   Nome: __________________________________________________  
   Assinatura: ___________________________________________ Data: _____/_____/2026

3. **Diretor de Tecnologia da Informação (Chancela Institucional):**  
   Nome: __________________________________________________  
   Assinatura: ___________________________________________ Data: _____/_____/2026
