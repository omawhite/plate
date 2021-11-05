import { useEffect } from 'react';
import { useEditorState } from '@udecode/plate-core';
import { useListItemContentSelection } from '../hooks';

export const PlateListExtensionEffect = () => {
  const editor = useEditorState();
  const [, setLicSelection, licSelectionRemove] = useListItemContentSelection(
    editor.id
  );

  useEffect(() => {
    if (editor?.selection) {
      setLicSelection(undefined);
    }
  }, [editor?.selection, setLicSelection]);

  useEffect(() => {
    return () => {
      licSelectionRemove({ id: editor.id as string });
    };
  }, [editor.id, licSelectionRemove]);

  return null;
};
