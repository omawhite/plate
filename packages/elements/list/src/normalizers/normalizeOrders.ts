import { getNode } from '@udecode/plate-common';
import {
  getPlatePluginType,
  PlateEditor,
  TAncestor,
  TNode,
} from '@udecode/plate-core';
import { NodeEntry, Path } from 'slate';
import { ELEMENT_OL } from '../defaults';
import { getListRoot } from '../queries';
import { setNodeOrder } from '../transforms/marks/setNodeOrder';

export const normalizeOrders = (editor: PlateEditor, location: Path): void => {
  if (!location) return;

  const olType = getPlatePluginType(editor, ELEMENT_OL);
  let root = getListRoot(editor, location) as NodeEntry<TAncestor>;

  if (!root) {
    const node = getNode<TNode>(editor, location);
    if (node?.type === olType) {
      root = [node as TAncestor, location];
    }
  }

  if (root) {
    if (root[0]?.type === olType) {
      setNodeOrder('ol', editor, root);
    } else {
      setNodeOrder('ul', editor, root);
    }
  }
};
