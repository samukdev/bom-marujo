# Referência: como o Duolingo funciona (UX e mecânicas)

> Objetivo: reunir padrões de UX e mecânicas do Duolingo que podem inspirar o **Bom Marujo**.
> Não é para copiar marca, mascote, cores ou arte — só os princípios.
> Pesquisa feita em nov/2026 com base no blog oficial do Duolingo, no guia de design público deles, no blog da Rive e em análises de UX de terceiros (marcadas como tal quando relevante).

## Resumo

- **Conteúdo em trilha linear**: uma única "trilha" (path) dividida em unidades curtas; cada nó é uma lição de 3–5 min. A ordem já embute **repetição espaçada** (conceitos voltam em intervalos crescentes) e há nós de prática/revisão e desafios de fim de unidade.
- **Lição = sequência de exercícios curtos** com barra de progresso no topo, um botão principal fixo embaixo ("Verificar" → "Continuar") e um **banner inferior verde/vermelho** com som de acerto/erro. Erros são **repetidos no fim da lição**.
- **Exercícios** vão de reconhecimento (múltipla escolha, inclusive com imagem) a produção (montar/digitar). Os de áudio têm botão de **ouvir de novo** ilimitado e botão de **velocidade lenta**, e há opção de "não posso ouvir agora".
- **Gamificação** em camadas: XP por lição, **ofensiva** diária (com "congelamento" para não perder), metas e missões diárias, **ligas** semanais, conquistas, e um limitador de sessões (corações → trocado por "energia" em 2025, com polêmica).
- **Prática personalizada** usa um modelo próprio de memória (Half-Life Regression) para escolher o que revisar; há uma área de "Erros" para revisar o que o usuário errou.
- **Design**: ilustração vetorial plana feita de poucas formas arredondadas, cores com significado fixo, animações curtas (~200 ms) e personagens com **estados emocionais** animados em **Rive** (máquinas de estado).
- **Onboarding**: deixa o usuário fazer uma lição *antes* de pedir cadastro; define meta diária e oferece teste de nivelamento.

---

## 1. Estrutura de conteúdo

**Trilha (path).** Desde o redesign de 2022 a tela inicial é um caminho vertical único, nó a nó. Antes era uma "árvore" de habilidades em que o usuário escolhia livremente; a trilha reduz a decisão ("o que eu faço agora?") a zero: o próximo nó é sempre óbvio.

**Unidades.** As lições são agrupadas em unidades pequenas, cada uma com um cabeçalho que descreve o objetivo em linguagem concreta (ex.: "pedir direções" em vez de "Cidade 3"). Há também um **guia da unidade** (dicas/explicações) acessível pelo cabeçalho. Para alunos intermediários eles passaram a usar "mini-unidades", ainda mais curtas.

**Nós da trilha.** Tipos que aparecem intercalados:
- Lições normais (conteúdo novo misturado com revisão de conteúdo anterior).
- Sessões de prática/revisão embutidas na trilha.
- Histórias (leitura/escuta de uma cena curta) posicionadas pela dificuldade.
- Baú de recompensa (pausa motivacional).
- Desafio de fim de unidade ("Lendário"): uma versão mais difícil, sem ajuda, que serve como prova da unidade e como prática contínua depois.

**Checkpoints e saltos.** Historicamente há pontos de controle ao longo do curso e a opção de "pular para cá" fazendo um teste — quem já sabe não precisa refazer o básico. Lições concluídas podem ser refeitas tocando no nó.

**Por que funciona:** progresso visível (posição na trilha), decisões mínimas, revisão espaçada sem o usuário precisar planejar.

**Críticas registradas:** usuários avançados reclamaram de perder a liberdade de escolha e de a reorganização embaralhar o progresso. Ou seja: trilha linear é ótima para iniciantes, mas convém permitir revisão livre e "pular com teste".

## 2. Tipos de exercício

Do mais fácil ao mais difícil (o Duolingo sobe a dificuldade *dentro* da lição):

| Tipo | Como é | Habilidade |
|---|---|---|
| Múltipla escolha com imagem | 3–4 cartões com ilustração + rótulo; escolher o que corresponde ao enunciado | Reconhecimento |
| Múltipla escolha de texto | Escolher a tradução/frase correta | Reconhecimento |
| Pares (matching) | Ligar itens de duas colunas; pares somem ao acertar | Reconhecimento rápido |
| Completar lacuna | Frase com espaço e opções | Reconhecimento em contexto |
| Banco de palavras | Montar a resposta tocando em "fichas" | Produção guiada |
| Digitar | Escrever a resposta livre | Produção livre |
| Escuta: "o que você ouviu?" | Tocar áudio e escolher a opção correta | Escuta |
| Escuta: "toque/digite o que ouviu" | Transcrever o áudio com fichas ou teclado | Escuta + produção |
| Pares de áudio | Botões de alto-falante para ligar som ↔ significado | Escuta |
| Fala | Repetir uma frase no microfone | Pronúncia |

**Detalhes do player de áudio:**
- Botão grande de alto-falante, que toca automaticamente ao abrir o exercício e pode ser tocado **quantas vezes quiser**.
- Botão secundário de **velocidade lenta** (ícone de tartaruga) ao lado.
- Opção "**Não posso ouvir agora**", que desativa exercícios de áudio pelo resto da lição (ou por um tempo) sem penalidade — importante para quem estuda em público.
- Andaime (scaffolding): no início da unidade o áudio vem acompanhado do texto; depois o texto some e o aluno depende só do som.
- Há uma área de prática "só escuta" e um formato tipo rádio/podcast para escuta mais longa.
- Configuração de acessibilidade para usuários com deficiência auditiva reduzirem/pularem áudio.

## 3. Fluxo de uma lição

1. **Topo:** botão de fechar (X), **barra de progresso** grossa e arredondada, contador de vidas/energia.
2. **Enunciado** curto no topo ("Selecione a imagem correta", "O que você ouviu?") + conteúdo.
3. **Rodapé fixo** com um único botão principal, desabilitado até o usuário responder ("Verificar"). Há um botão secundário "Pular".
4. Ao verificar, um **banner sobe da borda inferior**:
   - **Acerto:** fundo verde, ícone de check, elogio curto variado ("Muito bem!"), som agradável, botão vira "Continuar".
   - **Erro:** fundo vermelho (tom suave, não alarmante), mostra **a resposta correta**, som discreto, botão "Entendi"/"Continuar". Às vezes há explicação curta e opção de reportar.
5. A barra de progresso **anda mesmo com erro** (um pouco menos), para nunca parecer travada.
6. **Sequência de acertos** ("5 seguidas!") gera micro-celebração no meio da lição.
7. **Repetição de erros no fim:** perguntas erradas voltam antes de concluir — a lição só termina quando todas foram acertadas. O blog oficial explica que deixam para o fim de propósito, para ganhar um pouco de espaçamento.
8. A lição tende a **terminar com algo fácil**, para encerrar com sensação de sucesso.
9. **Tela de fim de lição:** personagem comemorando, XP ganho, precisão (%), tempo, progresso de missões diárias e da ofensiva; depois volta à trilha com animação do próximo nó desbloqueado.

**Detalhes de interação:** botões com "borda inferior" grossa que afunda ao pressionar (sensação física); transições de feedback rápidas (~200 ms); suporte a teclado no web (Enter = Verificar/Continuar, números para escolher opção).

## 4. Gamificação

- **XP:** pontos por lição (bônus por precisão/velocidade e em eventos de "XP em dobro"). Alimenta ligas e metas. Crítica comum: mede volume, não aprendizado.
- **Ofensiva (streak):** dias seguidos com pelo menos uma lição. É o principal mecanismo de retenção (aversão à perda). Complementos:
  - **Congelamento de ofensiva**: protege a ofensiva se faltar um dia — remove a "falha catastrófica" que faz o usuário desistir.
  - Calendário da ofensiva, marcos (7, 30, 100, 365 dias), animação de "fogo" que fica mais urgente quando a ofensiva está em risco, notificação no fim do dia.
- **Meta diária:** escolhida no onboarding (ex.: 5/10/15/20 min por dia).
- **Missões diárias e mensais:** 3 pequenas missões por dia ("ganhe 30 XP", "acerte 5 seguidas", "faça 1 lição com 90%+"); completar missões no mês dá uma insígnia colecionável.
- **Ligas:** ranking semanal com ~30 pessoas por XP; os primeiros sobem de divisão, os últimos descem (10 divisões). Gera muita motivação para alguns e ansiedade para outros.
- **Conquistas:** insígnias por marcos (ofensiva, lições perfeitas, XP total etc.).
- **Corações → Energia:** corações limitavam erros (5 vidas; perder todas encerra a sessão até recarregar ou praticar). Em 2025 trocaram por **energia**, que é gasta por exercício (certo ou errado). A justificativa foi não punir o erro; a recepção foi bem negativa (percebida como mais monetização). Lição: **limitadores servem à monetização mais que ao aprendizado**.
- **Moeda (gemas) e baús:** compram congelamentos, recargas etc.

## 5. Repetição espaçada e prática personalizada

- A **ordem da trilha** já intercala conteúdo novo com reapresentação de conteúdo anterior em intervalos crescentes.
- **Modelo de memória:** o Duolingo publicou o *Half-Life Regression* (HLR), que estima a "meia-vida" de cada item na memória de cada aluno a partir do histórico (acertos, erros, tempo desde a última vez). Quando a probabilidade de lembrar cai, o item volta. O artigo original relata erro bem menor que o sistema Leitner clássico (caixinhas).
- **Prática personalizada:** sessões de revisão escolhem itens combinando o modelo de esquecimento com a precisão do aluno.
- **Central de prática:** coleções de "**Erros**" (revisar o que errou), "Palavras", revisão do dia que muda diariamente, e práticas por habilidade (só escuta, só fala).
- **Força do conteúdo:** versões antigas mostravam barras de "força" que decaíam com o tempo, convidando a revisar.

## 6. Princípios de design

**Ilustração** (guia público de design + blog):
- Estilo **vetorial e plano**, poucas formas geométricas arredondadas (círculo, "pílula", retângulo arredondado), sombras planas em forma de pílula — sem perspectiva.
- **Só os detalhes necessários** para comunicar o conceito: poucos confunde, demais distrai.
- Silhuetas claras, cores vivas sobre fundo branco, **exagero e humor** para tornar frases simples memoráveis e reduzir o medo de errar.
- Personagens nunca em pose estática ou sem expressão; bocas assimétricas para parecerem vivas.
- O estilo enxuto existe também por **produtividade**: permite produzir muita ilustração rápido.

**Cores com significado fixo** (o padrão, não a paleta): verde = sucesso/ação principal; vermelho = erro/vidas; laranja = ofensiva; amarelo = XP/recompensa; azul = informação; roxo = ligas/premium; cinzas = superfícies.

**Animação:**
- Feedback rápido (~200 ms), progresso com easing suave, "idle" sutil em personagens/ícones.
- Personagens animados em **Rive** com **máquinas de estado**: o app só muda entradas (ex.: `acertou`, `errou`, `falando`) e o arquivo decide a transição. Usam isso também para sincronizar boca com áudio (visemas).
- Equipe de **creative technologists** monta as máquinas de estado e documenta as entradas para os engenheiros; "o design é o produto final", sem recriar animação em código.

**Mascote com estados emocionais:** feliz (acerto), comemorando (fim de lição), triste/preocupado (lembrete, ofensiva em risco), frustrado (erros seguidos), sonolento (inatividade). Dá peso emocional ao feedback e torna notificações mais simpáticas.

**Sons de feedback:** sons curtos e distintos para acerto e erro (o de erro é suave), som de conclusão; o som de acerto vira um sinal condicionado de progresso. Pode ser desligado nas configurações.

**Onboarding:**
- Escolhe o curso → motivo/objetivo → **meta diária** → nível (iniciante ou **teste de nivelamento**) → **primeira lição** → só então pede cadastro (segundo relatos de A/B, adiar o cadastro aumentou usuários ativos).
- Pré-compromisso (meta diária, permissão de notificação) antes da primeira lição.

## 7. Tecnologias de animação

| Opção | Prós | Contras |
|---|---|---|
| **Rive** (`@rive-app/react-canvas`) | Máquina de estado nativa (ideal para mascote com estados e ilustração interativa); arquivos binários muito pequenos; editor gera o asset final; runtime web via canvas/WASM | Curva de aprendizado do editor; runtime WASM (~100–200 KB) a carregar; texto/acessibilidade dentro do canvas é limitado; menos animadores disponíveis |
| **Lottie** (`lottie-web` / dotLottie) | Padrão de mercado, exporta do After Effects, muitos animadores e bibliotecas prontas; bom para animações lineares (confete, check, troféu) | JSON grande para cenas complexas; interatividade/estado historicamente limitados (dotLottie agora tem state machine, mas menos maduro); custo de CPU em animações pesadas |
| **SVG animado** (CSS/SMIL ou Framer Motion/GSAP) | Zero dependência pesada; acessível e indexável; controle total via React; ótimo para diagramas didáticos (barco, luzes, boias) com partes animáveis; fácil de gerar/editar no código | Personagens com rig e muitas poses viram muito trabalho manual; performance cai com muitos nós/filtros |
| Vídeo/GIF | Simples | Pesado, sem interatividade, não escala bem |

---

## O que adaptar para o Bom Marujo

**Estrutura**
1. **Trilha por unidade temática do programa da Marinha** (ex.: RIPEAM/regras de governo, luzes e marcas, sinais sonoros, balizamento IALA-B, segurança/salvatagem, navegação básica, legislação/NORMAM, primeiros socorros, específicos de motonauta). Cada unidade com 4–6 nós de 3–5 min.
2. **Modo Aula = nó de lição**: 1–3 telas de explicação curta com ilustração animada → 5–10 questões subindo de dificuldade. Guia da unidade sempre acessível (o "resumo para consulta").
3. **Desafio de fim de unidade** sem ajuda e **"pular unidade com teste"** para quem já tem experiência náutica.
4. **Modo Simulado** separado da trilha: mesmo formato/quantidade/tempo da prova real, **sem feedback imediato**, correção completa no fim com explicação por questão e envio automático dos erros para revisão. Mostrar "probabilidade de aprovação" a partir do histórico de simulados.

**Exercícios**
5. Priorizar o que a prova cobra: **múltipla escolha com imagem** (qual embarcação tem preferência? que luz é essa? qual boia indica o canal?), múltipla escolha de texto, pares (sinal ↔ significado) e **"identifique a situação"** com ilustração animada (ex.: luzes de uma embarcação à noite girando para revelar o aspecto).
6. **Exercícios de áudio para sinais sonoros**: botão grande "tocar" (autoplay ao abrir), replay ilimitado, **opção "mais lento"** (aumentar o espaçamento entre apitos curtos/longos, que é justamente o que confunde) e visualização opcional dos apitos como traços (• curto, — longo) depois de responder. Incluir "**Não posso ouvir agora**". Áudios gerados de forma sintética (tom + durações) garantem consistência e tamanho mínimo.
7. Andaime: primeiro o som vem com a notação (• —), depois só o som.

**Fluxo da lição**
8. Copiar o *padrão* de interação: barra de progresso no topo, botão único no rodapé (Verificar → Continuar), **banner inferior** de acerto/erro com som curto e **explicação de 1–2 linhas citando a regra** (ex.: "Regra 15 – situação de cruzamento") — mais didático que o Duolingo, porque a prova cobra a regra.
9. **Erros voltam no fim da lição**; a lição só termina quando tudo foi acertado. Barra avança mesmo com erro. Atalhos de teclado no web.
10. Tela final: precisão, XP, ofensiva, e "**itens para revisar**".

**Gamificação (dosar)**
11. Usar: **XP**, **ofensiva com congelamento** (ganho por mérito, não comprado), **meta diária**, **missões diárias** simples e **conquistas temáticas** (ex.: graduações náuticas). Uma métrica central de **"prontidão para a prova"** por tema vale mais para esse público do que ligas.
12. **Evitar** corações/energia punitivos (o público quer passar numa prova; limitar o estudo atrapalha) e deixar **ligas** como opcional ou para depois.

**Repetição espaçada**
13. Começar simples: Leitner/SM-2 por questão (ou o HLR simplificado), com uma seção "**Meus erros**" e uma "**Revisão do dia**". Guardar histórico por questão desde o primeiro dia para poder evoluir o modelo.

**Design**
14. Ilustração vetorial **plana, poucas formas, sem perspectiva**, com identidade própria (náutica). Cores com **significado fixo**, mas atenção: vermelho/verde/branco/amarelo são **conteúdo** (luzes de navegação, boias). Usar cores de feedback que não colidam com as cores das questões e sempre reforçar com ícone + texto.
15. **Mascote original** (ex.: um marujo ou um animal marinho) com estados: neutro, feliz, comemorando, preocupado, sonolento.
16. **Tecnologia sugerida:** **SVG animado em React** (Framer Motion/CSS) para as cenas didáticas (barcos, luzes, boias, ângulos de setor) — controle fino e fácil de gerar muitas variações; **Rive** só para o mascote com máquina de estados; **Lottie** opcional para microcelebrações prontas. Respeitar `prefers-reduced-motion`.
17. **Onboarding**: objetivo (Arrais ou Motonauta + data da prova) → meta diária → teste de nivelamento opcional → primeira lição → cadastro só depois (progresso salvo localmente até lá).

---

## Fontes

Oficiais (Duolingo / Rive):
- https://blog.duolingo.com/new-duolingo-home-screen-design
- https://blog.duolingo.com/intermediate-mini-units
- https://blog.duolingo.com/spaced-repetition-for-learning
- https://blog.duolingo.com/how-we-learn-how-you-learn
- https://blog.duolingo.com/guide-to-duolingo-practice-hub/
- https://blog.duolingo.com/ways-to-practice-in-duolingo
- https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-listening-skills/
- https://blog.duolingo.com/learning-with-hearing-aids/
- https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo
- https://blog.duolingo.com/duolingo-energy/
- https://blog.duolingo.com/shape-language-duolingos-art-style/
- https://blog.duolingo.com/world-character-visemes
- https://design.duolingo.com/illustration
- https://design.duolingo.com/illustration/characters
- https://research.duolingo.com/
- Settles & Meeder (ACL 2016), Half-Life Regression: https://preview.aclanthology.org/fix_video/P16-1174.pdf
- https://rive.app/blog/creative-technologists-duolingo-s-solution-to-the-designer-to-developer-handoff
- https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life

Análises de terceiros (usar com cautela):
- https://blakecrosley.com/guides/design/duolingo
- https://medium.com/usabilitygeek/ux-case-study-duolingo-ade986ec7450
- https://ixd.prattsi.org/2021/09/design-critique-duolingo-web-app/
- https://uxdesign.cc/duolingos-small-ui-switch-that-changes-everything-fae257203633
- https://www.deconstructoroffun.com/blog/2025/4/14/duolingo-how-the-15b-app-uses-gaming-principles-to-supercharge-dau-growth
- https://duolingo.deconstructoroffun.com/mechanics/leagues
- https://www.androidauthority.com/quitting-duolingo-energy-system-3599842/
- https://goodux.appcues.com/blog/duolingo-user-onboarding
- https://taplytics.com/blog/duolingo-ab-test-onboarding
- https://callstack.com/blog/lottie-vs-rive-optimizing-mobile-app-animation
- https://rive.app/blog/rive-as-a-lottie-alternative
- https://lottiefiles.com/blog/lottie-animations/lottiefiles-or-rive
