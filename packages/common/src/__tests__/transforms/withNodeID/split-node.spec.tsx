/** @jsx jsx */
import { jsx } from '@udecode/slate-plugins-test-utils';
import { Editor, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { withNodeID } from '../../../plugins/node-id/index';
import { idCreatorFixture } from './fixtures';

const input = ((
  <editor>
    <hp id={10}>
      tes
      <cursor />t
    </hp>
  </editor>
) as any) as Editor;

const output = (
  <editor>
    <hp id={10}>tes</hp>
    <hp id={1}>t</hp>
  </editor>
) as any;

it('should add an id to the new element', () => {
  const editor = withNodeID({
    idCreator: idCreatorFixture,
  })(withHistory(input));

  Transforms.splitNodes(editor);

  editor.undo();
  editor.redo();
  editor.undo();
  editor.redo();

  expect(input.children).toEqual(output.children);
});