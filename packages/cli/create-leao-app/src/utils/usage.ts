import os from 'os';
import _ from 'lodash';

import { Scope, StderrError } from '../types';

type TrackError = Error | string | StderrError;

// Add properties from the package.json leao key in the metadata
function addPackageJsonLeaoMetadata(metadata: Record<string, unknown>, scope: Scope) {
  const { packageJsonLeao = {} } = scope;

  return _.defaults(metadata, packageJsonLeao);
}

const boolToString = (value: boolean | undefined) => (value === true).toString();

const getProperties = (scope: Scope, error?: TrackError) => {
  const eventProperties = {
    error: typeof error === 'string' ? error : error && error.message,
  };

  const userProperties = {
    os: os.type(),
    osPlatform: os.platform(),
    osArch: os.arch(),
    osRelease: os.release(),
    nodeVersion: process.versions.node,
  };

  const groupProperties = {
    version: scope.leaoVersion,
    docker: scope.docker,
    useYarn: scope.packageManager === 'yarn',
    packageManager: scope.packageManager,
    /** @deprecated */
    useTypescriptOnServer: boolToString(scope.useTypescript),
    /** @deprecated */
    useTypescriptOnAdmin: boolToString(scope.useTypescript),
    useTypescript: boolToString(scope.useTypescript),
    noRun: boolToString(scope.runApp),
    projectId: scope.uuid,
    gitInit: boolToString(scope.gitInit),
    installDependencies: boolToString(scope.installDependencies),
  };

  return {
    eventProperties,
    userProperties,
    groupProperties: addPackageJsonLeaoMetadata(groupProperties, scope),
  };
};

function trackEvent(_event: string, _payload: Record<string, unknown>) {
  // Disabled: no analytics sent to external servers
  return Promise.resolve();
}

export async function trackError({ scope, error }: { scope: Scope; error?: TrackError }) {
  const properties = getProperties(scope, error);

  try {
    return await trackEvent('didNotCreateProject', {
      deviceId: scope.deviceId,
      ...properties,
    });
  } catch (err) {
    /** ignore errors */
    return Promise.resolve();
  }
}

export async function trackUsage({
  event,
  scope,
  error,
}: {
  event: string;
  scope: Scope;
  error?: TrackError;
}) {
  const properties = getProperties(scope, error);

  try {
    return await trackEvent(event, {
      deviceId: scope.deviceId,
      ...properties,
    });
  } catch (err) {
    /** ignore errors */
    return Promise.resolve();
  }
}
