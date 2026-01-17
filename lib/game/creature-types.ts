// Sistema de Criaturas - 8 Tipos Baseados no Folclore Japonês

export enum CreatureType {
  SUBSTITUTOS = 'substitutos',           // Algo voltou no lugar de alguém
  ENTIDADES_CONTATO = 'entidades_contato', // Algo que não pertence à realidade humana
  GHOULS = 'ghouls',                     // Humanos quebrados pela fome ou sobrenatural
  YOKAI_TRADICIONAIS = 'yokai_tradicionais', // Criaturas do folclore reinterpretadas
  YUREI = 'yurei',                       // Mortos que não seguiram adiante
  MONONOKE = 'mononoke',                 // Ressentimento coletivo vira fenômeno
  KAMI_MENORES = 'kami_menores',         // Espíritos locais da natureza
  TSUKUMOGAMI = 'tsukumogami'            // Objetos antigos que despertaram
}

export interface CreatureTypeDefinition {
  id: CreatureType
  name: string
  description: string
  examples: string[]
  triggerConditions: string[]
  manifestationStyles: string[]
  philosophicalThemes: string[]
}

export const CREATURE_TYPES: Record<CreatureType, CreatureTypeDefinition> = {
  [CreatureType.SUBSTITUTOS]: {
    id: CreatureType.SUBSTITUTOS,
    name: "Substitutos / Impostores",
    description: "Algo voltou no lugar de alguém. A pessoa que você conhece pode não ser mais aquela pessoa.",
    examples: [
      "Uma criança que não sorri mais",
      "Um amigo que fala com sotaque estranho",
      "Um familiar que evita espelhos",
      "Uma pessoa que não se lembra de memórias antigas"
    ],
    triggerConditions: [
      "Tragédias familiares não resolvidas",
      "Mortes violentas ou repentinas",
      "Pessoas desaparecidas há muito tempo",
      "Rituais interrompidos ou mal executados"
    ],
    manifestationStyles: [
      "Mudanças sutis no comportamento",
      "Memórias falsas ou esquecidas",
      "Aversão a elementos pessoais",
      "Sonhos compartilhados estranhos"
    ],
    philosophicalThemes: [
      "Identidade perdida",
      "A morte que não chega",
      "O vazio deixado para trás",
      "A impossibilidade do adeus"
    ]
  },

  [CreatureType.ENTIDADES_CONTATO]: {
    id: CreatureType.ENTIDADES_CONTATO,
    name: "Entidades de Contato",
    description: "Algo que não pertence à realidade humana. Uma presença alienígena que não deveria estar aqui.",
    examples: [
      "Sombras que se movem sozinhas",
      "Objetos que aparecem em lugares errados",
      "Vozes em idiomas desconhecidos",
      "Presenças sentidas mas não vistas"
    ],
    triggerConditions: [
      "Experimentos científicos fracassados",
      "Rituais de invocação",
      "Portais acidentais",
      "Tecnologia antiga descoberta"
    ],
    manifestationStyles: [
      "Perturbações tecnológicas",
      "Aparições breves e impossíveis",
      "Mudanças na percepção da realidade",
      "Memórias implantadas"
    ],
    philosophicalThemes: [
      "A realidade como ilusão",
      "O outro lado do véu",
      "A contaminação inevitável",
      "O desconhecido que observa"
    ]
  },

  [CreatureType.GHOULS]: {
    id: CreatureType.GHOULS,
    name: "Ghouls / Devoradores",
    description: "Humanos quebrados pela fome ou pelo sobrenatural. A linha entre predador e vítima se dissolve.",
    examples: [
      "Pessoas com apetite insaciável",
      "Indivíduos que consomem mais do que precisam",
      "Criaturas que devoram não só corpos, mas memórias",
      "Sobreviventes que se tornam monstros"
    ],
    triggerConditions: [
      "Fomes prolongadas",
      "Exposição a energias sobrenaturais",
      "Traumas não processados",
      "Influência de entidades maiores"
    ],
    manifestationStyles: [
      "Mudanças físicas graduais",
      "Comportamentos predatórios",
      "Necessidades que consomem tudo",
      "Transformação em algo diferente"
    ],
    philosophicalThemes: [
      "A fome como essência",
      "A sobrevivência como maldição",
      "O consumo como conexão",
      "A humanidade devorada"
    ]
  },

  [CreatureType.YOKAI_TRADICIONAIS]: {
    id: CreatureType.YOKAI_TRADICIONAIS,
    name: "Yōkai Tradicionais",
    description: "Criaturas do folclore japonês reinterpretadas. Espíritos antigos que moldam o mundo à sua imagem.",
    examples: [
      "Kitsune com intenções misteriosas",
      "Tengu que ensinam lições cruéis",
      "Kappa que fazem barganhas perigosas",
      "Tanuki que confundem realidade e ilusão"
    ],
    triggerConditions: [
      "Perturbação de locais sagrados",
      "Quebra de tradições antigas",
      "Invocações acidentais",
      "Desrespeito aos espíritos locais"
    ],
    manifestationStyles: [
      "Aparições em formas animais",
      "Ilusões e enganos",
      "Poderes sobre elementos naturais",
      "Lições dadas através de sofrimento"
    ],
    philosophicalThemes: [
      "O respeito aos antigos",
      "A natureza como juiz",
      "A tradição como proteção",
      "Os espíritos que nunca partiram"
    ]
  },

  [CreatureType.YUREI]: {
    id: CreatureType.YUREI,
    name: "Yūrei (Espíritos Humanos)",
    description: "Mortos que não seguiram adiante. Almas presas entre mundos, carregando o peso de vidas inacabadas.",
    examples: [
      "Figuras pálidas em branco",
      "Vozes chamando nomes esquecidos",
      "Toques gelados em noites solitárias",
      "Lembranças que não são suas"
    ],
    triggerConditions: [
      "Mortes violentas não vingadas",
      "Promessas não cumpridas",
      "Amores não correspondidos",
      "Vidas interrompidas prematuramente"
    ],
    manifestationStyles: [
      "Aparições etéreas e silenciosas",
      "Perturbações emocionais",
      "Mensagens de arrependimento",
      "Busca por resolução ou vingança"
    ],
    philosophicalThemes: [
      "A morte como pausa",
      "O luto como prisão",
      "As pontas soltas da vida",
      "A impossibilidade do descanso"
    ]
  },

  [CreatureType.MONONOKE]: {
    id: CreatureType.MONONOKE,
    name: "Mononoke (Ressentimento Coletivo)",
    description: "Emoções acumuladas viram fenômeno. O ressentimento de muitos cria uma entidade própria.",
    examples: [
      "Florestas que rejeitam visitantes",
      "Rios que se revoltam contra pontes",
      "Casas que lembram tragédias passadas",
      "Vilarejos com atmosfera opressiva"
    ],
    triggerConditions: [
      "Tragédias comunitárias",
      "Injustiças coletivas não resolvidas",
      "Energias negativas acumuladas",
      "Perturbações emocionais em grupo"
    ],
    manifestationStyles: [
      "Perturbações ambientais",
      "Manifestações coletivas",
      "Energias que afetam múltiplas pessoas",
      "Eventos que se repetem ciclicamente"
    ],
    philosophicalThemes: [
      "A emoção como força",
      "O coletivo sobre o individual",
      "O ressentimento como legado",
      "A história que não esquece"
    ]
  },

  [CreatureType.KAMI_MENORES]: {
    id: CreatureType.KAMI_MENORES,
    name: "Kami Menores",
    description: "Espíritos locais da natureza. Protetores ou juízes de locais específicos, com personalidades próprias.",
    examples: [
      "Árvores que sussurram avisos",
      "Rios que guiam ou enganam",
      "Montanhas que testam peregrinos",
      "Campos que recompensam respeito"
    ],
    triggerConditions: [
      "Perturbação de locais naturais",
      "Construções em áreas sagradas",
      "Falta de respeito aos rituais",
      "Mudanças ambientais drásticas"
    ],
    manifestationStyles: [
      "Fenômenos naturais inexplicáveis",
      "Guias espirituais sutis",
      "Proteção ou punição baseada em ações",
      "Lições através da natureza"
    ],
    philosophicalThemes: [
      "A natureza como consciência",
      "O respeito como sobrevivência",
      "Os espíritos como guardiões",
      "A harmonia como obrigação"
    ]
  },

  [CreatureType.TSUKUMOGAMI]: {
    id: CreatureType.TSUKUMOGAMI,
    name: "Tsukumogami",
    description: "Objetos antigos que despertaram. Itens que acumularam tanto significado que desenvolveram consciência própria.",
    examples: [
      "Espadas que escolhem seus portadores",
      "Máscaras que influenciam atores",
      "Lanternas que guardam segredos",
      "Estatuetas que observam em silêncio"
    ],
    triggerConditions: [
      "Objetos com história emocional forte",
      "Itens usados em rituais importantes",
      "Perturbações em templos ou santuários",
      "Energias sobrenaturais impregnadas"
    ],
    manifestationStyles: [
      "Objetos que se movem sozinhos",
      "Influências sutis no comportamento",
      "Proteção ou rejeição de usuários",
      "Histórias que se tornam realidade"
    ],
    philosophicalThemes: [
      "Os objetos como memória viva",
      "A idade como sabedoria",
      "A possessão como conexão",
      "As coisas que testemunharam demais"
    ]
  }
}

export interface CreatureEncounter {
  id: string
  type: CreatureType
  name?: string // Nunca revelado diretamente
  description: string // Apresentação misteriosa
  danger: 'low' | 'medium' | 'high' | 'extreme'
  clues: string[] // Pistas sutis sobre a natureza
  manifestations: string[] // Como aparece no mundo
  playerEffects: {
    immediate?: string[]
    gradual?: string[]
    permanent?: string[]
  }
  resolutionOptions: {
    peaceful: string[]
    confrontational: string[]
    avoidance: string[]
  }
}