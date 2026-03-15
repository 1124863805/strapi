import type { SchemaDefinition } from '../../../struct';

export interface ContentTypes {
  /**
   * Only the schema property is used and available
   * See loader in packages/core/leao/src/core/loaders/plugins/index.ts
   *  */
  [key: string]: { schema: SchemaDefinition };
}
