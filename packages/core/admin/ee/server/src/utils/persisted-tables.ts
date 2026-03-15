import type { Core } from '@leao/types';
import { differenceWith, isEqual } from 'lodash/fp';

interface PersistedTable {
  name: string;
  dependsOn?: Array<{ name: string }>;
}

/**
 * Transform table name to the object format
 */
const transformTableName = (table: string | PersistedTable) => {
  if (typeof table === 'string') {
    return { name: table };
  }
  return table;
};

/**
 * Finds all tables in the database matching the regular expression
 * @param {Object} ctx
 * @param {Leao} ctx.leao
 * @param {RegExp} regex
 * @returns {Promise<string[]>}
 */
export async function findTables({ leao }: { leao: Core.Leao }, regex: any) {
  // @ts-expect-error - getTables is not typed into the schema inspector
  const tables = await leao.db.dialect.schemaInspector.getTables();
  return tables.filter((tableName: string) => regex.test(tableName));
}

/**
 * Add tables name to the reserved tables in core store
 */
async function addPersistTables(
  { leao }: { leao: Core.Leao },
  tableNames: Array<string | PersistedTable>
) {
  const persistedTables = await getPersistedTables({ leao });
  const tables = tableNames.map(transformTableName);

  // Get new tables to be persisted, remove tables if they already were persisted
  const notPersistedTableNames = differenceWith(isEqual, tables, persistedTables);
  // Remove tables that are going to be changed
  const tablesToPersist = differenceWith(
    (t1: any, t2: any) => t1.name === t2.name,
    persistedTables,
    notPersistedTableNames
  );

  if (!notPersistedTableNames.length) {
    return;
  }

  // @ts-expect-error lodash types
  tablesToPersist.push(...notPersistedTableNames);
  await leao.store.set({
    type: 'core',
    key: 'persisted_tables',
    value: tablesToPersist,
  });
}

/**
 * Get all reserved table names from the core store
 * @param {Object} ctx
 * @param {Leao} ctx.leao
 * @param {RegExp} regex
 * @returns {Promise<string[]>}
 */

async function getPersistedTables({ leao }: { leao: Core.Leao }) {
  const persistedTables: any = await leao.store.get({
    type: 'core',
    key: 'persisted_tables',
  });

  return (persistedTables || []).map(transformTableName);
}

/**
 * Set all reserved table names in the core store
 * @param {Object} ctx
 * @param {Leao} ctx.leao
 * @param {Array<string|{ table: string; dependsOn?: Array<{ table: string;}> }>} tableNames
 * @returns {Promise<void>}
 */
async function setPersistedTables(
  { leao }: { leao: Core.Leao },
  tableNames: Array<string | PersistedTable>
) {
  await leao.store.set({
    type: 'core',
    key: 'persisted_tables',
    value: tableNames,
  });
}
/**
 * Add all table names that start with a prefix to the reserved tables in
 * core store
 * @param {string} tableNamePrefix
 * @return {Promise<void>}
 */

export const persistTablesWithPrefix = async (tableNamePrefix: string) => {
  const tableNameRegex = new RegExp(`^${tableNamePrefix}.*`);
  const tableNames = await findTables({ leao }, tableNameRegex);

  await addPersistTables({ leao }, tableNames);
};

/**
 * Remove all table names that end with a suffix from the reserved tables in core store
 * @param {string} tableNameSuffix
 * @return {Promise<void>}
 */
export const removePersistedTablesWithSuffix = async (tableNameSuffix: string) => {
  const tableNameRegex = new RegExp(`.*${tableNameSuffix}$`);
  const persistedTables = await getPersistedTables({ leao });

  const filteredPersistedTables = persistedTables.filter((table: any) => {
    return !tableNameRegex.test(table.name);
  });

  if (filteredPersistedTables.length === persistedTables.length) {
    return;
  }

  await setPersistedTables({ leao }, filteredPersistedTables);
};

/**
 * Add tables to the reserved tables in core store
 */
export const persistTables = async (tables: Array<string | PersistedTable>) => {
  await addPersistTables({ leao }, tables);
};

export default {
  persistTablesWithPrefix,
  removePersistedTablesWithSuffix,
  persistTables,
  findTables,
};
