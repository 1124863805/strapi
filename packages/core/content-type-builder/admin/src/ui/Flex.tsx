import type { HTMLAttributes, ReactNode } from 'react';

const toPx = (n?: number) => (n != null ? `${n * 4}px` : undefined);

type FlexProps = HTMLAttributes<HTMLDivElement> & {
  direction?: 'row' | 'column';
  gap?: number;
  alignItems?: string;
  justifyContent?: string;
  children?: ReactNode;
  padding?: number | string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingBlock?: number;
  paddingInline?: number;
  wrap?: string;
  maxHeight?: string;
  overflow?: string;
  textAlign?: string;
  background?: string;
  position?: string;
  cursor?: string;
  hasRadius?: boolean;
  grow?: number;
  borderRadius?: string;
  marginTop?: number;
  maxWidth?: string;
  shrink?: number;
  height?: number | string;
  width?: number | string;
  style?: React.CSSProperties;
};

export const Flex = ({
  direction = 'row',
  gap = 0,
  alignItems,
  justifyContent,
  style,
  children,
  padding,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  paddingBlock,
  paddingInline,
  wrap,
  maxHeight,
  overflow,
  textAlign,
  background,
  position,
  cursor,
  hasRadius,
  grow,
  borderRadius,
  marginTop,
  maxWidth,
  shrink,
  height,
  width,
  ...rest
}: FlexProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: direction,
      gap: typeof gap === 'number' ? `${gap * 4}px` : gap,
      alignItems,
      justifyContent,
      padding: typeof padding === 'string' ? padding : toPx(padding),
      paddingLeft: toPx(paddingLeft),
      paddingRight: toPx(paddingRight),
      paddingTop: toPx(paddingTop),
      paddingBottom: toPx(paddingBottom),
      paddingBlock: toPx(paddingBlock),
      paddingInline: toPx(paddingInline),
      flexWrap: wrap as React.CSSProperties['flexWrap'],
      maxHeight,
      overflow,
      textAlign: textAlign as React.CSSProperties['textAlign'],
      background:
        background === 'neutral100'
          ? 'var(--ctb-bg)'
          : background === 'primary200'
            ? 'var(--ctb-primary-soft)'
            : background === 'alternative100'
              ? 'var(--ctb-primary-soft)'
              : background,
      position: position as React.CSSProperties['position'],
      cursor,
      borderRadius: hasRadius ? 'var(--ctb-radius-sm)' : borderRadius,
      flexGrow: grow,
      marginTop: marginTop != null ? marginTop * 4 : undefined,
      maxWidth,
      flexShrink: shrink,
      height,
      width,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);
