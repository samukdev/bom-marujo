import type { Licao, Tema } from './tipos';
import { USOS_NOS } from './nos';

/*
 * Conteúdo escrito com nossas palavras, a partir do RIPEAM-72 e do sistema IALA.
 * Toda questão cita a regra em `referencia`. Revisar tecnicamente antes de publicar.
 */

export const LICOES: Licao[] = [
  {
    id: 'luzes-quem-vem-la',
    temaId: 'luzes',
    titulo: 'Quem vem lá?',
    descricao: 'Luzes de bordo, mastro, alcançado e fundeio',
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
          'A luz de mastro (branca) brilha para vante. Cada luz de bordo só aparece do seu lado. A de alcançado (branca) só é vista por quem está por trás. Atenção: quando ela vem DE FRENTE para você, o verde dela fica à SUA esquerda e o vermelho à sua direita. Branca alta + vermelha + verde = embarcação a motor de proa (roda a roda): as duas guinam para boreste. Vermelha e verde SEM a branca alta = veleiro: você, a motor, se afasta.',
        cena: { tipo: 'luzes-noite', embarcacao: { tipo: 'propulsao-mecanica' }, aspecto: 0 },
        falaMarujo: 'Vermelha e verde juntas? Ela vem na sua direção! Olhe se tem a branca alta.',
        pose: 'assustado',
      },
      {
        id: 'c-quem-e-quem',
        titulo: 'Quem é quem pelas luzes',
        texto:
          'A motor: luz de mastro branca + luzes de bordo. A vela: só luzes de bordo e de alcançado, SEM luz de mastro (veleiro navegando a motor acende a de mastro e conta como embarcação a motor). Fundeada (menos de 50 m): uma única luz branca, visível de todos os lados.',
        cena: { tipo: 'luzes-noite', embarcacao: { tipo: 'vela' }, aspecto: 0 },
        falaMarujo: 'Sem a branca alta em cima das cores? É veleiro!',
        pose: 'ensinando',
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
          'Um barco de pesca recolhendo a rede',
        ],
        correta: 0,
        explicacao:
          'A luz de alcançado é branca e cobre só a popa (135°). Se você vê só ela e está se aproximando, você é quem está ultrapassando: cabe a você se manter afastado.',
        referencia: 'RIPEAM · Regras 13 e 21(c)',
      },
      {
        id: 'q-traves-be',
        enunciado: 'Você vê uma luz branca alta e uma luz VERDE. Por qual bordo dela você está?',
        cena: { tipo: 'luzes-noite', embarcacao: { tipo: 'propulsao-mecanica' }, aspecto: 70 },
        opcoes: ['Pelo boreste dela', 'Pelo bombordo dela', 'Pela popa dela', 'Bem pela proa dela'],
        correta: 0,
        explicacao:
          'A luz verde só é visível pelo lado de boreste, da proa até 22,5° por ante a ré do través. Vendo a verde, você está no boreste dela. Em rumos cruzados (ambas a motor), quem tem a outra por boreste é que deve manobrar — ou seja, ela; mantenha rumo e velocidade, mas vigiando. Se ela não manobrar, apite 5 curtos e manobre você: reduza, pare ou guine para boreste — nunca para bombordo, porque ela está pelo seu bombordo (Regras 17(a)(ii) e 17(c)).',
        referencia: 'RIPEAM · Regras 15, 17(a)(ii), 17(c) e 21(b)',
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
          'Embarcação a vela exibe luzes de bordo e de alcançado, mas não tem luz de mastro. Sem a branca alta, é veleiro. Em geral, a embarcação a motor deve se manter afastada de veleiros.',
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
          'Embarcação fundeada com menos de 50 m mostra uma luz circular branca, onde ela possa ser melhor vista. Sem luzes de bordo, porque não está navegando. Atenção: uma lancha a motor com menos de 7 m e até 7 nós pode mostrar só uma branca circular (e, se possível, as de bordo) — mas ela estaria se movendo (Regra 23(d)).',
        referencia: 'RIPEAM · Regras 23(d) e 30',
      },
    ],
  },
  {
    id: 'apitos-manobra',
    temaId: 'sons',
    titulo: 'Apitos de manobra',
    descricao: '1, 2 e 3 apitos curtos e o sinal de dúvida',
    conceitos: [
      {
        id: 'c-apitos',
        titulo: 'Curto ou longo?',
        texto:
          'Apito curto dura cerca de 1 segundo; longo, de 4 a 6 segundos. Entre embarcações de propulsão mecânica que se avistam, quem manobra avisa: 1 curto = guinando para boreste, 2 curtos = guinando para bombordo, 3 curtos = dando máquinas atrás. Já os 5 ou mais curtos e rápidos valem para qualquer embarcação à vista: dúvida ou perigo.',
        cena: { tipo: 'encontro', sinal: 'guinando-boreste', manobra: 'boreste', vocePara: 'boreste' },
        falaMarujo: 'Um, dois, três: boreste, bombordo, pra trás! Cinco ou mais: hein?!',
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
          '1 curto = guinando para boreste. Em roda a roda, as duas guinam para boreste e passam bombordo com bombordo — a sua lancha também guina e responde com 1 curto.',
        referencia: 'RIPEAM · Regras 14 e 34(a)',
      },
      {
        id: 'q-3curtos',
        enunciado: 'Ouça o sinal do navio. O que ele está fazendo?',
        cena: { tipo: 'encontro', sinal: 'maquinas-atras', manobra: 'atras' },
        som: 'maquinas-atras',
        opcoes: ['Estou dando máquinas atrás', 'Estou guinando para bombordo', 'Pretendo ultrapassá-lo', 'Estou fundeado'],
        correta: 0,
        explicacao:
          '3 curtos = estou dando máquinas atrás. Isso não quer dizer que ele já parou: o navio ainda pode ter seguimento por um bom tempo.',
        referencia: 'RIPEAM · Regra 34(a)',
      },
      {
        id: 'q-2curtos',
        enunciado: 'Este navio passa pela sua bochecha de boreste e dá este sinal. O que ele está dizendo?',
        cena: { tipo: 'encontro', sinal: 'guinando-bombordo', manobra: 'bombordo', posicao: 'boreste' },
        som: 'guinando-bombordo',
        opcoes: ['Estou guinando para bombordo', 'Estou guinando para boreste', 'Estou dando máquinas atrás', 'Não entendi suas intenções'],
        correta: 0,
        explicacao:
          '2 curtos = estou guinando para bombordo. Aqui ele já está aberto pelo seu boreste e a guinada só aumenta a distância. Atenção: num roda a roda, guinar para bombordo é errado — as duas guinam para boreste.',
        referencia: 'RIPEAM · Regras 14 e 34(a)',
      },
      {
        id: 'q-duvida',
        enunciado: 'O navio à sua frente dá este sinal. O que ele quer dizer?',
        cena: { tipo: 'encontro', sinal: 'duvida', manobra: 'nenhuma' },
        som: 'duvida',
        opcoes: [
          'Não entendi suas intenções / sua manobra pode não evitar o perigo',
          'Estou guinando para boreste',
          'Estou dando máquinas atrás',
          'Estou parado, sem seguimento',
        ],
        correta: 0,
        explicacao:
          'Pelo menos 5 apitos curtos e rápidos = dúvida ou perigo. Ao ouvir isso, reduza a velocidade e deixe a sua manobra bem clara e a tempo.',
        referencia: 'RIPEAM · Regras 8 e 34(d)',
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
          'O Brasil usa a Região B da IALA. Quem ENTRA no porto, vindo do mar, deixa as marcas vermelhas por boreste (direita) e as verdes por bombordo (esquerda). Saindo, inverte. Navegue sempre dentro do canal balizado.',
        cena: { tipo: 'canal', sentido: 'entrando' },
        falaMarujo: 'Voltando pra casa, o vermelho fica à direita!',
      },
      {
        id: 'c-formatos',
        titulo: 'Formato e tope também falam',
        texto:
          'De dia, olhe o formato e o tope: a marca de boreste é cônica, com tope em cone de ponta para cima (▲); a de bombordo é cilíndrica, com tope em cilindro (■). Em boias pilar ou charuto, é o tope que diz o lado.',
        cena: { tipo: 'marcas' },
        falaMarujo: 'De longe, sem cor nenhuma, é o formato que te salva.',
        pose: 'pensando',
      },
    ],
    questoes: [
      {
        id: 'q-vermelha-entrando',
        enunciado: 'Você está ENTRANDO no porto. Por qual bordo deve deixar as boias vermelhas?',
        cena: { tipo: 'canal', sentido: 'entrando', oculto: true },
        opcoes: ['Por boreste (à minha direita)', 'Por bombordo (à minha esquerda)', 'Tanto faz, se houver profundidade', 'Devo passar entre duas vermelhas'],
        correta: 0,
        explicacao: 'Região B: entrando, vermelha por boreste e verde por bombordo.',
        referencia: 'Sistema IALA · Região B',
      },
      {
        id: 'q-vermelha-saindo',
        enunciado: 'Agora você está SAINDO do porto para o mar. Por qual bordo deixa as boias vermelhas?',
        cena: { tipo: 'canal', sentido: 'saindo', oculto: true },
        opcoes: ['Por bombordo (à minha esquerda)', 'Por boreste (à minha direita)', 'Por qualquer bordo', 'Não se usa boia na saída'],
        correta: 0,
        explicacao: 'O sentido convencional é o de quem entra. Saindo, tudo se inverte: vermelha por bombordo e verde por boreste.',
        referencia: 'Sistema IALA · Região B',
      },
      {
        id: 'q-formato-verde',
        enunciado: 'Qual é o formato da marca lateral de BOMBORDO (verde) na Região B?',
        cena: { tipo: 'marcas', oculto: true },
        opcoes: [
          'Cilíndrica, com tope cilíndrico',
          'Cônica, com tope em cone de ponta para cima',
          'Pilar, com dois cones pretos no tope',
          'Esférica, com faixas verticais vermelhas e brancas',
        ],
        correta: 0,
        explicacao:
          'Marca de bombordo: verde, cilíndrica (tipo lata), tope cilíndrico. A cônica com cone para cima é a de boreste; dois cones pretos são de marca cardinal; esférica listrada é de águas seguras.',
        referencia: 'Sistema IALA · Região B',
      },
    ],
  },
];

LICOES.push(
  {
    id: 'nos-arremate-emendas',
    temaId: 'marinharia',
    titulo: 'Nós I: arremate e emendas',
    descricao: 'Nó de oito, nó direito e nó de escota',
    conceitos: [
      {
        id: 'c-oito',
        titulo: 'Nó de oito',
        texto: USOS_NOS.oito.uso,
        cena: { tipo: 'no', no: 'oito' },
        falaMarujo: 'Chicote é a ponta do cabo. Firme é a parte que aguenta o esforço.',
      },
      {
        id: 'c-direito',
        titulo: 'Nó direito',
        texto: USOS_NOS.direito.uso,
        cena: { tipo: 'no', no: 'direito' },
        falaMarujo: 'Mesma grossura? Nó direito. Grossuras diferentes? Escota!',
        pose: 'orgulhoso',
      },
      {
        id: 'c-escota',
        titulo: 'Nó de escota',
        texto: USOS_NOS.escota.uso,
        cena: { tipo: 'no', no: 'escota' },
        pose: 'pensando',
        falaMarujo: 'O grosso faz a alça; o fino abraça o pescoço dela e morde a si mesmo.',
      },
    ],
    questoes: [
      {
        id: 'q-id-oito',
        enunciado: 'Que nó é este, feito na ponta do cabo?',
        cena: { tipo: 'no', no: 'oito' },
        opcoes: ['Nó de oito', 'Nó direito', 'Lais de guia', 'Volta do fiel'],
        correta: 0,
        explicacao: 'É o nó de oito, um nó de arremate: engrossa a ponta do cabo para ela não escapar de um moitão ou argola.',
        referencia: 'Marinharia · nós de arremate',
      },
      {
        id: 'q-uso-direito',
        enunciado: 'Você precisa emendar dois cabos de MESMA bitola. Qual nó usar?',
        cena: { tipo: 'no', no: 'direito', oculto: true },
        opcoes: ['Nó direito', 'Nó de escota', 'Nó de oito', 'Volta de cunho'],
        correta: 0,
        explicacao: 'Para cabos de mesma bitola, nó direito. Se as grossuras forem diferentes, o certo é o nó de escota.',
        referencia: 'Marinharia · emendas',
      },
      {
        id: 'q-uso-escota',
        enunciado: 'Um cabo grosso e um cabo fino precisam ser emendados com segurança. Qual nó?',
        cena: { tipo: 'no', no: 'escota', oculto: true },
        opcoes: ['Nó de escota', 'Nó direito', 'Lais de guia', 'Nó de oito'],
        correta: 0,
        explicacao: 'O nó de escota une cabos de bitolas diferentes: o grosso forma o seio e o fino dá a volta e morde a si mesmo.',
        referencia: 'Marinharia · emendas',
      },
      {
        id: 'q-uso-oito',
        enunciado: 'Para o cabo não escapar do moitão (roldana), que nó você dá no chicote?',
        cena: { tipo: 'no', no: 'oito', oculto: true },
        opcoes: ['Nó de oito', 'Volta do fiel', 'Nó de escota', 'Volta de cunho'],
        correta: 0,
        explicacao: 'O nó de oito é o arremate clássico: segura bem e desfaz fácil, mesmo depois de apertado.',
        referencia: 'Marinharia · nós de arremate',
      },
      {
        id: 'q-id-escota',
        enunciado: 'Que nó está unindo estes dois cabos?',
        cena: { tipo: 'no', no: 'escota' },
        opcoes: ['Nó de escota', 'Nó direito', 'Volta do fiel', 'Lais de guia'],
        correta: 0,
        explicacao: 'Repare: um cabo forma uma alça em U e o outro abraça o pescoço dela, passando por baixo de si mesmo. É o nó de escota.',
        referencia: 'Marinharia · emendas',
      },
    ],
  },
  {
    id: 'nos-alcas-voltas',
    temaId: 'marinharia',
    titulo: 'Nós II: alças e voltas',
    descricao: 'Lais de guia, volta do fiel e volta de cunho',
    conceitos: [
      {
        id: 'c-lais',
        titulo: 'Lais de guia',
        texto: USOS_NOS['lais-de-guia'].uso,
        cena: { tipo: 'no', no: 'lais-de-guia' },
        falaMarujo: 'O coelho sai da toca, dá a volta na árvore e volta pra toca. Nunca esqueci!',
      },
      {
        id: 'c-fiel',
        titulo: 'Volta do fiel',
        texto: USOS_NOS['volta-do-fiel'].uso,
        cena: { tipo: 'no', no: 'volta-do-fiel' },
        pose: 'aprovando',
        falaMarujo: 'Duas voltas e o chicote por baixo da cruz. Defensa no lugar!',
      },
      {
        id: 'c-cunho',
        titulo: 'Volta de cunho',
        texto: USOS_NOS['volta-de-cunho'].uso,
        cena: { tipo: 'no', no: 'volta-de-cunho' },
        pose: 'ensinando',
        falaMarujo: USOS_NOS['volta-de-cunho'].dica,
      },
    ],
    questoes: [
      {
        id: 'q-id-lais',
        enunciado: 'Que nó é este, que forma uma alça fixa na ponta do cabo?',
        cena: { tipo: 'no', no: 'lais-de-guia' },
        opcoes: ['Lais de guia', 'Nó de oito', 'Volta do fiel', 'Nó direito'],
        correta: 0,
        explicacao: 'Lais de guia: a alça não corre nem aperta, e o nó é fácil de desfazer depois.',
        referencia: 'Marinharia · alças',
      },
      {
        id: 'q-uso-lais',
        enunciado: 'Homem ao mar! Você vai jogar um cabo com uma alça que NÃO aperte em volta do corpo da vítima. Qual nó?',
        cena: { tipo: 'no', no: 'lais-de-guia', oculto: true },
        opcoes: ['Lais de guia', 'Volta do fiel', 'Nó de oito', 'Nó direito'],
        correta: 0,
        explicacao: 'A alça do lais de guia é fixa: não estrangula a pessoa quando o cabo é puxado. É o nó do salvamento. Primeiro jogue a boia salva-vidas; a alça vai por baixo dos braços.',
        referencia: 'Marinharia · resgate de homem ao mar',
      },
      {
        id: 'q-uso-cunho',
        enunciado: 'Atracando no cais: como você prende o cabo de amarração no cunho?',
        cena: { tipo: 'no', no: 'volta-de-cunho', oculto: true },
        opcoes: ['Volta de cunho', 'Nó de escota', 'Nó direito', 'Nó de oito'],
        correta: 0,
        explicacao: 'Volta de cunho: uma volta redonda, cotes cruzados em "oito" sobre as orelhas e um cote mordido para travar.',
        referencia: 'Marinharia · amarração',
      },
      {
        id: 'q-uso-fiel',
        enunciado: 'Você quer pendurar rapidamente a defensa no balaústre. Que volta usar?',
        cena: { tipo: 'no', no: 'volta-do-fiel', oculto: true },
        opcoes: ['Volta do fiel', 'Lais de guia', 'Nó de escota', 'Nó direito'],
        correta: 0,
        explicacao: 'A volta do fiel é rápida de dar e de ajustar a altura: perfeita para defensas. Ela pode correr com o balanço; para ficar de vez, arremate com um cote.',
        referencia: 'Marinharia · voltas',
      },
      {
        id: 'q-id-cunho',
        enunciado: 'Como se chama esta amarração?',
        cena: { tipo: 'no', no: 'volta-de-cunho' },
        opcoes: ['Volta de cunho', 'Volta do fiel', 'Nó de oito', 'Lais de guia'],
        correta: 0,
        explicacao: 'O cabo cruzado em "oito" sobre as orelhas do cunho, com o cote final travando, é a volta de cunho.',
        referencia: 'Marinharia · amarração',
      },
    ],
  },
);

export const TEMAS: Tema[] = [
  { id: 'luzes', titulo: 'Luzes de navegação', icone: '💡', licoes: ['luzes-quem-vem-la'] },
  { id: 'sons', titulo: 'Sinais sonoros', icone: '📯', licoes: ['apitos-manobra'] },
  { id: 'balizamento', titulo: 'Balizamento IALA B', icone: '🛟', licoes: ['balizamento-entrando'] },
  { id: 'governo', titulo: 'Regras de governo', icone: '🧭', licoes: [], emBreve: true },
  { id: 'marinharia', titulo: 'Marinharia: nós e voltas', icone: '🪢', licoes: ['nos-arremate-emendas', 'nos-alcas-voltas'] },
  { id: 'salvatagem', titulo: 'Salvatagem e sobrevivência', icone: '🦺', licoes: [], emBreve: true },
];

export function getLicao(id: string): Licao | undefined {
  return LICOES.find((l) => l.id === id);
}
