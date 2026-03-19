import { Flex, inputFocusStyle } from '../../ui';
import { styled } from 'styled-components';

const Wrapper = styled(Flex)`
  position: relative;
  align-items: stretch;

  label {
    border-radius: var(--ctb-radius-sm);
    max-width: 50%;
    cursor: pointer;
    user-select: none;
    flex: 1;
    border: 1px solid var(--ctb-border);
    transition: border-color 0.2s var(--ctb-ease), background 0.2s var(--ctb-ease);

    ${inputFocusStyle()}
  }

  label.container:has(input:checked) {
    border-color: var(--ctb-primary);
  }

  input {
    position: absolute;
    opacity: 0;
  }

  .ctb-radio-description {
    color: var(--ctb-text-muted);
  }

  .option {
    height: 100%;
    padding: var(--ctb-space-5) var(--ctb-space-4);
    border-radius: var(--ctb-radius-sm);
    will-change: transform, opacity;
    background: var(--ctb-bg-elevated);
    transition: background 0.2s var(--ctb-ease);

    .checkmark {
      position: relative;
      display: block;
      will-change: transform;
      background: var(--ctb-bg-elevated);
      width: var(--ctb-space-5);
      height: var(--ctb-space-5);
      border: 1px solid var(--ctb-border);
      border-radius: 50%;
      flex-shrink: 0;

      &:before,
      &:after {
        content: '';
        display: block;
        border-radius: 50%;
        width: var(--ctb-space-3);
        height: var(--ctb-space-3);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &:after {
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.2s var(--ctb-ease);
        will-change: transform;
      }
    }
  }

  .container input:checked ~ div.option {
    background: var(--ctb-primary-soft);

    .ctb-radio-title {
      color: var(--ctb-primary);
    }

    .ctb-radio-description {
      color: var(--ctb-text-secondary);
    }

    .checkmark {
      border-color: var(--ctb-primary);
      &::after {
        background: var(--ctb-primary);
        transform: translate(-50%, -50%) scale(1);
      }
    }
  }
`;

export { Wrapper };
