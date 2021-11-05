import { TNode, WithOverride } from '@udecode/plate-core';
import { defaults } from 'lodash';
import { NodeEntry } from 'slate';
import { KEY_LIST } from './defaults';
import { getListDeleteBackward } from './getListDeleteBackward';
import { getListDeleteForward } from './getListDeleteForward';
import { getListDeleteFragment } from './getListDeleteFragment';
import { getListInsertBreak } from './getListInsertBreak';
import { getListInsertFragment } from './getListInsertFragment';
import {
  normalizeList,
  normalizeListItemContentStyles,
  normalizeOrders,
  normalizeTextStyles,
} from './normalizers';
import { WithListOptions } from './types';

export const withList = ({
  validLiChildrenTypes,
  enableOrdering,
  supportedMarks,
  numberRender,
}: WithListOptions = {}): WithOverride => (editor) => {
  editor.options[KEY_LIST] = defaults(
    { validLiChildrenTypes, supportedMarks, enableOrdering, numberRender },
    {
      type: KEY_LIST,
      supportedMarks: [],
      numberRender: null,
      enableOrdering: false,
    }
  );

  const {
    insertBreak,
    deleteBackward,
    deleteForward,
    deleteFragment,
    normalizeNode,
  } = editor;

  editor.insertBreak = () => {
    if (getListInsertBreak(editor)) return;

    insertBreak();
  };

  editor.deleteBackward = (unit) => {
    if (getListDeleteBackward(editor, unit)) return;

    deleteBackward(unit);
  };

  editor.deleteForward = (unit) => {
    if (getListDeleteForward(editor)) return;

    deleteForward(unit);
  };

  editor.deleteFragment = () => {
    if (getListDeleteFragment(editor)) return;

    deleteFragment();
  };

  editor.insertFragment = getListInsertFragment(editor);

  editor.normalizeNode = (nodeEntry) => {
    const shouldReturnEarly = normalizeList(editor, nodeEntry);

    if (supportedMarks?.length || enableOrdering) {
      normalizeOrders(editor, nodeEntry[1]);
    }

    if (supportedMarks?.length) {
      normalizeTextStyles(editor, nodeEntry as NodeEntry<TNode>);
      normalizeListItemContentStyles(editor, nodeEntry as NodeEntry<TNode>);
    }
    if (!shouldReturnEarly) {
      normalizeNode(nodeEntry);
    }
  };

  return editor;
};
