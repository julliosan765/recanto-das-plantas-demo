# Notas de validação OAuth

Em 27/08/2026, o provedor Google foi habilitado no projeto Supabase `sdkyswgloohduydueqfo`.

O Site URL padrão foi atualizado para `https://recantoplt-9svuvrks.manus.space/` e salvo.

As URLs de retorno permitidas foram salvas para o domínio publicado da demonstração, a prévia do Manus, `localhost:3000`, `127.0.0.1:3000` e o domínio planejado do GitHub Pages. O cadastro usa curingas de caminho para suportar a página principal e `admin.html`.

O primeiro teste de login retornou para `localhost:3000` com um fragmento de autenticação. Os valores presentes no fragmento não devem ser reutilizados nem registrados; o usuário foi orientado a encerrar a sessão usada nesse teste.

Foi adicionada ao cliente Supabase uma função que processa a sessão e remove da barra de endereço fragmentos que contenham tokens de autenticação, preservando âncoras normais como `#catalogo`. O comportamento tem teste unitário dedicado em `server/supabase-auth-hash.test.ts`.

A validação automática local passou em tipos, três arquivos de teste com quatro testes e build de produção. O teste interativo final no navegador ainda depende de uma nova sessão sem os tokens do teste anterior.

A definição Drizzle local continua sendo a tabela interna do template; as tabelas `products`, `store_settings` e `store_admins` são do banco Supabase externo e devem ser verificadas pelo esquema remoto antes de qualquer DML.

Após a autorização em `store_admins`, a prévia `admin.html` abriu autenticada e exibiu corretamente somente as áreas Produtos e Informações da loja, com o botão Sair. O catálogo remoto está vazio neste momento, sem dados de teste inseridos.

Com a sessão Google autenticada na prévia, a página pública voltou a exibir a navegação e o catálogo, e o atalho Coleções funcionou. O painel administrativo autenticado também foi confirmado anteriormente. A origem da prévia usa atualmente o domínio `3000-...us4.manus.computer`; a publicação continua no domínio `recantoplt-9svuvrks.manus.space`.

Na sessão autenticada, o link `#catalogo` posicionou a página na seção Produtos e possibilidades; a navegação pública continua funcional e os cartões exibem o CTA Adicionar ao pedido. A rolagem final confirmou os blocos de contato, Instagram e mapa visual; não houve inserção de produto de teste.

A prévia autenticada agora exibe o campo “Pesquisar no catálogo” com ícone de lupa, os filtros Todos, Plantas, Vasos, Flores, Organização e Acessórios, além das categorias cadastradas pelos produtos. A seção mantém 3 opções demonstrativas e o contato público destaca retirada na loja e atendimento pelo WhatsApp.

Teste interativo na prévia autenticada: ao digitar “cactos” na lupa, o catálogo atualizou para “1 opção encontrada” e exibiu somente Cactos & suculentas. Os testes unitários também cobrem acentos, categorias e combinação de busca com filtro.

Validação posterior na prévia: a página pública abre sem login, exibe dois itens demonstrativos — Cactos decorativos por R$ 24,90 e Rosa-do-deserto por R$ 45,90 — ambos identificados como valores de exemplo. A busca e os filtros disponíveis refletem as categorias Plantas e Flores, e não há comunicação de serviço de entrega na interface pública.

Na Área da loja, o cabeçalho foi revisado para mostrar o símbolo botânico e o nome Recanto das Plantas lado a lado, alinhados ao botão Sair, sem corte nem sobreposição.

Teste automatizado em viewport de 390 × 844 px: a busca por “cactos” e o filtro Plantas deixaram um único item visível; o botão adicionou Cactos decorativos ao carrinho; e o botão final gerou a URL de pedido para o WhatsApp com o produto e o total de R$ 24,90.
