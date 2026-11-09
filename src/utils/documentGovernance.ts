/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Módulo Central de Governança Documental e Máquina de Estados
 * Etapa 9.1.6.3: Integridade Documental, Desacoplamento de Ciência e Assinatura,
 * e Bloqueio de Identidades Fictícias.
 */

import {
  FormalAlignment,
  AlignmentParticipant,
  FormalDocumentStatus,
  AlignmentScienceStatus,
  AlignmentSignatureStatus,
  ManagerialFeedback
} from '../types';

export interface AuthValidationResult {
  allowed: boolean;
  error?: string;
  operatorName?: string;
}

/**
 * Valida a presença de operador autenticado antes de qualquer ação sensível.
 * Bloqueia estritamente fallbacks a identidades fictícias.
 */
export function validateActionAuthentication(
  currentUser?: { name: string; id: string | number; role?: string } | null
): AuthValidationResult {
  if (!currentUser || !currentUser.name || !currentUser.name.trim()) {
    return {
      allowed: false,
      error: 'Ação bloqueada: Operação documental sensível requer operador autenticado no sistema. Não são permitidas identidades fictícias ou anônimas.'
    };
  }
  return {
    allowed: true,
    operatorName: currentUser.name.trim()
  };
}

/**
 * Confirma exclusivamente a CIÊNCIA de um participante.
 * REGRA P0: Atualiza apenas o estado de ciência.
 * NÃO altera assinatura física.
 * NÃO gera comprovante de assinatura.
 * NÃO afirma concordância com o conteúdo ou arquivamento.
 */
export function confirmParticipantScience(
  alignment: FormalAlignment,
  participantId: string | number,
  operatorName: string,
  date: string,
  notes?: string
): FormalAlignment {
  const updatedParticipants = alignment.participants.map(p => {
    if (p.id === participantId) {
      return {
        ...p,
        scienceStatus: 'CIENTE' as AlignmentScienceStatus,
        scienceDate: date
      };
    }
    return p;
  });

  const participant = alignment.participants.find(p => p.id === participantId);
  const pName = participant?.name || `Participante ${participantId}`;

  return {
    ...alignment,
    participants: updatedParticipants,
    history: [
      ...alignment.history,
      {
        timestamp: date,
        author: operatorName,
        action: `Ciência formal registrada para ${pName}`,
        note: notes || 'Declaração de ciência de conteúdo sem presunção de assinatura ou arquivamento.'
      }
    ]
  };
}

/**
 * Registra formalmente a RECUSA de ciência por parte do participante.
 */
export function refuseParticipantScience(
  alignment: FormalAlignment,
  participantId: string | number,
  operatorName: string,
  date: string,
  justification: string
): FormalAlignment {
  const updatedParticipants = alignment.participants.map(p => {
    if (p.id === participantId) {
      return {
        ...p,
        scienceStatus: 'RECUSOU_CIENCIA' as AlignmentScienceStatus,
        scienceDate: date
      };
    }
    return p;
  });

  const participant = alignment.participants.find(p => p.id === participantId);
  const pName = participant?.name || `Participante ${participantId}`;

  return {
    ...alignment,
    participants: updatedParticipants,
    history: [
      ...alignment.history,
      {
        timestamp: date,
        author: operatorName,
        action: `Recusa de ciência manifestada por ${pName}`,
        note: `Justificativa registrada: ${justification}`
      }
    ]
  };
}

/**
 * Registra a coleta de ASSINATURA MANUSCRITA física na folha A4.
 * REGRA P0: Exige confirmação explícita de assinatura da folha física.
 * Atualiza apenas o estado de assinatura e seus metadados.
 * NÃO altera automaticamente o estado de ciência.
 * NÃO cria assinatura eletrônica fictícia.
 * NÃO considera documento arquivado.
 */
export function collectParticipantPhysicalSignature(
  alignment: FormalAlignment,
  participantId: string | number,
  operatorName: string,
  date: string,
  evidenceNote?: string
): FormalAlignment {
  const updatedParticipants = alignment.participants.map(p => {
    if (p.id === participantId) {
      return {
        ...p,
        // Mantém scienceStatus original inalterado
        signatureStatus: 'ASSINATURA_FISICA_COLETADA' as AlignmentSignatureStatus,
        signatureDate: date,
        physicalSignatureRecord: {
          participantId: p.id,
          participantName: p.name,
          collectedBy: operatorName,
          collectedAt: date,
          evidenceNote: evidenceNote || 'Assinatura física manuscrita coletada na via impressa A4.',
          isSimulation: true
        }
      };
    }
    return p;
  });

  const participant = alignment.participants.find(p => p.id === participantId);
  const pName = participant?.name || `Participante ${participantId}`;

  // Máquina de estados documental
  const allParticipantsSigned = updatedParticipants.every(
    p => p.signatureStatus === 'ASSINATURA_FISICA_COLETADA' || p.signatureStatus === 'ASSINADO_FISICO'
  );
  const managerSigned =
    alignment.managerSignatureStatus === 'ASSINATURA_FISICA_COLETADA' ||
    alignment.managerSignatureStatus === 'ASSINADO_FISICO';

  let nextStatus: FormalDocumentStatus = alignment.status;
  if (alignment.status !== 'ARQUIVADO_FISICO') {
    if (allParticipantsSigned && managerSigned) {
      nextStatus = 'ASSINATURAS_COLETADAS';
    } else {
      nextStatus = 'PARCIALMENTE_ASSINADO';
    }
  }

  return {
    ...alignment,
    participants: updatedParticipants,
    status: nextStatus,
    history: [
      ...alignment.history,
      {
        timestamp: date,
        author: operatorName,
        action: `Assinatura física coletada para ${pName}`,
        note: evidenceNote || 'Aposição de firma manuscrita confirmada pelo operador na folha A4.'
      }
    ]
  };
}

/**
 * Registra formalmente a RECUSA de assinatura manuscrita.
 */
export function refuseParticipantPhysicalSignature(
  alignment: FormalAlignment,
  participantId: string | number,
  operatorName: string,
  date: string,
  justification: string
): FormalAlignment {
  const updatedParticipants = alignment.participants.map(p => {
    if (p.id === participantId) {
      return {
        ...p,
        signatureStatus: 'RECUSOU_ASSINATURA' as AlignmentSignatureStatus,
        signatureDate: date,
        physicalSignatureRecord: {
          participantId: p.id,
          participantName: p.name,
          collectedBy: operatorName,
          collectedAt: date,
          evidenceNote: `Recusa formal: ${justification}`,
          isSimulation: true
        }
      };
    }
    return p;
  });

  const participant = alignment.participants.find(p => p.id === participantId);
  const pName = participant?.name || `Participante ${participantId}`;

  const nextStatus: FormalDocumentStatus =
    alignment.status === 'ARQUIVADO_FISICO' ? 'ARQUIVADO_FISICO' : 'COM_RECUSA_ASSINATURA';

  return {
    ...alignment,
    participants: updatedParticipants,
    status: nextStatus,
    history: [
      ...alignment.history,
      {
        timestamp: date,
        author: operatorName,
        action: `Recusa de assinatura manuscrita registrada para ${pName}`,
        note: justification
      }
    ]
  };
}

/**
 * Registra a assinatura física manuscrita do gestor/condutor.
 * NÃO altera ciência e NÃO arquiva o documento.
 */
export function collectManagerPhysicalSignature(
  alignment: FormalAlignment,
  operatorName: string,
  date: string
): FormalAlignment {
  const allParticipantsSigned = alignment.participants.every(
    p => p.signatureStatus === 'ASSINATURA_FISICA_COLETADA' || p.signatureStatus === 'ASSINADO_FISICO'
  );

  let nextStatus: FormalDocumentStatus = alignment.status;
  if (alignment.status !== 'ARQUIVADO_FISICO') {
    if (allParticipantsSigned) {
      nextStatus = 'ASSINATURAS_COLETADAS';
    } else {
      nextStatus = 'PARCIALMENTE_ASSINADO';
    }
  }

  return {
    ...alignment,
    managerSignatureStatus: 'ASSINATURA_FISICA_COLETADA',
    managerSignatureDate: date,
    status: nextStatus,
    history: [
      ...alignment.history,
      {
        timestamp: date,
        author: operatorName,
        action: `Assinatura física do gestor/condutor (${alignment.managerName}) registrada`,
        note: 'Coleta física manuscrita conferida em via A4.'
      }
    ]
  };
}

/**
 * Registra o ARQUIVAMENTO FÍSICO institucional.
 * REGRA P0: Exige ação própria com livro, localização e operador.
 * NÃO pode ser inferido por coleta de assinaturas ou impressão de PDF.
 */
export function archiveDocumentPhysical(
  alignment: FormalAlignment,
  bookNumber: string,
  physicalLocation: string,
  operatorName: string,
  date: string
): { success: boolean; alignment?: FormalAlignment; error?: string } {
  if (!bookNumber || !bookNumber.trim()) {
    return { success: false, error: 'O número/tomo do livro de arquivo físico é obrigatório.' };
  }
  if (!physicalLocation || !physicalLocation.trim()) {
    return { success: false, error: 'A localização física (armário/pasta) é obrigatória.' };
  }
  if (!operatorName || !operatorName.trim()) {
    return { success: false, error: 'O operador responsável pelo arquivamento é obrigatório.' };
  }

  const updatedAlignment: FormalAlignment = {
    ...alignment,
    status: 'ARQUIVADO_FISICO',
    archivingInfo: {
      isArchivedPhysical: true,
      bookNumber: bookNumber.trim(),
      physicalLocation: physicalLocation.trim(),
      registeredBy: operatorName.trim(),
      archivedAt: date,
      isSimulation: true
    },
    history: [
      ...alignment.history,
      {
        timestamp: date,
        author: operatorName.trim(),
        action: `Arquivamento físico registrado: ${bookNumber.trim()} (${physicalLocation.trim()})`,
        note: 'Documento original manuscrito guardado no arquivo físico da DTI.'
      }
    ]
  };

  return { success: true, alignment: updatedAlignment };
}

/**
 * Resolução estrita de decisões finais:
 * Se não houver decisões preenchidas, emite o texto legal obrigatório sem presumir pactuação.
 */
export function resolveFinalDecisions(decisions?: string[] | null): string[] {
  if (!decisions || decisions.length === 0) {
    return ['Não foram registradas decisões pactuadas nesta reunião.'];
  }
  const clean = decisions.map(d => d.trim()).filter(d => d.length > 0);
  if (clean.length === 0) {
    return ['Não foram registradas decisões pactuadas nesta reunião.'];
  }
  return clean;
}

/**
 * Resolução de estado de preparação e realização de reunião:
 * Se a reunião não foi confirmada pelo gestor humano como realizada,
 * o status é AGUARDANDO_REALIZACAO e não inventa data/hora.
 */
export function resolveMeetingPreparation(
  isConfirmedConducted: boolean,
  inputDateTime?: string
): { status: FormalDocumentStatus; dateTime?: string } {
  if (!isConfirmedConducted) {
    return {
      status: 'AGUARDANDO_REALIZACAO',
      dateTime: undefined
    };
  }
  return {
    status: 'EM_REVISAO',
    dateTime: inputDateTime
  };
}

/**
 * Resolução de metas de IA:
 * Somente metas explicitamente confirmadas pelo gestor integram o plano final.
 */
export function resolveConfirmedGoals<T extends { id: string }>(
  allGoals: T[],
  confirmedIds: string[]
): T[] {
  return allGoals.filter(g => confirmedIds.includes(g.id));
}
