import { getNode, getNodes, setNodes } from '@udecode/plate-common';
import {
  getPlatePluginType,
  PlateEditor,
  TAncestor,
  TNode,
} from '@udecode/plate-core';
import { Editor, NodeEntry, Transforms } from 'slate';
import { ELEMENT_LIC } from '../../defaults';
import { getListItemLevel, getListRoot } from '../../queries';
import { ListItemContentSelection } from '../../types';

export const setListItemContentMark = (
  editor: PlateEditor,
  licSelection: ListItemContentSelection,
  type: string,
  value: unknown
): void => {
  if (!licSelection.level) {
    const node = getNode(editor, licSelection.path) as TNode;
    const prev = node.prev ?? {};
    Editor.withoutNormalizing(editor, () => {
      Transforms.deselect(editor);
      setNodes(
        editor,
        {
          [type]: value,
          prev: {
            ...(prev ?? {}),
            [type]: { ...(prev[type] ?? {}), dirty: true },
          },
        },
        { at: licSelection.path }
      );
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
      licNodeEntries.forEach(([, path]) => {
        setNodes(editor, { [type]: value }, { at: path });
      });
      setNodes(
        editor,
        {
          licStyles: {
            ...(root[0].licStyles ?? {}),
            [affectedLicLevel]: {
              ...(root[0].licStyles
                ? root[0].licStyles[affectedLicLevel] ?? {}
                : {}),
              [type]: value,
            },
          },
        },
        { at: root[1] }
      );
    });
  }
};
