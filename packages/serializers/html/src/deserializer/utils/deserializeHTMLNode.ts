import { PlateEditor, PlatePlugin } from '@udecode/plate-core';
import { DeserializeHTMLChildren, DeserializeHTMLReturn } from '../types';
import { deserializeHTMLToElement } from './deserializeHTMLToElement';
import { deserializeHTMLToFragment } from './deserializeHTMLToFragment';
import { deserializeHTMLToMarks } from './deserializeHTMLToMarks';
import { htmlBrToNewLine } from './htmlBrToNewLine';
import { htmlTextNodeToString } from './htmlTextNodeToString';
import { isHtmlElement } from './isHtmlElement';

/**
 * Deserialize HTML element or child node.
 */
export const deserializeHTMLNode = <T = {}>(
  editor: PlateEditor<T>,
  plugins: PlatePlugin<T>[]
) => (node: HTMLElement | ChildNode): DeserializeHTMLReturn => {
  const textNode = htmlTextNodeToString(node);
  if (textNode) return textNode;

  if (!isHtmlElement(node)) return null;

  // break line
  const breakLine = htmlBrToNewLine(node);
  if (breakLine) return breakLine;

  const { nodeName } = node;
  const parent: HTMLElement | ChildNode = node;

  // codeblock
  // if (nodeName === 'PRE' && node.childNodes[0]?.nodeName === 'CODE') {
  //   [parent] = node.childNodes;
  // }

  console.log(node.parentElement?.nodeName);

  const children: DeserializeHTMLChildren[] = Array.from(parent.childNodes)
    .map(deserializeHTMLNode(editor, plugins))
    .flat();

  // console.log(children);

  // body
  const fragment = deserializeHTMLToFragment({
    element: node,
    children,
  });
  if (fragment) return fragment;

  // element
  const element = deserializeHTMLToElement(editor, {
    plugins,
    element: node,
    children,
  });
  if (element) return element;

  // mark
  return deserializeHTMLToMarks(editor, {
    plugins,
    element: node,
    children,
  });
};
