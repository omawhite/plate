import { ListItemContentSelection } from '@udecode/plate-list';
import { SetStateAction, useAtom } from 'jotai';
import { listItemContentSelectionStates, Param } from '../atoms';

export const useListItemContentSelection = (
  id: string
): [
  ListItemContentSelection | undefined,
  (param: SetStateAction<ListItemContentSelection | undefined>) => void,
  (param: Param) => void
] => {
  const [listItemSelection, setListItemSelection] = useAtom(
    listItemContentSelectionStates({ id })
  );

  return [
    listItemSelection,
    setListItemSelection,
    listItemContentSelectionStates.remove,
  ];
};
