# PORTAL DE GESTÃO OPERACIONAL HEAL
## CONCILIAÇÃO TÉCNICA DO GERADOR DE PDF E ANÁLISE DO PR #4
### ETAPA 9.1.6.2 — GOVERNANÇA, INTEGRIDADE DOCUMENTAL E PAGINAÇÃO A4

**Referência:** PR #4 (`fix/pdf-alinhamentos-20261108`) vs. `src/utils/pdfGenerator.ts` (Commit `6362f050` / Main)  
**Destino:** Equipe Matrix / Luna CLI  
**Data da Auditoria:** 09/11/2026  
**Recomendação de Integração:** **NÃO REALIZAR MERGE CEGO (`NO BLIND MERGE`) — PRESERVAR A VERSÃO EVOLUÍDA DA BRANCH PRINCIPAL.**

---

## 1. RESUMO EXECUTIVO

O Pull Request #4 (`fix/pdf-alinhamentos-20261108`) propunha correções pontuais para quebra de página de alinhamentos formais com múltiplos participantes. No entanto, uma análise linha a linha revela que:

1. A branch de trabalho atual (`main` no repositório `portal_gestao_1.1`) já absorveu e **superou** as propostas do PR #4, implementando:
   - Paginação progressiva robusta para 1, 2, 5, 10 e 20+ colaboradores em grade de duas colunas (86mm de largura, 10mm de espaçamento).
   - Cálculo dinâmico do total de páginas com segunda passagem (`post-processing`) para renderizar `Página X de Y` fidedigna.
   - Bloco de arquivamento físico institucional (Livro de Tomo, Número do Tomo, Folha e Operador de Arquivamento).
   - Eliminação estrita de qualquer carimbo digital falso ("Assinado Digitalmente por IA"), preservando linhas para assinatura física manuscrita e aposição de ciência.
2. Se o PR #4 fosse mesclado cegamente (`git merge` sem triagem), haveria **regressão técnica** com perda de funcionalidades recém-homologadas e reintrodução de layouts estáticos que quebram com mais de 6 participantes.

---

## 2. COMPARAÇÃO TÉCNICA DETALHADA

| Aspecto | PR #4 (`fix/pdf-alinhamentos-20261108`) | Implementação Atual (`src/utils/pdfGenerator.ts`) | Veredito |
| :--- | :--- | :--- | :--- |
| **Grid de Participantes** | Linhas horizontais simples com espaçamento fixo; quebra de página manual rígida. | Grade modular dinâmica em 2 colunas com detecção preditiva de margem inferior (`currentY + 26 > pageHeight - 20`). | **Superior na Main**: Suporta listas de 1 a 30+ participantes sem sobreposição. |
| **Cabeçalho de Continuação** | Ausente ou duplicando cabeçalho padrão sem numeração correta. | Função `drawInstitutionalHeader` com título específico: `ASSINATURAS DOS PARTICIPANTES (CONTINUAÇÃO)` e número do protocolo institucional no topo. | **Superior na Main**: Conformidade com auditoria hospitalar. |
| **Total de Páginas (`Pág. X de Y`)** | Valor estático ou omitido na primeira página. | Cálculo de duas passagens: processa todo o fluxo do documento e reaplica a numeração de páginas institucional no rodapé de todas as folhas. | **Superior na Main**: Impede adulteração por subtração de páginas em arquivo físico. |
| **Termo de Ciência e Acordo** | Texto genérico que presumia concordância tácita. | Texto revisado em conformidade com governança HEAL Ops: ciência declaratória sem imputar pactuação fictícia quando não houver decisões. | **Superior na Main**: Alinhamento com a diretriz P0 de integridade documental. |
| **Rastreabilidade de Arquivamento** | Inexistente. | Bloco padronizado de protocolo com Livro Tomo, Folha, Hash SHA-256 sintético e rubrica do operador de arquivamento. | **Superior na Main**: Essencial para a rotina de arquivo do Hospital HEAL. |
| **Gestão de Espaço (Zero-Overflow)** | Vulnerável a overflow quando pauta e deliberações possuem múltiplos itens longos. | Quebra de linha dinâmica com `doc.splitTextToSize` e salto de página condicional antes de cada seção (`neededHeaderAndManagerHeight`). | **Superior na Main**: Elimina corte de texto no rodapé A4. |

---

## 3. IMPACTO DA APLICAÇÃO CEGA DO PR #4

Caso o PR #4 fosse aplicado sem resolução manual:
- ❌ **Perda da Grade Bicolunar:** Assinaturas seriam renderizadas em lista vertical única, consumindo desnecessariamente 4 a 6 páginas de papel sulfite em alinhamentos coletivos.
- ❌ **Quebra da Numeração de Páginas:** Os rodapés exibiriam `Página 1` e `Página 2` sem a menção do totalizador de integridade documental.
- ❌ **Violação das Regras de Homologação P0:** Reversão para textos que assumem pactuações inexistentes.

---

## 4. DIRETRIZES DE CONCILIAÇÃO PARA A MATRIX (LUNA CLI)

1. **Rejeitar ou Fechar o PR #4 como `superseded`:**
   - Registrar no PR #4 que as correções de paginação foram incorporadas e expandidas pelo commit `6362f050` e complementadas na Etapa 9.1.6.2.
2. **Preservar `src/utils/pdfGenerator.ts` Integralmente:**
   - O arquivo atual é a referência canônica do frontend para geração de relatórios A4 client-side em alta definição.
3. **Plano de Evolução para o Backend FastAPI:**
   - Caso no futuro a geração de PDF passe para o backend (ex.: via `WeasyPrint` ou `ReportLab`), a Matrix deve utilizar os modelos de dados e layout definidos neste arquivo como especificação funcional de referência.
   - O backend deverá receber os mesmos parâmetros tipados de `FormalAlignment` e `ManagerialFeedback` descritos em `src/types/index.ts`.

---

## 5. CONCLUSÃO TÉCNICA

A implementação em `src/utils/pdfGenerator.ts` atende com rigor técnico aos requisitos de:
- Integridade gráfica A4 (210 x 297 mm, margem 14mm, área útil 182mm).
- Paginação progressiva sem limites artificiais de participantes.
- Isenção de falsas assinaturas eletrônicas.
- Rastreabilidade arquivística institucional para o Hospital HEAL.

**Recomendação Final:** Manter a versão atual e prosseguir com a homologação funcional dos templates.
