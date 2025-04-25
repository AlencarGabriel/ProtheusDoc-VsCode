<!-- NÃO ESQUECER DE AJUSTAR O ARQUIVO whatsNew.ts com as mudanças consideráveis de versão. -->

# Change Log

All notable changes to the "protheusdoc-vscode" extension will be documented in this file.

---

## [0.10.2] - 2025-04-25

### Changed

- Alterado default da configuração `protheusDoc.usa_workspace_doc` para `false`, melhorando a experiência inicial da extensão [PR #93](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/pull/93).

---

## [0.10.1] - 2024-09-02

### Changed

- Atualizado lista de releases Protheus na configuração `protheusDoc.versao_default` [PR #88](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/pull/88).

### Fixed

- Sintaxe incorreta na busca da tipagem de retorno dos métodos. [#72](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/72).

### Thanks

- [Rodrigo Mello](https://github.com/rodsmello) pela contribuíção na lista de releases Protheus via [Pull Request](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/pull/88).
- [Izac](https://github.com/izacsc) pela identificação do problema na tipagem de retorno dos métodos.

---

## [0.10.0] - 2023-11-13

### Changed

- Atualizado dependencia npm **protheusdoc-html** para **^1.1.8**.
- Adaptação da Tag `@see` com Múltiplos [#61](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/61).

### Fixed

- Quando o nome da função contém o caracter "_" (underline), a documentação gerada suprime o restante. [#76](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/76).
- Gerar Documentação HTML - Pastas [#79](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/79).

### Thanks

- [Robson Rogério](https://github.com/robsonrosilva/) pelos ajustes na biblioteca base da geração de HTML.
- [@carloseniemeyer](https://github.com/carloseniemeyer) pela identificação do problema com múltiplos atributos `@see`.
- [Edson Hornberger](https://github.com/edhornberger) pela identificação do problema na geração de HTML com diretórios contendo caracteres especiais.
- [Leandro Michelsen](https://github.com/leandromichelsen) pela identificação do problema na geração de HTML com funções contendo "_" (underline).

---

## [0.9.0] - 2021-06-24

### Added

- Tornar snippet `@history` dinâmico [#7](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/7).
- Tornar snippet `@author` dinâmico [#33](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/33).
- Tornar snippet `@version` dinâmico [#65](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/65).
- Atualizar os tipos permitidos de acordo com a tabela oficial [#64](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/64).
- Tipo de Conteúdo Undefined nas tags `@param` e `@return` [#63](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/63).

---

## [0.8.0] - 2021-03-22

### Added

- Parâmetro Opcional no ProtheusDoc [#50](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/50).

### Changed

- Atualizado dependencia npm **protheusdoc-html** para **^1.1.4**.

### Fixed

- `findAdvpl` causes high CPU [#57](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/57).
- Link dos métodos está vindo errado [#41](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/41).

---

## [0.7.6] - 2021-01-22

### Changed

- Elevado versão mínima do VsCode para **1.52.0** e atualizado dependencias npm.

### Fixed

- Snippets precedidas por espaço não reconhecidas [#40](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/40).
- Snippets não são reconhecidas em bloco ProtheusDoc precedido por espaço [#54](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/54).

---

## [0.7.4] - 2020-12-30

### Fixed

- `onDidChangeActiveTextEditor` causes high CPU [#49](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/49).

---

## [0.7.3] - 2020-12-17

*Alcançamos a marca de 3k users! Obrigado a você que faz parte dessa comunidade.*

### News

- Faça parte da nossa comunidade nas discussões do GitHub. [Acesse aqui](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/discussions) e veja os artigos já disponíveis! Fique a vontade para iniciar uma discussão.

### Changed

- Adicionar sugestão de versão no `@version` gerado automaticamente [#44](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/44).

### Fixed

- Extension causes high cpu load [#45](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/45).
- Diagnóstico inválido quando descrição contém "*" [#46](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/46).

---

## [0.7.0] - 2020-12-09

### Added

- Implementado **Diagnóstico** das documentações ProtheusDoc [#13](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/13) | [PR #43](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/pull/43).

### Changed

- Extensão não deixa VsCode apresentar as palavras do editor [#36](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/36).
    - Agora a extensão também irá prover no auto complete as palavras do documento aberto. Saiba mais na Wiki [Comandos](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/wiki/Comandos).

### Fixed

- Atributo History quebrando texto com "*" ou ":" no Hover [#32](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/32).

### Agradecimentos

- [@izacsc](https://github.com/izacsc) pela ótima sugestão de melhoria para implementar o diagnóstico das documentações na extensão.

---

## [0.6.1] - 2020-07-17

### Fixed

- Parte do texto nas descrições não é documentado [#35](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/35).

---

## [0.6.0] - 2020-05-29

### Added

- Implementado geração de documentação HTML de arquivos e pastas [#29](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/29) | [PR #31](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/pull/31).

### Fixed

- Numeração incorreta no link da documentação [#30](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/30).

---

## [0.5.0] - 2020-05-16

### Added

- Implementado posicionamento na linha da documentação [#16](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/16) | [PR #26](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/pull/26).
- Adicionado configuração para escolher quais atributos serão apresentados no Documentation Hover [PR #27](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/pull/27).
- Adicionado suporte ao atributo `@link` [#23](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/23).
- Implementado geração da **documentação HTML** dos fontes [#25](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/pull/25).
    - Agradecimento especial ao [Robson Rogério](https://github.com/robsonrosilva) pelo desenvolvimento da extensão base para geração das documentações em HTML [protheusDoc-html](https://github.com/robsonrosilva/protheusDoc).

### Changed

- Adicionado suporte ao atributo `@history` no Hover [#17](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/17) | [PR #27](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/pull/27).

### Fixed

- Corrigido problema que cortava o nome dos parâmetros com a palavra **"as"** [#22](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/22).
- Ajustado para que a tabela de documentações considere tambem arquivos com extensão maiúscula [#24](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/24).
- Adotado uso da API `asWebviewUri()` conforme notificação da Microsoft [#28](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/28).

---

## [0.4.7] - 2020-04-21

### Changed

- Ajustado extensão para aplicar as decorações apenas em fontes suportados pela extensão [#18](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/18).

### Fixed

- Recriado estrutura dos arquivos da extensão, por conta de problemas em ambientes case sensitive (Linux) [#21](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/21).
- Corrigido BUG que não validava se o array de documentações do fonte atual estava vazio, tentando buscar sempre as documentações do fonte aberto no editor [#19](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/19).

---

## [0.4.4] - 2020-03-31

### Added

- Implementado *What's New* para apresentar as novidades e correções da versão.

### Changed

- Ajustado *Hover* para verificar se existe documentação do identificador no arquivo atual, se existir mostra somente deste arquivo, se não mostra todas as ocorrências encontradas [#15](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/15).

### Fixed

- Ajustado *expressões de classe* para interpretarem classes com herança [#11](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/11).
- Retirado *Tab Stop do snippet do return* quando este já vem tipado [#12](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/12).
- Corrigido BUG que ocorria quando a busca de linhas com documentação chegava no fim do arquivo.

### Agradecimentos

- [@izacsc](https://github.com/izacsc) pelas ótimas sugestões de melhorias para a extensão.

---

## [0.4.1] - 2020-02-20

### Added

- Implementado *Hover de Documentação* nas chamadas dos identificadores para mostrar o ProtheusDOC. [Veja mais em https://github.com/AlencarGabriel/ProtheusDoc-VsCode/wiki/Hover-de-documentações](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/wiki/Hover-de-documentações).

---

## [0.3.0] - 2020-01-30

### Added

- Implementado *Text Decoration* para os atributos do ProtheusDoc ficarem negritos (para desativar esta decoração [veja aqui](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/wiki/Configurações)).

### Fixed

- Alterado forma de buscar as configurações, para sempre buscar a configuração atual e não a do momento da ativação da extensão.

---

## [0.2.3] - 2020-01-28

### Added

- Adicionado suporte para interpratação da sintaxe de Classe para adicionar o bloco ProtheusDoc.

### Fixed

- Ajustado problema remanescente da situação de bloco de parâmetros vazio que não havia sido detectado totalmente na 0.1.2 [#6](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/6).
- Melhorado expressões para aceitarem mais espaços entre as palavras [#9](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/9).
- Implementado interpretação das funções para interpretar o tipo `Function` [#8](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/8).

---

## [0.1.2] - 2020-01-27

### Added

- Adicionado suporte para interpratação da sintaxe de método de classe para adicionar o bloco ProtheusDoc.

### Fixed

- Implementado tipos Char e Block (alternativos de Character e CodeBlock) como tipos reconhecidos do ProtheusDoc [#5](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/5).
- Ajustado para que o marcador de parâmetros não seja apresentado caso o método ou função tenha os `( )` mas não tenha definição de parâmetros [#6](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/6).

---

## [0.0.8] - 2020-01-24

### Added

- Adicionado suporte para interpretar tambem a sintaxe de Parâmetros e Retornos usando Tipagem Forte [#2](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/2).

### Fixed

- Ajustes na quebra de linha dos Snippets.
- Refatorado Interface estrutura do Return para funcionar igual os Params.

---

## [0.0.5] - 2020-01-23

### Added

- Adicionado atalho `Shift + Alt + D` para o comando `ProtheusDoc - Adicionar bloco de Documentação`.

### Changed

- Alterado forma como o IntelliSense sugere o comando do ProtheusDoc. Para mais informações [veja aqui](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/wiki/Comandos#snippets).

### Fixed

- Auto Complete está sobrescrevendo as sugestões de string [#3](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/3).
- Ao usar o Snippet está substituindo o conteúdo da linha [#4](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/4).

---

## [0.0.2] - 2020-01-22

### Fixed

- Adicionado compatibilidade com a versão 1.38.0 do VsCode [#1](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/1).

---

## [0.0.1] - 2020-01-22

### Added

- First extension release.