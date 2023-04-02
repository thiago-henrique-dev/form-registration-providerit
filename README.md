- Realizei diversas melhorias na aplicacao, adicionando validaoes em todos os campos, inclusive CPF, RG e CEP.

- Agora, quando o usuario tenta inserir um registro com dados que ja existem no banco de dados, como por exemplo, RG e CPF uma mensagem de alerta é exibida para informa-lo sobre o problema.

 - Alem disso  implementei uma mensagem para informar ao usuario quais campos estao em branco apos o envio dos dados, para que ele possa corrigir eventuais problemas.

- Para melhorar ainda mais a precisao das validaçoes, adicionei eventos Blur nos campos de CPF, RG e data de nascimento. Quando o usuário sai do campo em foco, a validação e feita em tempo real, garantindo que apenas dados validos sejam inseridos na aplicação. Na data de nascimento, o usuario so pode selecionar datas a partir de 1900 e datas do dia atual, evitando a inserçao de dados incorretos.

- Adicionei tambem um limite maximo de caracteres nos campos de RG, CPF e CEP para evitar a inserção de dados incorretos. Alem disso, formatei esses campos no padrão correto, facilitando a leitura e a validacãao dos dados. Quando o usuário atinge o limite maximo de caracteres, o campo e bloqueado para impedir a inserção de dados incorretos.

- Implementei uma mensagem de confirmaçao para quando o usuario deleta um registro com sucesso, assim como no editar. E se o usuario pesquisar o CEP e o campo estiver em branco, uma mensagem sera exibida para informar que é necessario inserir o CEP, pois o campo esta em branco. 

- Adicionei tambem validaçoes no modal de consulta de usuario: se o usuario clicar em consultar e o campo estiver em branco, uma mensagem e exibida; se o usuario nao existir, uma mensagem e exibida; e se o usuario for encontrado, uma mensagem de sucesso é exibida.

- Tambem implementei uma funcionalidade que exibe uma mensagem solicitando que o usuario consulte um registro antes de realizar a operação de edição.

- Adicionei uma funcionalidade que permite excluir um usuario apenas apos a consulta pelo ID correspondente. Se o usuario clicar no botao "Excluir" sem antes consultar o usuario, uma mensagem será exibida informando que é necessário consultar um usuario antes de executar essa operaçao.

Todas essas melhorias ajudam a garantir que apenas dados validos sejam inseridos na aplicaçao.

- Ficha cadastral. - Thiago Henrique Monteiro.