# codemirror-lang-cedar

CodeMirror language support for the [Cedar](https://cedarpolicy.com) policy language.

## Contributing

 * Rewrite the grammar in `src/syntax.grammar` to cover the language. See the [Lezer system guide](https://lezer.codemirror.net/docs/guide/#writing-a-grammar) for information on this file format.

 * Adjust the metadata in `src/index.ts` to work with your new grammar.

 * Adjust the grammar tests in `test/cases.txt`.

 * Build (`npm run prepare`) and test (`npm test`).
