/* =====================================================================
   CONTEÚDO DA APRESENTAÇÃO — SEGANTINI PSICOLOGIA EMPRESARIAL
   ---------------------------------------------------------------------
   Este é o ÚNICO arquivo que precisa ser editado para atualizar textos,
   desafios, soluções, depoimentos e contato. Não é preciso mexer no
   restante do código.

   Fonte de todo o conteúdo: apresentação institucional "Pessoas
   estruturadas, negócio que cresce" (Proposta Comercial 2026) e prints
   de avaliações do Google enviados pela Segantini.

   Regras ao editar:
   - Mantenha as aspas e vírgulas (é JavaScript).
   - Os "id" de desafios e soluções são usados na planilha: evite trocá-los
     depois que a apresentação estiver em uso (troque só os textos).
   ===================================================================== */

window.SEGANTINI = {
  /* ---------------- CONTATO ---------------- */
  contato: {
    // Número no formato internacional, só dígitos (55 + DDD + número).
    // Fonte: slide "Vamos começar?" do PDF — (84) 99610-8749.
    whatsapp: "5584996108749",
    whatsappExibicao: "(84) 99610-8749",
    email: "comercial@segantiniconsultoria.com",
    site: "https://segantiniconsultoria.com",
    siteExibicao: "segantiniconsultoria.com",
  },

  /* ---------------- ETAPA 1 — CONHEÇA A SEGANTINI ---------------- */
  abertura: {
    selo: "Psicologia Empresarial",
    titulo: "Pessoas estruturadas,",
    tituloDestaque: "negócio que cresce.",
    subtitulo:
      "Gestão de pessoas como decisão estratégica — com método, dados e acompanhamento próximo.",
    quemSomos:
      "Fundada por psicólogas potiguares, a Segantini conecta saúde organizacional e resultado: acreditamos que um não existe sem o outro.",
    fundadora: {
      nome: "Letícia Segantini",
      cargo: "Fundadora e CEO",
      bio: "Especialista em Psicologia Organizacional e Gestão de Pessoas (PUC/RS). Mentorada pela G4 Educação e Cultura na Prática.",
      foto: "assets/leticia-segantini.jpg",
    },
    pilares: [
      { icone: "users", titulo: "Psicólogas organizacionais", texto: "Psicologia aplicada ao dia a dia." },
      { icone: "target", titulo: "RH focado em business", texto: "Pessoas e negócio na mesma conversa." },
      { icone: "trend", titulo: "RH como centro de lucro", texto: "Resultado, não só custo." },
    ],
    manifesto: {
      texto: "Você não precisa só de um RH.",
      destaque: "Você precisa de alguém que entenda de pessoas segurando na sua mão para tomar a decisão junto com você.",
    },
    naoSomos: [
      { titulo: "Não somos uma fábrica de documentos", texto: "Material pronto que fica esquecido na gaveta." },
      { titulo: "Não fazemos treinamentos genéricos", texto: "Treinamento que não é aplicado na prática." },
      { titulo: "Não somos um RH à distância", texto: "Aparecer só na reunião de entrega não resolve." },
    ],
    naoSomosFechamento: "Gestão de pessoas se constrói com proximidade.",
  },

  /* ---------------- INDICADORES (usados nas etapas 1 e 4) ---------------- */
  indicadores: [
    { valor: "+150", rotulo: "empresas atendidas em diversos segmentos" },
    { valor: "9,8", rotulo: "nota média de recomendação (0 a 10)" },
    { valor: "78%", rotulo: "taxa de recompra" },
    { valor: "8", rotulo: "estados: RN, PB, PE, MG, SP, BA, MA e CE" },
  ],
  indicadorExtra: "NPS na Zona de Excelência há 3 anos",

  /* ---------------- ETAPA 2 — DESAFIOS ----------------
     "solucoes" liga cada desafio às soluções recomendadas (ids abaixo). */
  desafios: [
    { id: "contratar", icone: "repeat", titulo: "Contratar virou gargalo", texto: "A mesma vaga aberta de novo e de novo.", solucoes: ["hunting"] },
    { id: "rotatividade", icone: "door", titulo: "Alta rotatividade", texto: "Gente boa entra, mas não fica.", solucoes: ["hunting", "pulsar", "avaliacao"] },
    { id: "cultura", icone: "puzzle", titulo: "Contratações desalinhadas à cultura", texto: "Discurso diferente da prática.", solucoes: ["hunting", "alicerce"] },
    { id: "sem-rh", icone: "clipboard", titulo: "Sem RH — ou RH só operacional", texto: "Processos de pessoas sem estrutura.", solucoes: ["rhaas", "alicerce"] },
    { id: "cresceu", icone: "layers", titulo: "A empresa cresceu, a gestão não", texto: "Time maior, gerido como se fosse pequeno.", solucoes: ["inteligencia", "alicerce"] },
    { id: "lideranca", icone: "user-check", titulo: "Líderes técnicos, gestão no improviso", texto: "Ótimos executores, pouco preparo para pessoas.", solucoes: ["educacao", "avaliacao"] },
    { id: "comunicacao", icone: "message", titulo: "Comunicação e feedback falhos", texto: "Conflitos e falta de clareza de papéis.", solucoes: ["educacao", "diagnostico"] },
    { id: "salarios", icone: "dollar", titulo: "Cargos e salários caso a caso", texto: "Sem descritivos nem faixas claras.", solucoes: ["cargos"] },
    { id: "indicadores", icone: "chart", titulo: "Decisões sem indicadores", texto: "Gestão de pessoas baseada em percepção.", solucoes: ["inteligencia", "diagnostico", "avaliacao"] },
    { id: "talentos", icone: "award", titulo: "Dificuldade em desenvolver talentos", texto: "Sem avaliação nem plano de carreira.", solucoes: ["avaliacao", "educacao", "cargos"] },
    { id: "saude-mental", icone: "heart", titulo: "Sobrecarga e saúde mental", texto: "Desgaste que pesa na produtividade.", solucoes: ["pulsar", "diagnostico"] },
    { id: "nr01", icone: "shield", titulo: "Adequação à NR-01", texto: "Riscos psicossociais na gestão de riscos.", solucoes: ["diagnostico", "pulsar"] },
    { id: "nao-sei", icone: "search", titulo: "Algo não vai bem, mas não sei onde", texto: "Sintomas aparecem, a causa não.", solucoes: ["diagnostico"] },
  ],

  /* ---------------- ETAPA 3 — SOLUÇÕES ---------------- */
  solucoes: [
    {
      id: "diagnostico", icone: "search", nome: "Diagnóstico Organizacional",
      descricao: "Clima, escutas e NR-01.",
      problema: "Algo não vai bem, mas você não sabe onde — ou precisa se adequar à NR-01.",
      resultado: "Escuta individual, pesquisa de clima e riscos, e um mapa com plano de ação: prioridades claras para a gestão agir.",
    },
    {
      id: "rhaas", icone: "layers", nome: "RH as a Service",
      descricao: "RH terceirizado de ponta a ponta.",
      problema: "Não ter RH estruturado — ou ter um RH só operacional.",
      resultado: "Gestão de pessoas organizada do zero ou reorganizada para crescer, com acompanhamento próximo.",
    },
    {
      id: "alicerce", icone: "compass", nome: "Consultoria Alicerce",
      descricao: "Estruturação completa do RH.",
      problema: "Processos de pessoas sem estrutura e cultura que não sai do discurso.",
      resultado: "Um RH estruturado, com valores traduzidos em rotina.",
    },
    {
      id: "inteligencia", icone: "pulse", nome: "Inteligência de RH",
      descricao: "Estratégia de pessoas para a direção.",
      problema: "A empresa vai crescer e a liderança precisa sair da operação.",
      resultado: "Decisões sobre pessoas baseadas em indicadores, não em percepção.",
    },
    {
      id: "hunting", icone: "target", nome: "Hunting por assinatura",
      descricao: "Vagas simultâneas, taxa só no sucesso. Via Empregahub.",
      problema: "Vagas urgentes, demanda recorrente e ninguém para recrutar.",
      resultado: "Perfil claro, triagem e banco de talentos — você mantém só a decisão final.",
    },
    {
      id: "cargos", icone: "dollar", nome: "Cargos e Remuneração",
      descricao: "PCCS, faixas e descritivos.",
      problema: "Cargos e salários decididos caso a caso.",
      resultado: "Descritivos e faixas salariais claras.",
    },
    {
      id: "avaliacao", icone: "award", nome: "Avaliação de Desempenho",
      descricao: "Nine Box e 360º.",
      problema: "Desempenho avaliado por percepção e talentos sem direção.",
      resultado: "Performance acompanhada com método, base para desenvolver e reter pessoas.",
    },
    {
      id: "educacao", icone: "book", nome: "Educação Corporativa",
      descricao: "Liderança, RH e oratória.",
      problema: "Líderes com dificuldade para lidar com pessoas.",
      resultado: "Líderes com rituais de 1:1, feedback e PDI — no lugar de gestor apagando incêndio.",
    },
    {
      id: "pulsar", icone: "heart", nome: "Pulsar",
      descricao: "Humor, energia e plantão psicológico.",
      problema: "Sobrecarga, desgaste e saúde mental pesando no dia a dia.",
      resultado: "Acompanhamento contínuo do bem-estar da equipe.",
    },
  ],
  ecossistema: "Ao contratar, sua empresa também acessa o ecossistema Segantini: Empregahub, Resllo (recrutamento com IA), Comunidade Segantini e Segantini Lab.",

  /* ---------------- ETAPA 4 — PROVA SOCIAL ----------------
     "destaque: true" aparece no carrossel principal; os demais ficam em
     "Ver todas as avaliações". Textos transcritos dos materiais originais. */
  cases: [
    {
      empresa: "Brasil Embalagens", servico: "Hunting por assinatura",
      desafio: "Muitas posições estratégicas, sem inflar o custo de contratação.",
      numeros: [["+12", "vagas estratégicas fechadas"], ["79%", "de ROI no período"], ["R$ 7.717,60", "de economia vs. avulso"]],
    },
    {
      empresa: "2A Engenharia", servico: "Treinamento",
      desafio: "Produtividade eficiente do time e liderança.",
      numeros: [["10", "NPS da gestão"]],
    },
    {
      empresa: "Agência M3ta", servico: "Liderança humana",
      desafio: "Integrar o time e renovar a energia para novos desafios.",
      numeros: [["100", "NPS dos colaboradores"], ["4,81", "motivação pós-evento (1 a 5)"]],
    },
    {
      empresa: "Rede Mais", servico: "Educação corporativa",
      desafio: "Desenvolver continuamente o time de gestores.",
      numeros: [["3 anos", "de parceria contínua"]],
    },
  ],

  depoimentos: [
    {
      destaque: true, fonte: "Google", estrelas: 5,
      nome: "Marco Nippashi", cargo: "HANEI Consultoria",
      frase: "Redução de saída de funcionários.",
      texto: "A Segantini [atende] a HANEI CONSULTORIA [há] aproximadamente 1 ano e temos tido grandes benefícios como acompanhamento individual do bem-estar dos funcionários, plano de carreira estruturado, plano anual para entender performance, redução de saída de funcionários. Ótimo atendimento.",
    },
    {
      destaque: true, fonte: "Apresentação institucional",
      nome: "Jady Targino", cargo: "Gerente Executivo de DH · Rede Mais",
      frase: "Há 3 anos treinando nossos gestores.",
      texto: "A Segantini treina o nosso time de gestores há 3 anos e a experiência sempre é extremamente positiva!",
    },
    {
      destaque: true, fonte: "Apresentação institucional",
      nome: "Letícia", cargo: "CEO · Agência M3ta",
      frase: "Um verdadeiro recálculo de rota.",
      texto: "Uma experiência transformadora e inesquecível. Sinto que houve um verdadeiro recálculo de rota para o nosso time.",
    },
    {
      destaque: true, fonte: "Apresentação institucional",
      nome: "Hyanna", cargo: "2A Engenharia",
      frase: "Em 9 anos de RH, nunca vi um conteúdo tão rico.",
      texto: "Vocês foram cirúrgicas e necessárias em cada fala. Em 9 anos de carreira dentro de RH, nunca ouvi, nem vi (mesmo nos grandes eventos de RH que já fui) um conteúdo tão rico, uma condução tão natural e de uma qualidade excelente.",
    },
    {
      destaque: true, fonte: "Google", estrelas: 5,
      nome: "Carmem Luiza", cargo: "",
      frase: "Acompanham de perto, escutam e conversam.",
      texto: "Muito cuidadosas e atenciosas para trazer soluções para a empresa. Acompanham de perto, escutam, conversam e sempre trazem apontamentos que melhoram sua visão para o negócio. Recomendo!",
    },
    {
      destaque: true, fonte: "Google", estrelas: 5,
      nome: "Neto AlvesC", cargo: "",
      frase: "Recomendo de olhos fechados!",
      texto: "Minha experiência com a Segantini está sendo maravilhosa! Sou muito bem atendido, sempre com atenção, cuidado e muita dedicação. A equipe me passa muita confiança e está sempre disponível para me ajudar no que preciso. Estou muito satisfeito com todo o suporte e recomendo de olhos fechados!",
    },
    {
      destaque: false, fonte: "Cliente Empregahub (WhatsApp)",
      nome: "Cliente Empregahub", cargo: "Recrutamento",
      frase: "Sensíveis para encontrar a pessoa certa.",
      texto: "Vocês foram maravilhosas e muito sensíveis para encontrar a pessoa certa! Muito obrigada equipe por todo o trabalho!! Agora já sabemos com quem contar para os próximos recrutamentos.",
    },
    {
      destaque: false, fonte: "Google", estrelas: 5,
      nome: "Samara Felipa Dias", cargo: "",
      frase: "Serviço de confiança e qualidade.",
      texto: "Gostei muito do atendimento da Segantini Consultoria! Pessoal atencioso, prestativo e profissional. Recomendo a quem procura um serviço de confiança e qualidade.",
    },
    {
      destaque: false, fonte: "Google", estrelas: 5,
      nome: "Luiz Segantini", cargo: "",
      frase: "Me senti seguro e meu negócio crescendo.",
      texto: "Excelente métodos de acompanhamento e gestão. Estar de olho na principal fonte de energia da empresa (as pessoas) é a parte mais importante de um negócio. Aqui, eu me senti seguro que estava sendo bem cuidado e meu negócio crescendo!",
    },
    {
      destaque: false, fonte: "Google", estrelas: 5,
      nome: "Amanda Medeiros", cargo: "",
      frase: "Uma profissional incrível e competente.",
      texto: "Conheço Letícia desde o ensino médio e é inegável sua dedicação e empenho em tudo que faz. Sempre se destacou como uma mulher forte, determinada e hoje como uma empresária séria e humana. A Segantini Consultoria é apenas uma consequência de tudo que ela é e já provou ao longo da vida! Uma profissional incrível e competente!",
    },
  ],

  clientes: [
    "Dental Med", "EMKO Construtora", "Rede Mais", "2A Engenharia", "Agência M3ta", "Brasil Embalagens",
    "Abreu Imóveis", "Grupo Atlantis", "Lótus Recepções", "Amentoria", "BZV Advogados", "Marcon Construtora",
    "Home Sushi Home", "Centro Vitta", "Just Food", "Kalaz", "Casa Moscou", "O Pico Noronha", "Waza",
    "Loucos por Coxinha", "Nutralim", "Rarus", "Sea Wolf", "My Acessórios", "AGraciosa", "DM Contábil",
    "Seahub Coworking", "Atelier Marina Portela", "Kopenhagen", "Subway", "CDH Diagnóstica", "Fio a Fio",
    "Insight Psicologia", "SCI", "We Lov", "MJOliveira", "Turquesa",
  ],

  /* ---------------- ETAPA 5 — DIAGNÓSTICO ---------------- */
  perguntas: {
    porte: {
      titulo: "Quantos colaboradores sua empresa possui hoje?",
      opcoes: ["Até 10", "De 11 a 30", "De 31 a 60", "De 61 a 100", "Mais de 100"],
    },
    rh: {
      titulo: "Sua empresa possui um RH estruturado?",
      opcoes: [
        "Sim, temos um setor de RH",
        "Temos uma pessoa responsável, mas não um setor estruturado",
        "Não temos uma estrutura de RH",
        "Temos RH terceirizado",
      ],
    },
    desafios: { titulo: "Quais são hoje seus principais desafios na gestão de pessoas?" },
    solucoes: { titulo: "Quais soluções despertaram mais interesse?" },
    melhoria: {
      titulo: "O que sua empresa mais gostaria de melhorar na gestão de pessoas hoje?",
      placeholder: "Opcional — conte em poucas palavras",
    },
  },

  /* ---------------- ETAPA 6 — PRÓXIMO PASSO ---------------- */
  proximosPassos: [
    { titulo: "Escolha do caminho", texto: "Solução e formato ideais para o seu momento." },
    { titulo: "Aceite formal", texto: "Agendamos o briefing com a direção." },
    { titulo: "Início do trabalho", texto: "Primeiro encontro de entendimento e diagnóstico." },
  ],
};
