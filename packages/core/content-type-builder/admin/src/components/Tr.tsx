import { styled } from 'styled-components';

// Keep component-row for css specificity
export const Tr = styled.tr<{
  $isFromDynamicZone?: boolean;
  $isChildOfDynamicZone?: boolean;
}>`
  &.component-row,
  &.dynamiczone-row {
    position: relative;
    border-top: none !important;

    table tr:first-child {
      border-top: none;
    }

    > td:first-of-type {
      padding: 0 0 0 var(--ctb-space-8);
      position: relative;

      &::before {
        content: '';
        width: var(--ctb-space-2);
        height: calc(100% - 2 * var(--ctb-space-5));
        position: absolute;
        top: calc(-1 * var(--ctb-space-2));
        left: calc(var(--ctb-space-8) + var(--ctb-space-2));
        border-radius: var(--ctb-radius-sm);

        ${({ $isFromDynamicZone, $isChildOfDynamicZone }) => {
          if ($isChildOfDynamicZone || $isFromDynamicZone) {
            return `background-color: var(--ctb-primary-soft);`;
          }
          return `background: var(--ctb-bg-active);`;
        }}
      }
    }
  }

  &.dynamiczone-row > td:first-of-type {
    padding: 0;
  }
`;
