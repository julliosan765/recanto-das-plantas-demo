# Login Google da demonstração

Em 27 de agosto de 2026, a conta temporária `san765ad@gmail.com` foi acessada no Google Cloud. Foi criado o projeto temporário `recanto-das-plantas-login`, que será usado apenas para criar a credencial OAuth do login Google da demonstração. O projeto foi selecionado e ainda não possui clientes OAuth cadastrados.

No Supabase, o provedor Google ainda estava desativado no momento da inspeção. O Google Cloud abriu a etapa de identidade do aplicativo, ainda aguardando o início da configuração. Para ativá-lo, será necessário concluir a tela de consentimento do OAuth no Google Cloud, criar uma credencial de **OAuth Client ID** do tipo aplicativo da web e cadastrar a URL de retorno fornecida pelo Supabase. O Client ID e o Client Secret serão configurados no painel de Authentication → Sign In / Providers do Supabase, nunca no código público.

Na primeira etapa da tela de consentimento, o nome público do aplicativo foi definido como **Recanto das Plantas**. O próximo campo é o e-mail de suporte temporário, que será o mesmo e-mail do administrador de demonstração.

O e-mail de suporte temporário foi definido como `san765ad@gmail.com` e o público do aplicativo foi marcado como **Externo**. Enquanto estiver em teste, somente e-mails incluídos na lista de usuários de teste poderão entrar; antes de a loja divulgar o catálogo para todos, o aplicativo deverá ser publicado no Google e a configuração deverá ser revisada sob a conta do proprietário.

A configuração encontra-se na etapa de público externo, pronta para avançar à indicação de contato do desenvolvedor temporário.

O contato de notificações também foi preenchido com `san765ad@gmail.com`. A configuração está pronta para a etapa final de criação do perfil OAuth temporário.

Após a aprovação comercial, o dono deverá criar um projeto Google Cloud próprio ou assumir um projeto equivalente. Uma nova credencial OAuth será criada sob a conta dele, testada no Supabase e só então a credencial temporária será removida. O catálogo e os produtos não precisam ser movidos nesse processo.

## Endereços autorizados preparados

A credencial web temporária foi preenchida com as origens `https://recantoplt-9svuvrks.manus.space` e `https://julliosan765.github.io`. O retorno OAuth configurado é `https://sdkyswgloohduydueqfo.supabase.co/auth/v1/callback`. O cliente foi nomeado **Recanto das Plantas - Web** e está pronto para ser criado no Google Cloud.

> O Client ID e o Client Secret serão tratados como credenciais e não serão registrados neste documento nem no código público.

---

*Última atualização: 27 de agosto de 2026.*


A página confirma a origem atual do Manus, a origem futura do GitHub Pages e o callback do Supabase. O formulário permanece na seção de redirecionamento autorizado, com uma única URI válida preenchida; o botão Criar aparece no rodapé da etapa.


## Cliente OAuth criado

O cliente OAuth web **Recanto das Plantas - Web** foi criado com sucesso no projeto Google Cloud `recanto-das-plantas-login`. O Google exibiu o Client ID na tela de confirmação; por segurança, o Client ID e o Client Secret não foram copiados para este arquivo nem para o código público. O próximo passo é configurar o provedor Google no Supabase com essas credenciais usando o formulário seguro.


O cliente OAuth aparece na lista e nos detalhes como ativo. O identificador público começa com `216515021319-` e termina em `apps.googleusercontent.com`; o segredo está mascarado no painel e não será registrado em arquivo.


## Observação sobre o segredo

O Google Cloud informa que a chave secreta antiga não pode mais ser visualizada nem baixada. Para continuar a integração, é necessário usar **Add secret** para gerar uma nova chave; ela deve ser copiada diretamente para a configuração do provedor Google no Supabase e não deve ser colocada no repositório.


Após retomar a sessão, o detalhe da credencial abriu normalmente. O Google mostra a chave ativa apenas de forma mascarada (`****dHnr`) e orienta gerar outra em **Add secret** quando o valor original não foi guardado.


A sessão Google Cloud foi retomada com sucesso e a credencial OAuth web está ativa. O painel mantém o segredo mascarado e exige **Add secret** para gerar outro; nenhum segredo foi armazenado no projeto local.


A sessão autenticada continua ativa. O painel mostra o cliente OAuth web ativo, o ID público e a orientação do Google para usar **Add secret** quando o segredo anterior não foi guardado. Nenhuma credencial secreta foi gravada localmente.


A credencial OAuth web foi reaberta com a conta `san765ad@gmail.com`. O Google confirma o ID público `216515021319-j3t00ak8amraa87agi8el15563vf5h6u.apps.googleusercontent.com`, o cliente está ativo e o segredo aparece apenas mascarado. A próxima ação necessária é gerar uma nova chave em **Add secret**.


A inspeção do HTML confirmou que **Add secret** existe como botão do Google Cloud no painel de informações do cliente OAuth. A interface usa a classe `mat-mdc-button-disabled-interactive`, mas não foi confirmado ainda se o botão está realmente desabilitado; será necessário acioná-lo pela interface autenticada para gerar a nova chave.


A sessão do Google Cloud está autenticada como `san765ad@gmail.com` e o cliente OAuth web está ativo. A interface de detalhes mostra o segredo apenas mascarado e mantém **Add secret** dentro do painel de informações. Como a rolagem direta não trouxe o painel ao viewport, a próxima tentativa usará a navegação de teclado/interface sem expor o segredo no chat.


A busca pelo campo OAuth fez o painel principal avançar até mostrar a seção **Chaves secretas do cliente**. O botão **Add secret** ainda está abaixo da dobra, enquanto a rolagem de página não move o painel. O fluxo continua sem expor a chave no chat.


A navegação por teclado conseguiu trazer o painel para a altura correta e confirmou as duas origens JavaScript autorizadas (`recantoplt-9svuvrks.manus.space` e `julliosan765.github.io`). O foco atual está no segundo URI; a seção **Chaves secretas do cliente** aparece logo abaixo na coluna direita.


A credencial OAuth permanece aberta e os dois domínios autorizados aparecem no formulário. A navegação por teclado está percorrendo os controles de URI; a seção de segredo continua abaixo da área visível e será acionada sem revelar seu valor.


A interface continua na mesma posição, com foco nos controles de URI. A rolagem de página não move o painel; a seção de segredos já está parcialmente visível à direita. Para não fazer rolagens repetitivas, a próxima etapa usará os controles interativos disponíveis ou uma alternativa de configuração autenticada.


O URI de redirecionamento autorizado do Supabase está presente: `https://sdkyswgloohduydueqfo.supabase.co/auth/v1/callback`. A seção de segredos está visível na coluna direita; o botão Add secret ainda não entrou na lista de controles interativos, então não será acionado por tentativa imprecisa.

