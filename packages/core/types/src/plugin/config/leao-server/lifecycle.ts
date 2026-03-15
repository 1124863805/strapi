import type { Leao } from '../../../core';

export type LifecycleMethod = ({ leao }: { leao: Leao }) => Promise<unknown> | unknown;

export type Register = LifecycleMethod;
export type Bootstrap = LifecycleMethod;
export type Destroy = LifecycleMethod;
