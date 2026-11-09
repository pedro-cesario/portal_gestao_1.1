# MATRIZ DE CONTRATOS DE DADOS FRONTEND ↔ BACKEND — HEAL OPS 1.1
## Especificação de Endpoints REST, Modelos Pydantic e Tipos TypeScript
**Instituto HEAL — Diretoria de Tecnologia da Informação (DTI)**  
**Versão:** 1.1.0  
**Data:** 09/11/2026

---

## 1. ENUMS E CICLOS DE VIDA COMPARTILHADOS

Os enums definidos no frontend em `src/types/index.ts` mapeiam-se de forma idêntica para enums Python (`StrEnum`) no FastAPI:

### 1.1. Categorias e Tons de Alinhamento
```python
class AlignmentCategory(str, Enum):
    ORIENTACAO_CONDUTA = "ORIENTACAO_CONDUTA"
    RECONHECIMENTO = "RECONHECIMENTO"
    ALINHAMENTO_OPERACIONAL = "ALINHAMENTO_OPERACIONAL"
    PASSAGEM_PLATAOR_ESCALA = "PASSAGEM_PLATAOR_ESCALA"
    AJUSTE_DE_ESCALA = "AJUSTE_DE_ESCALA"
    AJUSTE_FERIAS = "AJUSTE_FERIAS"
    DEFINICAO_PAPEL = "DEFINICAO_PAPEL"
    ORIENTACAO_TECNICA = "ORIENTACAO_TECNICA"
    FEEDBACK_GERENCIAL = "FEEDBACK_GERENCIAL"
    LIVRE = "LIVRE"

class AlignmentTone(str, Enum):
    EQUILIBRADO_PROFISSIONAL = "EQUILIBRADO_PROFISSIONAL"
    ACOLHEDOR = "ACOLHEDOR"
    DIRETO_ASSERTIVO = "DIRETO_ASSERTIVO"
    ORIENTADO_DESENVOLVIMENTO = "ORIENTADO_DESENVOLVIMENTO"
```

### 1.2. Status de Assinatura, Ciência e Ciclo de Vida Documental
```python
class AlignmentScienceStatus(str, Enum):
    PENDENTE = "PENDENTE"
    CIENTE_EM_SESSAO = "CIENTE_EM_SESSAO"
    RECUSOU_CIENCIA = "RECUSOU_CIENCIA"

class AlignmentSignatureStatus(str, Enum):
    ASSINATURA_FISICA_PENDENTE = "ASSINATURA_FISICA_PENDENTE"
    ASSINATURA_FISICA_COLETADA = "ASSINATURA_FISICA_COLETADA"
    DISPENSADA_JUSTIFICADA = "DISPENSADA_JUSTIFICADA"

class FormalDocumentStatus(str, Enum):
    RASCUNHO = "RASCUNHO"
    EM_REVISAO = "EM_REVISAO"
    FORMALIZADO = "FORMALIZADO"
    AGUARDANDO_ASSINATURAS = "AGUARDANDO_ASSINATURAS"
    ARQUIVADO_FISICO = "ARQUIVADO_FISICO"
    CANCELADO = "CANCELADO"

class DevelopmentCommitmentStatus(str, Enum):
    PLANEJADO = "PLANEJADO"
    EM_ANDAMENTO = "EM_ANDAMENTO"
    CUMPRIDO = "CUMPRIDO"
    PARCIAL = "PARCIAL"
    NAO_CUMPRIDO = "NAO_CUMPRIDO"
    CANCELADO = "CANCELADO"

class ProjectTaskStatus(str, Enum):
    NAO_INICIADO = "NAO_INICIADO"
    PLANEJADO = "PLANEJADO"
    EM_ANDAMENTO = "EM_ANDAMENTO"
    BLOQUEADO = "BLOQUEADO"
    AGUARDANDO_VALIDACAO = "AGUARDANDO_VALIDACAO"
    AJUSTES_SOLICITADOS = "AJUSTES_SOLICITADOS"
    CONCLUIDO = "CONCLUIDO"
    CANCELADO = "CANCELADO"
```

---

## 2. ESPECIFICAÇÃO DE ENDPOINTS E CONTRATOS

### 2.1. Módulo TPL-01 & Acordos de Reunião

#### `POST /api/v1/agreements`
* **Descrição:** Registra novo acordo ou encaminhamento formalizado em reunião (Daily ou Semanal).
* **Request Body (Pydantic):**
```python
class CreateAgreementRequest(BaseModel):
    title: str
    type: Literal["decisao", "tarefa", "encaminhamento", "compromisso"]
    responsible: str
    deadline: str
    notes: Optional[str] = None
    source_meeting_type: Literal["DAILY", "ALINHAMENTO_SEMANAL"]
    meeting_reference_date: str
    is_previous_meeting: bool = False
    linked_ticket_ids: List[int] = []
```
* **Response (201 Created):**
```python
class MeetingAgreementResponse(BaseModel):
    agreement_id: str
    title: str
    type: str
    responsible: str
    deadline: str
    status: Literal["RASCUNHO", "AGUARDANDO_CONFIRMACAO", "CONFIRMADO", "EM_ANDAMENTO", "CONCLUIDO", "CANCELADO"]
    notes: Optional[str]
    source_meeting_type: str
    meeting_reference_date: str
    is_previous_meeting: bool
    created_at: str
    created_by: str
    linked_ticket_ids: List[int]
    history: List[dict]
```

#### `PATCH /api/v1/agreements/{agreement_id}/status`
* **Descrição:** Atualiza status de um acordo com auditoria obrigatória.
* **Request Body:**
```python
class UpdateAgreementStatusRequest(BaseModel):
    new_status: str
    note: Optional[str] = None
```
* **Response (200 OK):** `MeetingAgreementResponse`

---

### 2.2. Módulo TPL-02 & Planos de Evolução Individual

#### `POST /api/v1/development-plans`
* **Descrição:** Cria novo compromisso de desenvolvimento individual pactuado com o técnico.
* **Request Body:**
```python
class CreateCommitmentRequest(BaseModel):
    collaborator_id: int
    collaborator_name: str
    development_area: Literal["TECNICA_GLPI", "COMUNICACAO_POSTURA", "PONTUALIDADE_ASSIDUIDADE", "AGILIDADE_SLA", "PROCESSO_POP"]
    context_or_trigger: str
    agreed_goal: str
    practical_actions: List[dict] # { action_text: str, deadline: str }
    deadline: str
    evidence_criteria: str
    source_alignment_id: Optional[str] = None
```

#### `POST /api/v1/development-plans/{commitment_id}/validate`
* **Descrição:** Gestor valida formalmente o cumprimento do compromisso com parecer escrito.
* **Request Body:**
```python
class ValidateCommitmentRequest(BaseModel):
    validation_status: Literal["CUMPRIDO", "PARCIAL", "NAO_CUMPRIDO"]
    validation_feedback: str
```
* **Response (200 OK):** `DevelopmentCommitmentResponse`

---

### 2.3. Módulo TPL-03 — Feedback e Alinhamentos

#### `POST /api/v1/ai/alignment-preparation`
* **Descrição:** Invoca o Agente Gerencial de Redação com IA para estruturar o roteiro e minuta.
* **Request Body:**
```python
class AiAlignmentPreparationRequest(BaseModel):
    participant_ids: List[int]
    category: AlignmentCategory
    spontaneous_strengths: Optional[str] = None
    spontaneous_dev_points: Optional[str] = None
    spontaneous_context: Optional[str] = None
    primary_objective: Optional[str] = None
    previous_commitments_to_rescue: Optional[str] = None
    include_glpi_metrics: bool = True
    tone: AlignmentTone = AlignmentTone.EQUILIBRADO_PROFISSIONAL
```
* **Response (200 OK):**
```python
class AiAlignmentPreparationResponse(BaseModel):
    tone: AlignmentTone
    tone_label: str
    generated_at: str
    conversation_script: List[ConversationScriptBlock]
    proposed_goals: List[ProposedGoalDraft]
    preliminary_draft: PreliminaryDraft
    is_simulation: bool = False
```

#### `POST /api/v1/alignments`
* **Descrição:** Salva ata formal gerando identificador sequencial `ALN-2026-XXXX`.
* **Request Body:**
```python
class CreateFormalAlignmentRequest(BaseModel):
    location: str
    periodicity: Literal["ESPORADICO", "SEMANAL", "QUINZENAL", "MENSAL"]
    scope: Literal["INDIVIDUAL", "COLETIVO"]
    category: AlignmentCategory
    subject: str
    objective: str
    context: str
    topics_discussed: List[str]
    observed_facts_or_situations: str
    transmitted_orientations: str
    participants: List[AlignmentParticipantPayload]
    general_commitments: List[GeneralCommitmentPayload]
    decisions: List[str]
    next_review_date: Optional[str] = None
```

#### `POST /api/v1/alignments/{alignment_id}/signatures/collect`
* **Descrição:** Atesta que o participante assinou fisicamente a folha impressa em papel.
* **Request Body:**
```python
class CollectPhysicalSignatureRequest(BaseModel):
    participant_id: Union[str, int]
    operator_name: str
    date_collected: str
    notes: Optional[str] = None
```
* **Response (200 OK):** Retorna o documento com `signatureStatus: "ASSINATURA_FISICA_COLETADA"` para aquele participante específico.

#### `POST /api/v1/alignments/{alignment_id}/archive-physical`
* **Descrição:** Registra a guarda física do documento impresso no livro e armário da DTI.
* **Request Body:**
```python
class ArchivePhysicalDocumentRequest(BaseModel):
    book_number: str
    physical_location: str
    operator_name: Optional[str] = None
    archive_date: Optional[str] = None
    scanned_pdf_uploaded: Optional[bool] = False
```
* **Response (200 OK):** Retorna o documento com status atualizado para `ARQUIVADO_FISICO`.

---

### 2.4. Módulo TPL-04 — Gestão Completa de Projetos

#### `PATCH /api/v1/projects/tasks/{task_id}/submit-validation`
* **Descrição:** Técnico conclui suas atividades e submete a tarefa para validação gerencial.
* **Request Body:**
```python
class SubmitTaskValidationRequest(BaseModel):
    evidence_note: str
    subtasks_completed: bool
```
* **Transição de Status:** Altera de `EM_ANDAMENTO` para `AGUARDANDO_VALIDACAO`.

#### `PATCH /api/v1/projects/tasks/{task_id}/manager-validate`
* **Descrição:** Gestor homologa a entrega ou solicita ajustes adicionais.
* **Request Body:**
```python
class ManagerValidateTaskRequest(BaseModel):
    decision: Literal["APROVAR", "SOLICITAR_AJUSTES"]
    feedback_notes: str
```
* **Transição de Status:**
  - Se `APROVAR`: transita para `CONCLUIDO` (100% de progresso).
  - Se `SOLICITAR_AJUSTES`: transita para `AJUSTES_SOLICITADOS`.

---

## 3. CÓDIGOS DE ERRO PADRONIZADOS

| Código HTTP | Significado | Tratamento no Frontend |
|:---:|:---|:---|
| `400 Bad Request` | Payload malformado ou campos obrigatórios ausentes | Exibe mensagem explicativa no modal |
| `401 Unauthorized` | Token de autenticação expirado ou ausente | Redireciona para login |
| `403 Forbidden` | Operador sem permissão para ação (ex: técnico tentando validar meta) | Notificação visual de permissão negada |
| `404 Not Found` | Documento, chamado ou colaborador inexistente | Exibe aviso de registro não localizado |
| `409 Conflict` | Documento já arquivado ou ata formalizada com bloqueio de edição | Bloqueia salvamento e sugere criar revisão |
| `422 Unprocessable` | Invalidação semântica de regras hospitalares (ex: meta sem responsável) | Destaca os campos em vermelho |
| `500 Server Error` | Falha interna no serviço ou banco de dados | Notificação de erro sem travar a interface |
