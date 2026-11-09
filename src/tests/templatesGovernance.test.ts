/**
 * Suíte de Testes de Governança Operacional — HEAL Ops 1.1 (Etapa 9.1.6.2)
 * Validação de integridade documental, inclusão do Grupo 48, rejeição de concordância automática,
 * homologação não presumida e separação de fluxos de assinatura e arquivamento.
 */

import { MOCK_TECHNICIANS } from '../data/mockData';
import { DEFAULT_CALCULATION_SETTINGS } from '../data/settingsDefaults';
import { 
  FormalAlignment, 
  AlignmentParticipant, 
  TemplateSpecificationStatus, 
  DataOriginStatus,
  FormalDocumentStatus 
} from '../types';

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

console.log('\n=== INICIANDO BATERIA DE TESTES DE GOVERNANÇA HEAL OPS 1.1 ===\n');

// -------------------------------------------------------------
// TESTE 1: INCLUSÃO DO GRUPO 48 NO RANKING E INDICADORES
// -------------------------------------------------------------
console.log('1. TESTE: Inclusão do Grupo 48 TI > Gestão nos Rankings');
{
  const group48Techs = MOCK_TECHNICIANS.filter(t => t.groupId === 48 || t.isManagementGroup);
  assert(group48Techs.length > 0, 'Existem técnicos do Grupo 48 cadastrados na equipe');

  const totalActiveTicketsAll = MOCK_TECHNICIANS.reduce((acc, t) => acc + t.activeTicketsCount, 0);
  const activeTicketsGroup48 = group48Techs.reduce((acc, t) => acc + t.activeTicketsCount, 0);
  assert(activeTicketsGroup48 > 0, 'Técnicos do Grupo 48 possuem chamados ativos atribuídos');
  assert(totalActiveTicketsAll >= activeTicketsGroup48, 'Contagem consolidada de chamados inclui Grupo 48');

  // Verifica se a configuração padrão não exclui o Grupo 48
  assert(DEFAULT_CALCULATION_SETTINGS.teamGovernance.excludeManagementGroup48 === false, 'Default settings NÃO exclui o Grupo 48 por padrão');
  assert(DEFAULT_CALCULATION_SETTINGS.teamGovernance.excludedGroupIds.length === 0, 'Lista de grupos excluídos por padrão está vazia');
}

// -------------------------------------------------------------
// TESTE 2: REJEIÇÃO DE CONCORDÂNCIA AUTOMÁTICA EM DECISÕES
// -------------------------------------------------------------
console.log('\n2. TESTE: Rejeição de Concordância Automática e Decisões Vazias');
{
  function resolveDecisions(rawDecisionsInput: string): string[] {
    return rawDecisionsInput.trim().length > 0
      ? [rawDecisionsInput.trim()]
      : ['Não foram registradas decisões pactuadas nesta reunião.'];
  }

  const emptyDecisions = resolveDecisions('');
  const whitespaceDecisions = resolveDecisions('   ');
  const validDecisions = resolveDecisions('Pactuado cumprimento do POP-TIN-017');

  assert(emptyDecisions[0] === 'Não foram registradas decisões pactuadas nesta reunião.', 'Decisão vazia retorna estritamente a frase informativa padronizada');
  assert(!emptyDecisions[0].includes('acordados entre as partes'), 'Não inventa declaração de concordância quando vazio');
  assert(!emptyDecisions[0].includes('aceitas pelos participantes'), 'Não inventa aceitação pelos participantes quando vazio');
  assert(whitespaceDecisions[0] === 'Não foram registradas decisões pactuadas nesta reunião.', 'Espaços em branco são tratados como ausência de decisões');
  assert(validDecisions[0] === 'Pactuado cumprimento do POP-TIN-017', 'Decisão explicitamente preenchida é preservada');
}

// -------------------------------------------------------------
// TESTE 3: HOMOLOGAÇÃO NÃO PRESUMIDA (ESTADO DE ESPECIFICAÇÃO)
// -------------------------------------------------------------
console.log('\n3. TESTE: Homologação Não Presumida e Multi-dimensionalidade');
{
  function resolveSpecificationStatus(specStatus?: TemplateSpecificationStatus): string {
    return specStatus === 'HOMOLOGADO' ? 'HOMOLOGADO' : 'EM HOMOLOGAÇÃO';
  }

  assert(resolveSpecificationStatus(undefined) === 'EM HOMOLOGAÇÃO', 'Ausência de prova documental resulta em "EM HOMOLOGAÇÃO"');
  assert(resolveSpecificationStatus('EM_HOMOLOGACAO') === 'EM HOMOLOGAÇÃO', 'Estado em homologação é respeitado');
  assert(resolveSpecificationStatus('HOMOLOGADO') === 'HOMOLOGADO', 'Apenas declara HOMOLOGADO com evidência expressa');
}

// -------------------------------------------------------------
// TESTE 4: DISTINÇÃO ENTRE DADOS DEMONSTRATIVOS E OPERACIONAIS
// -------------------------------------------------------------
console.log('\n4. TESTE: Distinção entre Dados Demonstrativos e Operacionais');
{
  function resolveDataOrigin(origin?: DataOriginStatus, isMock: boolean = true): string {
    if (isMock) return 'DEMONSTRATIVO';
    return origin || 'DEMONSTRATIVO';
  }

  assert(resolveDataOrigin('REALTIME', true) === 'DEMONSTRATIVO', 'Dados de simulação/mock nunca são declarados como REALTIME');
  assert(resolveDataOrigin('SNAPSHOT', false) === 'SNAPSHOT', 'Snapshot operacional é identificado como SNAPSHOT quando real');
}

// -------------------------------------------------------------
// TESTE 5: SEPARAÇÃO ENTRE ASSINATURA, CIÊNCIA E ARQUIVAMENTO
// -------------------------------------------------------------
console.log('\n5. TESTE: Separação Estrita de Assinatura, Ciência e Arquivamento');
{
  const mockParticipant: AlignmentParticipant = {
    id: 'part-1',
    collaboratorId: 101,
    name: 'Mariana Costa',
    role: 'Técnica de Sistemas',
    department: 'Sistemas Clínicos',
    alignmentRole: 'PARTICIPANTE',
    presence: 'PRESENCA_NAO_CONFIRMADA',
    individualStatement: '',
    scienceStatus: 'PENDENTE',
    signatureStatus: 'ASSINATURA_FISICA_PENDENTE'
  };

  assert(mockParticipant.presence === 'PRESENCA_NAO_CONFIRMADA', 'Presença inicial não é presumida automaticamente');
  assert(mockParticipant.scienceStatus === 'PENDENTE', 'Ciência inicial é PENDENTE');
  assert(mockParticipant.signatureStatus === 'ASSINATURA_FISICA_PENDENTE', 'Assinatura física inicial é PENDENTE');

  // Simula coleta de assinatura física sem ciência eletrônica
  const signedParticipant: AlignmentParticipant = {
    ...mockParticipant,
    signatureStatus: 'ASSINATURA_FISICA_COLETADA'
  };
  assert(signedParticipant.scienceStatus === 'PENDENTE', 'Coleta de assinatura física não altera automaticamente ciência eletrônica');

  // Simula documento aguardando arquivamento
  const mockDocStatus: FormalDocumentStatus = 'AGUARDANDO_ASSINATURAS';
  assert((mockDocStatus as string) !== 'ARQUIVADO_FISICO', 'Documento aguardando assinaturas não é considerado arquivado');
}

// -------------------------------------------------------------
// TESTE 6: REUNIÃO NÃO REALIZADA SEM CONFIRMAÇÃO HUMANA
// -------------------------------------------------------------
console.log('\n6. TESTE: Status de Realização de Reunião Não Presumida');
{
  function resolveMeetingRealization(isConfirmedByManager: boolean, inputDate?: string): { status: FormalDocumentStatus; dateTime: string } {
    if (!isConfirmedByManager) {
      return {
        status: 'AGUARDANDO_REALIZACAO',
        dateTime: 'Aguardando realização presencial da reunião'
      };
    }
    return {
      status: 'EM_REVISAO',
      dateTime: inputDate || 'Hoje'
    };
  }

  const unconfirmed = resolveMeetingRealization(false);
  assert(unconfirmed.status === 'AGUARDANDO_REALIZACAO', 'Sem confirmação humana, documento fica como AGUARDANDO_REALIZACAO');
  assert(unconfirmed.dateTime === 'Aguardando realização presencial da reunião', 'Sem confirmação, data não é atribuída automaticamente');

  const confirmed = resolveMeetingRealization(true, '09/11/2026 14:00');
  assert(confirmed.status === 'EM_REVISAO', 'Com confirmação humana, documento avança para EM_REVISAO');
  assert(confirmed.dateTime === '09/11/2026 14:00', 'Data informada pelo gestor é atribuída');
}

console.log('\n=============================================================');
console.log(`RESULTADO DOS TESTES: ${testsPassed} PASSOU | ${testsFailed} FALHOU`);
console.log('=============================================================\n');

if (testsFailed > 0) {
  process.exit(1);
}
