# ProtheusDoc for VsCode (AdvPL)

Suporte aos recursos e snippets do TOTVS ProtheusDoc para VsCode.

![ProtheusDoc for VsCode](images/Example2.gif)

>**Estou muito feliz pelo seu Download e espero que goste!**

---

## Necessidade

Detectar a sintaxe da função, método ou classe e gerar uma documentação dinâmica no formato [ProtheusDoc.](https://tdn.totvs.com/display/tec/ProtheusDOC)

## [Issues](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues)

Caso encontre algum problema, tenha alguma dúvida ou sugestão de melhoria, fique a vontade para abrir uma Issue ou enviar um Pull Request.

## Features previstas:

- [x] Implementar geração do cabeçalho lendo a declaração da Função;
- [x] Implementar configuração para o nome do Autor Default (caso omitido apresenta o do SO);
- [x] Implementar configuração para ocultar marcadores não obrigatórios;
- [x] Implementar Snippets dos marcadores mais comuns do ProtheusDoc;
- [ ] Implementar geração do cabeçalho lendo a declaração do Método;
- [ ] Implementar geração do cabeçalho lendo a declaração da Classe;
- [ ] Implementar configuração para definir a estrutura dos marcadores para Função, Método e Classe;
- [ ] Implementar *Text Decoration* para os atributos do ProtheusDoc ficarem negritos;
- [ ] Implementar *Hover* no cabeçalho das funções para mostrar o ProtheusDOC;
- [ ] Implementar função para criar comentários no cabeçalho de todas as funções;
- [ ] Implementar sintaxe do 4gl;
- [ ] Implementar Geração de HTML das documentações;

---

## Comandos da Extensão

### Snippets:

Em qualquer trecho de um código AdvPL (futuramente também 4gl), é possível chamar o Snippet `Add ProtheusDoc Block`.

![Snippet ProtheusDoc VsCode](https://user-images.githubusercontent.com/10109480/72910730-b77a2900-3d17-11ea-885a-c7456f36b200.png)

### Command Pallet:

Com o cursor posicionado na assinatura da Função, Método ou Classe ou acima desta, é possível executar o comando: `CTRL + SHIFT + P` > `ProtheusDoc - Adicionar bloco de Documentação`.

![image](https://user-images.githubusercontent.com/10109480/72911195-67e82d00-3d18-11ea-96cb-d91ada6345ab.png)


> **Importante:**
>
>A extensão irá interpretar a sintaxe da assinatura, e montará um bloco de documentação ProtheusDoc acima da assinatura da Função, Método ou Classe.
>
>É necessário que o cursor de escrita esteja posicionado em até 2 (duas) linhas antes do início da assinatura da Função, Método ou Classe.

---

## Configurações da Extensão

Esta extensão contribui com as seguintes configurações:

* `protheusDoc.marcadores_ocultos: [];` // Ocultar marcadores não obrigatórios do ProtheusDoc (@version, @author, @since, @params, @return).
* `protheusDoc.autor_default: "";` // Nome do autor padrão das documentações ProtheusDoc. Caso esteja vazio o autor será o usuário conectado no SO.
* `protheusDoc.versao_default: "";` // Versão padrão do identificador.

**Aproveite, me ajuda e com certeza irá te ajudar tambem!** :heart: