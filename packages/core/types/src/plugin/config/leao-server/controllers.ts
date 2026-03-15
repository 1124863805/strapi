import type * as Core from '../../../core';

// TODO Replace when we have WithLeaoCallback accessible
export type Controller = ({ leao }: { leao: Core.Leao }) => Core.Controller;

export interface Controllers {
  [key: string]: Controller;
}
