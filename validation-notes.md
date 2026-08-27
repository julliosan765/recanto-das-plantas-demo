# Evidência de validação do GitHub Pages — galeria

- URL validada: https://julliosan765.github.io/recanto-das-plantas-demo/admin.html?gallery-release=0f2aae2
- O fluxo do GitHub Actions para o commit `0f2aae2f7ea8539337947ccf5ed1983ca0cc2c18` terminou com `success` no workflow `Publicar no GitHub Pages`.
- A página publicada já exibe o rótulo `ADICIONAR FOTOS DO PRODUTO`, confirmando que a versão da galeria chegou ao Pages.
- A sessão administrativa conectada permanece ativa; a página mostra `VER A LOJA` e `SAIR`.
- O formulário e o catálogo estão acessíveis na rolagem do painel; o catálogo atual está vazio e mantém apenas os cartões demonstrativos da vitrine pública.
- A captura visual chegou ao início do formulário; a validação do input real e do controle individual de enquadramento ainda depende de selecionar fotos no navegador.

Na inspeção seguinte, o rodapé do formulário publicado mostrou `SALVAR PRODUTO`, além dos campos de WhatsApp e Instagram já preenchidos, e `SALVAR INFORMAÇÕES`. Isso confirma que o painel carregou a estrutura completa até o fim da página no Pages. O input de fotos e sua prévia ficaram entre as áreas capturadas; será aberto diretamente pelo teclado/posição do formulário para completar a seleção manual.

A rolagem adicional confirmou no domínio público que o cabeçalho administrativo continua fixo e que a seção `Produtos do dia` permanece disponível no layout publicado. A rolagem é necessária apenas para posicionar o formulário; o conteúdo textual completo já foi extraído pelo navegador.

O formulário publicado foi posicionado na seção de cadastro. A captura mostra `NOME DO PRODUTO`, `CATEGORIA`, `PREÇO (R$)` e `DESCRIÇÃO CURTA` renderizados no painel, com o catálogo vazio ao lado. O próximo passo do teste manual é selecionar dois arquivos no input `multiple` do campo de fotos.

A captura final desta etapa confirmou o bloco `Informações da loja` e os campos de WhatsApp/Instagram no rodapé, sem erro visual de carregamento. O navegador alterna corretamente entre o topo, formulário e rodapé; a seleção do input de arquivo será feita sem salvar dados de contato.

No viewport do formulário publicado, o rótulo clicável `ADICIONAR FOTOS DO PRODUTO` aparece imediatamente acima de `DISPONÍVEL PARA PEDIDO` e do botão `SALVAR PRODUTO`. A interação com o rótulo manteve o formulário sem alterações e confirmou que o controle de upload está integrado à mesma etapa de cadastro.

O input `multiple` aceitou a tentativa de seleção dos dois arquivos. A validação da aplicação exibiu a mensagem `A imagem deve ter no máximo 5 MB.` porque os arquivos de exemplo escolhidos possuem 5.568.375 e 5.309.382 bytes, respectivamente. Portanto, o limite de 5 MB está sendo aplicado no fluxo publicado; ainda será repetido o teste com duas imagens menores para validar a galeria efetivamente.

Após a primeira tentativa com arquivos acima de 5 MB, o painel publicado exibiu a mensagem de limite tanto junto ao formulário quanto no bloco de informações. A página permaneceu estável e sem alteração dos contatos. Os arquivos comprimidos para a segunda tentativa têm 269.948 e 281.982 bytes.

O formulário voltou à posição central no navegador: categoria, preço, descrição, o rótulo `ADICIONAR FOTOS DO PRODUTO`, a caixa de disponibilidade e `SALVAR PRODUTO` estão visíveis. A mensagem de limite permanece como feedback da tentativa anterior; a seleção com arquivos menores será feita agora.

A segunda tentativa de upload não alterou o formulário: o índice usado apontou para `input[type=checkbox]`, não para o input de arquivo, porque o navegador reposicionou o viewport e renumerou os elementos visíveis. Nenhum produto foi salvo e nenhuma imagem foi persistida. O teste continuará reposicionando o rótulo de fotos antes de selecionar os arquivos menores.

A navegação retornou ao card `Adicionar ao catálogo`, com o catálogo atual exibindo `0 produtos` e o campo de nome disponível. O estado vazio segue intacto após as tentativas de upload, então a validação não deixou registros parciais no Supabase.

Nesta posição do viewport, a lista de elementos mostra `ADICIONAR FOTOS DO PRODUTO` como rótulo no índice 8, `DISPONÍVEL PARA PEDIDO` no índice 9, o checkbox no índice 10 e `SALVAR PRODUTO` no índice 11. O próximo upload deve apontar para o índice 8, que contém o input de arquivo como descendente.

O teste manual no GitHub Pages foi bem-sucedido com dois arquivos abaixo de 5 MB: o painel informa `2 fotos adicionadas`, mostra `PRINCIPAL`, `USAR PRINCIPAL`, `PRÉVIA NO CELULAR` e `Ajustar enquadramento vertical`, com a instrução de selecionar miniatura e mover o controle. O catálogo ainda está em `0 produtos` porque o cadastro não foi salvo.

Após a rolagem, o estado do formulário manteve a indicação `2 fotos adicionadas` e o catálogo permaneceu com `0 produtos`. As imagens estão somente no estado temporário do cadastro, o que permite testar o enquadramento e depois limpar sem criar registro no banco.

A validação visual alcançou o editor da galeria publicado. A captura mostra miniaturas das fotos, a etiqueta `PRINCIPAL`, a prévia em formato de celular e o slider `Ajustar enquadramento vertical` com valor inicial `50`. A instrução ao administrador informa que a imagem original não é cortada.

O controle foi acionado no navegador publicado: o slider da primeira foto mudou de `50` para `80`, a prévia continuou visível em formato de celular e o painel manteve `2 fotos adicionadas`. Isso confirma atualização imediata do estado de enquadramento sem cortar o arquivo original.

A vitrine pública abriu pelo endereço do Pages sem solicitar login. A página exibiu as coleções, os dois produtos demonstrativos com preços, busca/filtros, retirada na loja e pedido por WhatsApp. O cabeçalho e a hero da estufa também carregaram sem erro.

O fluxo de saída foi validado no Pages: ao clicar em `SAIR` no painel, o navegador retornou para `https://julliosan765.github.io/recanto-das-plantas-demo/`. A vitrine abriu sem autenticação, exibindo catálogo, preços, busca, retirada na loja e WhatsApp.

A proteção da rota também foi revalidada: depois do logout, abrir `admin.html` no Pages mostra somente `ENTRAR COM GOOGLE` e `VER A LOJA`, sem catálogo administrativo nem formulário. Isso confirma que uma sessão não autenticada não recebe acesso ao painel.

Após o deploy do commit `264c9a8d`, o painel autenticado do GitHub Pages mostrou o item existente `vaso` com as ações `EDITAR`, `OCULTAR` e `APAGAR PRODUTO`. A presença e o posicionamento foram confirmados no navegador conectado; a exclusão real não foi acionada para preservar o produto do proprietário durante a validação.
