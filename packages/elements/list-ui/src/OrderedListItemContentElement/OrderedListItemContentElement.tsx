import * as React from 'react';
import { CSSProperties, ReactElement } from 'react';
import { getPlatePluginOptions } from '@udecode/plate-core';
import {
  isListItemContentSelected,
  KEY_LIST,
  SupportedMarksParams,
  WithListOptions,
} from '@udecode/plate-list';
import {
  getStyledNodeStyles,
  StyledElementProps,
} from '@udecode/plate-styled-components';
import { cloneDeep } from 'lodash';
import castArray from 'lodash/castArray';
import { CSSObject } from 'styled-components';
import { useListItemContentSelection } from '../hooks';
import { onMouseDown } from './OnMouseDown';

/**
 * StyledElement with no default styles.
 */
export const OrderedListItemContentElement = (
  props: StyledElementProps
): ReactElement => {
  const {
    attributes,
    children,
    nodeProps,
    className,
    styles,
    element,
    editor,
  } = props;
  const [licSelection, setLicSelection] = useListItemContentSelection(
    editor?.id
  );

  const selected =
    editor && isListItemContentSelected(editor, attributes.ref, licSelection);

  const options: WithListOptions = editor
    ? getPlatePluginOptions<Required<WithListOptions>>(editor, KEY_LIST)
    : {};
  const { supportedMarks, numberRender } = options;

  const NumberElement =
    numberRender ?? (() => <>{element?.order?.join('.')}.</>);

  const rootStyles = castArray(styles?.root ?? []);
  const nodePropsStyles = nodeProps?.styles?.root?.css ?? [];

  const { root } = getStyledNodeStyles({
    ...nodeProps,
    styles: { root: [...rootStyles, ...nodePropsStyles] },
  });

  const styleProps: CSSObject = root.css.reduce((acc: CSSObject, a) => {
    if (typeof a === 'object') {
      return { ...acc, ...(a as Partial<React.CSSProperties>) };
    }
    return acc;
  }, {} as CSSObject);

  const additionalStyles: Partial<CSSProperties> = supportedMarks
    ? supportedMarks.reduce(
        (acc: Partial<CSSProperties>, params: SupportedMarksParams) => {
          const key = (params.cssPropName as string) || (params.key as string);
          const transform: (params: {
            options: WithListOptions;
            value: unknown;
            currentValue: unknown;
          }) => string | number =
            params.transformCssValue &&
            typeof params.transformCssValue === 'function'
              ? params.transformCssValue
              : ({ value }: { value: unknown }): string | number => {
                  return value as string | number;
                };
          return {
            ...acc,
            [key]: transform({
              options,
              value: element[params.key],
              currentValue: acc[key],
            }),
          };
        },
        {} as CSSProperties
      )
    : ({} as Partial<CSSProperties>);

  return (
    <div
      style={{
        ...styleProps,
        display: 'flex',
        alignItems: 'flex-start',
      }}
      className={className}
    >
      {element.parentType === 'ol' && (
        <span
          style={{
            userSelect: 'none',
            msUserSelect: 'none',
            paddingRight: '4px',
            ...additionalStyles,
            ...(selected ? { backgroundColor: '#b9d5ff' } : {}),
          }}
          contentEditable={false}
          onMouseDown={(ev) =>
            editor && onMouseDown(ev, editor, attributes, setLicSelection)
          }
        >
          <NumberElement order={cloneDeep(element.order)} options={options} />
        </span>
      )}
      <span style={{ display: 'inline-block' }} {...attributes} {...nodeProps}>
        {children}
      </span>
    </div>
  );
};
