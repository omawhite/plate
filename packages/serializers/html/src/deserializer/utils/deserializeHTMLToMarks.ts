import { mergeDeepToNodes } from '@udecode/plate-common';
import {
  isElement,
  PlateEditor,
  PlatePlugin,
  TDescendant,
} from '@udecode/plate-core';
import { Text } from 'slate';
import { jsx } from 'slate-hyperscript';
import { DeserializeHTMLChildren } from '../types';

jsx;

export interface DeserializeMarksProps<T = {}> {
  plugins: PlatePlugin<T>[];
  element: HTMLElement;
  children: DeserializeHTMLChildren[];
}

/**
 * Deserialize HTML to TDescendant[] with marks on Text.
 * Build the leaf from the leaf deserializers of each plugin.
 */
export const deserializeHTMLToMarks = <T = {}>(
  editor: PlateEditor<T>,
  { plugins, element, children }: DeserializeMarksProps<T>
) => {
  let leaf = {};

  plugins.forEach(({ deserialize: pluginDeserializers }) => {
    const leafDeserializers = pluginDeserializers?.(editor).leaf;
    if (!leafDeserializers) return;

    leafDeserializers.forEach((deserializer) => {
      const leafPart = deserializer.deserialize(element);

      if (!leafPart) return;

      leaf = { ...leaf, ...leafPart };
    });
  });

  return children.reduce((arr: TDescendant[], child) => {
    if (!child) return arr;

    if (isElement(child)) {
      if (Object.keys(leaf).length) {
        mergeDeepToNodes({
          node: child,
          source: leaf,
          query: {
            filter: ([n]) => Text.isText(n),
          },
        });
      }
      arr.push(child);
    } else {
      arr.push(jsx('text', leaf, child));
    }

    return arr;
  }, []);
};
