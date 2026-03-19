import type { HTMLAttributes, ReactNode } from 'react';

type BoxTag = 'div' | 'span' | 'section' | 'article' | 'button';

const toPx = (n?: number) => (n != null ? `${n * 4}px` : undefined);

type BoxProps = HTMLAttributes<HTMLDivElement> & {
  tag?: BoxTag;
  children?: ReactNode;
  padding?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  position?: string;
  grow?: number;
  height?: string;
  width?: string;
  top?: number;
  textAlign?: string;
  hasRadius?: boolean;
  background?: string;
  borderColor?: string;
  marginTop?: number;
  maxWidth?: string;
};

export const Box = ({
  tag: Tag = 'div',
  children,
  style,
  padding,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  position,
  grow,
  height,
  width,
  top,
  textAlign,
  hasRadius,
  background,
  borderColor,
  marginTop,
  maxWidth,
  ...rest
}: BoxProps) => {
  const s: React.CSSProperties = {
    ...style,
    padding: toPx(padding),
    paddingLeft: toPx(paddingLeft),
    paddingRight: toPx(paddingRight),
    paddingTop: toPx(paddingTop),
    paddingBottom: toPx(paddingBottom),
    position: position as React.CSSProperties['position'],
    flexGrow: grow,
    height,
    width,
    top: toPx(top),
    textAlign: textAlign as React.CSSProperties['textAlign'],
    borderRadius: hasRadius ? 'var(--ctb-radius-sm)' : undefined,
    background: background === 'neutral100' ? 'var(--ctb-bg)' : background,
    borderColor: borderColor === 'neutral200' ? 'var(--ctb-border)' : borderColor,
    marginTop: marginTop != null ? marginTop * 4 : undefined,
    maxWidth,
  };
  return (
    <Tag style={s} {...(rest as any)}>
      {children}
    </Tag>
  );
};
