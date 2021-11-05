import { ListItemContentSelection } from '@udecode/plate-list';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export type Param = {
  id: string;
  selection?: ListItemContentSelection;
};

export const listItemContentSelectionStates = atomFamily(
  (param: Param) => atom(param.selection),
  (a: Param, b: Param) => a.id === b.id
);
