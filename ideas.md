# Direção de design — Recanto das Plantas

## Três direções exploradas

| Tema | Introdução breve | Probabilidade |
|---|---|---:|
| **Estufa Editorial** | Uma estética botânica contemporânea, com a delicadeza de uma revista de jardinagem e a materialidade de uma estufa bem-cuidada. A experiência transmite conhecimento, calma e desejo de levar a natureza para casa. | 0,07 |
| **Caderno de Horta** | Um universo artesanal inspirado em etiquetas de viveiro, anotações de cultivo e papel reciclado. A direção é íntima, acolhedora e muito humana. | 0,03 |
| **Jardim ao Entardecer** | Uma direção solar e mediterrânea, com barro, folhas em sombra e os tons quentes do fim de tarde em Maceió. O resultado seria mais exuberante e sensorial. | 0,09 |

## Direção escolhida: Estufa Editorial

### Movimento de design

**New Botanical Editorial**, combinando o refinamento gráfico de revistas de casa e jardim com a organicidade de uma estufa contemporânea. A página deve parecer uma seleção cuidadosa de espécies e soluções para ambientes, não um catálogo genérico.

### Princípios centrais

1. **Natureza com curadoria:** cada bloco apresenta uma seleção, uma utilidade e uma história curta; o visual evita excesso decorativo.
2. **Assimetria serena:** títulos, imagens e chamadas ocupam pesos diferentes, em composições que lembram páginas editoriais.
3. **Textura tátil:** fundos com papel quente, linhas de cultivo e sombras de folhagem dão profundidade sem perder legibilidade.
4. **Conversão discreta:** o pedido pelo WhatsApp está sempre acessível, mas aparece como consequência natural da descoberta do catálogo.

### Filosofia de cor

O **verde profundo** transmite confiança de quem entende de plantas, enquanto o **areia-clara** cria uma base doméstica e luminosa. O terracota deve atuar como lembrança da terra, dos vasos e do cuidado manual, nunca como elemento agressivo. A assinatura da marca será o **Verde Folhagem** (`#1F5C3E`): um verde vivo, denso e proprietário, aplicado nos pontos decisivos de ação e reconhecimento.

### Paradigma de layout

Uma **narrativa de viveiro** em faixas assimétricas, em vez de uma página centralizada em cartões idênticos. O hero usa uma coluna editorial à esquerda, uma imagem alta à direita e uma etiqueta vertical de entrega. O catálogo aparece como uma prateleira fluida; o manifesto quebra a página com uma faixa escura; a rota e o contato formam uma “ficha de visita” ampla no rodapé.

### Elementos de assinatura

1. **Selo-botânico circular:** uma marca de folha e sol em formato de selo, repetida em pequeno formato nos detalhes importantes.
2. **Etiquetas de cultivo:** pílulas minimalistas em caixa alta para categorias, origem e disponibilidade.
3. **Linhas de poda:** traços finos e orgânicos que conectam áreas da página como ramos, sem virar ilustração excessiva.

### Filosofia de interação

A interação deve parecer a manipulação de um catálogo físico: imagens se revelam com leve elevação, etiquetas mudam de tom e os botões confirmam a ação com firmeza. Os links de navegação devem rolar para a seção correspondente; botões de pedido levam ao WhatsApp com uma mensagem contextualizada.

### Animação

Entradas discretas por opacidade e deslocamento vertical de no máximo 16 px, com intervalos de 50 ms entre elementos relacionados e duração entre 180–260 ms. No hero, apenas a imagem principal recebe um movimento de escala muito suave. Hover em cartões e botões deve durar 160 ms; a interface respeitará `prefers-reduced-motion`.

### Sistema tipográfico

**Cormorant Garamond** para títulos, com itálico usado como gesto editorial em palavras-chave; **DM Sans** para corpo, navegação e informações práticas. Títulos devem ter amplo espaçamento vertical, corpo com entrelinha confortável e etiquetas em caixa alta com rastreamento amplo.

### Essência de marca

**Posicionamento:** uma floricultura-viveiro de Maceió que transforma plantas, vasos e arranjos em escolhas simples para casas mais vivas.  
**Personalidade:** cuidadosa, luminosa, conhecedora.

### Voz da marca

As chamadas falam com proximidade tranquila e conhecimento prático; CTAs convidam, não pressionam. Evitar frases vazias, adjetivos excessivos e tom publicitário genérico.

> “Sua casa tem espaço para mais verde.”

> “Escolha a planta. A gente ajuda no resto.”

### Wordmark e logo

O wordmark deve unir uma serifada botânica em “Recanto” a uma assinatura sans discreta em “das Plantas”. O ícone é um **R** construído por um caule curvo e duas folhas, dentro do selo circular. O símbolo funciona sozinho no cabeçalho e como favicon; não deve depender do texto para ser reconhecível.

## Style Decisions

- Priorizar fotos botânicas luminosas, com um toque de editorial contemporâneo e espaço negativo para texto.
- Não usar gradientes roxos, estética neon, tipografia Inter, cartões uniformes ou layouts excessivamente centralizados.
- Utilizar o Verde Folhagem como cor de assinatura e garantir contraste alto em todo texto sobre imagens.
- Toda fotografia deve parecer feita em casa, viveiro ou bancada editorial; fotos isoladas de produto em fundo branco, ou objetos de cor fria e saturada, ficam fora do sistema.
- O catálogo sempre inclui uma etiqueta de cultivo ou uma nota de curadoria; os selos, etiquetas e traços botânicos devem reaparecer para costurar a experiência.
- A apresentação institucional é breve e concreta: ela explica a proposta de cuidado da loja sem inventar história, fundador, anos de atuação ou promessas não confirmadas.
