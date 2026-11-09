# Padrão visual das cenas — Bom Marujo

Linguagem única para todas as ilustrações animadas. Saiu da revisão com 10 personas: o ilustrador técnico propôs, e engenheira, matemática, contramestre e os demais convergiram. Implementado em `src/components/cenas/` (`tokens.ts`, `comum.tsx`, `Moldura.tsx`).

## Tokens (`tokens.ts`)
| Papel | Cor |
|---|---|
| Tinta (todo contorno, de dia) | `#0B1F3F` |
| Tinta noturna (contorno à noite, mesma espessura) | `#3A5A8F` |
| Papel (bancada dos nós) | `#F5F1E6` |
| Mar de dia (topo → fundo) | `#2A7FD0` → `#1557A8` |
| Céu de dia | `#BFE2FA` |
| Noite (céu / mar) | `#0B1A36` / `#0C2348` |
| **Cor de OBJETO** vermelho / verde | `#D4342B` / `#1F8A4C` |
| **Cor de LUZ** vermelha / verde / branca / amarela | `#FF3B30` / `#22E07A` / `#FFFFFF` / `#FFD23F` |
| Casco / metal / vidro | `#FFFFFF` / `#C9D2DE` / `#9CCBF2` |
| Cabo manilha / cabo azul | `#D9A75E` / `#3F7DD8` |

Nenhuma cor avulsa fora destes tokens.

## Traço
Só 3 espessuras, sempre com a tinta e ponta e junção redondas: **3** (silhueta principal), **2** (detalhe), **1,5** (micro). À noite, mesmas espessuras com a tinta noturna.

## Sombra e espuma
- Sombra só sobre superfície sólida (papel, deque): deslocada (3,5), tinta a 16%.
- Sobre a água não há sombra: em vez dela, espuma (elipse branca a 50%).

## Moldura
- Tamanho 400×260 (viewBox), raio 16, borda de tinta 3, margem segura 16.
- A faixa do topo (y < 36) é reservada à **plaquinha**. Exceção: um cabo (o firme de um nó) pode SAIR pela borda atravessando a faixa, desde que não encoste na plaquinha. O firme sempre sai da cena sem falcaça; falcaça só no chicote.
- Cada cena tem ids próprios (`useId`), sem colisão entre cenas na mesma página.

## Plaquinha (contexto e notação)
Pílula de tinta a 85% com texto branco de 12 u, sempre no canto superior esquerdo. Exemplos: "NOITE", "VISTA DE CIMA", "ENTRANDO NO PORTO", "• • = GUINANDO PARA BOMBORDO".

## Rótulo único
- Texto de 12 u, peso 900, CAIXA ALTA, branco com halo de tinta 3,5.
- Cor só por um ● antes do texto, nunca pintando a letra.
- Linha-guia branca de 1,5 com bolinha de 3 no objeto.
- Nunca sobre o objeto principal nem sobre a lua; sempre dentro da margem segura.

## Pontos de vista (3 e só 3)
1. **Plano** (vista de cima): manobras e bordos.
2. **Olho do timoneiro**: luzes e boias, com a lancha VOCÊ em primeiro plano quando faz sentido.
3. **Bancada** (papel): nós.

A lancha VOCÊ e o navio têm um desenho só em todas as cenas.

## Movimento (3 níveis)
1. **Ambiente**: no máximo 2 loops por cena, balanço ±1°/4 s e ondas/8 s. Sem nuvens, sem estrelas piscando, sem traços de avanço.
2. **Sinal**: luz, lampejo, fumaça e apito, sempre sincronizados com o conteúdo. A fumaça dura o mesmo que o apito.
3. **Revelação**: ação em **2,4 s** com `cubic-bezier(.45,0,.3,1)`.

## Regra de revelação
- O **antes** mostra só a evidência que o enunciado descreve e nada que diferencie as alternativas. Exemplos: à noite, só as luzes, sem casco; nas boias, fantasmas sem cor e sem forma.
- O **depois** é a MESMA cena, nesta ordem:
  1. ação (manobra, desenho do cabo, cor das boias) em 2,4 s;
  2. seta tracejada branca de 3 (traço 7 7);
  3. rótulos com fade e subida de 4 px em 0,3 s.
- Nunca trocar a cena inteira.

## Placeholder único ("fantasma")
É o mesmo fundo da cena final, com o objeto em tinta a 15% e um disco "?" (raio 22, azul, borda 3) no centro.

## Controles
Ficam numa barra FORA do SVG, abaixo da moldura e alinhada à direita, com pílulas iguais: "↻ Ver de novo", "🔊 Ouvir", "🐢". O replay vale para toda revelação animada.

## Movimento reduzido
Com `prefers-reduced-motion`, a cena vai direto para o estado final. Os apitos ganham um aviso textual (`aria-live`).
