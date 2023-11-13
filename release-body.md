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