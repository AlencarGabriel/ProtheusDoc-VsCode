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
- [ ] Implementar configuração para definir a estrutura dos marcadores para Função, Método e Classe;
- [ ] Implementar *Hover* no cabeçalho das funções para mostrar o ProtheusDOC;
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

## Configurações da Extensão

Esta extensão contribui com as seguintes configurações:

Configuração | Descrição
------------ | -----------
`"protheusDoc.marcadores_ocultos": []` | Ocultar marcadores automáticos não obrigatórios do ProtheusDoc **(version, author, since, params, return)**
`"protheusDoc.autor_default": ""` | Nome do autor padrão das documentações ProtheusDoc. Caso esteja vazio o autor será o usuário conectado no SO.
`"protheusDoc.versao_default": ""` | Versão padrão do identificador.
`"protheusDoc.usa_decoracao": true` | Define se a extensão irá decorar os atributos ProtheusDoc.

---

**Aproveite, me ajuda e com certeza irá te ajudar tambem!** :heart: