import { css } from 'styled-components';

export const inputFocusStyle = () => css`
  &:focus-within {
    outline: 2px solid var(--ctb-primary);
    outline-offset: 2px;
  }
`;
