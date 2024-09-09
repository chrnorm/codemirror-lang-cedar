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
import { completeFromList, ifIn, ifNotIn } from "@codemirror/autocomplete";
import { styleTags, tags as t } from "@lezer/highlight";

export const cedarLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Scope: continuedIndent(),
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
        At: t.meta,
        AnnotationKey: t.meta,
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
      autocomplete: ifNotIn(
        ["String", "LineComment", "Scope", "Condition"],
        completeFromList([
          { label: "permit", type: "keyword" },
          { label: "forbid", type: "keyword" },
        ]),
      ),
    }),
    cedarLanguage.data.of({
      autocomplete: ifIn(
        ["Scope"],
        completeFromList([
          { label: "principal", type: "variable" },
          { label: "action", type: "variable" },
          { label: "resource", type: "variable" },
        ]),
      ),
    }),
    cedarLanguage.data.of({
      autocomplete: ifIn(
        ["Condition"],
        completeFromList([
          { label: "principal", type: "variable" },
          { label: "action", type: "variable" },
          { label: "resource", type: "variable" },
          { label: "context", type: "variable" },
        ]),
      ),
    }),
  ]);
}
