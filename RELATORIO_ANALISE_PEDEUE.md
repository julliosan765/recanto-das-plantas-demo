# Como funciona o delivery observado e o que isso muda para a Recanto

**Data da análise:** 27 de agosto de 2026  
**Site observado:** [Esquina Burguer no Pedeue](https://esquinaburguer.pedeue.com/)

## Resposta direta

> **O cliente não precisa de conta Google.** Ele recebe o link, escolhe os produtos, personaliza quando houver opções, vê o total e conclui o pedido. A conta de administração é do estabelecimento no painel da plataforma, não do cliente.

No cardápio observado, há status de aberto/fechado, estimativa de tempo, busca, categorias, fotos, preços, itens indisponíveis, destaques e combos. Ao tocar em um hambúrguer, abre uma tela lateral com foto, quantidade, observação e adicionais com preço próprio. O sistema calcula o total. Como a loja estava fechada no momento da análise, a etapa de finalização ficou bloqueada com **“Loja fechada”**. [1]

## Quem usa o quê

| Pessoa | O que faz | Precisa de Google? |
|---|---|---|
| Cliente | Abre o link, escolhe itens e envia o pedido. | **Não.** |
| Dono/funcionário | Cadastra fotos, preços, categorias, horários, disponibilidade, adicionais e WhatsApp de recebimento no painel da plataforma. | Precisa de acesso ao painel; **não foi possível confirmar que seja via Google**. |
| Plataforma | Hospeda o cardápio, mantém carrinho e organiza a jornada do pedido. | Não se aplica. |

## O modelo do Pedeue

A apresentação oficial da Pedeue oferece três formatos: **vitrine de produtos**, **cardápio digital** e **catálogo de serviços**. Ela informa recebimento de pedidos pelo WhatsApp, aplicativo de computador com impressão automática, pedidos ilimitados e plano anunciado por **R$ 69/mês**, sem taxa por pedido. A página possui os caminhos “Entrar” e “Criar minha loja”, por isso o comerciante tem uma conta de gestão própria na plataforma. [2]

O rapaz que vende isso para lanchonetes provavelmente não está criando um sistema do zero em cada venda. Ele usa uma plataforma já pronta, cria ou configura a loja do cliente, coloca logo/cardápio/WhatsApp e cobra pela implantação, pelo plano mensal, ou pelos dois. É um modelo rápido de entregar porque a estrutura já existe.

## Comparação para a Recanto das Plantas

| Caminho | Cliente precisa de login? | Dono edita produtos? | Pontos fortes | Limitações | Complexidade inicial |
|---|---:|---:|---|---|---:|
| **Plataforma pronta, como Pedeue** | Não | Sim, no painel da plataforma | Rápido; já inclui catálogo, carrinho e recursos de pedido. | Mensalidade e menos liberdade para criar uma marca e visual únicos. | Baixa |
| **Site próprio + painel Supabase** | Não | Sim, após login Google somente do administrador | Site com identidade da Recanto; produtos, estoque/disponibilidade e pedido para WhatsApp do jeito que você definir. | Precisa configurar Supabase, login e permissões uma vez. | Média |
| **Catálogo simples + WhatsApp, alterado por você** | Não | Não diretamente; você faz as mudanças | É a opção mais simples e sem painel para o dono. | Você fica responsável por cada troca de foto, preço ou disponibilidade. | Baixa |

## Melhor caminho para o que você pediu

Para a **Recanto das Plantas**, a melhor continuação é o **site próprio com catálogo e carrinho que prepara o pedido para o WhatsApp**, sem pagamento online por enquanto. É a proposta que já está sendo preparada: o cliente não cria conta, apenas seleciona plantas e envia o pedido pronto; somente o dono entra no painel com Google para cadastrar foto, nome, categoria, preço e disponibilidade.

Isso é parecido com a facilidade que você viu no Pedeue, mas com uma diferença importante: você estará vendendo um site com visual próprio da floricultura, não apenas mais um cardápio com o mesmo modelo visual de vários estabelecimentos.

Quando a dona aprovar, o fluxo seguro é simples: ela entra uma vez com o Google dela no painel; depois você associa o usuário criado ao papel de administrador no Supabase. Não basta somente escrever o e-mail dela no código, porque o usuário precisa existir primeiro no sistema de login.

## Próxima decisão

Há duas formas boas de seguir:

1. **Manter o modelo simples recomendado:** catálogo de plantas + carrinho + pedido preparado para WhatsApp, sem conta para clientes e sem pagamento online.
2. **Aproximar mais do delivery:** acrescentar horários de funcionamento, taxa/área de entrega, observações e uma etapa de confirmação mais parecida com a do Pedeue.

## Referências

[1] [Esquina Burguer — cardápio público no Pedeue](https://esquinaburguer.pedeue.com/), observado em 27 de agosto de 2026.  
[2] [Pedeue — Cardápio digital e gestão de pedidos](https://pedeue.com/), acessado em 27 de agosto de 2026.
