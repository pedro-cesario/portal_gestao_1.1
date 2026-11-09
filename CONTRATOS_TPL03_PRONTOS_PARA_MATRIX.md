# CONTRATOS TPL-03 — FEEDBACK E ALINHAMENTOS FORMAIS
## ESPECIFICAÇÃO DE DTOs E REGRAS DE CONCILIAÇÃO FASTAPI (MATRIX / LUNA CLI)

**Módulo:** TPL-03 (Feedback e Alinhamentos Formais)  
**Data:** 09/11/2026  
**Ambiente:** Portal de Gestão Operacional HEAL 1.1 (Etapa 9.1.6.3)  
**Backend Alvo:** FastAPI + SQLite V004 (Staging) / MariaDB GLPI (Read-Only)  
**Status dos Contratos:** `[CP] Contrato Proposto` pronto para implementação na Matrix  

---

## 1. REQUISITOS DE INFRAESTRUTURA, SESSÃO E SEGURANÇA

1. **Autenticação:** Baseada exclusivamente em **cookies de sessão HTTP-only e Secure** já existentes.
   - O frontend não manipula credenciais nem chaves secretas.
   - Não utilizar tokens Bearer no header para rotas internas de governança documental.
2. **Proteção CSRF:**
   - Todas as requisições mutativas (`POST`, `PUT`, `PATCH`, `DELETE`) devem enviar o cabeçalho `X-CSRF-Token` correspondente ao cookie `csrf_token`.
3. **Controle de Acesso Baseado em Papéis (RBAC):**
   - Perfil `GESTOR_TI` ou `COORDENADOR_TI`: Permissão para criar minutas, confirmar realização, registrar coletas de assinaturas físicas e arquivar documentos.
   - Perfil `COLABORADOR` / `TECNICO`: Permissão apenas para emitir declaração de ciência individual de seu próprio prontuário (`POST /api/v1/alignments/{id}/participants/{participant_id}/science`).
4. **Isolamento de Staging:**
   - Persistência das tabelas em **SQLite V004**.
   - Integração com GLPI estritamente **read-only** (não altera chamados GLPI a partir deste módulo).

---

## 2. PAYLOADS DE DTO (JSON SCHEMAS)

### 2.1. Payload de Confirmação de Ciência Individual
* **Rota Proposta:** `POST /api/v1/alignments/{alignment_id}/participants/{participant_id}/science`
* **Permissão:** Próprio participante ou Gestor autenticado com justificativa.
* **Regra:** Não altera assinatura física. Não afirma concordância nem arquivamento.

```json
{
  "scienceConfirmed": true,
  "scienceDate": "2026-11-09T14:30:00-03:00",
  "observation": "Ciência do conteúdo da orientação registrada pelo participante.",
  "channel": "PORTAL_WEB"
}
```

**Resposta esperada (`200 OK`):**
```json
{
  "alignmentId": "aln-2026-088",
  "participantId": "p-105",
  "scienceStatus": "CIENTE",
  "scienceDate": "2026-11-09T14:30:00-03:00",
  "signatureStatus": "ASSINATURA_FISICA_PENDENTE"
}
```

---

### 2.2. Payload de Coleta de Assinatura Física Manuscrita
* **Rota Proposta:** `POST /api/v1/alignments/{alignment_id}/participants/{participant_id}/physical-signature`
* **Permissão:** Exclusiva para Gestor/Operador autenticado.
* **Regra:** Requer confirmação expressa de aposição de firma manuscrita em folha A4. Não altera ciência.

```json
{
  "physicalSignatureConfirmed": true,
  "collectedAt": "2026-11-09T15:00:00-03:00",
  "operatorId": 1,
  "operatorName": "Henrique Vasconcelos",
  "evidenceNote": "Assinatura aposta a caneta esferográfica azul na folha impressa A4.",
  "sheetPageNumber": 1
}
```

**Resposta esperada (`200 OK`):**
```json
{
  "alignmentId": "aln-2026-088",
  "participantId": "p-105",
  "signatureStatus": "ASSINATURA_FISICA_COLETADA",
  "signatureDate": "2026-11-09T15:00:00-03:00",
  "documentStatus": "PARCIALMENTE_ASSINADO"
}
```

---

### 2.3. Payload de Recusa Formal (Ciência ou Assinatura)
* **Rota Proposta:** `POST /api/v1/alignments/{alignment_id}/participants/{participant_id}/refusal`
* **Permissão:** Gestor/Operador autenticado.

```json
{
  "refusalType": "ASSINATURA",
  "refusalReason": "Colaborador declarou verbalmente que discorda do prazo fixado para o plano de ação e se recusa a assinar.",
  "recordedAt": "2026-11-09T15:10:00-03:00",
  "operatorId": 1,
  "operatorName": "Henrique Vasconcelos"
}
```

**Resposta esperada (`200 OK`):**
```json
{
  "alignmentId": "aln-2026-088",
  "participantId": "p-105",
  "signatureStatus": "RECUSOU_ASSINATURA",
  "documentStatus": "COM_RECUSA_ASSINATURA"
}
```

---

### 2.4. Payload de Arquivamento Físico Institucional
* **Rota Proposta:** `POST /api/v1/alignments/{alignment_id}/archive-physical`
* **Permissão:** Gestor autenticado.
* **Regra:** Não pode ser invocado automaticamente. Todos os campos são obrigatórios.

```json
{
  "bookNumber": "Livro de Alinhamentos DTI — Tomo 03/2026",
  "physicalLocation": "Arquivo Geral DTI / Armário 102 / Gaveta 04",
  "archivedAt": "2026-11-09T16:00:00-03:00",
  "operatorId": 1,
  "operatorName": "Henrique Vasconcelos",
  "sheetCount": 2,
  "notes": "Via física original arquivada após coleta de todas as assinaturas manuscritas."
}
```

**Resposta esperada (`200 OK`):**
```json
{
  "alignmentId": "aln-2026-088",
  "status": "ARQUIVADO_FISICO",
  "archivingInfo": {
    "isArchivedPhysical": true,
    "bookNumber": "Livro de Alinhamentos DTI — Tomo 03/2026",
    "physicalLocation": "Arquivo Geral DTI / Armário 102 / Gaveta 04",
    "registeredBy": "Henrique Vasconcelos",
    "archivedAt": "2026-11-09T16:00:00-03:00"
  }
}
```

---

## 3. MÁQUINA DE ESTADOS DOCUMENTAIS

### 3.1. Estados Permitidos (`FormalDocumentStatus`)
1. `RASCUNHO_PREPARACAO`: Documento em rascunho inicial antes da reunião.
2. `AGUARDANDO_REALIZACAO`: Reunião pautada mas não confirmada pelo gestor.
3. `EM_REVISAO`: Reunião confirmada como realizada; minuta sob edição.
4. `FORMALIZADO`: Versão final congelada e homologada localmente com protocolo.
5. `PDF_EMITIDO`: Layout A4 gerado para impressão.
6. `AGUARDANDO_ASSINATURAS`: Folha impressa aguardando recolhimento de assinaturas.
7. `PARCIALMENTE_ASSINADO`: Ao menos uma assinatura coletada, mas faltam outras ou a do gestor.
8. `ASSINATURAS_COLETADAS`: 100% dos participantes e o gestor assinaram fisicamente.
9. `COM_RECUSA_ASSINATURA`: Pelo menos um participante recusou formalmente assinar.
10. `ARQUIVADO_FISICO`: Folha física guardada em livro/tomo e armário institucional.
11. `CANCELADO`: Documento tornado sem efeito por decisão gerencial auditada.

### 3.2. Transições Proibidas
* 🚫 **`RASCUNHO_PREPARACAO` $\to$ `ARQUIVADO_FISICO`:** Não é permitido arquivar sem realização e sem registro de firmas.
* 🚫 **`AGUARDANDO_REALIZACAO` $\to$ `FORMALIZADO`:** É proibido formalizar ata sem a confirmação expressa de que a reunião presencial de fato ocorreu.
* 🚫 **Geração de PDF $\to$ `ARQUIVADO_FISICO`:** A emissão de PDF não autoriza transição para arquivado; exige registro específico de livro e tomo.
* 🚫 **Ciência confirmada $\to$ `ASSINATURAS_COLETADAS`:** Ciência individual não supre a assinatura física manuscrita.
* 🚫 **Recusa $\to$ `ASSINATURAS_COLETADAS`:** Recusa nunca pode ser equiparada a aceite.

---

## 4. CAMPOS AUDITÁVEIS E RASTREABILIDADE

Todo documento retornado pela API deve conter o array `history` contendo objetos imutáveis:

```typescript
export interface DocumentHistoryEntry {
  id: string; // UUID v4
  timestamp: string; // ISO 8601
  authorId: number | string;
  authorName: string;
  action: string;
  note?: string;
  ipAddress?: string;
}
```

Nenhuma ação pode sobrescrever o histórico; apenas novas entradas são apensadas (`append-only`).

---

## 5. O QUE DEPENDE DE IMPLEMENTAÇÃO NO FASTAPI (MATRIX)

1. **Criação das Tabelas SQLite V004:**
   - `heal_alignments`
   - `heal_alignment_participants`
   - `heal_alignment_commitments`
   - `heal_alignment_history`
   - `heal_feedbacks`
2. **Endpoints de Escrita:**
   - Implementar os 4 endpoints listados na Seção 2 (`/science`, `/physical-signature`, `/refusal`, `/archive-physical`).
3. **Validação de Permissão RBAC:**
   - Garantir via dependência FastAPI `Depends(require_gestor_role)` que operadores sem privilégio administrativo sejam barrados (`403 Forbidden`).
4. **Verificação de CSRF:**
   - Validar cabeçalho `X-CSRF-Token` em conformidade com as rotas já existentes no backend.
