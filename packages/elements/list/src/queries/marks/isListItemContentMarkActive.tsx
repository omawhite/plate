import { TEditor } from '@udecode/plate-core';
import { ListItemContentSelection } from '../../types';
import { hasListItemContentMarkActive } from './hasListItemContentMarkActive';

export const isListItemContentMarkActive = (
  editor: TEditor,
  licSelection: ListItemContentSelection,
  key: string
): boolean => {
  return !!hasListItemContentMarkActive(editor, licSelection, key);
};
