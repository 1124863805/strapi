import { isObject } from 'lodash/fp';
import { engine as engineDataTransfer, leao as leaoDataTransfer } from '@leao/data-transfer';

import {
  buildTransferTable,
  createLeaoInstance,
  DEFAULT_IGNORED_CONTENT_TYPES,
  formatDiagnostic,
  loadersFactory,
  exitMessageText,
  abortTransfer,
  setSignalHandler,
  getDiffHandler,
  getAssetsBackupHandler,
  parseRestoreFromOptions,
} from '../../utils/data-transfer';
import { exitWith } from '../../utils/helpers';

const { createTransferEngine } = engineDataTransfer;
const {
  providers: {
    createRemoteLeaoDestinationProvider,
    createLocalLeaoSourceProvider,
    createLocalLeaoDestinationProvider,
    createRemoteLeaoSourceProvider,
  },
} = leaoDataTransfer;

interface CmdOptions {
  from?: URL;
  fromToken: string;
  to: URL;
  toToken: string;
  only?: (keyof engineDataTransfer.TransferGroupFilter)[];
  exclude?: (keyof engineDataTransfer.TransferGroupFilter)[];
  throttle?: number;
  force?: boolean;
}
/**
 * Transfer command.
 *
 * Transfers data between local Leao and remote Leao instances
 */
export default async (opts: CmdOptions) => {
  // Validate inputs from Commander
  if (!isObject(opts)) {
    exitWith(1, 'Could not parse command arguments');
  }

  if (!(opts.from || opts.to) || (opts.from && opts.to)) {
    exitWith(1, 'Exactly one source (from) or destination (to) option must be provided');
  }

  const leao = await createLeaoInstance();
  let source;
  let destination;

  // if no URL provided, use local Leao
  if (!opts.from) {
    source = createLocalLeaoSourceProvider({
      getLeao: () => leao,
    });
  }
  // if URL provided, set up a remote source provider
  else {
    if (!opts.fromToken) {
      exitWith(1, 'Missing token for remote destination');
    }

    source = createRemoteLeaoSourceProvider({
      getLeao: () => leao,
      url: opts.from,
      auth: {
        type: 'token',
        token: opts.fromToken,
      },
    });
  }

  // if no URL provided, use local Leao
  if (!opts.to) {
    destination = createLocalLeaoDestinationProvider({
      getLeao: () => leao,
      strategy: 'restore',
      restore: parseRestoreFromOptions(opts),
    });
  }
  // if URL provided, set up a remote destination provider
  else {
    if (!opts.toToken) {
      exitWith(1, 'Missing token for remote destination');
    }

    destination = createRemoteLeaoDestinationProvider({
      url: opts.to,
      auth: {
        type: 'token',
        token: opts.toToken,
      },
      strategy: 'restore',
      restore: parseRestoreFromOptions(opts),
    });
  }

  if (!source || !destination) {
    exitWith(1, 'Could not create providers');
  }

  const engine = createTransferEngine(source, destination, {
    versionStrategy: 'exact',
    schemaStrategy: 'strict',
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
          filter(entity) {
            return !DEFAULT_IGNORED_CONTENT_TYPES.includes(entity.type);
          },
        },
      ],
    },
  });

  engine.diagnostics.onDiagnostic(formatDiagnostic('transfer'));

  const progress = engine.progress.stream;

  const { updateLoader } = loadersFactory();

  engine.onSchemaDiff(getDiffHandler(engine, { force: opts.force, action: 'transfer' }));

  engine.addErrorHandler(
    'ASSETS_DIRECTORY_ERR',
    getAssetsBackupHandler(engine, { force: opts.force, action: 'transfer' })
  );

  progress.on(`stage::start`, ({ stage, data }) => {
    updateLoader(stage, data).start();
  });

  progress.on('stage::finish', ({ stage, data }) => {
    updateLoader(stage, data).succeed();
  });

  progress.on('stage::progress', ({ stage, data }) => {
    updateLoader(stage, data);
  });

  progress.on('stage::error', ({ stage, data }) => {
    updateLoader(stage, data).fail();
  });

  progress.on('transfer::start', () => {
    console.log(`Starting transfer...`);
  });

  let results: Awaited<ReturnType<typeof engine.transfer>>;
  try {
    // Abort transfer if user interrupts process
    setSignalHandler(() => abortTransfer({ engine, leao }));

    results = await engine.transfer();

    try {
      const table = buildTransferTable(results.engine);
      console.log(table?.toString());
    } catch (e) {
      console.error('There was an error displaying the results of the transfer.');
    }

    exitWith(0, exitMessageText('transfer'));
  } catch {
    exitWith(1, exitMessageText('transfer', true));
  }
};
