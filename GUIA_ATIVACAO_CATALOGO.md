# Guia simples: catálogo, Supabase e conta administradora

Este projeto já tem duas telas: o site público e a área privada em `/admin.html`. A área privada só libera a edição de produtos para uma conta Google cadastrada como administradora. Até o Supabase ser conectado, o site continua normal e mostra os itens visuais atuais.

## O que será necessário depois

| Item | Para que serve | Quem deve ter acesso |
|---|---|---|
| Projeto Supabase | Guarda produtos, fotos, preços e permissões | Você durante a demonstração; o proprietário após aprovação |
| Conta Google | Entra na área `/admin.html` | Administrador atual da loja |
| Repositório GitHub | Guarda o código e publica o site | Você durante a demonstração; proprietário como titular após a venda |

## Ativar o Supabase

1. Entre em [supabase.com](https://supabase.com) com a sua conta Google e crie um projeto chamado `recanto-das-plantas-demo`.
2. No projeto, abra **SQL Editor**, crie uma consulta e cole o arquivo `supabase/migrations/20260827_catalogo_recanto.sql` deste repositório. Execute uma vez.
3. Abra **Project Settings → API**. Copie a **Project URL** e a **Publishable key**. A chave `service_role` não deve ser copiada para o site, GitHub ou painel público.
4. No GitHub, abra o repositório e crie duas **Actions variables**: `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`. Cole respectivamente a URL e a chave pública.
5. No Supabase, abra **Authentication → URL Configuration**. Em **Site URL**, informe a URL publicada do GitHub Pages. Em **Redirect URLs**, adicione a mesma URL seguida de `/admin.html`.

## Ativar o login com Google

1. No [Google Cloud Console](https://console.cloud.google.com/), crie um projeto e, em **Google Auth Platform**, crie um cliente OAuth do tipo **Web application**.
2. Adicione a URL do GitHub Pages em **Authorized JavaScript origins**. Por exemplo: `https://SEU-USUARIO.github.io`.
3. No Supabase, abra **Authentication → Providers → Google**. Copie a URL de callback mostrada pelo próprio Supabase para **Authorized redirect URIs** no Google Cloud. Depois cole o **Client ID** e o **Client Secret** no provedor Google do Supabase e o habilite.
4. Abra `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/admin.html`, entre com sua conta Google e copie o ID que a página exibe.
5. No SQL Editor do Supabase, execute o comando abaixo, trocando os dois valores pelos dados da conta que entrou:

```sql
insert into public.store_admins (user_id, email)
values ('ID_DO_USUARIO_DO_SUPABASE', 'email-da-conta-google@exemplo.com');
```

Depois disso, a conta cadastrada poderá adicionar fotos, nome, categoria, preço, descrição e disponibilidade. No envio da foto, o painel também permite escolher o enquadramento vertical que ficará melhor no catálogo do celular; a imagem original é preservada. O site público buscará somente produtos ativos e disponíveis.

## Manter o projeto gratuito ativo

O repositório contém a rotina `Manter catálogo Supabase ativo`, configurada para fazer uma verificação simples todos os dias. Depois de exportar o código para o GitHub, abra **Settings → Secrets and variables → Actions** no repositório e crie estes dois segredos: `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY`. Use apenas a URL do projeto e a chave pública; nunca coloque a chave `service_role` no GitHub ou no site.

Essa rotina não altera produtos e não lê dados do cliente. Ela reduz o risco de pausa por inatividade no plano gratuito, mas a garantia de não haver pausa automática continua sendo exclusiva dos planos pagos do Supabase.

## Entregar as contas ao proprietário depois da aprovação

O proprietário cria ou acessa a própria conta no **GitHub**. Essa conta é separada do Google, embora ele possa escolher entrar no GitHub usando o Google dele. Antes da entrega, ele também cria ou acessa uma conta no **Supabase**.

No painel do site, o proprietário abre `/admin.html`, entra com a própria conta Google e informa o ID exibido. Você executa, no SQL Editor do Supabase:

```sql
insert into public.store_admins (user_id, email)
values ('ID_DO_PROPRIETARIO', 'email-do-proprietario@exemplo.com');
```

Depois de confirmar que ele entrou e cadastrou um produto com sucesso, remova seu acesso com:

```sql
delete from public.store_admins
where email = 'seu-email@exemplo.com';
```

Não é necessário mudar e-mail dentro do código. A troca acontece na tabela `store_admins`, protegida pelas políticas do Supabase. Isso evita deixar e-mails de administradores expostos no site público.

Depois que tudo estiver confirmado, transfira o repositório: no GitHub, abra o repositório, vá até **Settings**, desça até **Danger Zone**, escolha **Transfer** e informe o usuário GitHub do proprietário. Ele precisa aceitar o convite em até um dia. Você continua como colaborador depois da transferência, então remova seu acesso se o combinado for que somente o proprietário tenha controle. A documentação do GitHub avisa que o endereço do GitHub Pages não é redirecionado automaticamente; após a transferência, atualize os links publicados no Instagram e no Google Maps. [4]

Para entregar o Supabase, adicione o proprietário como membro da organização de destino. Depois, sendo proprietário da organização de origem, abra **Project Settings → General** e use a transferência de projeto. O Supabase exige que você seja membro da organização de destino e informa que a operação pode causar uma interrupção breve em alguns casos. [5]

## Publicar no GitHub Pages

No repositório, abra **Settings → Pages** e escolha **GitHub Actions** em *Build and deployment*. A cada envio para a branch `main`, o arquivo `.github/workflows/deploy-pages.yml` compilará e publicará o site. Para esse repositório, a URL esperada é `https://julliosan765.github.io/recanto-das-plantas-demo/`.

## Referências

[1] [Supabase — Login com Google](https://supabase.com/docs/guides/auth/social-login/auth-google)

[2] [Supabase — Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

[3] [Vite — Publicação no GitHub Pages](https://vite.dev/guide/static-deploy)

[4] [GitHub Docs — Transferring a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository)

[5] [Supabase Docs — Project transfers](https://supabase.com/docs/guides/platform/project-transfer)

## Busca, categorias e nomes dos produtos

A página principal continua sendo o catálogo público para testar os produtos cadastrados na área da loja. No painel, o campo **Nome do produto** deve receber o nome específico que o cliente reconheceria, como “Jiboia em vaso 20 cm”, “Cacto mandacaru”, “Vaso cerâmico branco nº 2” ou “Cesto organizador de fibra”. Evite cadastrar apenas “produto”.

No catálogo, a lupa pesquisa pelo nome, categoria e descrição. O filtro **Todos** fica sempre disponível; as categorias padrão aparecem somente quando houver correspondência real nos produtos cadastrados, e as categorias personalizadas também são acrescentadas automaticamente. Assim, a categoria **Organização** estará disponível para itens de arrumação quando a loja cadastrar produtos desse tipo. O pedido continua sendo aberto no WhatsApp para a equipe confirmar disponibilidade e valor, com retirada na loja.
