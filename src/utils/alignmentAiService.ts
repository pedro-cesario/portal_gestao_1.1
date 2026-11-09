import { 
  AlignmentAiPreparationInput, 
  AlignmentAiPreparationResult, 
  AlignmentTone, 
  ConversationScriptBlock, 
  ProposedGoalDraft, 
  AlignmentCategory 
} from '../types';
import { MOCK_TECHNICIANS } from '../data/mockData';

export const TONE_CONFIG: Record<AlignmentTone, { label: string; description: string; badgeColor: string }> = {
  EQUILIBRADO_PROFISSIONAL: {
    label: 'Equilibrado e Profissional (Padrão)',
    description: 'Tom formal, ponderado e focado na clareza dos processos operacionais do Hospital HEAL.',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
  },
  ACOLHEDOR: {
    label: 'Mais Acolhedor e Empático',
    description: 'Foco no acolhimento, escuta ativa, reconhecimento de dedicação e segurança psicológica.',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
  },
  DIRETO_ASSERTIVO: {
    label: 'Mais Direto e Assertivo',
    description: 'Foco na correção de desvios, senso de urgência operacional e alinhamento de prazos críticos.',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
  },
  ORIENTADO_DESENVOLVIMENTO: {
    label: 'Orientado ao Desenvolvimento & Carreira',
    description: 'Foco em mentoria técnica, autonomia resolutiva e expansão de competências na equipe.',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
  }
};

export const CATEGORY_LABELS: Record<AlignmentCategory, string> = {
  ORIENTACAO_CONDUTA: 'Orientação de Conduta / Procedimento',
  RECONHECIMENTO: 'Elogio e Reconhecimento Formal',
  ALINHAMENTO_OPERACIONAL: 'Alinhamento Operacional de Rotina',
  PASSAGEM_PLATAOR_ESCALA: 'Passagem de Plantão e Escala',
  AJUSTE_DE_ESCALA: 'Ajuste de Escala Operacional',
  AJUSTE_FERIAS: 'Ajuste de Período de Férias',
  DEFINICAO_PAPEL: 'Definição de Responsabilidades e Papéis',
  ORIENTACAO_TECNICA: 'Orientação Técnica / Documental GLPI',
  FEEDBACK_GERENCIAL: 'Feedback Gerencial Periódico',
  LIVRE: 'Registro Livre / Outros Assuntos',
  ORIENTACAO_CONDUTA_PROCEDIMENTO: 'Orientação de Conduta / Procedimento',
  ELOGIO_RECONHECIMENTO_FORMAL: 'Elogio e Reconhecimento Formal',
  TROCA_DE_PLANTAO: 'Troca de Plantão',
  AJUSTE_PERIODO_FERIAS: 'Ajuste de Período de Férias',
  DEFINICAO_RESPONSABILIDADES: 'Definição de Responsabilidades',
  REGISTRO_LIVRE_OUTROS: 'Registro Livre / Outros'
};

/**
 * Gera preparação estruturada de alinhamento gerencial com base nas anotações do gestor
 * Simulação inteligente no frontend compatível com os contratos previstos pelo backend FastAPI.
 */
export function generateAiAlignmentPreparation(
  input: AlignmentAiPreparationInput,
  managerName: string = 'Henrique Vasconcelos'
): AlignmentAiPreparationResult {
  const selectedTechs = MOCK_TECHNICIANS.filter(t => input.participantIds.includes(t.id));
  const participantsNames = selectedTechs.length > 0 
    ? selectedTechs.map(t => t.name).join(', ')
    : 'Colaborador(es)';

  const primaryName = selectedTechs.length === 1 ? selectedTechs[0].name : 'a equipe';
  const categoryLabel = CATEGORY_LABELS[input.category] || 'Alinhamento Operacional';

  const strengthsClean = input.spontaneousStrengths?.trim() || 'Dedicação ao plantão e disponibilidade operacional.';
  const devPointsClean = input.spontaneousDevPoints?.trim() || 'Aprimoramento do fluxo de registro tempestivo no GLPI.';
  const contextClean = input.spontaneousContext?.trim() || 'Rotina de acompanhamento gerencial periódico da equipe de TI.';
  const objectiveClean = input.primaryObjective?.trim() || `Alinhamento de diretrizes e compromissos operacionais para ${primaryName}.`;

  // Modelagem por tom
  let script: ConversationScriptBlock[] = [];
  let draftGoals: ProposedGoalDraft[] = [];

  const now = new Date();
  const deadlineDate = new Date();
  deadlineDate.setDate(now.getDate() + 30);
  const deadlineStr = deadlineDate.toLocaleDateString('pt-BR');

  if (input.tone === 'ACOLHEDOR') {
    script = [
      {
        stepNumber: 1,
        title: 'Abertura e Acolhimento Humanizado',
        guideline: 'Crie um ambiente seguro, demonstre interesse genuíno pelo bem-estar e esclareça que o alinhamento visa apoiar o crescimento mútuo.',
        suggestedTalkingPoints: [
          `"Olá ${primaryName}, obrigado pelo tempo hoje. Gostaria de entender como tem sido a rotina e como você está se sentindo em relação às demandas recentes."`,
          `"Este momento é para dialogarmos com tranquilidade sobre nossas rotinas e construirmos caminhos que facilitem o seu dia a dia no hospital."`
        ],
        reflectiveQuestions: [
          'Como você avalia a carga e o ritmo dos seus atendimentos nas últimas semanas?',
          'Há algum obstáculo que eu, como gestor, possa remover para facilitar o seu trabalho?'
        ]
      },
      {
        stepNumber: 2,
        title: 'Reconhecimento das Contribuições e Forças',
        guideline: 'Destaque pontos fortes com sinceridade, valorizando o impacto humano e assistencial do colaborador.',
        suggestedTalkingPoints: [
          `"Quero reconhecer seus pontos positivos: ${strengthsClean}"`,
          `"Sua dedicação tem um reflexo direto no cuidado prestado às equipes assistenciais e aos pacientes do HEAL."`
        ]
      },
      {
        stepNumber: 3,
        title: 'Apresentação Cuidada dos Pontos a Desenvolver',
        guideline: 'Apresente os pontos de melhoria com respeito, conectando-os à proteção do próprio colaborador e à qualidade do serviço.',
        suggestedTalkingPoints: [
          `"Percebemos algumas oportunidades que merecem nossa atenção conjunta: ${devPointsClean}"`,
          `"Contextualizando os fatos: ${contextClean}"`,
          `"Nosso objetivo não é apontar culpados, mas entender a raiz dessa situação e garantir que você tenha clareza de como agir."`
        ],
        reflectiveQuestions: [
          'O que você percebe que contribuiu para essa situação acontecer?',
          'De que forma podemos ajustar esse processo para que você se sinta mais amparado?'
        ]
      },
      {
        stepNumber: 4,
        title: 'Expectativas e Diretrizes Institucionais do HEAL',
        guideline: 'Relembre com clareza as diretrizes do Instituto HEAL, sem tom punitivo, enfatizando a importância do padrão assistencial.',
        suggestedTalkingPoints: [
          `"No Instituto HEAL, prezamos pela transparência e pelo cumprimento do POP-TIN-017 como garantia da segurança assistencial."`,
          `"Objetivo central: ${objectiveClean}"`
        ]
      },
      {
        stepNumber: 5,
        title: 'Escuta Ativa e Perguntas Reflexivas',
        guideline: 'Permita que o colaborador fale livremente, ouvindo sem interromper e anotando suas considerações.',
        suggestedTalkingPoints: [
          `"Gostaria muito de ouvir a sua visão sobre tudo isso. O que faz sentido para você e onde você enxerga maior desafio?"`
        ],
        reflectiveQuestions: [
          'Qual é a sua leitura sobre essas orientações?',
          'Que tipo de suporte técnico ou treinamento você gostaria de receber?'
        ]
      },
      {
        stepNumber: 6,
        title: 'Construção Colaborativa de Compromissos',
        guideline: 'Defina compromissos realistas e factíveis, pactuados em conjunto.',
        suggestedTalkingPoints: [
          `"Vamos estruturar dois compromissos práticos para o próximo ciclo de 30 dias."`,
          `"Você concorda que esse prazo e esse critério são viáveis?"`
        ]
      },
      {
        stepNumber: 7,
        title: 'Encerramento Positivo e Próxima Revisão',
        guideline: 'Reforce a confiança profissional, agradeça a disponibilidade e confirme a formalização do documento com data de acompanhamento.',
        suggestedTalkingPoints: [
          `"Agradeço imensamente sua abertura e colaboração, ${primaryName}. Tenho plena confiança no seu potencial de evolução."`,
          `"Vamos formalizar esta ata para o caderno físico de alinhamentos e revisitar esses pontos em 30 dias."`
        ]
      }
    ];

    draftGoals = [
      {
        id: `goal-ai-1`,
        objective: 'Aprimoramento gradual dos registros no GLPI com suporte tutorial',
        target: 'Realização de apontamentos regulares antes do encerramento dos turnos',
        practicalActions: ['Realizar checklist de pendências 15 min antes de encerrar o plantão', 'Acionar a gestão preventiva caso haja sobrecarga'],
        responsible: participantsNames,
        deadline: deadlineStr,
        expectedEvidence: 'Relatório diário de auditoria com conformidade acima de 90%'
      }
    ];

  } else if (input.tone === 'DIRETO_ASSERTIVO') {
    script = [
      {
        stepNumber: 1,
        title: 'Abertura Objetiva e Delimitação da Pauta',
        guideline: 'Vá direto ao ponto com firmeza e cordialidade, indicando o motivo específico do alinhamento formal.',
        suggestedTalkingPoints: [
          `"${primaryName}, convoquei este alinhamento formal para tratarmos diretamente de situações operacionais que exigem correção imediata."`,
          `"Objetivo da reunião: ${objectiveClean}"`
        ]
      },
      {
        stepNumber: 2,
        title: 'Apresentação Objetiva de Fatos e Evidências',
        guideline: 'Apresente fatos concretos, dados de chamados e impactos operacionais sem rodeios.',
        suggestedTalkingPoints: [
          `"Fatos observados no período: ${devPointsClean}"`,
          `"Contexto identificado pela supervisão: ${contextClean}"`,
          `"No ambiente hospitalar, desvios nesses fluxos geram riscos assistenciais e inconformidades no POP-TIN-017."`
        ],
        reflectiveQuestions: [
          'Você tem ciência exata de como esse procedimento deve ser executado conforme o POP-TIN-017?',
          'O que impediu o cumprimento estrito do padrão estabelecido?'
        ]
      },
      {
        stepNumber: 3,
        title: 'Reconhecimento Equilibrado de Competências',
        guideline: 'Reconheça a capacidade técnica para demonstrar que a exigência é proporcional à competência esperada.',
        suggestedTalkingPoints: [
          `"Reconheço que você possui capacidade técnica e domínio nas seguintes frentes: ${strengthsClean}"`,
          `"Justamente por conhecer sua capacidade, a gestão não pode aceitar reincidência nos pontos apontados."`
        ]
      },
      {
        stepNumber: 4,
        title: 'Diretrizes Não-Negociáveis e Limiares HEAL',
        guideline: 'Explicite o padrão institucional não-negociável e as consequências operacionais.',
        suggestedTalkingPoints: [
          `"A partir desta data, o cumprimento do protocolo é mandatório e será acompanhado diariamente."`,
          `"Qualquer impedimento técnico deve ser escalonado formalmente ao gestor antes de expirar o limiar de 24h."`
        ]
      },
      {
        stepNumber: 5,
        title: 'Manifestação e Posicionamento do Colaborador',
        guideline: 'Solicite a manifestação explícita do colaborador sobre seu entendimento e compromisso de correção.',
        suggestedTalkingPoints: [
          `"Gostaria de registrar no documento a sua manifestação formal sobre os fatos apresentados."`
        ],
        reflectiveQuestions: [
          'Você compreende a gravidade do impacto e está de acordo com as ações de correção?'
        ]
      },
      {
        stepNumber: 6,
        title: 'Pactuação de Metas com Prazos e Critérios Rígidos',
        guideline: 'Defina metas com critérios objetivos de sucesso e verificação sistemática.',
        suggestedTalkingPoints: [
          `"Ficam estabelecidas as metas que constarão na ata física assinada por ambos."`
        ]
      },
      {
        stepNumber: 7,
        title: 'Encerramento Formal e Coleta de Assinatura Física',
        guideline: 'Encerre com seriedade institucional, imprimindo o documento para assinatura física manuscrita e arquivamento no livro tomo.',
        suggestedTalkingPoints: [
          `"Este documento será impresso, assinado manuscritamente por ambas as partes e anexado ao livro de alinhamentos da DTI."`,
          `"Nossa próxima checagem formal ocorrerá impreterivelmente na data estipulada."`
        ]
      }
    ];

    draftGoals = [
      {
        id: `goal-ai-1`,
        objective: 'Eliminação imediata de inconformidades operacionais e de registro',
        target: '100% de aderência às diretrizes transmitidas nos próximos plantões',
        practicalActions: ['Seguir rigorosamente o fluxo de apontamento POP-TIN-017', 'Registrar acionamento de terceiro com protocolo obrigatório'],
        responsible: participantsNames,
        deadline: deadlineStr,
        expectedEvidence: 'Auditoria noturna com zero apontamentos de inconformidade confirmada'
      }
    ];

  } else if (input.tone === 'ORIENTADO_DESENVOLVIMENTO') {
    script = [
      {
        stepNumber: 1,
        title: 'Abertura Focada em Evolução e Carreira',
        guideline: 'Enquadre a conversa como uma oportunidade de mentoria técnica e evolução no plano individual.',
        suggestedTalkingPoints: [
          `"${primaryName}, esta reunião foi planejada para avaliarmos seu plano de desenvolvimento individual e traçarmos os próximos passos na equipe."`,
          `"Queremos potencializar seus pontos fortes e preparar você para desafios de maior complexidade técnica."`
        ]
      },
      {
        stepNumber: 2,
        title: 'Mapeamento e Valorização de Competências',
        guideline: 'Destaque o valor estratégico do trabalho realizado e as competências já consolidadas.',
        suggestedTalkingPoints: [
          `"Seus pontos fortes consolidados: ${strengthsClean}"`,
          `"Essa consistência técnica credencia você a assumir maior protagonismo operacional."`
        ]
      },
      {
        stepNumber: 3,
        title: 'Identificação de Alavancas de Crescimento',
        guideline: 'Apresente os pontos a desenvolver como oportunidades de salto de maturidade profissional.',
        suggestedTalkingPoints: [
          `"Para avançar em maturidade, identificamos as seguintes alavancas: ${devPointsClean}"`,
          `"Cenário atual e contexto: ${contextClean}"`
        ],
        reflectiveQuestions: [
          'Quais dessas competências você sente mais interesse em aprofundar?',
          'Como você enxerga a evolução da sua autonomia nos chamados de nível mais crítico?'
        ]
      },
      {
        stepNumber: 4,
        title: 'Alinhamento com as Demandas Futuras da DTI HEAL',
        guideline: 'Conecte o crescimento do colaborador aos projetos estratégicos do Instituto.',
        suggestedTalkingPoints: [
          `"A DTI HEAL está expandindo novas rotinas e precisamos de referências sólidas para conduzir esses avanços."`,
          `"Nosso foco estratégico: ${objectiveClean}"`
        ]
      },
      {
        stepNumber: 5,
        title: 'Plano de Ação e Mentoria Conjunta',
        guideline: 'Construa um plano com ações práticas de estudo, acompanhamento e aplicação no dia a dia.',
        suggestedTalkingPoints: [
          `"Que iniciativas práticas podemos adotar para você praticar essas competências de forma estruturada?"`
        ],
        reflectiveQuestions: [
          'Gostaria de assumir a condução da passagem de plantão ou a homologação de um procedimento técnico?'
        ]
      },
      {
        stepNumber: 6,
        title: 'Metas SMART de Desenvolvimento',
        guideline: 'Defina metas claras que expandam o repertório técnico e a governança documental.',
        suggestedTalkingPoints: [
          `"Vamos fixar duas metas focadas no seu desenvolvimento técnico e metodológico."`
        ]
      },
      {
        stepNumber: 7,
        title: 'Encerramento Motivador e Próxima Revisão',
        guideline: 'Reforce o compromisso da gestão em investir no profissional e agende a data de revisão.',
        suggestedTalkingPoints: [
          `"Estou muito confiante com o seu plano. Conte com meu apoio direto no que for necessário."`,
          `"Revisaremos o progresso dessas metas em 30 dias."`
        ]
      }
    ];

    draftGoals = [
      {
        id: `goal-ai-1`,
        objective: 'Desenvolvimento de autonomia em rotinas de suporte avançado e auditoria',
        target: 'Conduzir com autonomia 100% dos procedimentos da sua área de responsabilidade',
        practicalActions: ['Estudar a documentação técnica da base de conhecimento', 'Disseminar as boas práticas nas reuniões diárias'],
        responsible: participantsNames,
        deadline: deadlineStr,
        expectedEvidence: 'Apresentação de melhoria de processo ou redução de tempo de atendimento'
      }
    ];

  } else {
    // EQUILIBRADO_PROFISSIONAL (Padrão)
    script = [
      {
        stepNumber: 1,
        title: 'Abertura Profissional e Alinhamento de Pauta',
        guideline: 'Apresente com serenidade o motivo do encontro, destacando a rotina de governança e alinhamento contínuo.',
        suggestedTalkingPoints: [
          `"Bom dia / boa tarde, ${primaryName}. Conduzimos este alinhamento formal como parte da governança operacional da DTI."`,
          `"Objetivo da sessão: ${objectiveClean}"`
        ],
        reflectiveQuestions: [
          'Como você avalia o fluxo das demandas no seu turno de trabalho recente?'
        ]
      },
      {
        stepNumber: 2,
        title: 'Reconhecimento Equilibrado de Entregas',
        guideline: 'Reconheça o empenho e as entregas positivas observadas na rotina.',
        suggestedTalkingPoints: [
          `"Quero destacar as contribuições observadas: ${strengthsClean}"`,
          `"Esse esforço tem sido essencial para a continuidade das operações no hospital."`
        ]
      },
      {
        stepNumber: 3,
        title: 'Apresentação Respeitosa dos Pontos de Ajuste',
        guideline: 'Trate com clareza técnica e respeito os pontos de atenção identificados pela gestão.',
        suggestedTalkingPoints: [
          `"Temos alguns pontos específicos que precisamos ajustar: ${devPointsClean}"`,
          `"Contexto observado pela supervisão: ${contextClean}"`,
          `"O objetivo é manter nossa operação segura e aderente às boas práticas do Instituto HEAL."`
        ],
        reflectiveQuestions: [
          'Qual é a sua perspectiva sobre essa situação?',
          'Identifica alguma dificuldade específica no fluxo de atendimento ou nas ferramentas de suporte?'
        ]
      },
      {
        stepNumber: 4,
        title: 'Diretrizes Operacionais e Procedimentais HEAL',
        guideline: 'Explique o padrão de conformidade e o papel de cada técnico no cumprimento dos acordos.',
        suggestedTalkingPoints: [
          `"As diretrizes estabelecem atenção estrita aos prazos, qualidade de apontamento e escalonamento tempestivo."`,
          `"Esses padrões protegem toda a equipe e garantem rastreabilidade em auditorias."`
        ]
      },
      {
        stepNumber: 5,
        title: 'Escuta Ativa e Registro de Manifestação',
        guideline: 'Abra espaço para considerações do participante e registre suas observações no documento.',
        suggestedTalkingPoints: [
          `"Sua manifestação será registrada formalmente nesta ata para que tudo fique claro e acordado."`
        ],
        reflectiveQuestions: [
          'Tem alguma dúvida ou observação que queira incluir nesta ata formal?'
        ]
      },
      {
        stepNumber: 6,
        title: 'Pactuação de Compromissos e Prazos',
        guideline: 'Formalize os compromissos com responsáveis e datas de entrega definidas.',
        suggestedTalkingPoints: [
          `"Registramos os compromissos operacionais a serem seguidos a partir de agora."`
        ]
      },
      {
        stepNumber: 7,
        title: 'Encerramento Formal e Orientações para Assinatura',
        guideline: 'Conclua a sessão, imprima a via em folha A4 para coleta de assinatura manuscrita e arquivamento físico.',
        suggestedTalkingPoints: [
          `"Agradeço a colaboração e transparência durante esta reunião."`,
          `"Vamos imprimir a folha de ata formal para coleta de assinaturas físicas e arquivamento no livro tomo da DTI."`
        ]
      }
    ];

    draftGoals = [
      {
        id: `goal-ai-1`,
        objective: 'Aderência integral às diretrizes e rotinas pactuadas',
        target: 'Cumprimento de 100% dos procedimentos operacionais no período acordado',
        practicalActions: ['Seguir checklist padrão de atendimento', 'Registrar atualizações tempestivas nos chamados'],
        responsible: participantsNames,
        deadline: deadlineStr,
        expectedEvidence: 'Relatórios do sistema sem apontamento de inconformidade'
      }
    ];
  }

  // Se houver compromissos anteriores a resgatar
  if (input.previousCommitmentsToRescue && input.previousCommitmentsToRescue.trim().length > 0) {
    draftGoals.push({
      id: `goal-ai-2`,
      objective: `Acompanhamento de compromisso prévio: ${input.previousCommitmentsToRescue.substring(0, 60)}...`,
      target: 'Evidência concreta de regularização da pendência anterior',
      practicalActions: ['Executar revisão das pendências pendentes', 'Reportar status na próxima reunião'],
      responsible: participantsNames,
      deadline: deadlineStr,
      expectedEvidence: 'Confirmação documental pelo gestor responsável'
    });
  }

  // Minuta preliminar do documento
  const preliminaryDraft = {
    subject: `${categoryLabel} — ${primaryName}`,
    objective: objectiveClean,
    context: contextClean,
    topicsDiscussed: [
      `Abertura e enquadramento institucional da reunião (${TONE_CONFIG[input.tone].label})`,
      `Reconhecimento das contribuições: ${strengthsClean.substring(0, 80)}...`,
      `Tratativa dos pontos de atenção: ${devPointsClean.substring(0, 80)}...`,
      `Pactuação de compromissos operacionais e prazos de acompanhamento`
    ],
    observedFactsOrSituations: `${contextClean} Registros observados: ${devPointsClean}`,
    transmittedOrientations: `A gestão transmitiu as orientações com tom ${TONE_CONFIG[input.tone].label.toLowerCase()}: cumprimento do POP-TIN-017, pontualidade nos apontamentos, transparência nas passagens de plantão e cooperação mútua entre as equipes.`
  };

  return {
    tone: input.tone,
    toneLabel: TONE_CONFIG[input.tone].label,
    generatedAt: `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
    conversationScript: script,
    proposedGoals: draftGoals,
    preliminaryDraft,
    isSimulation: true
  };
}
