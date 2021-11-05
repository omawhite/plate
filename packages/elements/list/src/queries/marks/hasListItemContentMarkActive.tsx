import { getNode } from '@udecode/plate-common';
import { TEditor, TNode } from '@udecode/plate-core';
import { ListItemContentSelection } from '../../types';

export const hasListItemContentMarkActive = (
  editor: TEditor,
  licSelection: ListItemContentSelection,
  key: string
): unknown => {
  const node = getNode(editor, licSelection.path) as TNode;

  return node[key];
};
