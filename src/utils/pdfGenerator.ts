import jsPDF from 'jspdf';
import { FormalAlignment, ManagerialFeedback } from '../types';

/**
 * Utilitário profissional de geração de documentos em formato PDF para
 * Feedbacks Gerenciais e Alinhamentos Formais (Individuais e Coletivos)
 * em conformidade com o padrão institucional HEAL Ops.
 */

// Retorna título formal com base na categoria e escopo
export function getAlignmentDocumentTitle(alignment: FormalAlignment): string {
  switch (alignment.category) {
    case 'RECONHECIMENTO':
      return 'TERMO DE RECONHECIMENTO E ELOGIO FORMAL';
    case 'ORIENTACAO_CONDUTA':
      return 'TERMO DE ORIENTAÇÃO DE CONDUTA E POSTURA';
    case 'ORIENTACAO_TECNICA':
      return 'TERMO DE ALINHAMENTO E ORIENTAÇÃO TÉCNICA';
    case 'PASSAGEM_PLATAOR_ESCALA':
      return 'REGISTRO DE ALINHAMENTO DE ESCALA E COBERTURA';
    case 'ALINHAMENTO_OPERACIONAL':
      return alignment.scope === 'COLETIVO'
        ? 'TERMO DE ALINHAMENTO OPERACIONAL COLETIVO'
        : 'TERMO DE ALINHAMENTO OPERACIONAL INDIVIDUAL';
    case 'DEFINICAO_PAPEL':
      return 'TERMO DE DEFINIÇÃO DE PAPEL E ATRIBUIÇÕES';
    case 'AJUSTE_FERIAS':
      return 'TERMO DE PROGRAMAÇÃO E ALINHAMENTO DE FÉRIAS';
    default:
      return alignment.scope === 'COLETIVO'
        ? 'TERMO DE ALINHAMENTO FORMAL COLETIVO'
        : 'TERMO DE ALINHAMENTO FORMAL INDIVIDUAL';
  }
}

/**
 * Desenha o cabeçalho institucional HEAL no topo de cada página
 */
function drawInstitutionalHeader(doc: jsPDF, documentNumber: string, pageNum: number, totalPages?: number) {
  // Faixa superior azul institucional
  doc.setFillColor(19, 79, 159); // #134F9F
  doc.rect(14, 10, 182, 3, 'F');

  // Cabeçalho institucional
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(19, 79, 159);
  doc.text('INSTITUTO HEAL — GESTÃO HOSPITALAR & SAÚDE ASSISTENCIAL', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Diretoria de Tecnologia da Informação — DTI | Núcleo de Governança Operacional (HEAL Ops)', 14, 22);

  // Número de protocolo à direita
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(`Doc: ${documentNumber}`, 196, 18, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Pág. ${pageNum}${totalPages ? ` de ${totalPages}` : ''}`, 196, 22, { align: 'right' });

  // Linha divisória sutil
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(14, 25, 196, 25);
}

/**
 * Desenha o rodapé institucional com carimbo de autenticidade
 */
function drawInstitutionalFooter(doc: jsPDF, documentNumber: string) {
  const pageHeight = 297;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(14, pageHeight - 15, 196, pageHeight - 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  const authHash = `HEAL-SEC-${documentNumber}-${new Date().getFullYear()}-AUTHENTIC-RECORD`;
  doc.text(`Documento emitido pelo Portal de Gestão Operacional HEAL Ops | Hash: ${authHash}`, 14, pageHeight - 10);
  doc.text(`Via de arquivo e registro formal — Assinatura das partes obrigatória`, 196, pageHeight - 10, { align: 'right' });
}

/**
 * Gera PDF completo para Alinhamento Formal (Individual ou Coletivo)
 */
export function generateAlignmentPDF(alignment: FormalAlignment, download: boolean = true): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = 182;
  let currentY = 32;

  // Página 1
  drawInstitutionalHeader(doc, alignment.alignmentNumber, 1);

  // Título Principal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  const docTitle = getAlignmentDocumentTitle(alignment);
  doc.text(docTitle, pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Assunto: ${alignment.subject}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 7;

  // Box de Metadados da Reunião
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, currentY, contentWidth, 18, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('DATA E HORA:', marginX + 3, currentY + 5);
  doc.text('LOCAL / MEIO:', marginX + 50, currentY + 5);
  doc.text('GESTÃO / CONDUTOR:', marginX + 115, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(alignment.dateTime, marginX + 3, currentY + 10);
  doc.text(alignment.location, marginX + 50, currentY + 10);
  doc.text(`${alignment.managerName} (${alignment.managerRole})`, marginX + 115, currentY + 10);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('ESCOPO:', marginX + 3, currentY + 15);
  doc.text('PERIODICIDADE:', marginX + 50, currentY + 15);
  doc.text('STATUS:', marginX + 115, currentY + 15);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(19, 79, 159);
  doc.text(alignment.scope === 'COLETIVO' ? 'Alinhamento Coletivo' : 'Alinhamento Individual', marginX + 18, currentY + 15);
  doc.text(alignment.periodicity === 'PERIODICO_MENSAL' ? 'Periódico Mensal' : 'Esporádico / Pontual', marginX + 76, currentY + 15);
  doc.text(alignment.status, marginX + 130, currentY + 15);

  currentY += 23;

  // 1. Participantes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(19, 79, 159);
  doc.text('1. PARTICIPANTES DO ALINHAMENTO', marginX, currentY);
  currentY += 4;

  // Tabela de participantes
  doc.setFillColor(241, 245, 249);
  doc.rect(marginX, currentY, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('NOME COMPLETO', marginX + 2, currentY + 4.2);
  doc.text('CARGO / ÁREA', marginX + 65, currentY + 4.2);
  doc.text('PAPEL NO ALINHAMENTO', marginX + 120, currentY + 4.2);
  doc.text('CONDIÇÃO / CIÊNCIA', marginX + 155, currentY + 4.2);
  currentY += 6;

  alignment.participants.forEach((part, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(marginX, currentY, contentWidth, 5.5, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(part.name, marginX + 2, currentY + 3.8);
    doc.text(`${part.role} - ${part.department}`, marginX + 65, currentY + 3.8);
    doc.text(part.alignmentRole, marginX + 120, currentY + 3.8);
    
    const scienceText = part.scienceStatus === 'CIENTE' 
      ? 'Ciente' 
      : part.scienceStatus === 'SOLICITOU_CORRECAO' 
      ? 'Ajuste Solicitado' 
      : 'Pendente de Ciência';
    doc.setTextColor(part.scienceStatus === 'CIENTE' ? 16 : 180, part.scienceStatus === 'CIENTE' ? 149 : 83, part.scienceStatus === 'CIENTE' ? 73 : 9);
    doc.text(scienceText, marginX + 155, currentY + 3.8);
    currentY += 5.5;
  });

  currentY += 4;

  // 2. Contexto e Objetivo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(19, 79, 159);
  doc.text('2. CONTEXTO E OBJETIVO DO ALINHAMENTO', marginX, currentY);
  currentY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  const contextLines = doc.splitTextToSize(`Objetivo: ${alignment.objective}\nContexto: ${alignment.context}`, contentWidth);
  doc.text(contextLines, marginX, currentY);
  currentY += (contextLines.length * 4) + 3;

  // 3. Fatos e Orientações Transmitidas
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(19, 79, 159);
  doc.text('3. SITUAÇÕES OBSERVADAS E ORIENTAÇÕES TRANSMITIDAS', marginX, currentY);
  currentY += 4.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Situações / Fatos Observados:', marginX, currentY);
  currentY += 3.5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  const factsLines = doc.splitTextToSize(alignment.observedFactsOrSituations || 'Sem ocorrências adicionais registradas.', contentWidth);
  doc.text(factsLines, marginX, currentY);
  currentY += (factsLines.length * 4) + 2;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Diretrizes e Orientações Estabelecidas:', marginX, currentY);
  currentY += 3.5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  const orientationLines = doc.splitTextToSize(alignment.transmittedOrientations || 'Orientações orais transmitidas em conformidade com os POPs institucionais.', contentWidth);
  doc.text(orientationLines, marginX, currentY);
  currentY += (orientationLines.length * 4) + 4;

  // 4. Compromissos e Acordos Firmados
  // Verifica se precisa quebrar de página antes da tabela de compromissos
  if (currentY > 210) {
    drawInstitutionalFooter(doc, alignment.alignmentNumber);
    doc.addPage();
    drawInstitutionalHeader(doc, alignment.alignmentNumber, 2);
    currentY = 32;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(19, 79, 159);
  doc.text('4. PLANO DE COMPROMISSOS, AÇÕES E PRAZOS ACORDADOS', marginX, currentY);
  currentY += 4;

  // Cabeçalho da tabela de compromissos
  doc.setFillColor(241, 245, 249);
  doc.rect(marginX, currentY, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('COMPROMISSO / AÇÃO', marginX + 2, currentY + 4.2);
  doc.text('RESPONSÁVEL', marginX + 90, currentY + 4.2);
  doc.text('PRAZO', marginX + 130, currentY + 4.2);
  doc.text('CRITÉRIO DE ÊXITO', marginX + 155, currentY + 4.2);
  currentY += 6;

  const allCommitments = [
    ...alignment.generalCommitments.map(c => ({ ...c, scopeLabel: 'Coletivo' })),
    ...alignment.individualCommitments.map(ic => ({ ...ic.commitment, scopeLabel: ic.participantName }))
  ];

  if (allCommitments.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('Nenhum compromisso pendente registrado neste alinhamento.', marginX + 2, currentY + 4);
    currentY += 6;
  } else {
    allCommitments.forEach((commit, idx) => {
      // checa se cabe no espaço restante
      if (currentY > 260) {
        drawInstitutionalFooter(doc, alignment.alignmentNumber);
        doc.addPage();
        drawInstitutionalHeader(doc, alignment.alignmentNumber, doc.getNumberOfPages());
        currentY = 32;
      }

      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(marginX, currentY, contentWidth, 8, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(15, 23, 42);
      const descLine = commit.description.length > 55 ? commit.description.substring(0, 52) + '...' : commit.description;
      doc.text(descLine, marginX + 2, currentY + 3.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`[${commit.scopeLabel}]`, marginX + 2, currentY + 6.8);

      doc.setTextColor(15, 23, 42);
      doc.text(commit.responsibleName, marginX + 90, currentY + 5);
      doc.text(commit.deadline, marginX + 130, currentY + 5);

      const critLine = commit.successCriteria.length > 20 ? commit.successCriteria.substring(0, 18) + '...' : commit.successCriteria;
      doc.text(critLine, marginX + 155, currentY + 5);

      currentY += 8;
    });
  }

  currentY += 4;

  // 5. Manifestações Individuais (se houver)
  const participantsWithStatements = alignment.participants.filter(p => p.individualStatement && p.individualStatement.trim() !== '');
  if (participantsWithStatements.length > 0) {
    if (currentY > 230) {
      drawInstitutionalFooter(doc, alignment.alignmentNumber);
      doc.addPage();
      drawInstitutionalHeader(doc, alignment.alignmentNumber, doc.getNumberOfPages());
      currentY = 32;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(19, 79, 159);
    doc.text('5. MANIFESTAÇÕES INDIVIDUAIS DOS PARTICIPANTES', marginX, currentY);
    currentY += 4;

    participantsWithStatements.forEach(p => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Manifestação de ${p.name} (${p.role}):`, marginX, currentY);
      currentY += 3.5;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      const stmtLines = doc.splitTextToSize(`"${p.individualStatement}"`, contentWidth - 4);
      doc.text(stmtLines, marginX + 2, currentY);
      currentY += (stmtLines.length * 3.8) + 2;
    });
    currentY += 2;
  }

  interface PDFSigner {
    name: string;
    role: string;
    signed?: boolean;
    signedDate?: string;
  }

  const allSigners: PDFSigner[] = [
    { 
      name: alignment.managerName, 
      role: `${alignment.managerRole} (Condutor / Gestor)`,
      signed: true,
      signedDate: alignment.dateTime.split(' ')[0]
    },
    ...alignment.participants.map(p => ({
      name: p.name,
      role: `${p.role} — ${p.department}`,
      signed: p.signatureStatus !== 'PENDENTE',
      signedDate: p.signatureDate
    }))
  ];

  const signaturesRowCount = Math.ceil(allSigners.length / 2);
  const neededHeightForSignatures = 25 + (signaturesRowCount * 24);

  if (currentY + neededHeightForSignatures > pageHeight - 20) {
    drawInstitutionalFooter(doc, alignment.alignmentNumber);
    doc.addPage();
    drawInstitutionalHeader(doc, alignment.alignmentNumber, doc.getNumberOfPages());
    currentY = 32;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(19, 79, 159);
  doc.text('6. TERMO DE CIÊNCIA E ASSINATURAS', marginX, currentY);
  currentY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const termDisclaimer = 'Declaramos para todos os fins que participamos da reunião de alinhamento acima referenciada, tomamos ciência integral do seu teor, diretrizes transmitidas e assumimos os compromissos nos termos e prazos estabelecidos neste documento formal.';
  const discLines = doc.splitTextToSize(termDisclaimer, contentWidth);
  doc.text(discLines, marginX, currentY);
  currentY += (discLines.length * 3.8) + 8;

  // Desenha os campos de assinatura em pares de 2 por linha
  const colWidth = 85;
  const colGap = 12;

  allSigners.forEach((signer, index) => {
    const isSecondCol = index % 2 === 1;
    const colX = isSecondCol ? marginX + colWidth + colGap : marginX;
    const rowY = currentY + (Math.floor(index / 2) * 22);

    // Linha de assinatura
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.4);
    doc.line(colX, rowY + 10, colX + colWidth, rowY + 10);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(signer.name, colX + (colWidth / 2), rowY + 14, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(signer.role, colX + (colWidth / 2), rowY + 17.5, { align: 'center' });

    if (signer.signed) {
      doc.setTextColor(16, 149, 73);
      doc.setFontSize(6.5);
      doc.text(`[Assinado digitalmente em ${signer.signedDate || 'Arquivo'}]`, colX + (colWidth / 2), rowY + 9, { align: 'center' });
    }
  });

  // Desenha rodapés em todas as páginas criadas
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawInstitutionalHeader(doc, alignment.alignmentNumber, i, totalPages);
    drawInstitutionalFooter(doc, alignment.alignmentNumber);
  }

  if (download) {
    doc.save(`${alignment.alignmentNumber}_${alignment.subject.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  }

  return doc;
}

/**
 * Gera PDF de Feedback Gerencial Individual (TPL-03)
 */
export function generateFeedbackPDF(feedback: ManagerialFeedback, download: boolean = true): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = 182;
  let currentY = 32;

  // Header
  drawInstitutionalHeader(doc, feedback.feedbackNumber, 1);

  // Título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('TERMO DE FEEDBACK E DESENVOLVIMENTO INDIVIDUAL', pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Colaborador: ${feedback.collaboratorName} | Período Avaliado: ${feedback.periodEvaluated}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 7;

  // Box de Metadados
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, currentY, contentWidth, 18, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('COLABORADOR:', marginX + 3, currentY + 5);
  doc.text('CARGO / LOTAÇÃO:', marginX + 70, currentY + 5);
  doc.text('DATA DO FEEDBACK:', marginX + 130, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(feedback.collaboratorName, marginX + 3, currentY + 10);
  doc.text(`${feedback.collaboratorRole} — ${feedback.collaboratorDepartment}`, marginX + 70, currentY + 10);
  doc.text(feedback.feedbackDate, marginX + 130, currentY + 10);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('GESTOR CONDUTOR:', marginX + 3, currentY + 15);
  doc.text('TIPO DE FEEDBACK:', marginX + 70, currentY + 15);
  doc.text('STATUS:', marginX + 130, currentY + 15);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(19, 79, 159);
  doc.text(feedback.managerName, marginX + 33, currentY + 15);
  doc.text(feedback.feedbackType, marginX + 100, currentY + 15);
  doc.text(feedback.status, marginX + 145, currentY + 15);

  currentY += 23;

  // 1. Pontos Fortes e Destaques
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(19, 79, 159);
  doc.text('1. PONTOS FORTES E RECONHECIMENTO OPERACIONAL', marginX, currentY);
  currentY += 4.5;

  feedback.strengths.forEach(str => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(16, 149, 73);
    doc.text(`• ${str.title}`, marginX + 2, currentY);
    currentY += 3.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    const descLines = doc.splitTextToSize(str.description, contentWidth - 6);
    doc.text(descLines, marginX + 5, currentY);
    currentY += (descLines.length * 3.8) + 2;
  });

  currentY += 3;

  // 2. Pontos de Desenvolvimento e Oportunidades
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(19, 79, 159);
  doc.text('2. OPORTUNIDADES DE DESENVOLVIMENTO E PONTOS DE ATENÇÃO', marginX, currentY);
  currentY += 4.5;

  feedback.developmentPoints.forEach(dp => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text(`• ${dp.title}`, marginX + 2, currentY);
    currentY += 3.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    const descLines = doc.splitTextToSize(dp.description, contentWidth - 6);
    doc.text(descLines, marginX + 5, currentY);
    currentY += (descLines.length * 3.8);

    if (dp.operationalImpact) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Impacto Operacional: ${dp.operationalImpact}`, marginX + 5, currentY + 3);
      currentY += 4;
    }
    currentY += 2;
  });

  currentY += 3;

  // 3. Avaliação Gerencial Sintética
  if (currentY > 210) {
    drawInstitutionalFooter(doc, feedback.feedbackNumber);
    doc.addPage();
    drawInstitutionalHeader(doc, feedback.feedbackNumber, 2);
    currentY = 32;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(19, 79, 159);
  doc.text('3. CRITÉRIOS DE AVALIAÇÃO GERENCIAL', marginX, currentY);
  currentY += 4;

  const criteria = [
    { label: 'Colaboração & Espírito de Equipe', value: feedback.managerialEvaluation.collaboration || 'Excelente' },
    { label: 'Comunicação com Usuários & Pares', value: feedback.managerialEvaluation.communication || 'Em evolução' },
    { label: 'Organização & Qualidade Documental', value: feedback.managerialEvaluation.organization || 'Dentro do esperado' },
    { label: 'Postura Profissional & Assiduidade', value: feedback.managerialEvaluation.posture || 'Exemplar' },
    { label: 'Autonomia & Resolução de Problemas', value: feedback.managerialEvaluation.autonomy || 'Adequada' }
  ];

  doc.setFillColor(241, 245, 249);
  doc.rect(marginX, currentY, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('DIMENSÃO AVALIADA', marginX + 3, currentY + 3.8);
  doc.text('AVALIAÇÃO DO GESTOR', marginX + 110, currentY + 3.8);
  currentY += 5.5;

  criteria.forEach((crit, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(marginX, currentY, contentWidth, 5, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(crit.label, marginX + 3, currentY + 3.5);
    doc.text(crit.value, marginX + 110, currentY + 3.5);
    currentY += 5;
  });

  currentY += 5;

  // 4. Metas de Desenvolvimento Pactuadas
  if (currentY > 215) {
    drawInstitutionalFooter(doc, feedback.feedbackNumber);
    doc.addPage();
    drawInstitutionalHeader(doc, feedback.feedbackNumber, doc.getNumberOfPages());
    currentY = 32;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(19, 79, 159);
  doc.text('4. METAS INDIVIDUAIS DE DESENVOLVIMENTO', marginX, currentY);
  currentY += 4;

  feedback.developmentGoals.forEach((goal, idx) => {
    if (currentY > 245) {
      drawInstitutionalFooter(doc, feedback.feedbackNumber);
      doc.addPage();
      drawInstitutionalHeader(doc, feedback.feedbackNumber, doc.getNumberOfPages());
      currentY = 32;
    }

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(marginX, currentY, contentWidth, 14, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(19, 79, 159);
    doc.text(`Meta ${idx + 1}: ${goal.objective}`, marginX + 3, currentY + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`Alvo: ${goal.target} | Prazo: ${goal.deadline} | Status: ${goal.status}`, marginX + 3, currentY + 8);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Evidência Esperada: ${goal.expectedEvidences}`, marginX + 3, currentY + 12);

    currentY += 16;
  });

  currentY += 3;

  // 5. Manifestação do Colaborador
  if (feedback.collaboratorStatement) {
    if (currentY > 230) {
      drawInstitutionalFooter(doc, feedback.feedbackNumber);
      doc.addPage();
      drawInstitutionalHeader(doc, feedback.feedbackNumber, doc.getNumberOfPages());
      currentY = 32;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(19, 79, 159);
    doc.text('5. MANIFESTAÇÃO DO COLABORADOR', marginX, currentY);
    currentY += 4;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    const stmtLines = doc.splitTextToSize(`"${feedback.collaboratorStatement}"`, contentWidth);
    doc.text(stmtLines, marginX, currentY);
    currentY += (stmtLines.length * 3.8) + 4;
  }

  // 6. Bloco de Assinaturas
  if (currentY + 45 > pageHeight - 20) {
    drawInstitutionalFooter(doc, feedback.feedbackNumber);
    doc.addPage();
    drawInstitutionalHeader(doc, feedback.feedbackNumber, doc.getNumberOfPages());
    currentY = 32;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(19, 79, 159);
  doc.text('6. TERMO DE CIÊNCIA E ASSINATURAS', marginX, currentY);
  currentY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const termDisclaimer = 'O colaborador declara ter participado da reunião de feedback, recebido as orientações de desenvolvimento e acordado o plano de metas acima descrito.';
  doc.text(termDisclaimer, marginX, currentY);
  currentY += 12;

  // Assinatura Gestor e Colaborador lado a lado
  const colWidth = 85;
  const colGap = 12;

  // Gestor
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(marginX, currentY + 10, marginX + colWidth, currentY + 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(feedback.managerName, marginX + (colWidth / 2), currentY + 14, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`${feedback.managerRole} — Gestor Imediato`, marginX + (colWidth / 2), currentY + 17.5, { align: 'center' });

  // Colaborador
  const col2X = marginX + colWidth + colGap;
  doc.line(col2X, currentY + 10, col2X + colWidth, currentY + 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(feedback.collaboratorName, col2X + (colWidth / 2), currentY + 14, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`${feedback.collaboratorRole} — Colaborador`, col2X + (colWidth / 2), currentY + 17.5, { align: 'center' });

  if (feedback.collaboratorSignedScience) {
    doc.setTextColor(16, 149, 73);
    doc.setFontSize(6.5);
    doc.text(`[Ciência confirmada em ${feedback.collaboratorSignedScienceAt || 'Data do Feedback'}]`, col2X + (colWidth / 2), currentY + 9, { align: 'center' });
  }

  // Desenha rodapés em todas as páginas criadas
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawInstitutionalHeader(doc, feedback.feedbackNumber, i, totalPages);
    drawInstitutionalFooter(doc, feedback.feedbackNumber);
  }

  if (download) {
    doc.save(`${feedback.feedbackNumber}_Feedback_${feedback.collaboratorName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  }

  return doc;
}
