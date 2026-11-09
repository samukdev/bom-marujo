# Mascote — prompts de geração de imagem e animação

## Conceito

**O Marujo** (nome provisório — sugestões: *Seu Marujo*, *Mestre Bento*, *Zé Âncora*): um velho marinheiro de cartoon, original, desenhado no estilo **"rubber hose" dos anos 1920–30** (membros em forma de mangueira, olhos tipo "pie-cut", luvas brancas, traço preto grosso, animação elástica).

> ⚠️ **Personagem original.** A referência é o *estilo* da época, não personagens existentes. Nos prompts **não use nomes** como Popeye ou Mickey: os geradores tendem a copiar o personagem (risco de marca/direitos) ou recusar o pedido. Descreva apenas os traços.

### Traços fixos (manter em todos os prompts)
- Velho marinheiro corpulento, queixo largo, nariz redondo e grande
- **Bigode** cheio e curvado nas pontas (handlebar), branco-acinzentado
- **Cachimbo** de sabugo ou madeira curvo no canto da boca, com fumacinha
- **Tatuagem pequena de âncora** logo abaixo do olho direito (posição da "lágrima")
- **Duas andorinhas** tatuadas no peito, visíveis pela gola em V do uniforme
- Chapéu de marinheiro branco (gorro tipo "dixie cup") ou boné de capitão
- Blusa de marinheiro com **gola marinheira azul-marinho** de listras brancas e lenço vermelho
- Antebraços grossos; olhos "pie-cut"; luvas brancas de 4 dedos (convenção do estilo)
- Atitude: experiente, bem-humorado, encorajador — o "professor" do aluno

### Paleta sugerida
| Uso | Cor |
|---|---|
| Azul-marinho (primária) | `#1B2A4A` |
| Branco-espuma | `#F5F1E6` (creme, efeito de papel antigo) |
| Vermelho do lenço / boia | `#C8372D` |
| Amarelo-latão / ouro | `#E3A72F` |
| Verde-boreste | `#2E8B57` |
| Traço | `#111111` |

Vermelho e verde também são as cores de **bombordo e boreste** e das **boias laterais**. Isso dá coerência temática ao app.

---

## 1. Folha do personagem (gerar primeiro e usar como referência)

```
Original cartoon mascot character sheet, 1930s rubber hose animation style, vintage black-and-white era cartoon look with limited color. An old, stocky, good-humored sailor with a broad jaw and a big round nose, a thick white curled handlebar mustache, and a curved corncob pipe in the corner of his mouth with a little puff of smoke. A small anchor tattoo right under his right eye, like a teardrop tattoo. Two swallow tattoos on his chest visible through the V-neck of his sailor shirt. White sailor cap, navy blue sailor collar with white stripes, red neckerchief, thick forearms, white four-finger cartoon gloves, pie-cut eyes. Turnaround: front view, three-quarter view, side view, back view. Clean thick black ink outlines, flat colors in navy #1B2A4A, cream #F5F1E6, red #C8372D, brass yellow #E3A72F. Plain cream background, no text.
```

## 2. Folha de expressões (estados do mascote no app)

```
Same original 1930s rubber hose sailor character (old sailor, white handlebar mustache, corncob pipe, anchor tattoo under right eye, swallow tattoos on chest, white sailor cap, navy sailor collar, red neckerchief). Expression sheet with 8 poses, rubber hose animation style, thick black outlines, flat vintage colors, cream background:
1. waving hello, 2. proud thumbs up (correct answer), 3. facepalm with pipe drooping (wrong answer), 4. thinking, scratching chin, 5. celebrating, jumping with cap flying off, 6. pointing to the side like a teacher, 7. sleepy / missing you (streak reminder), 8. saluting.
No text.
```

## 3. Logo / ícone do app

**Opção A — emblema circular (logo principal)**
```
Vintage nautical badge logo for an app called "Bom Marujo". Round emblem like an old life ring (red and cream segments) framing the head and shoulders of an original 1930s rubber hose cartoon old sailor with a white handlebar mustache, corncob pipe, small anchor tattoo under his right eye, white sailor cap, navy collar. Rope border, small anchor and two swallows as ornaments. Text "BOM MARUJO" in bold vintage serif lettering arching across a ribbon banner. Flat colors: navy #1B2A4A, cream #F5F1E6, red #C8372D, brass #E3A72F. Thick black outlines, clean vector style, centered, plain background.
```

**Opção B — ícone de app (sem texto, legível em tamanho pequeno)**
```
App icon, rounded square, navy blue background #1B2A4A. Close-up head of an original 1930s rubber hose cartoon old sailor: big grin, white curled mustache, corncob pipe with a puff of smoke, small anchor tattoo under right eye, white sailor cap tilted. Simple, bold, thick black outlines, flat colors, high contrast, readable at 48px. No text.
```

> Dica: gere em alta resolução e depois vetorize (Illustrator *Image Trace*, Vectorizer.ai ou recriação manual no Figma) para ter um SVG limpo.

## 4. Animação de entrada (splash / abertura)

### Storyboard (~3–4 s)
1. **0,0s** Tela creme com textura de papel/filme antigo, vinheta escura nas bordas, leve *film grain* e tremulação.
2. **0,3s** Ondas em rubber hose entram de baixo, balançando no ritmo.
3. **0,8s** Uma boia salva-vidas sobe das ondas girando e para no centro.
4. **1,2s** O Marujo salta de dentro da boia (squash & stretch), o chapéu voa e volta pra cabeça.
5. **1,8s** Ele bate continência; o cachimbo solta 3 baforadas que formam as letras **BOM MARUJO**.
6. **2,6s** Som de apito de navio (1 apito longo) + piscadela do Marujo.
7. **3,2s** Fecha em íris (círculo fechando, estilo cartoon antigo) para a tela inicial.

### Prompt para gerador de vídeo (Veo, Runway, Kling, Sora etc.)
```
3-second vintage 1930s rubber hose cartoon animation, cream paper background with film grain and flicker, dark vignette. Bouncy cartoon waves rise from the bottom; a red-and-white life ring pops up spinning and stops in the center. An original old sailor character (white handlebar mustache, corncob pipe, small anchor tattoo under his right eye, white sailor cap, navy sailor collar, red neckerchief, white gloves) springs out of the life ring with exaggerated squash and stretch, his cap flies up and lands back on his head, he gives a crisp salute and winks, puffs of smoke from his pipe. Ends with a classic circular iris-out transition. Smooth bouncy timing, thick black outlines, flat colors.
```

### Recomendação de implementação
A animação final do app deve ser feita em **Rive** (ou Lottie). Um vídeo gerado por IA serve como **referência de movimento**, não como asset final: vídeo pesa mais, não é interativo e não se adapta ao tema. Fluxo sugerido:
1. Gerar a folha do personagem (prompt 1) e escolher a versão final.
2. Vetorizar/redesenhar no Figma em camadas (cabeça, bigode, cachimbo, braços, chapéu, corpo).
3. Montar o rig no Rive com *state machine*: `idle`, `correct`, `wrong`, `celebrate`, `thinking`, `intro`.

---

## 5. Ilustrações de situações (padrão para todas as cenas)

Prefixo de estilo para manter as cenas consistentes:
```
Flat vector illustration, 1930s rubber hose cartoon style, thick black outlines, limited vintage palette (navy #1B2A4A, cream #F5F1E6, red #C8372D, green #2E8B57, brass #E3A72F), simple readable composition, top-down or side view, educational diagram clarity, no text.
```
Exemplo:
```
[prefixo] Night scene at sea: a motorboat seen from the front showing a red light on the left side, a green light on the right side and a white masthead light above. Dark navy sky, gentle cartoon waves.
```

> Nas cenas técnicas (luzes, boias, marcas diurnas), **a precisão normativa vem antes do estilo**: cores, posições e formatos têm que bater com o RIPEAM e o IALA B. Essas cenas provavelmente serão desenhadas como SVG no código, com a IA servindo só para explorar o estilo (veja o PLAN.md).
