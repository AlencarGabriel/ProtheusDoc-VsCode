![Version](https://vsmarketplacebadge.apphb.com/version/AlencarGabriel.protheusdoc-vscode.svg) ![Installs](https://vsmarketplacebadge.apphb.com/installs/AlencarGabriel.protheusdoc-vscode.svg) ![Downloads](https://vsmarketplacebadge.apphb.com/downloads/AlencarGabriel.protheusdoc-vscode.svg) ![Rating](https://vsmarketplacebadge.apphb.com/rating-star/AlencarGabriel.protheusdoc-vscode.svg)

# ProtheusDoc for VsCode (AdvPL)

Suporte aos recursos e snippets de documentação TOTVS ProtheusDoc para VsCode.

![ProtheusDoc for VsCode](images/Example2.gif)

>**Estou muito feliz pelo seu Download e espero que goste!**

---

## Necessidade

Detectar a sintaxe da função, método ou classe e gerar uma documentação dinâmica no formato [ProtheusDoc.](https://tdn.totvs.com/display/tec/ProtheusDOC)

> Conheça mais sobre o ProtheusDoc em meu blog: https://gabrielalencar.dev/2020/01/29/ProtheusDoc-for-VsCode/

## [Issues](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues)

Caso encontre algum problema, tenha alguma dúvida ou sugestão de melhoria, fique a vontade para abrir uma Issue ou enviar um Pull Request.

## Features previstas:

- [x] Implementar geração do cabeçalho lendo a declaração da Função;
- [x] Implementar configuração para o nome do Autor Default (caso omitido apresenta o do SO);
- [x] Implementar configuração para ocultar marcadores não obrigatórios;
- [x] Implementar Snippets dos marcadores mais comuns do ProtheusDoc;
- [x] Implementar geração do cabeçalho lendo a declaração do Método;
- [x] Implementar geração do cabeçalho lendo a declaração da Classe;
- [x] Implementar *Text Decoration* para os atributos do ProtheusDoc ficarem negritos;
- [x] Implementar *Hover* no cabeçalho das funções para mostrar o ProtheusDOC;
- [ ] Implementar configuração para definir a estrutura dos marcadores para Função, Método e Classe;
- [ ] Implementar função para criar comentários no cabeçalho de todas as funções;
- [ ] Implementar sintaxe do 4gl;
- [ ] Implementar Geração de HTML das documentações;

---

## Comandos da Extensão

### Snippets:

Em qualquer trecho de um código AdvPL (futuramente também 4gl), é possível chamar o Snippet `Add ProtheusDoc Block` das seguintes formas: `add`, `pdoc` ou `prot`.

![Snippet ProtheusDoc VsCode](https://user-images.githubusercontent.com/10109480/73039691-d078fc00-3e35-11ea-82ca-cbc63dedbddc.png)

> Caso existam snippets de ProtheusDoc oriundos de outras extensões, pode ser que o IntelliSense não processe este Snippet de primeira, sendo necessário pressionar `Esc` e depois chamar o AutoComplete novamente `Ctrl + Space`.

### Command Pallet:

Com o cursor posicionado na assinatura da Função, Método ou Classe ou acima desta, é possível executar o comando: `Ctrl + Shift + P` > `ProtheusDoc - Adicionar bloco de Documentação`.

![ProtheusDoc Command VsCode](https://user-images.githubusercontent.com/10109480/73039567-5c3e5880-3e35-11ea-9a77-ca93ea5129d1.png)

### Atalho:

Foi implementado para o comando `ProtheusDoc - Adicionar bloco de Documentação` o atalho `Shift + Alt + D`.

> **Importante:**
>
>A extensão irá interpretar a sintaxe da assinatura, e montará um bloco de documentação ProtheusDoc acima da assinatura da Função, Método ou Classe.
>
>É necessário que o cursor de escrita esteja posicionado em até 2 (duas) linhas antes do início da assinatura da Função, Método ou Classe.

---

## Hover de documentações

A partir da versão 0.4.0 da extensão, foi disponibilizado um recurso para visualizar as documentações de uma função, método ou classe apenas passsando o mouse pelo identificador.

![Hover de Documentação ProtheusDoc](https://user-images.githubusercontent.com/10109480/74953051-ebf90780-53df-11ea-9f6f-1a8cae64de4c.png)

Ao passar o mouse por um identificador, a rotina irá consultar na [tabela de documentações](#Tabela-de-Documentações) se existe uma documentação ProtheusDoc para o identificador em questão.

A feature reconhece e apresenta (caso disponível) o tipo do identificador, descrição, parâmetros, retorno e a localização da definição.

**Obs.:** A extensão identifica a documentação mesmo se for uma chamada de `User Function`:

![Hover de Documentação ProtheusDoc](https://user-images.githubusercontent.com/10109480/74953170-15199800-53e0-11ea-9428-58b3ecfc5d00.png)

### Assinaturas Duplicadas

É possivel que hajam identificadores (funções, métodos ou classes) com o mesmo nome na Workspace, ou ainda que arquivos duplicados causem essa situação. 

Sendo assim, caso um mesmo identificador esteja duplicado na Workspace, será apresentado todas as ocorrências de documentação.

![ProtheusDoc duplicado](https://user-images.githubusercontent.com/10109480/74956901-8c9df600-53e5-11ea-8d26-4d41b8d205b9.png)

### Estilo da Visualização

Para que no início da visualização da documentação seja apresentado a demonstração da estrutura de código, é necessário que a propriedade `@type` do ProtheusDoc esteja definida no bloco de documentação do identificador.

Caso este esteja omitido ou inválido, será apresentado apenas o nome do identificador.

### Tabela de Documentações

A tabela de documentações armazena uma lista de documentações ProtheusDoc detectadas na Workspace ou nos arquivos abertos.

Sempre que um projeto (ou workspace) AdvPL é aberto, a extensão irá varrer os arquivos permitidos da Workspace (vide configuração `protheusDoc.include`) em busca de documentações ProtheusDoc.

> **Importante:**
>
>Caso a Workspace aberta possua uma quantidade considerável de arquivos com documentações ProtheusDoc, o uso de memória e CPU do VsCode poderá aumentar de forma considerável. Mas a tendência é que depois que a API varrer os arquivos a utilização diminua, pois esta é bem performatica.
> 
> Para minimizar os impactos negativos no ambiente de desenvolvimento, é extremamente importante que as configurações `protheusDoc.include`, `protheusDoc.exclude` e `protheusDoc.maxFilesForSearch` estejam definidas conforme o melhor cenário para o projeto.

Caso o uso da tabela de documentações seja desativado (`"protheusDoc.usa_tabela_documentacoes": false`), somente os arquivos que tiveram interação serão adicionados na tabela conforme são abertos ou alterados.

> A tabela é sempre limpa quando a Workspace é alterada.

---

## Configurações da Extensão

Esta extensão contribui com as seguintes configurações:

Configuração | Descrição
------------ | -----------
`"protheusDoc.marcadores_ocultos": []` | Ocultar marcadores automáticos não obrigatórios do ProtheusDoc **(version, author, since, params, return)**
`"protheusDoc.autor_default": ""` | Nome do autor padrão das documentações ProtheusDoc. Caso esteja vazio o autor será o usuário conectado no SO.
`"protheusDoc.versao_default": ""` | Versão padrão do identificador.
`"protheusDoc.usa_decoracao": true` | Define se a extensão irá decorar os atributos ProtheusDoc.
`"protheusDoc.usa_tabela_documentacoes": true` | Define se a extensão irá criar uma tabela interna com todas as documentações ProtheusDoc presentes na Workspace. Em caso de `false` somente os fontes que tiveram interação serão adicionados na tabela.

---

**Aproveite, me ajuda e com certeza irá te ajudar tambem!** :heart: