import { CSSProperties, ReactChild, ReactChildren, ReactNode } from 'react';

export type SupportedMarksParams = {
  key: '';

  /**
   * camelCase name of the css property that is used by the mark
   * if not provided it will fall back to the plugin key
   * @default key
   */
  cssPropName?: keyof CSSProperties;

  /**
   * Transformation function that will be used to transform the value from the text
   * if not provided the value will be used as is
   * `value` the value on the element
   * `currentValue` this will hold the current value of the cssPropName
   * for scenarios when multiple plugin were to handle the same cssPropName
   * @default undefined
   */
  transformCssValue?: (params: {
    options: WithListOptions;
    value: unknown;
    currentValue: unknown;
  }) => number | string;
};

export interface WithListOptions {
  /**
   * Valid children types for list items, in addition to p and ul types.
   */
  validLiChildrenTypes?: string[];

  /**
   * Enables custom ordering, this is required for formatted numbering
   * It will be enable if supportedMarks are provided
   */
  enableOrdering?: boolean;

  /**
   * Render for the number element,
   * @default ({order}) => order.join('.')
   */
  numberRender?: (params: {
    order: number[];
    options: WithListOptions;
  }) => JSX.Element;

  /**
   * List of supported marks
   */
  supportedMarks?: SupportedMarksParams[];
}

export interface ListNormalizerOptions
  extends Pick<WithListOptions, 'validLiChildrenTypes'> {}
