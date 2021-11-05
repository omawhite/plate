import { MutableRefObject } from 'react';
import { getAbove } from '@udecode/plate-common';
import { getPlatePluginType, PlateEditor } from '@udecode/plate-core';
import { isEqual } from 'lodash';
import { ReactEditor } from 'slate-react';
import { ELEMENT_LIC } from '../../defaults';
import { ListItemContentSelection } from '../../types';
import { getListRoot } from '../getListRoot';
import { getListItemLevel } from './getListItemLevel';

export const isListItemContentSelected = (
  editor: PlateEditor & ReactEditor,
  ref: MutableRefObject<HTMLElement>,
  listItemSelection?: ListItemContentSelection
): boolean => {
  if (!editor || !listItemSelection || !ref) {
    return false;
  }
  const licType = getPlatePluginType(editor, ELEMENT_LIC);

  const point = ReactEditor.toSlatePoint(editor, [ref.current, 0], {
    exactMatch: false,
    suppressThrow: true,
  });

  if (!point) {
    return false;
  }

  const lic = getAbove(editor, {
    at: point,
    match: { type: licType },
    throwError: false,
  });

  if (!lic) {
    return false;
  }

  if (isEqual(listItemSelection.path, lic[1])) {
    return true;
  }

  if (listItemSelection.level) {
    const licLevel = getListItemLevel(lic[1]);
    const selectionLevel = getListItemLevel(listItemSelection.path);
    if (licLevel === selectionLevel) {
      const licRoot = getListRoot(editor, lic[1]);
      const selectionRoot = getListRoot(editor, listItemSelection.path);
      if (selectionRoot && licRoot && isEqual(selectionRoot[1], licRoot[1])) {
        return true;
      }
    }
  }

  return false;
};
