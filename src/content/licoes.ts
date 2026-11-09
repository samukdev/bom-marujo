import type { Licao, Tema } from './tipos';

/*
 * Conteúdo escrito com nossas palavras, a partir do RIPEAM-72 e do sistema IALA.
 * Toda questão cita a regra em `referencia`. Revisar tecnicamente antes de publicar.
 */

export const LICOES: Licao[] = [
  {
    id: 'luzes-quem-vem-la',
    temaId: 'luzes',
    titulo: 'Quem vem lá?',
    descricao: 'Luzes de bordo, mastro e alcançado',
    conceitos: [
      {
        id: 'c-bordos',
        titulo: 'Bombordo e boreste',
        texto:
          'Olhando para a proa (a frente do barco), o lado esquerdo é BOMBORDO e o direito é BORESTE. À noite, cada bordo tem sua cor: bombordo vermelho, boreste verde.',
        cena: { tipo: 'bordos' },
        falaMarujo: 'Macete: bombordO e vermelhO terminam em O; borestE e verdE terminam em E!',
      },
      {
        id: 'c-setores',
        titulo: 'Cada luz tem seu setor',
        texto:
          'A luz de mastro (branca) brilha para vante. As de bordo só aparecem do seu lado. A de alcançado (branca) só é vista por quem está por trás. Por isso, as luzes que você vê dizem para onde a embarcação está indo.',
        cena: { tipo: 'luzes-noite', embarcacao: { tipo: 'propulsao-mecanica' }, aspecto: 0 },
        falaMarujo: 'Vermelha e verde juntas? Ela vem na sua direção!',
        pose: 'assustado',
      },
    ],
    questoes: [
      {
        id: 'q-proa-motor',
        enunciado: 'À noite, você avista estas luzes bem na sua proa, se aproximando. O que é e o que fazer?',
        cena: { tipo: 'luzes-noite', embarcacao: { tipo: 'propulsao-mecanica' }, aspecto: 0 },
        opcoes: [
          'Embarcação a motor vindo de roda a roda: as duas guinam para boreste',
          'Embarcação a vela vindo de frente: você deve manter o rumo',
          'Embarcação a motor se afastando de você',
          'Embarcação fundeada: basta contorná-la por qualquer bordo',
        ],
        correta: 0,
        explicacao:
          'Mastro branco + vermelha e verde ao mesmo tempo = propulsão mecânica vindo de proa. Em roda a roda, as duas guinam para boreste e passam bombordo com bombordo.',
        referencia: 'RIPEAM · Regras 14 e 23',
      },
      {
        id: 'q-popa-motor',
        enunciado: 'Você só enxerga uma luz branca, sem vermelha nem verde. A embarcação está em movimento. O que está vendo?',
        cena: { tipo: 'luzes-noite', embarcacao: { tipo: 'propulsao-mecanica' }, aspecto: 180 },
        opcoes: [
          'A luz de alcançado: você está vendo a popa dela',
          'A luz de mastro: ela vem de frente para você',
          'Uma embarcação sem governo',
          'Uma boia de águas seguras',
        ],
        correta: 0,
        explicacao:
          'A luz de alcançado é branca e cobre só a popa (135°). Se você vê só ela, está na situação de quem ultrapassa: cabe a você manobrar e se manter afastado.',
        referencia: 'RIPEAM · Regras 13 e 21(c)',
      },
      {
        id: 'q-traves-be',
        enunciado: 'Você vê uma luz branca alta e uma luz VERDE. Por qual bordo dela você está?',
        cena: { tipo: 'luzes-noite', embarcacao: { tipo: 'propulsao-mecanica' }, aspecto: 70 },
        opcoes: ['Pelo boreste dela', 'Pelo bombordo dela', 'Pela popa dela', 'Bem pela proa dela'],
        correta: 0,
        explicacao:
          'A luz verde só é visível pelo lado de boreste, da proa até 22,5° por ante a ré do través. Vendo a verde, você está no boreste dela, e a proa dela aponta para a sua direita.',
        referencia: 'RIPEAM · Regra 21(b)',
      },
      {
        id: 'q-vela-proa',
        enunciado: 'Vermelha e verde juntas, mas SEM nenhuma luz branca acima. O que vem na sua direção?',
        cena: { tipo: 'luzes-noite', embarcacao: { tipo: 'vela' }, aspecto: 0 },
        opcoes: [
          'Uma embarcação a vela, vindo de proa',
          'Uma embarcação a motor, vindo de proa',
          'Uma embarcação fundeada',
          'Uma embarcação de pesca arrastando',
        ],
        correta: 0,
        explicacao:
          'Embarcação a vela exibe luzes de bordo e de alcançado, mas não tem luz de mastro. Sem a branca alta, é veleiro. Atenção: em geral, a embarcação a motor deve se manter afastada de veleiros.',
        referencia: 'RIPEAM · Regras 18 e 25',
      },
      {
        id: 'q-fundeada',
        enunciado: 'Uma única luz branca, visível de todos os lados e parada no mesmo lugar. O que provavelmente é?',
        cena: { tipo: 'luzes-noite', embarcacao: { tipo: 'fundeada' }, aspecto: 40 },
        opcoes: [
          'Embarcação fundeada (menor que 50 m)',
          'Embarcação a motor vindo de proa',
          'Embarcação sem governo',
          'Veleiro navegando',
        ],
        correta: 0,
        explicacao:
          'Embarcação fundeada com menos de 50 m mostra uma luz circular branca, onde ela possa ser melhor vista. Sem luzes de bordo, porque não está navegando.',
        referencia: 'RIPEAM · Regra 30',
      },
    ],
  },
  {
    id: 'apitos-manobra',
    temaId: 'sons',
    titulo: 'Apitos de manobra',
    descricao: '1, 2 e 3 apitos curtos',
    conceitos: [
      {
        id: 'c-apitos',
        titulo: 'Curto ou longo?',
        texto:
          'Apito curto dura cerca de 1 segundo. Longo, de 4 a 6 segundos. Quando duas embarcações se avistam, quem manobra avisa: 1 curto = guinando para boreste, 2 curtos = guinando para bombordo, 3 curtos = dando máquinas atrás.',
        cena: { tipo: 'encontro', sinal: 'guinando-boreste', manobra: 'nenhuma' },
        falaMarujo: 'Um, dois, três: boreste, bombordo, pra trás!',
        pose: 'apito',
      },
    ],
    questoes: [
      {
        id: 'q-1curto',
        enunciado: 'O navio que vem de frente emite este sinal. O que ele está dizendo?',
        cena: { tipo: 'encontro', sinal: 'guinando-boreste', manobra: 'boreste', vocePara: 'boreste' },
        som: 'guinando-boreste',
        opcoes: ['Estou guinando para boreste', 'Estou guinando para bombordo', 'Estou dando máquinas atrás', 'Não entendi suas intenções'],
        correta: 0,
        explicacao:
          '1 curto = guinando para boreste. Em roda a roda, as duas guinam para boreste e passam bombordo com bombordo.',
        referencia: 'RIPEAM · Regras 14 e 34(a)',
      },
      {
        id: 'q-3curtos',
        enunciado: 'Ouça o sinal do navio. O que ele está fazendo?',
        cena: { tipo: 'encontro', sinal: 'maquinas-atras', manobra: 'atras' },
        som: 'maquinas-atras',
        opcoes: ['Estou dando máquinas atrás', 'Estou guinando para bombordo', 'Pretendo ultrapassá-lo', 'Estou fundeado'],
        correta: 0,
        explicacao: '3 curtos = estou dando máquinas atrás (o navio está freando ou dando ré).',
        referencia: 'RIPEAM · Regra 34(a)',
      },
      {
        id: 'q-2curtos',
        enunciado: 'E agora, que sinal é este?',
        cena: { tipo: 'encontro', sinal: 'guinando-bombordo', manobra: 'bombordo' },
        som: 'guinando-bombordo',
        opcoes: ['Estou guinando para bombordo', 'Estou guinando para boreste', 'Estou dando máquinas atrás', 'Perigo / dúvida'],
        correta: 0,
        explicacao: '2 curtos = estou guinando para bombordo.',
        referencia: 'RIPEAM · Regra 34(a)',
      },
      {
        id: 'q-duvida',
        enunciado: 'O navio não entendeu o que você vai fazer. Que sinal ele deve dar?',
        cena: { tipo: 'encontro', sinal: 'duvida', manobra: 'nenhuma' },
        som: 'duvida',
        opcoes: ['Pelo menos 5 apitos curtos e rápidos', '1 apito longo', '2 apitos longos', '3 apitos curtos'],
        correta: 0,
        explicacao:
          'Na dúvida sobre as intenções da outra embarcação, ou se acha que a manobra dela não evita o perigo, dê pelo menos 5 apitos curtos e rápidos.',
        referencia: 'RIPEAM · Regra 34(d)',
      },
    ],
  },
  {
    id: 'balizamento-entrando',
    temaId: 'balizamento',
    titulo: 'Entrando no porto',
    descricao: 'Boias laterais na Região B',
    conceitos: [
      {
        id: 'c-regiao-b',
        titulo: 'Vermelho a boreste, entrando',
        texto:
          'O Brasil usa a Região B da IALA. Quem ENTRA no porto, vindo do mar, deixa as marcas vermelhas por boreste (direita) e as verdes por bombordo (esquerda). Saindo, inverte.',
        cena: { tipo: 'canal', sentido: 'entrando' },
        falaMarujo: 'Voltando pra casa, o vermelho fica à direita!',
      },
      {
        id: 'c-formatos',
        titulo: 'Formato e tope também falam',
        texto:
          'De dia, sem luz, olhe o formato: a marca de boreste é cônica, com tope em cone de ponta para cima (▲). A de bombordo é cilíndrica, com tope em cilindro (■).',
        cena: { tipo: 'canal', sentido: 'entrando' },
        falaMarujo: 'De longe, sem cor nenhuma, é o formato que te salva.',
        pose: 'pensando',
      },
    ],
    questoes: [
      {
        id: 'q-vermelha-entrando',
        enunciado: 'Você está ENTRANDO no porto. Por qual bordo deve deixar as boias vermelhas?',
        cena: { tipo: 'canal', sentido: 'entrando' },
        opcoes: ['Por boreste (à minha direita)', 'Por bombordo (à minha esquerda)', 'Tanto faz, se houver profundidade', 'Devo passar entre duas vermelhas'],
        correta: 0,
        explicacao: 'Região B: entrando, vermelha por boreste e verde por bombordo.',
        referencia: 'Sistema IALA · Região B',
      },
      {
        id: 'q-vermelha-saindo',
        enunciado: 'Agora você está SAINDO do porto para o mar. Por qual bordo deixa as boias vermelhas?',
        cena: { tipo: 'canal', sentido: 'saindo' },
        opcoes: ['Por bombordo (à minha esquerda)', 'Por boreste (à minha direita)', 'Por qualquer bordo', 'Não se usa boia na saída'],
        correta: 0,
        explicacao: 'O sentido convencional é o de quem entra. Saindo, tudo se inverte: vermelha por bombordo e verde por boreste.',
        referencia: 'Sistema IALA · Região B',
      },
      {
        id: 'q-formato-verde',
        enunciado: 'Qual é o formato da marca lateral de BOMBORDO (verde) na Região B?',
        cena: { tipo: 'canal', sentido: 'entrando' },
        opcoes: ['Cilíndrica, com tope cilíndrico', 'Cônica, com tope em cone', 'Esférica, com tope em X', 'Pilar, com dois cones'],
        correta: 0,
        explicacao: 'Marca de bombordo: verde, cilíndrica (tipo lata), tope cilíndrico. Marca de boreste: vermelha, cônica, tope em cone com a ponta para cima.',
        referencia: 'Sistema IALA · Região B',
      },
    ],
  },
];

export const TEMAS: Tema[] = [
  { id: 'luzes', titulo: 'Luzes de navegação', icone: '💡', licoes: ['luzes-quem-vem-la'] },
  { id: 'sons', titulo: 'Sinais sonoros', icone: '📯', licoes: ['apitos-manobra'] },
  { id: 'balizamento', titulo: 'Balizamento IALA B', icone: '🛟', licoes: ['balizamento-entrando'] },
  { id: 'governo', titulo: 'Regras de governo', icone: '🧭', licoes: [], emBreve: true },
  { id: 'marinharia', titulo: 'Nomenclatura e marinharia', icone: '🪢', licoes: [], emBreve: true },
  { id: 'salvatagem', titulo: 'Salvatagem e sobrevivência', icone: '🦺', licoes: [], emBreve: true },
];

export function getLicao(id: string): Licao | undefined {
  return LICOES.find((l) => l.id === id);
}
