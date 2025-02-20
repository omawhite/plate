import React from 'react';
import castArray from 'lodash/castArray';
import { EditableProps } from 'slate-react/dist/components/editable';
import { DefaultLeaf } from '../components/DefaultLeaf';
import { PlateEditor } from '../types/PlateEditor';
import { PlatePlugin } from '../types/PlatePlugin/PlatePlugin';
import { PlateRenderLeafProps } from '../types/PlateRenderLeafProps';
import { TRenderLeafProps } from '../types/TRenderLeafProps';
import { pipeOverrideProps } from './pipeOverrideProps';

/**
 * @see {@link RenderLeaf}
 */
export const pipeRenderLeaf = (
  editor: PlateEditor,
  plugins: PlatePlugin[] = []
): EditableProps['renderLeaf'] => {
  const renderLeafs = plugins.flatMap(
    (plugin) => plugin.renderLeaf?.(editor) ?? []
  );

  const propsOverriders = plugins.flatMap((plugin) =>
    castArray(plugin.overrideProps).flatMap((cb) => cb?.(editor) ?? [])
  );

  return (renderLeafProps) => {
    const props: PlateRenderLeafProps = {
      ...pipeOverrideProps(
        renderLeafProps as TRenderLeafProps,
        propsOverriders
      ),
      editor,
      plugins,
    };

    renderLeafs.forEach((renderLeaf) => {
      const newChildren = renderLeaf(props);
      if (newChildren !== undefined) {
        props.children = newChildren;
      }
    });

    return <DefaultLeaf {...props} />;
  };
};
