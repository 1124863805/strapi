import type { Core } from '@leao1/types';
import { isObject } from 'lodash/fp';
import chalk from 'chalk';

import {
  engine as engineDataTransfer,
  leao as leaoDataTransfer,
  file as fileDataTransfer,
} from '@leao1/data-transfer';

import {
  buildTransferTable,
  DEFAULT_IGNORED_CONTENT_TYPES,
  createLeaoInstance,
  formatDiagnostic,
  loadersFactory,
  exitMessageText,
  abortTransfer,
  setSignalHandler,
  getDiffHandler,
  parseRestoreFromOptions,
} from '../../utils/data-transfer';
import { exitWith } from '../../utils/helpers';

const {
  providers: { createLocalFileSourceProvider },
} = fileDataTransfer;

const {
  providers: { createLocalLeaoDestinationProvider, DEFAULT_CONFLICT_STRATEGY },
} = leaoDataTransfer;

const { createTransferEngine, DEFAULT_VERSION_STRATEGY, DEFAULT_SCHEMA_STRATEGY } =
  engineDataTransfer;

interface CmdOptions {
  file?: string;
  decompress?: boolean;
  decrypt?: boolean;
  key?: string;
  conflictStrategy?: 'restore';
  force?: boolean;
  only?: (keyof engineDataTransfer.TransferGroupFilter)[];
  exclude?: (keyof engineDataTransfer.TransferGroupFilter)[];
  throttle?: number;
}

type EngineOptions = Parameters<typeof createTransferEngine>[2];

/**
 * Import command.
 *
 * It transfers data from a file to a local Leao instance
 */
export default async (opts: CmdOptions) => {
  // validate inputs from Commander
  if (!isObject(opts)) {
    exitWith(1, 'Could not parse arguments');
  }

  /**
   * From leao backup file
   */
  const sourceOptions = getLocalFileSourceOptions(opts);

  const source = createLocalFileSourceProvider(sourceOptions);

  /**
   * To local Leao instance
   */
  const leaoInstance = await createLeaoInstance();

  /**
   * Configure and run the transfer engine
   */
  const engineOptions: EngineOptions = {
    versionStrategy: DEFAULT_VERSION_STRATEGY,
    schemaStrategy: DEFAULT_SCHEMA_STRATEGY,
    exclude: opts.exclude,
    only: opts.only,
    throttle: opts.throttle,
    transforms: {
      links: [
        {
          filter(link) {
            return (
              !DEFAULT_IGNORED_CONTENT_TYPES.includes(link.left.type) &&
              !DEFAULT_IGNORED_CONTENT_TYPES.includes(link.right.type)
            );
          },
        },
      ],
      entities: [
        {
          filter: (entity) => !DEFAULT_IGNORED_CONTENT_TYPES.includes(entity.type),
        },
      ],
    },
  };

  const destinationOptions = {
    async getLeao() {
      return leaoInstance;
    },
    autoDestroy: false,
    strategy: opts.conflictStrategy || DEFAULT_CONFLICT_STRATEGY,
    restore: parseRestoreFromOptions(engineOptions),
  };

  const destination = createLocalLeaoDestinationProvider(destinationOptions);
  destination.onWarning = (message) => console.warn(`\n${chalk.yellow('warn')}: ${message}`);

  const engine = createTransferEngine(source, destination, engineOptions);

  engine.diagnostics.onDiagnostic(formatDiagnostic('import'));

  const progress = engine.progress.stream;

  const { updateLoader } = loadersFactory();

  engine.onSchemaDiff(getDiffHandler(engine, { force: opts.force, action: 'import' }));

  progress.on(`stage::start`, ({ stage, data }) => {
    updateLoader(stage, data).start();
  });

  progress.on('stage::finish', ({ stage, data }) => {
    updateLoader(stage, data).succeed();
  });

  progress.on('stage::progress', ({ stage, data }) => {
    updateLoader(stage, data);
  });

  progress.on('transfer::start', () => {
    console.log('Starting import...');
  });

  let results: engineDataTransfer.ITransferResults<typeof source, typeof destination>;
  try {
    // Abort transfer if user interrupts process
    setSignalHandler(() => abortTransfer({ engine, leao: leao as Core.Leao }));

    results = await engine.transfer();

    try {
      const table = buildTransferTable(results.engine);
      console.log(table?.toString());
    } catch (e) {
      console.error('There was an error displaying the results of the transfer.');
    }

    await leaoInstance.destroy();

    exitWith(0, exitMessageText('import'));
  } catch {
    exitWith(1, exitMessageText('import', true));
  }
};

/**
 * Infer local file source provider options based on a given filename
 */
const getLocalFileSourceOptions = (opts: {
  file?: string;
  decompress?: boolean;
  decrypt?: boolean;
  key?: string;
}) => {
  const options: fileDataTransfer.providers.ILocalFileSourceProviderOptions = {
    file: { path: opts.file ?? '' },
    compression: { enabled: !!opts.decompress },
    encryption: { enabled: !!opts.decrypt, key: opts.key },
  };

  return options;
};
