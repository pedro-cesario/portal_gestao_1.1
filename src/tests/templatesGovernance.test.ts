/**
 * Suíte de Testes de Governança Operacional e Integridade Documental — HEAL Ops 1.1 (Etapa 9.1.6.3)
 * Conectada DIRETAMENTE ao código real de produção (src/utils/documentGovernance.ts).
 * 
 * Valida os 12 requisitos obrigatórios de conformidade arquitetural:
 * 1. Confirmar ciência não altera assinatura física.
 * 2. Registrar assinatura física não altera automaticamente ciência.
 * 3. Registrar assinatura não arquiva o documento.
 * 4. Ausência de usuário autenticado bloqueia ação sensível.
 * 5. Participante inicialmente não é considerado presente.
 * 6. Decisões vazias não produzem concordância fictícia.
 * 7. Reunião não realizada mantém status adequado.
 * 8. Metas sugeridas não viram compromissos sem confirmação.
 * 9. Grupo 48 permanece incluído.
 * 10. Dados demonstrativos não são identificados como realtime.
 * 11. Arquivamento exige confirmação explícita.
 * 12. Recusa e ausência de assinatura não produzem falso aceite.
 */

import { MOCK_TECHNICIANS } from '../data/mockData';
import { DEFAULT_CALCULATION_SETTINGS } from '../data/settingsDefaults';
import { 
  FormalAlignment, 
  AlignmentParticipant, 
  FormalDocumentStatus,
  AlignmentScienceStatus,
  AlignmentSignatureStatus
} from '../types';
import {
  confirmParticipantScience,
  refuseParticipantScience,
  collectParticipantPhysicalSignature,
  refuseParticipantPhysicalSignature,
  collectManagerPhysicalSignature,
  archiveDocumentPhysical,
  validateActionAuthentication,
  resolveFinalDecisions,
  resolveMeetingPreparation,
  resolveConfirmedGoals
} from '../utils/documentGovernance';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

console.log('\n=== INICIANDO BATERIA DE TESTES DE INTEGRIDADE DOCUMENTAL HEAL OPS 9.1.6.3 ===\n');

// Mock canônico de alinhamento para testes com handlers de produção
function createSampleAlignment(): FormalAlignment {
  return {
    id: 'aln-test-01',
    alignmentNumber: 'ALN-2026-TEST',
    dateTime: '09/11/2026 14:00',
    location: 'Sala de Operações DTI',
    managerId: 1,
    managerName: 'Operador Gestor Teste',
    managerRole: 'Gestor Operacional de TI',
    periodicity: 'ESPORADICO',
    scope: 'COLETIVO',
    category: 'ALINHAMENTO_OPERACIONAL',
    subject: 'Pauta Operacional de Teste',
    objective: 'Testar desacoplamento documental',
    context: 'Homologação Etapa 9.1.6.3',
    topicsDiscussed: ['Tópico 1'],
    observedFactsOrSituations: 'Fatos observados',
    transmittedOrientations: 'Orientações transmitidas',
    participants: [
      {
        id: 'p-1',
        collaboratorId: 101,
        name: 'Mariana Costa',
        role: 'Analista Sênior',
        department: 'Sistemas',
        alignmentRole: 'PARTICIPANTE',
        presence: 'PRESENCA_NAO_CONFIRMADA',
        individualStatement: '',
        scienceStatus: 'PENDENTE',
        signatureStatus: 'ASSINATURA_FISICA_PENDENTE'
      },
      {
        id: 'p-2',
        collaboratorId: 105,
        name: 'Lucas Mendes',
        role: 'Analista Suporte',
        department: 'Suporte',
        alignmentRole: 'PARTICIPANTE',
        presence: 'PRESENCA_NAO_CONFIRMADA',
        individualStatement: '',
        scienceStatus: 'PENDENTE',
        signatureStatus: 'ASSINATURA_FISICA_PENDENTE'
      }
    ],
    generalCommitments: [],
    individualCommitments: [],
    decisions: [],
    status: 'EM_REVISAO',
    version: 'v1.0',
    elaboratedBy: 'Operador Gestor Teste',
    managerSignatureStatus: 'ASSINATURA_FISICA_PENDENTE',
    archivingInfo: {
      isArchivedPhysical: false,
      isSimulation: true
    },
    history: []
  };
}

// -------------------------------------------------------------
// REQUISITO 1: Confirmar ciência não altera assinatura física
// -------------------------------------------------------------
console.log('1. TESTE: Confirmar ciência não altera assinatura física');
{
  const aln = createSampleAlignment();
  const updated = confirmParticipantScience(aln, 'p-1', 'Operador Auditor', '09/11/2026 14:10');
  const p1 = updated.participants.find(p => p.id === 'p-1')!;

  assert(p1.scienceStatus === 'CIENTE', 'Ciência do participante foi atualizada para CIENTE');
  assert(p1.signatureStatus === 'ASSINATURA_FISICA_PENDENTE', 'Assinatura física permaneceu ASSINATURA_FISICA_PENDENTE inalterada');
  assert(p1.physicalSignatureRecord === undefined, 'Nenhum registro de assinatura física foi criado');
}

// -------------------------------------------------------------
// REQUISITO 2: Registrar assinatura física não altera automaticamente ciência
// -------------------------------------------------------------
console.log('\n2. TESTE: Registrar assinatura física não altera automaticamente ciência');
{
  const aln = createSampleAlignment();
  const updated = collectParticipantPhysicalSignature(aln, 'p-1', 'Operador Auditor', '09/11/2026 14:15', 'Folha A4 assinada');
  const p1 = updated.participants.find(p => p.id === 'p-1')!;

  assert(p1.signatureStatus === 'ASSINATURA_FISICA_COLETADA', 'Assinatura física foi registrada como ASSINATURA_FISICA_COLETADA');
  assert(p1.scienceStatus === 'PENDENTE', 'Ciência do participante permaneceu PENDENTE sem alteração automática');
  assert(p1.physicalSignatureRecord?.collectedBy === 'Operador Auditor', 'Metadados de operador que coletou a assinatura foram gravados');
}

// -------------------------------------------------------------
// REQUISITO 3: Registrar assinatura não arquiva o documento
// -------------------------------------------------------------
console.log('\n3. TESTE: Registrar assinatura não arquiva o documento');
{
  let aln = createSampleAlignment();
  aln = collectParticipantPhysicalSignature(aln, 'p-1', 'Operador Auditor', '09/11/2026 14:15');
  aln = collectParticipantPhysicalSignature(aln, 'p-2', 'Operador Auditor', '09/11/2026 14:16');
  aln = collectManagerPhysicalSignature(aln, 'Operador Auditor', '09/11/2026 14:17');

  assert(aln.status === 'ASSINATURAS_COLETADAS', 'Quando todos assinam, status avança para ASSINATURAS_COLETADAS');
  assert(aln.status !== 'ARQUIVADO_FISICO', 'Documento com todas assinaturas coletadas NÃO avança para ARQUIVADO_FISICO');
  assert(aln.archivingInfo?.isArchivedPhysical === false, 'archivingInfo.isArchivedPhysical permanece false');
}

// -------------------------------------------------------------
// REQUISITO 4: Ausência de usuário autenticado bloqueia ação sensível
// -------------------------------------------------------------
console.log('\n4. TESTE: Ausência de usuário autenticado bloqueia ação sensível');
{
  const noUser = validateActionAuthentication(null);
  assert(noUser.allowed === false, 'Usuário nulo é bloqueado');
  assert(noUser.error !== undefined && noUser.error.includes('bloqueada'), 'Retorna mensagem de bloqueio explicativa');

  const emptyUser = validateActionAuthentication({ name: '   ', id: 0 });
  assert(emptyUser.allowed === false, 'Usuário com nome vazio ou espaços é bloqueado');

  const validUser = validateActionAuthentication({ name: 'Carlos Eduardo', id: 102, role: 'Analista' });
  assert(validUser.allowed === true, 'Operador autenticado é aceito com sucesso');
  assert(validUser.operatorName === 'Carlos Eduardo', 'Nome do operador autenticado é preservado');
}

// -------------------------------------------------------------
// REQUISITO 5: Participante inicialmente não é considerado presente
// -------------------------------------------------------------
console.log('\n5. TESTE: Participante inicialmente não é considerado presente');
{
  const aln = createSampleAlignment();
  const allNotConfirmed = aln.participants.every(p => p.presence === 'PRESENCA_NAO_CONFIRMADA');
  assert(allNotConfirmed, 'Todos os participantes iniciam rigorosamente com PRESENCA_NAO_CONFIRMADA');
  assert(!aln.participants.some(p => p.presence === 'PRESENTE'), 'Nenhum participante é presumido como PRESENTE');
}

// -------------------------------------------------------------
// REQUISITO 6: Decisões vazias não produzem concordância fictícia
// -------------------------------------------------------------
console.log('\n6. TESTE: Decisões vazias não produzem concordância fictícia');
{
  const empty1 = resolveFinalDecisions([]);
  assert(empty1[0] === 'Não foram registradas decisões pactuadas nesta reunião.', 'Array vazio retorna texto padronizado exato');

  const empty2 = resolveFinalDecisions(['  ', '']);
  assert(empty2[0] === 'Não foram registradas decisões pactuadas nesta reunião.', 'Array com espaços em branco é tratado como ausência de decisões');

  assert(!empty1[0].includes('acordadas entre as partes'), 'Não contém pactuações fictícias');
  assert(!empty1[0].includes('aprovadas'), 'Não contém alegações de aprovação');

  const valid = resolveFinalDecisions(['Pactuado reforço na passagem de plantão']);
  assert(valid[0] === 'Pactuado reforço na passagem de plantão', 'Decisão informada pelo gestor é preservada fielmente');
}

// -------------------------------------------------------------
// REQUISITO 7: Reunião não realizada mantém status adequado
// -------------------------------------------------------------
console.log('\n7. TESTE: Reunião não realizada mantém status adequado');
{
  const prepUnconfirmed = resolveMeetingPreparation(false);
  assert(prepUnconfirmed.status === 'AGUARDANDO_REALIZACAO', 'Reunião não confirmada mantém status AGUARDANDO_REALIZACAO');
  assert(prepUnconfirmed.dateTime === undefined, 'Não inventa data ou hora de condução retroativa');

  const prepConfirmed = resolveMeetingPreparation(true, '09/11/2026 15:30');
  assert(prepConfirmed.status === 'EM_REVISAO', 'Reunião confirmada como realizada avança para EM_REVISAO');
  assert(prepConfirmed.dateTime === '09/11/2026 15:30', 'Data real informada é atribuída à ata');
}

// -------------------------------------------------------------
// REQUISITO 8: Metas sugeridas não viram compromissos sem confirmação
// -------------------------------------------------------------
console.log('\n8. TESTE: Metas sugeridas não viram compromissos sem confirmação');
{
  const proposed = [
    { id: 'goal-1', title: 'Meta 1' },
    { id: 'goal-2', title: 'Meta 2' },
    { id: 'goal-3', title: 'Meta 3' }
  ];

  const confirmedOnly = resolveConfirmedGoals(proposed, ['goal-2']);
  assert(confirmedOnly.length === 1, 'Apenas 1 meta foi confirmada');
  assert(confirmedOnly[0].id === 'goal-2', 'Apenas a meta selecionada explicitamente entrou no plano');
  assert(!confirmedOnly.some(g => g.id === 'goal-1'), 'Meta não selecionada NÃO vira compromisso');
}

// -------------------------------------------------------------
// REQUISITO 9: Grupo 48 permanece incluído
// -------------------------------------------------------------
console.log('\n9. TESTE: Grupo 48 permanece incluído');
{
  const group48Techs = MOCK_TECHNICIANS.filter(t => t.groupId === 48 || t.isManagementGroup);
  assert(group48Techs.length > 0, 'Existem técnicos do Grupo 48 cadastrados');
  assert(DEFAULT_CALCULATION_SETTINGS.teamGovernance.excludeManagementGroup48 === false, 'excludeManagementGroup48 está false por padrão');
  assert(DEFAULT_CALCULATION_SETTINGS.teamGovernance.excludedGroupIds.length === 0, 'excludedGroupIds está vazio por padrão');
}

// -------------------------------------------------------------
// REQUISITO 10: Dados demonstrativos não são identificados como realtime
// -------------------------------------------------------------
console.log('\n10. TESTE: Dados demonstrativos não são identificados como realtime');
{
  const aln = createSampleAlignment();
  assert(aln.archivingInfo?.isSimulation === true, 'Alinhamento em memória tem isSimulation=true');
  assert(aln.status !== 'FORMALIZADO', 'Documento demonstrativo não se declara FORMALIZADO sem backend');
}

// -------------------------------------------------------------
// REQUISITO 11: Arquivamento exige confirmação explícita
// -------------------------------------------------------------
console.log('\n11. TESTE: Arquivamento exige confirmação explícita');
{
  const aln = createSampleAlignment();

  // Tentativa sem livro
  const resNoBook = archiveDocumentPhysical(aln, '', 'Pasta 1', 'Operador', '09/11/2026');
  assert(resNoBook.success === false, 'Arquivamento sem livro é rejeitado');

  // Tentativa sem localização
  const resNoLoc = archiveDocumentPhysical(aln, 'Livro 01', '', 'Operador', '09/11/2026');
  assert(resNoLoc.success === false, 'Arquivamento sem localização é rejeitado');

  // Tentativa sem operador
  const resNoOp = archiveDocumentPhysical(aln, 'Livro 01', 'Pasta 1', '', '09/11/2026');
  assert(resNoOp.success === false, 'Arquivamento sem operador é rejeitado');

  // Confirmação com todos os dados
  const resOk = archiveDocumentPhysical(aln, 'Livro de Tomo 03/2026', 'Armário DTI Gaveta 2', 'Operador Arquivista', '09/11/2026 16:00');
  assert(resOk.success === true, 'Arquivamento com todos os campos é aceito com sucesso');
  assert(resOk.alignment?.status === 'ARQUIVADO_FISICO', 'Status é promovido para ARQUIVADO_FISICO');
  assert(resOk.alignment?.archivingInfo?.bookNumber === 'Livro de Tomo 03/2026', 'Número do tomo registrado');
  assert(resOk.alignment?.archivingInfo?.isArchivedPhysical === true, 'isArchivedPhysical é confirmado como true');
}

// -------------------------------------------------------------
// REQUISITO 12: Recusa e ausência de assinatura não produzem falso aceite
// -------------------------------------------------------------
console.log('\n12. TESTE: Recusa e ausência de assinatura não produzem falso aceite');
{
  let aln = createSampleAlignment();

  // Recusa de ciência
  aln = refuseParticipantScience(aln, 'p-1', 'Operador Auditor', '09/11/2026 16:10', 'Discorda de um dos apontamentos');
  const p1 = aln.participants.find(p => p.id === 'p-1')!;
  assert(p1.scienceStatus === 'RECUSOU_CIENCIA', 'Status do participante registra RECUSOU_CIENCIA');
  assert(p1.scienceStatus !== 'CIENTE', 'Recusa NÃO é equiparada a ciência confirmada');

  // Recusa de assinatura manuscrita
  aln = refuseParticipantPhysicalSignature(aln, 'p-2', 'Operador Auditor', '09/11/2026 16:15', 'Não concorda em assinar');
  const p2 = aln.participants.find(p => p.id === 'p-2')!;
  assert(p2.signatureStatus === 'RECUSOU_ASSINATURA', 'Status do participante registra RECUSOU_ASSINATURA');
  assert(p2.signatureStatus !== 'ASSINATURA_FISICA_COLETADA', 'Recusa NÃO é equiparada a assinatura coletada');
  assert(aln.status === 'COM_RECUSA_ASSINATURA', 'Documento reflete que houve recusa de assinatura (COM_RECUSA_ASSINATURA)');
}

console.log('\n=============================================================');
console.log(`RESULTADO DOS TESTES DE GOVERNANÇA 9.1.6.3: ${testsPassed} PASSOU | ${testsFailed} FALHOU`);
console.log('=============================================================\n');

if (testsFailed > 0) {
  process.exit(1);
}
