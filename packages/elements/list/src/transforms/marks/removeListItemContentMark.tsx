import { getNode, getNodes, setNodes } from '@udecode/plate-common';
import {
  getPlatePluginType,
  PlateEditor,
  TAncestor,
  TNode,
} from '@udecode/plate-core';
import { castArray } from 'lodash';
import { Editor, NodeEntry, Transforms } from 'slate';
import { ELEMENT_LIC } from '../../defaults';
import { getListItemLevel, getListRoot } from '../../queries';
import { ListItemContentSelection } from '../../types';
import { clearNodeMarks } from './clearNodeMarks';

export const removeListItemContentMark = (
  editor: PlateEditor,
  licSelection: ListItemContentSelection,
  type: string | string[]
): void => {
  const types = castArray(type);
  if (!licSelection.level) {
    const node = getNode(editor, licSelection.path) as TNode;
    Editor.withoutNormalizing(editor, () => {
      Transforms.deselect(editor);
      clearNodeMarks(editor, types, node, licSelection.path);
    });
  } else {
    const root = getListRoot(editor, licSelection.path) as NodeEntry<TAncestor>;
    const affectedLicLevel = getListItemLevel(licSelection.path);

    const licNodeEntries = Array.from(
      getNodes(editor, {
        at: root[1],
        match: { type: getPlatePluginType(editor, ELEMENT_LIC) },
      })
    ).filter(
      (nodeEntry) => getListItemLevel(nodeEntry[1]) === affectedLicLevel
    );

    Editor.withoutNormalizing(editor, () => {
      Transforms.deselect(editor);
      licNodeEntries.forEach(([node, path]) => {
        clearNodeMarks(editor, types, node, path);
      });
      setNodes(
        editor,
        {
          licStyles: {},
        },
        { at: root[1] }
      );
    });
  }
};
