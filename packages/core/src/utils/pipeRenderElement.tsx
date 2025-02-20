import React from 'react';
import castArray from 'lodash/castArray';
import { DefaultElement } from 'slate-react';
import { EditableProps } from 'slate-react/dist/components/editable';
import { PlateEditor } from '../types/PlateEditor';
import { PlatePlugin } from '../types/PlatePlugin/PlatePlugin';
import { PlateRenderElementProps } from '../types/PlateRenderElementProps';
import { TRenderElementProps } from '../types/TRenderElementProps';
import { pipeOverrideProps } from './pipeOverrideProps';

/**
 * @see {@link RenderElement}
 */
export const pipeRenderElement = (
  editor: PlateEditor,
  plugins: PlatePlugin[] = []
): EditableProps['renderElement'] => {
  const renderElements = plugins.flatMap(
    (plugin) => plugin.renderElement?.(editor) ?? []
  );

  const propsOverriders = plugins.flatMap((plugin) =>
    castArray(plugin.overrideProps).flatMap((cb) => cb?.(editor) ?? [])
  );

  return (renderElementProps) => {
    const props: PlateRenderElementProps = {
      ...pipeOverrideProps(
        renderElementProps as TRenderElementProps,
        propsOverriders
      ),
      editor,
      plugins,
    };

    let element;

    renderElements.some((renderElement) => {
      element = renderElement(props as any);
      return !!element;
    });

    if (element) return element;

    return <DefaultElement {...props} />;
  };
};
