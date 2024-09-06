import { parser } from "./syntax.grammar";
import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  delimitedIndent,
  continuedIndent,
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
        Policy: continuedIndent(),
        Condition: continuedIndent(),
        Application: delimitedIndent({ closing: ")", align: false }),
      }),
      foldNodeProp.add({
        Application: foldInside,
      }),
      styleTags({
        Effect: t.definitionKeyword,
        "permit forbid": t.definitionKeyword,
        "when unless": t.keyword,
        "in is has contains containsAll": t.operatorKeyword,
        "if then else": t.controlKeyword,
        Identifier: t.variableName,
        CompareOp: t.compareOperator,
        BooleanLiteral: t.bool,
        Principal: t.variableName,
        Action: t.variableName,
        Resource: t.variableName,
        Context: t.variableName,
        String: t.string,
        Int: t.integer,
        LineComment: t.lineComment,
        "( )": t.paren,
        "{ }": t.brace,
        "[ ]": t.squareBracket,
        ";": t.separator,
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
