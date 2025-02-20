import React from 'react';
import {
  CodeBlockNodeData,
  getCodeBlockPluginOptions,
} from '@udecode/plate-code-block';
import { setNodes } from '@udecode/plate-common';
import { TElement } from '@udecode/plate-core';
import {
  getRootProps,
  StyledElementProps,
} from '@udecode/plate-styled-components';
import { ReactEditor } from 'slate-react';
import { getCodeBlockElementStyles } from './CodeBlockElement.styles';
import { CodeBlockSelectElement } from './CodeBlockSelectElement';

export const CodeBlockElement = (props: StyledElementProps) => {
  const { attributes, children, nodeProps, element, editor } = props;

  const rootProps = getRootProps(props);

  const { lang } = element;
  const { root } = getCodeBlockElementStyles(props);
  const code_block = getCodeBlockPluginOptions(editor);
  const codeClassName = lang ? `${lang} language-${lang}` : '';

  return (
    <>
      <pre
        {...attributes}
        css={root.css}
        className={root.className}
        {...rootProps}
        {...nodeProps}
      >
        {code_block?.syntax && (
          <CodeBlockSelectElement
            data-testid="CodeBlockSelectElement"
            lang={lang}
            onChange={(val: string) => {
              const path = ReactEditor.findPath(editor, element);
              setNodes<TElement<CodeBlockNodeData>>(
                editor,
                { lang: val },
                { at: path }
              );
            }}
          />
        )}
        <code className={codeClassName}>{children}</code>
      </pre>
    </>
  );
};
