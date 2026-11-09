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

## 2b. Poses emocionais estilo "mascote de app" (personalidade durona) — em 3 lotes de 4

Anexar a folha do personagem aprovada. Bloco fixo + lote:

```
Using the attached reference, draw the SAME original character with exactly the same face, mustache, pipe, anchor tattoo under his RIGHT eye, two swallow tattoos on his chest, scar, clothes, colors and proportions. He is a gruff, tough old sea dog who rarely smiles, so every emotion must be big, exaggerated and instantly readable even as a small app icon, like a mobile app mascot. Full body, 4 poses in a clean 2x2 grid, generous space between them, same scale. 1930s rubber hose cartoon style, thick uniform black outlines, flat colors only, pure white background, no text, no labels, no color swatches.
```
- **Lote A (feedback):** 1. APPROVING: thumbs up, one eye winking, small proud half-smile around the pipe · 2. PROUD: arms crossed, chest puffed out, chin up, satisfied smirk · 3. SKEPTICAL: arms crossed, one eyebrow raised high, pipe tilted down, unimpressed · 4. ANGRY: red face, steam blowing from his ears and pipe, fist raised, teeth clenched on the pipe
- **Lote B (emoções):** 5. SAD: sitting on a small anchor, shoulders slumped, pipe drooping and unlit, one tear · 6. CELEBRATING: jumping with both fists up, cap flying off, big laughing open mouth · 7. SHOCKED: eyes popping out, mustache bristling, pipe falling from his mouth, holding his cap · 8. ASLEEP: snoozing leaning on a bollard, cap over his eyes, "Zzz" smoke from the pipe
- **Lote C (ensino):** 9. TEACHING: pointing to the side with the pipe stem like a teacher, other hand on hip · 10. THINKING: scratching his chin, eyes looking up, pipe smoke forming a question mark · 11. SALUTING: crisp military salute, standing tall, serious face · 12. BLOWING WHISTLE: blowing a brass ship whistle, cheeks inflated, puffs of steam

## 2a. Folha de poses do app (versão final — usar com a imagem da folha do personagem como referência)

```
Character pose sheet of the SAME original mascot from the reference image: an old, stocky, cheerful sailor drawn in 1930s rubber hose cartoon style — big round nose, broad jaw, thick white curled handlebar mustache, curved corncob pipe in the corner of his mouth, small anchor tattoo just below his RIGHT eye (teardrop tattoo position), two swallow tattoos on his chest visible through the V-neck, white sailor cap, white sailor shirt with navy blue sailor collar with white stripes, red neckerchief, navy bell-bottom trousers, black shoes, white four-finger cartoon gloves, pie-cut eyes, thick rubbery limbs.
Full body, 9 poses in a clean 3x3 grid, each pose separated with generous space, same scale and same proportions in every pose:
1. waving hello with a big grin
2. proud thumbs up, winking (correct answer)
3. facepalm, pipe drooping, sweat drop (wrong answer)
4. thinking, scratching his chin, looking up
5. jumping and celebrating, arms up, cap flying off
6. pointing to the side like a teacher, holding the pipe in the other hand
7. sad and sleepy, sitting on a small anchor (missing you / streak reminder)
8. crisp military salute, standing tall
9. blowing a ship whistle with puffs of steam, cheeks inflated
Thick uniform black ink outlines, flat colors only (no gradients, no texture, no shading except simple cel shadow): navy #1B2A4A, royal blue #1765D8 accents, cream #F5F1E6, red #C8372D, brass yellow #E3A72F. Pure white background, no text, no labels, no frame, no extra characters.
```

## 2. Folha de expressões (versão inicial)

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
