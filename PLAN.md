# ⚓ Bom Marujo — Plano do projeto

> App de estudo, no estilo Duolingo, para as provas de **Arrais-Amador** e **Motonauta** da Marinha do Brasil.
> Lições curtas, situações marítimas ilustradas e animadas, sinais sonoros reais (apitos) e simulados no formato da prova.

**Status:** Fase 1 em andamento · **Atualizado em:** 08/11/2026

```bash
npm install && npm run dev   # http://localhost:3000
npm test                     # regras RIPEAM/IALA
```

| Documento | Conteúdo |
|---|---|
| [docs/referencias/marinha-arrais-motonauta.md](docs/referencias/marinha-arrais-motonauta.md) | Norma vigente, formato da prova, programa oficial, fontes, tabelas RIPEAM/IALA |
| [docs/referencias/duolingo.md](docs/referencias/duolingo.md) | Mecânicas e UX do Duolingo, e o que adaptar |
| [docs/mascote-prompts.md](docs/mascote-prompts.md) | Conceito do Marujo e prompts para logo, expressões e abertura |
| [prototipos/cenas.html](prototipos/cenas.html) | Protótipo das 3 cenas (luzes, boias, apito) com fluxo de lição |

---

## 1. Objetivo

Fazer o usuário **passar na prova** de Arrais-Amador e/ou Motonauta e **entender de verdade** as regras, de forma divertida e em poucos minutos por dia.

**Métrica de sucesso:** o usuário chega na prova com "prontidão" ≥ 80% em todos os temas e é aprovado. A nota mínima é 5,0, mas o objetivo é ir bem acima disso.

### O que é a prova (resumo da pesquisa)
| | Arrais-Amador | Motonauta |
|---|---|---|
| Norma | NORMAM-211/DPC (Anexo 5-A) | NORMAM-212/DPC (Anexo 3-C) |
| Questões | 40, múltipla escolha | 20, múltipla escolha |
| Tempo | até 2h | até 1h30 |
| Aprovação | nota 5,0 (50%) | nota 5,0 (50%) |
| Pré-requisito | 18 anos + treinamento náutico de 6h | treinamento de 3h |

O Arrais **não** habilita para moto aquática, então o app tem duas trilhas que compartilham conteúdo. O Motonauta cobre ~8 temas, praticamente um subconjunto do Arrais.
⚠️ Itens a confirmar estão na seção "Lacunas" do arquivo de referência da Marinha.

---

## 2. Público e plataforma

- **Usuário principal:** quem vai tirar Arrais e/ou Motonauta. Adulto, estuda pelo celular em momentos curtos.
- **Plataforma:** **web app responsivo + PWA**, instalável no celular e funcionando offline. Uma base de código só, sem loja de apps no começo. Se fizer sentido, vira app nativo depois (Capacitor ou Expo).
- **Idioma:** pt-BR.

---

## 3. Modos do app

### 3.1 🧭 Trilha / modo Aula (principal)
Caminho linear por **temas → unidades → lições**, como o Duolingo.
- **Lição de aula (3–5 min):** 2–4 *cartões de conceito* (explicação curta com cena animada e o Marujo comentando), depois 6–10 questões sobre o conceito.
- A dificuldade cresce dentro da lição, do reconhecimento ("qual destas é a boia de boreste?") para a aplicação ("o que você faz nesta situação?").
- **Erros voltam no fim da lição.** A barra de progresso avança mesmo com erro, e a lição termina com uma questão fácil.
- **Revisão de unidade** no fim de cada unidade, com questões misturadas e mais difíceis.
- Permitir **pular unidade com teste** para quem já sabe.

### 3.2 📝 Modo Simulado
Imita a prova real.
- **Arrais:** 40 questões, cronômetro de 2h. **Motonauta:** 20 questões, cronômetro de 1h30.
- Distribuição por tema proporcional à prova (ver seção 3.3 da referência da Marinha).
- **Sem feedback durante a prova.** No fim: nota, aprovado/reprovado, revisão questão a questão com explicação e desempenho por tema.
- Histórico de simulados e gráfico de evolução.
- Opção de "simulado rápido" (10 questões, sem cronômetro).

### 3.3 🔁 Prática de erros / Revisão do dia
- **Repetição espaçada** por questão (Leitner/SM-2 no MVP), guardando histórico de cada resposta desde o primeiro dia.
- "Revisão do dia": o que está para ser esquecido. "Meus erros": o que errei recentemente.

### 3.4 📯 Treino de sons (destaque)
- Player grande no estilo Duolingo: **🔊 Ouvir** + **🐢 Devagar** (aumenta o intervalo entre os apitos).
- Exercícios: "ouça e identifique o significado", "qual sequência corresponde a 'estou dando atrás'?", "neblina: que sinal esta embarcação emite?".
- Depois da resposta, mostrar a **notação visual** (• curto, ▬ longo) e animar a cena (a embarcação manobra).
- Sons **sintetizados com Web Audio**, com duração conforme o RIPEAM (curto ≈ 1s, longo 4–6s). Leves, precisos e sem direitos autorais. Sino e gongo também podem ser sintetizados.

---

## 4. Conteúdo (temas)

Baseado no programa oficial. A coluna **M** indica o que também cai para Motonauta.

| # | Tema | M | Destaques para o app |
|---|---|---|---|
| 1 | **Nomenclatura e marinharia** | | Partes da embarcação, bordos, direções relativas (proa, través, alheta, bochecha), nós (animados!), manobras, homem ao mar |
| 2 | **Luzes e marcas (RIPEAM)** | ✅ | Luzes por tipo de embarcação e aspecto (proa, través, popa), marcas diurnas (balão, cone, cilindro) |
| 3 | **Regras de governo (RIPEAM)** | ✅ | Roda a roda, rumos cruzados, ultrapassagem, preferência, canais estreitos, visibilidade restrita |
| 4 | **Sinais sonoros e luminosos** | ✅ | Manobra (1/2/3 curtos), dúvida (5+), canal estreito, cerração, sinais de perigo |
| 5 | **Balizamento IALA B** | ✅ | Laterais, canal preferencial, cardinais (com ritmo de luz animado), perigo isolado, águas seguras, especiais, perigo novo |
| 6 | **Sinais de perigo / socorro** | ✅ | Pirotécnicos, bandeiras, braços, MAYDAY |
| 7 | **Salvatagem e equipamentos** | | Coletes (classes), boias circulares, pirotécnicos, balsas, palamenta |
| 8 | **Sobrevivência** | ✅ | Abandono, posição HELP, agrupamento, hipotermia |
| 9 | **Primeiros socorros** | ✅ | Afogamento, RCP, queimaduras, hemorragias, mal de mar |
| 10 | **Combate a incêndio** | | Triângulo do fogo, classes A/B/C/D, extintores, abastecimento |
| 11 | **Instrumentos náuticos** | | Agulha, GPS, ecobatímetro, tacômetro... |
| 12 | **Meteorologia e marés** | ✅ (meteo) | Beaufort, frentes frias, previsão (Boletim ao Mar), tábua de marés |
| 13 | **Comunicações VHF** | | Canal 16, MAYDAY / PAN-PAN / SÉCURITÉ, alfabeto fonético |
| 14 | **Estabilidade** | | Distribuição de peso, mau tempo, balanço e caturro |
| 15 | **Legislação** | ✅ | LESTA/RLESTA, NORMAM-211/212, documentos, infrações, distâncias de praia |
| 16 | **Moto aquática (específico)** | ✅ só M | Aproximação de praia, banhistas, reboque de esquiador, chave e cordão de segurança |

**Ordem da trilha (proposta):** começar pelo que é mais visual e mais cobrado (Nomenclatura → Luzes → Governo → Sons → Balizamento) e depois os temas mais "decoreba".

### Fonte e revisão do conteúdo
- A base normativa vem do **RIPEAM-72, das NORMAM-211/212, da LESTA/RLESTA e do IALA**, que são textos públicos.
- A **apostila do Samuel** (que ele vai trazer) define temas, ênfases e ilustrações de referência. O texto do app será **escrito com nossas palavras**, sem copiar a apostila (direitos autorais da escola/editora).
- Toda questão tem **`referencia`** (ex.: "RIPEAM Regra 34-a") e passa por revisão técnica antes de entrar (status `rascunho → revisada`).
- Não existem provas antigas oficiais de Arrais/Motonauta publicadas (só de Capitão-Amador). Os simulados serão **questões originais no estilo da prova**.

---

## 5. Tipos de exercício

| Tipo | Exemplo |
|---|---|
| Múltipla escolha com cena | Cena animada + 4 alternativas (protótipo) |
| Escolha a imagem | "Qual destas é a marca cardinal Norte?" (4 cenas pequenas) |
| Áudio → significado | Toca o apito e o aluno escolhe o significado |
| Significado → áudio | "Qual destes sinais é 'estou dando atrás'?" (4 players) |
| Verdadeiro ou falso | Rápido, para revisão |
| Toque na cena | "Toque no bordo por onde você deve deixar a boia" (toca boreste/bombordo na cena) |
| Pares | Ligar luz/marca ao tipo de embarcação |
| Sequência | Montar o sinal sonoro (• ▬) ou a ordem do procedimento de homem ao mar |

No **Simulado** só entra múltipla escolha, como na prova real.

---

## 6. Ilustrações e animações

### Princípio nº 1: precisão normativa
Cor, posição, setor e formato **têm que estar certos**. A ilustração ensina, então não pode ensinar errado.
- **Bombordo = vermelho (esquerda de quem olha para a proa) · Boreste = verde (direita).**
- Vista de **proa**: o verde aparece à **esquerda** de quem observa e o vermelho à **direita** (ver protótipo, cena 1).
- Setores de luz: mastro 225°, bordos 112,5° cada, alcançado 135°, circular 360°.
- IALA B: entrando no porto, **vermelha por boreste (cônica ▲)** e **verde por bombordo (cilíndrica ■)**.

### Motor de cenas paramétrico (peça central da arquitetura)
Em vez de desenhar cada cena à mão, cenas técnicas são **geradas a partir de dados**, e as luzes visíveis são **calculadas pelas regras do RIPEAM**:

```ts
cena({
  periodo: 'noite',
  embarcacoes: [{
    tipo: 'propulsao-mecanica',   // | 'vela' | 'pesca-arrasto' | 'reboque' | 'sem-governo' | 'restrita-manobra' | 'fundeada' | 'encalhada' | 'moto-aquatica' ...
    comprimento: '<50m',
    aspecto: 'proa',              // ângulo relativo ao observador: proa | bb | be | popa | 0–359°
  }],
  boias: [], som: null,
})
// → o motor decide quais luzes/marcas aparecem e onde, e renderiza o SVG animado
```

Vantagens: as cenas saem **sempre corretas**, gerar centenas de questões fica barato ("mesma embarcação vista de outro ângulo") e dá para testar com testes unitários (`tipo + aspecto → luzes esperadas`).

### Estilo
- Vetor plano, **traço grosso escuro**, poucas formas e arredondadas, inspirado no cartoon antigo (*rubber hose*), combinando com o Marujo.
- Movimento "elástico": ondas ritmadas, balanço, boias oscilando, luzes com ritmo real (Fl, Q, VQ, Iso, Oc, LFl).
- **Cores de UI separadas das cores náuticas:** o feedback de acerto/erro **sempre** tem ícone ✓/✕ + texto, para não confundir com luz verde/vermelha.
- Respeitar `prefers-reduced-motion`.

### Tecnologia
| O quê | Como |
|---|---|
| Cenas didáticas | Componentes React gerando **SVG** + **Motion** (Framer Motion) / CSS |
| Mascote (estados: idle, acerto, erro, comemora, pensa, abertura) | **Rive** com *state machine* |
| Comemorações pequenas | Lottie (opcional) |
| Sons | **Web Audio API** (sintetizado) + efeitos curtos de feedback |

---

## 7. O Marujo (mascote)

Personagem **original** no estilo cartoon dos anos 1930: velho marinheiro, bigode, cachimbo, âncora tatuada abaixo do olho, andorinhas no peito, uniforme de marinheiro. Detalhes e prompts em [docs/mascote-prompts.md](docs/mascote-prompts.md).

Papel no app: professor nos cartões de conceito, reação a acertos e erros, lembrete de ofensiva, abertura animada.

---

## 8. Gamificação

| Mecânica | Decisão |
|---|---|
| XP por lição | ✅ |
| Ofensiva diária (🔥) com "congelamento" | ✅ |
| Meta diária (5/10/15 min) | ✅ |
| **Prontidão para a prova** por tema (%) | ✅ métrica principal, mais útil que XP |
| Conquistas (ex.: "Lobo do mar: 7 dias", "Ouvido de ouro: 50 apitos certos") | ✅ |
| Vidas/corações/energia | ❌ **Não**: punitivo, e o público quer estudar à vontade antes da prova |
| Ligas | ⏳ Talvez depois, opcional |
| Contagem regressiva para a data da prova | ✅ ("faltam 12 dias", com plano de estudo ajustado) |

---

## 9. Design system

- **Cor primária: azul** `#1765D8` (sombra dos botões `#0E4BA8`, fundo claro `#E6F0FD`). Tinta/traço `#0B1F3F`, fundo `#F4F7FB`, creme `#F5F1E6`.
- Acerto `#1E9E6A` / erro `#D2463A` só na UI, sempre com ícone.
- Fonte: **Nunito** (arredondada e amigável), em pesos 600/800/900.
- Botões "3D" com sombra inferior, cartões com borda de 2px e cantos de 16px, barra de progresso grossa.
- Tokens em CSS custom properties com tema claro e escuro.

---

## 10. Arquitetura técnica

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Já é a stack do Samuel. ⚠️ Ler `node_modules/next/dist/docs/` antes, porque a versão atual tem mudanças |
| Estilo | CSS Modules + tokens (como no `ig-engagement-ranking`) | Leve e com controle total |
| Animação | Motion + SVG; Rive para o mascote | Ver seção 6 |
| Conteúdo | Arquivos tipados no repo (`content/**/*.ts` ou JSON validado com **Zod**) | Versionado, revisável por PR, funciona offline |
| Progresso | **Local-first**: IndexedDB (Dexie) | Funciona sem conta e offline |
| Conta/sync (fase 5) | Supabase (auth + Postgres) | Só quando precisar sincronizar dispositivos |
| PWA | Service worker + manifest | Instalar no celular e estudar offline |
| Testes | **Vitest** (motor de regras, SRS, sorteio do simulado) + **Playwright** (fluxo de lição) | O motor de cenas/regras precisa de testes |
| Deploy | Vercel | Simples |

### Modelo de dados (conteúdo)
```ts
type Categoria = 'arrais' | 'motonauta';

interface Tema    { id; titulo; icone; ordem; categorias: Categoria[] }
interface Unidade { id; temaId; titulo; ordem }
interface Licao   { id; unidadeId; tipo: 'aula' | 'revisao'; conceitos: CartaoConceito[]; questoes: string[] }

interface CartaoConceito { id; titulo; texto; cena?: CenaSpec; falaMarujo?: string }

interface Questao {
  id: string;
  temaId: string;
  categorias: Categoria[];
  tipo: 'multipla' | 'imagem' | 'audio' | 'vf' | 'toque' | 'pares' | 'sequencia';
  enunciado: string;
  cena?: CenaSpec;            // spec do motor de cenas
  som?: SinalSonoro;          // ex.: ['curto'] | ['longo','curto','curto']
  opcoes: Opcao[];            // texto, cena ou som
  correta: number | number[];
  explicacao: string;
  referencia: string;         // "RIPEAM Regra 34(a)"
  dificuldade: 1 | 2 | 3;
  status: 'rascunho' | 'revisada';
}
```

### Modelo de dados (progresso do usuário, local)
`respostas` (questaoId, acertou, tempo, data, modo) · `srs` (questaoId, caixa, proximaRevisao) · `licoesConcluidas` · `simulados` (data, categoria, nota, respostas) · `perfil` (meta diária, data da prova, ofensiva, XP).

### Estrutura de pastas (proposta)
```
bom-marujo/
├─ PLAN.md
├─ docs/                 referências, prompts, decisões
├─ prototipos/           HTMLs de exploração
├─ content/              temas, unidades, lições, questões (tipados)
├─ src/
│  ├─ app/               rotas: / (trilha), /licao/[id], /simulado, /pratica, /sons, /perfil
│  ├─ components/
│  │  ├─ licao/          LessonShell, BarraProgresso, Rodape/Feedback, Opcao...
│  │  ├─ cenas/          motor de cenas: Embarcacao, Luz, Boia, Mar, Ceu, Apito...
│  │  └─ marujo/         wrapper Rive do mascote
│  ├─ lib/
│  │  ├─ ripeam/         regras: luzes visíveis por tipo + aspecto, sinais sonoros (testado)
│  │  ├─ iala/           boias: cor, formato, tope, ritmo de luz (testado)
│  │  ├─ audio/          síntese de apitos, sino, gongo
│  │  ├─ srs/            repetição espaçada
│  │  ├─ simulado/       sorteio proporcional por tema, correção
│  │  └─ db/             Dexie (progresso local)
│  └─ styles/            tokens.css, globals.css
└─ public/               ícones, manifest, .riv
```

---

## 11. Roadmap

### Fase 0: Fundação
- [x] Pasta do projeto e git
- [x] Pesquisa: Duolingo e Marinha (referências)
- [x] Prompts do mascote
- [x] Protótipo de 3 cenas (luzes, boias, apito) para definir o tom
- [ ] **Samuel traz a apostila**: mapear temas, ênfases e ilustrações → ajustar a seção 4
- [x] Tom visual aprovado (protótipo de cenas)
- [x] Mascote gerado (Grok), 13 poses recortadas e integradas (scripts/recortar-marujo.py)
- [x] Logo: ícone do app, favicon, ícone maskable, emblema transparente, manifest PWA (scripts/gerar-icones.py)
- [x] Módulo de nós: motor de cabos com cruzamentos por z, 6 nós animados, 2 lições e Caderno de nós (/nos)
- [x] Setup do Next.js 16, tokens (azul), fonte Nunito
- [ ] PWA básico (manifest + service worker)
- [ ] Tema escuro

### Fase 1: MVP da lição (o "loop" principal)
- [x] Componentes de lição: progresso, cartões de conceito, opções, rodapé de feedback, repetir erros no fim, tela de fim de lição, atalhos de teclado (1–4 / Enter)
- [x] `lib/ripeam` (luzes por setor + projeção na tela, sinais sonoros) + `lib/iala` (laterais Região B), com 17 testes
- [x] Motor de cenas v1: luzes à noite em qualquer ângulo (motor, vela, fundeada, sem governo, arrasto), canal entrando/saindo, encontro com apito e manobra, bordos
- [x] `lib/audio`: apitos sintetizados curto e longo, sequências, player 🔊/🐢 sincronizado com a fumaça
- [x] Trilha simples + progresso local (localStorage, XP, lições concluídas)
- [ ] Motor de cenas v2: marcas diurnas, cardinais com ritmo de luz, cerração, ≥50 m
- [ ] Conteúdo: **3 temas completos** (Luzes, Sons, Balizamento) com ~60 questões revisadas (hoje: 3 lições, 12 questões)
- [ ] Trocar localStorage por Dexie/IndexedDB

### Fase 2: Simulado + conteúdo completo
- [ ] Modo Simulado (Arrais 40q/2h, Motonauta 20q/1h30) com sorteio proporcional e correção
- [ ] Todos os 16 temas com aula + questões (meta: **400+ questões** revisadas)
- [ ] Trilhas separadas Arrais / Motonauta

### Fase 3: Gamificação + Marujo
- [ ] XP, ofensiva, meta diária, conquistas, data da prova
- [ ] Mascote em Rive com estados + animação de abertura
- [ ] Sons de feedback

### Fase 4: Aprendizagem inteligente
- [ ] Repetição espaçada, "Revisão do dia", "Meus erros"
- [ ] Prontidão por tema
- [ ] PWA offline completo

### Fase 5: Publicação
- [ ] Conta opcional + sync (Supabase)
- [ ] Domínio, analytics com foco em privacidade, deploy
- [ ] Beta com colegas de curso de arrais

---

## 12. Decisões em aberto

1. **Nome do mascote:** *Seu Marujo*, *Mestre Bento*, *Zé Âncora*... ou outro?
2. **Trilhas:** uma trilha única com filtro (Arrais/Motonauta) ou duas trilhas separadas?
3. **Público:** é só para uso pessoal ou vai virar produto? Isso muda a prioridade de conta, sync e monetização.
4. **Revisão técnica:** quem valida o conteúdo? O instrutor da escola náutica pode revisar?
5. **Confirmar dados da prova** (lacunas listadas na referência da Marinha), de preferência com a Capitania local.
6. **Protótipo:** o tom das cenas está bom? Ajustar traço, cores, nível de detalhe ou velocidade das animações?
