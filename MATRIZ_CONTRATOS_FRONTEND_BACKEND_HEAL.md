# MATRIZ DE CONTRATOS DE DADOS FRONTEND ↔ BACKEND — HEAL OPS 1.1
## Especificação de Endpoints REST, Modelos Pydantic e Tipos TypeScript
**Instituto HEAL — Diretoria de Tecnologia da Informação (DTI)**  
**Versão:** 1.1.0 (Revisão Etapa 9.1.6.2)  
**Data:** 09/11/2026

---

## 1. PREMISSAS ARQUITETURAIS DE INTEGRAÇÃO

1. **Autenticação:** Baseada em sessão/cookie HTTP-only existente com validação de token CSRF no cabeçalho `X-CSRF-Token`. Não requer Bearer JWT para a conciliação em staging.
2. **Nomenclatura:** O frontend trafega dados em `camelCase`. Os modelos Pydantic no FastAPI devem utilizar `alias_generator = to_camel` e `populate_by_name = True`.
3. **Persistência de Staging:** Referência mantida na base relacional **SQLite V004**.
4. **Classificação dos Endpoints:**
   - `[EC] Existente e confirmado`
   - `[EA] Existente com ajuste necessário`
   - `[CP] Contrato proposto`
   - `[NI] Não implementado`
   - `[DG] Dependente de gate institucional`
   - `[NV] Não verificado no backend`

---

## 2. ENUMS E CICLOS DE VIDA COMPARTILHADOS

```python
from enum import Enum

class TemplateSpecificationStatus(str, Enum):
    RASCUNHO = "RASCUNHO"
    EM_HOMOLOGACAO = "EM_HOMOLOGACAO"
    HOMOLOGADO = "HOMOLOGADO"

class DataOriginStatus(str, Enum):
    DEMONSTRATIVO = "DEMONSTRATIVO"
    SNAPSHOT = "SNAPSHOT"
    REALTIME = "REALTIME"
    INDISPONIVEL = "INDISPONIVEL"

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

class AlignmentPresence(str, Enum):
    PRESENTE = "PRESENTE"
    AUSENTE = "AUSENTE"
    JUSTIFICADO = "JUSTIFICADO"
    PRESENCA_NAO_CONFIRMADA = "PRESENCA_NAO_CONFIRMADA"

class AlignmentScienceStatus(str, Enum):
    PENDENTE = "PENDENTE"
    CIENTE_EM_SESSAO = "CIENTE_EM_SESSAO"
    RECUSOU_CIENCIA = "RECUSOU_CIENCIA"

class AlignmentSignatureStatus(str, Enum):
    ASSINATURA_FISICA_PENDENTE = "ASSINATURA_FISICA_PENDENTE"
    ASSINATURA_FISICA_COLETADA = "ASSINATURA_FISICA_COLETADA"
    RECUSOU_ASSINATURA = "RECUSOU_ASSINATURA"
    DISPENSADA_JUSTIFICADA = "DISPENSADA_JUSTIFICADA"

class FormalDocumentStatus(str, Enum):
    RASCUNHO = "RASCUNHO"
    AGUARDANDO_REALIZACAO = "AGUARDANDO_REALIZACAO"
    EM_REVISAO = "EM_REVISAO"
    FORMALIZADO = "FORMALIZADO"
    AGUARDANDO_ASSINATURAS = "AGUARDANDO_ASSINATURAS"
    ARQUIVADO_FISICO = "ARQUIVADO_FISICO"
    CANCELADO = "CANCELADO"
```

---

## 3. ESPECIFICAÇÃO DETALHADA DE CONTRATOS REST

### 3.1. TPL-01: Acordos e Encaminhamentos da Daily

#### `POST /api/v1/agreements` — [CP] Contrato proposto
* **Request Body (Pydantic):**
```python
class CreateAgreementRequest(BaseModel):
    title: str = Field(..., min_length=5, description="Título claro do acordo")
    type: Literal["decisao", "tarefa", "encaminhamento", "compromisso"]
    responsible_name: str
    responsible_id: Optional[int] = None
    deadline: str
    priority: Literal["P1_CRITICA", "ALTA", "MEDIA", "BAIXA"] = "MEDIA"
    source_meeting_type: Literal["DAILY", "ALINHAMENTO_SEMANAL"]
    meeting_reference_date: str
    notes: Optional[str] = None
    related_ticket_id: Optional[int] = None
```
* **Regra de Validação:** Nenhum acordo pode ser criado com status `CONCLUIDO` diretamente. Status inicial é `AGUARDANDO_CONFIRMACAO` ou `CONFIRMADO`.

---

### 3.2. TPL-02: Planos de Evolução Individual

#### `POST /api/v1/development-plans/{id}/validate` — [CP] Contrato proposto
* **Request Body:**
```python
class ValidateCommitmentRequest(BaseModel):
    validation_status: Literal["CUMPRIDO", "PARCIAL", "NAO_CUMPRIDO"]
    validation_feedback: str = Field(..., min_length=10, description="Parecer descritivo e fundamentado do gestor")
    evidence_verified: bool = Field(True, description="Confirmação de que evidências foram verificadas")
```
* **Regra de Validação:** Requer permissão de perfil `Gestor`. Bloqueia validação sem parecer textual.

---

### 3.3. TPL-03: Feedback e Alinhamentos

#### `POST /api/v1/ai/alignment-preparation` — [CP] Contrato proposto
* **Request Body:**
```python
class AiAlignmentPreparationRequest(BaseModel):
    participant_ids: List[int] = Field(..., min_items=1)
    category: AlignmentCategory
    spontaneous_strengths: Optional[str] = None
    spontaneous_dev_points: Optional[str] = None
    spontaneous_context: Optional[str] = None
    primary_objective: Optional[str] = None
    previous_commitments_to_rescue: Optional[str] = None
    include_glpi_metrics: bool = True
    tone: AlignmentTone = AlignmentTone.EQUILIBRADO_PROFISSIONAL
```
* **Response Body:**
```python
class AiAlignmentPreparationResponse(BaseModel):
    tone: AlignmentTone
    tone_label: str
    generated_at: str
    conversation_script: List[dict] # 7 blocos humanizados
    proposed_goals: List[dict] # sugestões preliminares (NÃO são compromissos pactuados ainda)
    preliminary_draft: dict # minuta preliminar com tópicos
    is_simulation: bool = False
```
* **Regra Mandatória de Segurança:** O retorno deste endpoint NÃO preenche o campo de decisões pós-reunião. As decisões devem permanecer vazias para condução e registro humano posterior.

#### `POST /api/v1/alignments` — [CP] Contrato proposto
* **Request Body:**
```python
class CreateAlignmentDocumentRequest(BaseModel):
    location: str
    scope: Literal["INDIVIDUAL", "COLETIVO"]
    category: AlignmentCategory
    subject: str
    objective: str
    context: str
    observed_facts_or_situations: str
    transmitted_orientations: str
    is_meeting_conducted_confirmed: bool = Field(..., description="Confirmação se a reunião ocorreu")
    conduction_date_time: Optional[str] = None
    participants: List[dict] # lista com presença individual (não presumida)
    confirmed_commitments: List[dict] # apenas metas validadas pelo gestor
    decisions: List[str] # se vazio, backend deve gravar: 'Não foram registradas decisões pactuadas nesta reunião.'
```

#### `POST /api/v1/alignments/{id}/signatures/collect` — [CP] Contrato proposto
* **Request Body:**
```python
class CollectPhysicalSignaturePayload(BaseModel):
    participant_id: Union[str, int]
    operator_name: str
    date_collected: str
    evidence_notes: Optional[str] = None
```
* **Regra de Governança:** O endpoint apenas atesta a coleta manuscrita em folha física. É vedada a simulação de assinatura eletrônica digital sem certificado ICP-Brasil ou SSO formal.

---

### 3.4. TPL-04: Gestão Completa de Projetos

#### `POST /api/v1/projects/tasks/{task_id}/manager-validate` — [CP] Contrato proposto
* **Request Body:**
```python
class ManagerValidateProjectTaskRequest(BaseModel):
    decision: Literal["APROVAR", "SOLICITAR_AJUSTES"]
    feedback_notes: str = Field(..., min_length=5)
```
* **Regra de Transição:**
  - `APROVAR`: Transita a tarefa para `CONCLUIDO`.
  - `SOLICITAR_AJUSTES`: Transita para `AJUSTES_SOLICITADOS` e notifica o responsável.

---

## 4. MATRIZ CONSOLIDADA DE CONTRATOS

| Módulo | Endpoint | Método | Classificação | Status de Homologação |
|:---|:---|:---:|:---:|:---:|
| **TPL-01** | `/api/v1/tickets/open` | `GET` | `[NV]` | `NÃO VERIFICADO NO BACKEND` |
| **TPL-01** | `/api/v1/tickets/stalled-24h` | `GET` | `[NV]` | `NÃO VERIFICADO NO BACKEND` |
| **TPL-01** | `/api/v1/templates/daily/latest` | `GET` | `[CP]` | `ESPECIFICADO NO FRONTEND` |
| **TPL-01** | `/api/v1/agreements` | `POST` | `[CP]` | `ESPECIFICADO NO FRONTEND` |
| **TPL-01** | `/api/v1/agreements/{id}/status` | `PATCH` | `[CP]` | `ESPECIFICADO NO FRONTEND` |
| **TPL-02** | `/api/v1/templates/weekly/summary` | `GET` | `[CP]` | `ESPECIFICADO NO FRONTEND` |
| **TPL-02** | `/api/v1/development-plans` | `GET`/`POST` | `[CP]` | `ESPECIFICADO NO FRONTEND` |
| **TPL-02** | `/api/v1/development-plans/{id}/validate` | `POST` | `[CP]` | `ESPECIFICADO NO FRONTEND` |
| **TPL-03** | `/api/v1/ai/alignment-preparation` | `POST` | `[CP]` | `ESPECIFICADO NO FRONTEND` |
| **TPL-03** | `/api/v1/alignments` | `POST`/`GET` | `[CP]` | `ESPECIFICADO NO FRONTEND` |
| **TPL-03** | `/api/v1/alignments/{id}/signatures/collect` | `POST` | `[CP]` | `ESPECIFICADO NO FRONTEND` |
| **TPL-03** | `/api/v1/alignments/{id}/archive-physical` | `POST` | `[CP]` | `ESPECIFICADO NO FRONTEND` |
| **TPL-04** | `/api/v1/projects/{id}` | `GET` | `[CP]` | `ESPECIFICADO NO FRONTEND` |
| **TPL-04** | `/api/v1/projects/tasks/{id}/progress` | `PATCH` | `[CP]` | `ESPECIFICADO NO FRONTEND` |
| **TPL-04** | `/api/v1/projects/tasks/{id}/submit-validation`| `POST` | `[CP]` | `ESPECIFICADO NO FRONTEND` |
| **TPL-04** | `/api/v1/projects/tasks/{id}/manager-validate` | `POST` | `[CP]` | `ESPECIFICADO NO FRONTEND` |
| **TPL-04** | `/api/v1/projects/gmud-link` | `POST` | `[DG]` | `DEPENDENTE DE GATE INSTITUCIONAL` |
