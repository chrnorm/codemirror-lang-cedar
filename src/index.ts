import { parser } from "./syntax.grammar";
import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  delimitedIndent,
} from "@codemirror/language";
import { completeFromList, ifNotIn } from "@codemirror/autocomplete";
import { styleTags, tags as t } from "@lezer/highlight";

let kwCompletion = (name: string) => ({ label: name, type: "keyword" });

const keywords = "permit forbid when unless".split(" ").map(kwCompletion);

const dontComplete = ["String", "LineComment"];

export const cedarLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({ closing: ")", align: false }),
      }),
      foldNodeProp.add({
        Application: foldInside,
      }),
      styleTags({
        effect: t.keyword,
        "when unless": t.keyword,
        Identifier: t.variableName,
        Boolean: t.bool,
        String: t.string,
        LineComment: t.lineComment,
        "( )": t.paren,
        "{ }": t.paren,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: "//" },
  },
});

export function cedar() {
  return new LanguageSupport(cedarLanguage, [
    cedarLanguage.data.of({
      autocomplete: ifNotIn(dontComplete, completeFromList(keywords)),
    }),
  ]);
}
