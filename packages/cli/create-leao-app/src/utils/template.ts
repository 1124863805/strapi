import path from 'node:path';
import url from 'node:url';

import fse from 'fs-extra';
import type { Scope } from '../types';

const BUNDLED_TEMPLATES = ['vanilla', 'vanilla-js'];

// Merge template with new project being created
// Only supports: bundled templates (handled in create-leao-impl) and local file:// or filesystem paths.
// No external network requests (e.g. GitHub) are made.
export async function copyTemplate(scope: Scope, rootPath: string) {
  const { template } = scope;

  if (!template) {
    throw new Error('Missing template option');
  }

  if (BUNDLED_TEMPLATES.includes(template)) {
    throw new Error(
      `Template "${template}" should be handled by bundled templates. This path should not be reached.`
    );
  }

  if (isLocalTemplate(template)) {
    const filePath = template.startsWith('file://') ? url.fileURLToPath(template) : template;

    await fse.copy(filePath, rootPath);
    return;
  }

  throw new Error(
    `Unsupported template "${template}". ` +
      `Bundled templates: ${BUNDLED_TEMPLATES.join(', ')}. ` +
      'For custom templates use: file:///path/to/template'
  );
}

function isLocalTemplate(template: string) {
  return (
    template.startsWith('file://') ||
    fse.existsSync(path.isAbsolute(template) ? template : path.resolve(process.cwd(), template))
  );
}
