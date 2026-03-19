import type { ReactNode } from 'react';
import { styled } from 'styled-components';

import { Flex, Typography } from '../ui';

const IconBox = styled.div<{ color: string }>`
  height: 2.4rem;
  width: 2.4rem;
  border-radius: var(--ctb-radius-sm);
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ color }) =>
    color === 'primary' ? 'var(--ctb-primary-soft)' : 'var(--ctb-bg-hover)'};
  color: ${({ color }) => (color === 'primary' ? 'var(--ctb-primary)' : 'var(--ctb-text-muted)')};

  svg {
    height: 1rem;
    width: 1rem;
  }
`;

const ButtonBox = styled.button`
  border-radius: 0 0 var(--ctb-radius) var(--ctb-radius);
  display: block;
  width: 100%;
  border: none;
  position: relative;
  left: -0.4rem;
  padding: var(--ctb-space-4) var(--ctb-space-5);
  min-height: 52px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-family: var(--ctb-font);
  transition: background 180ms ease;
  border-top: 1px dashed var(--ctb-border);

  &:hover {
    background: var(--ctb-bg);
  }
`;

interface NestedTFooterProps {
  color: string;
  children: ReactNode;
  icon: ReactNode;
  onClick?: () => void;
}

export const NestedTFooter = ({ children, icon, color, ...props }: NestedTFooterProps) => (
  <ButtonBox type="button" {...props}>
    <Flex>
      <IconBox color={color} aria-hidden>
        {icon}
      </IconBox>
      <div style={{ paddingLeft: 'var(--ctb-space-4)' }}>
        <Typography variant="pi" fontWeight="bold" textColor={color === 'primary' ? 'primary600' : 'neutral600'}>
          {children}
        </Typography>
      </div>
    </Flex>
  </ButtonBox>
);
