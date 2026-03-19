import type { HTMLAttributes, ReactNode } from 'react';

type TypographyTag = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'label';

type TypographyProps = HTMLAttributes<HTMLElement> & {
  variant?: 'sigma' | 'pi' | 'epsilon' | 'delta' | 'beta' | 'alpha';
  textColor?: string;
  fontWeight?: string | number;
  fontSize?: number;
  tag?: TypographyTag;
  children?: ReactNode;
  ellipsis?: boolean;
  textAlign?: string;
  htmlFor?: string;
};

/* 中文优化：sigma 不转大写，行高 1.5 */
const variantStyles: Record<string, React.CSSProperties> = {
  sigma: { fontSize: 'var(--ctb-font-size-sm)', letterSpacing: '0.3px', lineHeight: 1.5 },
  pi: { fontSize: 'var(--ctb-font-size-base)', lineHeight: 1.5 },
  epsilon: { fontSize: 'var(--ctb-font-size-lg)', lineHeight: 1.5 },
  delta: { fontSize: 'var(--ctb-font-size-base)', lineHeight: 1.5 },
  beta: { fontSize: 'var(--ctb-font-size-md)', lineHeight: 1.5 },
  alpha: { fontSize: 'var(--ctb-font-size-xl)', lineHeight: 1.5 },
};

export const Typography = ({
  variant = 'pi',
  textColor,
  fontWeight,
  fontSize,
  tag: Tag = 'span',
  style,
  children,
  ellipsis,
  textAlign,
  htmlFor,
  ...rest
}: TypographyProps) => (
  <Tag
    style={{
      ...variantStyles[variant],
      color:
        textColor === 'neutral600'
          ? 'var(--ctb-text-muted)'
          : textColor === 'neutral800'
            ? 'var(--ctb-text)'
            : textColor === 'primary600'
              ? 'var(--ctb-primary)'
              : textColor === 'alternative600'
                ? 'var(--ctb-primary)'
                : undefined,
      fontWeight,
      fontSize: fontSize ?? variantStyles[variant]?.fontSize,
      overflow: ellipsis ? 'hidden' : undefined,
      textOverflow: ellipsis ? 'ellipsis' : undefined,
      whiteSpace: ellipsis ? 'nowrap' : undefined,
      textAlign: textAlign as React.CSSProperties['textAlign'],
      ...style,
    }}
    htmlFor={htmlFor}
    {...rest}
  >
    {children}
  </Tag>
);
