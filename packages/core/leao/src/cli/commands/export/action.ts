import { isObject, isString, isFinite, toNumber } from 'lodash/fp';
import fs from 'fs-extra';
import chalk from 'chalk';
import type { Core } from '@leao/types';

import {
  engine as engineDataTransfer,
  leao as leaoDataTransfer,
  file as fileDataTransfer,
} from '@leao/data-transfer';

import {
  getDefaultExportName,
  buildTransferTable,
  DEFAULT_IGNORED_CONTENT_TYPES,
  createLeaoInstance,
  formatDiagnostic,
  loadersFactory,
  exitMessageText,
  abortTransfer,
  setSignalHandler,
} from '../../utils/data-transfer';
import { exitWith } from '../../utils/helpers';

const {
  providers: { createLocalFileDestinationProvider },
} = fileDataTransfer;
const {
  providers: { createLocalLeaoSourceProvider },
} = leaoDataTransfer;

const BYTES_IN_MB = 1024 * 1024;

interface CmdOptions {
  file?: string;
  encrypt?: boolean;
  key?: string;
  compress?: boolean;
  only?: (keyof engineDataTransfer.TransferGroupFilter)[];
  exclude?: (keyof engineDataTransfer.TransferGroupFilter)[];
  throttle?: number;
  maxSizeJsonl?: number;
}

/**
 * Export command.
 *
 * It transfers data from a local Leao instance to a file
 *
 * @param {ExportCommandOptions} opts
 */
export default async (opts: CmdOptions) => {
  // Validate inputs from Commander
  if (!isObject(opts)) {
    exitWith(1, 'Could not parse command arguments');
  }

  const leao = await createLeaoInstance();

  const source = createSourceProvider(leao);
  const destination = createDestinationProvider(opts);

  const engine = engineDataTransfer.createTransferEngine(source, destination, {
    versionStrategy: 'ignore', // for an export to file, versionStrategy will always be skipped
    schemaStrategy: 'ignore', // for an export to file, schemaStrategy will always be skipped
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

  engine.diagnostics.onDiagnostic(formatDiagnostic('export'));

  const progress = engine.progress.stream;

  const { updateLoader } = loadersFactory();

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
    console.log(`Starting export...`);
  });

  let results: engineDataTransfer.ITransferResults<typeof source, typeof destination>;
  let outFile: string;
  try {
    // Abort transfer if user interrupts process
    setSignalHandler(() => abortTransfer({ engine, leao }));

    results = await engine.transfer();
    outFile = results.destination?.file?.path ?? '';
    const outFileExists = await fs.pathExists(outFile);
    if (!outFileExists) {
      throw new engineDataTransfer.errors.TransferEngineTransferError(
        `Export file not created "${outFile}"`
      );
    }

    try {
      const table = buildTransferTable(results.engine);
      console.log(table?.toString());
    } catch (e) {
      console.error('There was an error displaying the results of the transfer.');
    }

    console.log(`Export archive is in ${chalk.green(outFile)}`);
    exitWith(0, exitMessageText('export'));
  } catch {
    exitWith(1, exitMessageText('export', true));
  }
};

/**
 * It creates a local leao destination provider
 */
const createSourceProvider = (leao: Core.Leao) => {
  return createLocalLeaoSourceProvider({
    async getLeao() {
      return leao;
    },
  });
};

/**
 * It creates a local file destination provider based on the given options
 */
const createDestinationProvider = (opts: CmdOptions) => {
  const { file, compress, encrypt, key, maxSizeJsonl } = opts;

  const filepath = isString(file) && file.length > 0 ? file : getDefaultExportName();

  const maxSizeJsonlInMb = isFinite(toNumber(maxSizeJsonl))
    ? toNumber(maxSizeJsonl) * BYTES_IN_MB
    : undefined;

  return createLocalFileDestinationProvider({
    file: {
      path: filepath,
      maxSizeJsonl: maxSizeJsonlInMb,
    },
    encryption: {
      enabled: encrypt ?? false,
      key: encrypt ? key : undefined,
    },
    compression: {
      enabled: compress ?? false,
    },
  });
};
