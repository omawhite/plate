import { setNodes } from '@udecode/plate-common';
import {
  getPlatePluginOptions,
  getPlatePluginType,
  PlateEditor,
  TNode,
} from '@udecode/plate-core';
import { Editor, NodeEntry } from 'slate';
import { ELEMENT_LIC, KEY_LIST } from '../defaults';
import { getListItemLevel, getListRoot } from '../queries';
import { WithListOptions } from '../types';

export const normalizeListItemContentStyles = (
  editor: PlateEditor,
  [node, path]: NodeEntry<TNode>
): void => {
  const licType = getPlatePluginType(editor, ELEMENT_LIC);
  const { supportedMarks } = getPlatePluginOptions<Required<WithListOptions>>(
    editor,
    KEY_LIST
  );

  if (node.type === licType) {
    const [rootNode] = getListRoot(editor, path) as NodeEntry;
    Editor.withoutNormalizing(editor, () => {
      const types = supportedMarks
        ? supportedMarks.map((value) => value.key)
        : [];
      types.forEach((key) => {
        if (!(node.prev && node.prev[key]?.dirty)) {
          const level = getListItemLevel(path);
          const value =
            (rootNode as TNode).licStyles &&
            (rootNode as TNode).licStyles[level] &&
            (rootNode as TNode).licStyles[level][key];
          if (value) {
            setNodes(editor, { [key]: value }, { at: path });
          }
        }
      });
    });
  }
};
