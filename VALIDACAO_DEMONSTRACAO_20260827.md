# Validação da demonstração — 27 de agosto de 2026

## Tela pública

- A página abre no My Browser com título **Recanto das Plantas | Maceió** e apresenta navegação, catálogo, contato, Instagram, localização e mapa.
- O catálogo exibe os três itens de apresentação sem preços inventados, usando o texto **“Consulte o valor”** até que o administrador cadastre os preços reais.
- As ações de pedido estão descritas como envio ao WhatsApp e não há pagamento online nem login para cliente.
- As capturas em desktop e em 375 px mostraram a composição editorial, a navegação móvel e a ficha de visita no trecho final.
- A inspeção no My Browser confirmou que os três cards do catálogo aparecem com suas imagens, rótulos e ações de adicionar ao pedido.

## Área administrativa

- A rota `/admin.html` abre uma tela de **Conexão pendente** enquanto o Supabase não é configurado, sem expor chaves ou permitir alterações públicas.
- Após configuração futura, o acesso será exclusivamente pelo administrador autenticado; o cliente nunca verá essa tela como parte da compra.

## Compilação

- `pnpm check` concluído sem erros de TypeScript.
- `pnpm build` concluído com sucesso. O bundler registrou apenas aviso de tamanho de arquivo, sem impedir a publicação.
