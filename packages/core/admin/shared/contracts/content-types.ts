import type { Struct } from '@leao1/types';

export interface ContentType extends Struct.ContentTypeSchema {
  isDisplayed: boolean;
  apiID: string;
}
