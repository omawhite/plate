import { TAncestor, TEditor } from '@udecode/plate-core';
import { defaults } from 'lodash';
import { Editor } from 'slate';
import { EditorAboveOptions } from '../types';
import { getQueryOptions } from './match';

/**
 * Get node above a location (default: selection).
 */
export const getAbove = <T extends TAncestor = TAncestor>(
  editor: TEditor,
  options: EditorAboveOptions<T> = { throwError: true }
) => {
  options = defaults(options, { throwError: true });

  if (options.throwError) {
    return Editor.above<T>(editor, getQueryOptions(editor, options));
  }
  try {
    return Editor.above<T>(editor, getQueryOptions(editor, options));
  } catch (e) {
    return null;
  }
};
