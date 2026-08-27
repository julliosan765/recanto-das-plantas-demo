# Integração futura: Supabase, Google e GitHub Pages

## Fontes consultadas

- [Login com Google no Supabase](https://supabase.com/docs/guides/auth/social-login/auth-google): para um site web, criar um cliente OAuth do tipo Web no Google Cloud, cadastrar a URL do site em **Authorized JavaScript origins**, cadastrar a URL de callback indicada pelo Supabase em **Authorized redirect URIs** e ativar o provedor Google dentro do painel do Supabase. O código web usa `signInWithOAuth({ provider: 'google', options: { redirectTo } })`.
- [Autenticação no Supabase](https://supabase.com/docs/guides/auth): o Supabase Auth integra autenticação por Google com autorização no banco via JWT e políticas RLS.
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security): toda tabela do esquema exposto deve ter RLS ativado; é necessário revogar permissões excessivas e conceder ao público somente leitura de produtos publicados. A chave `service_role` nunca deve ir para o navegador.
- [Publicação estática do Vite](https://vite.dev/guide/static-deploy): em GitHub Pages, uma URL de projeto usa `base: '/<repositorio>/'`; um domínio personalizado usa `base: '/'`. A publicação requer um workflow do GitHub Actions.
- [Workflow GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages): o workflow deve ter permissões `contents: read`, `pages: write` e `id-token: write`, empacotar o build e fazer o deploy do artefato.

## Regras de segurança da implementação

1. Somente `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` serão expostas ao frontend; a chave `service_role` não será adicionada ao código, ao repositório ou ao GitHub Pages.
2. O e-mail administrador deve ser controlado por tabela e política RLS no Supabase, e não somente escondido na interface do navegador.
3. Até a empresa criar sua conta e informar as chaves, o catálogo continuará em modo demonstração e o painel administrativo não permitirá alterações persistentes.

## Estado final da demonstração — 27 de agosto de 2026

O projeto Supabase da demonstração é `sdkyswgloohduydueqfo`, hospedado na região de São Paulo. O provedor Google está habilitado. O Site URL padrão está definido como `https://recantoplt-9svuvrks.manus.space/`, e as URLs de retorno permitidas incluem o domínio publicado, a prévia do Manus, `localhost:3000`, `127.0.0.1:3000` e o domínio planejado do GitHub Pages. A entrada administrativa usa `admin.html` e o servidor de desenvolvimento foi ajustado para servir essa página separadamente.

A conta Google temporária `san765ad@gmail.com` foi localizada no Auth do Supabase e cadastrada em `public.store_admins`. Para transferir o projeto, o proprietário deverá entrar com a conta Google dele, confirmar o novo e-mail no Auth, inserir o novo `user_id` em `public.store_admins`, testar o painel e só depois remover a conta temporária. A credencial OAuth do Google Cloud também deverá ser recriada ou transferida para o projeto do proprietário antes da remoção da credencial temporária.

O catálogo público pode ser visitado sem login: qualquer cliente pode pesquisar itens, ver os preços e montar o pedido. O pedido não realiza pagamento e é aberto no WhatsApp para a equipe confirmar disponibilidade e valor. O login Google é exigido somente na área `admin.html`, que protege o cadastro de produtos, WhatsApp e Instagram. O site informa somente a retirada na loja.

O cliente agora remove automaticamente da barra de endereço os fragmentos que carregam tokens Supabase depois de processar a sessão, preservando âncoras comuns como `#catalogo`. A URL de teste que expôs tokens deve ser considerada comprometida; a sessão correspondente deve ser encerrada antes de novos testes.

## Registro de segurança — 27 de agosto de 2026

A auditoria do Supabase confirmou que as tabelas expostas usam RLS e que a leitura anônima se limita aos produtos ativos, disponíveis e com preço, além dos contatos públicos da loja. As funções `is_store_admin` e `keep_project_active` foram removidas da API pública. A autorização administrativa agora é feita pelas políticas RLS com a tabela `public.store_admins`; a automação diária registra somente uma leitura permitida do catálogo.

O único aviso residual do Supabase é a proteção contra senhas vazadas. A interface atual não oferece cadastro ou login por senha: a única entrada administrativa é o OAuth do Google. Portanto, o aviso não se aplica ao fluxo operacional presente. **Se o projeto passar a oferecer login por senha no futuro, a proteção contra senhas vazadas deverá ser habilitada no Supabase Auth antes dessa funcionalidade ser publicada.**
