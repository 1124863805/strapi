import pluralize from 'pluralize';
import type { NodePlopAPI } from 'plop';

import registerApi from './plops/api';
import registerController from './plops/controller';
import registerContentType from './plops/content-type';
import registerPolicy from './plops/policy';
import registerMiddleware from './plops/middleware';
import registerMigration from './plops/migration';
import registerService from './plops/service';

export default (plop: NodePlopAPI) => {
  plop.setWelcomeMessage('Leao Scaffold');
  plop.addHelper('pluralize', (text: string) => pluralize(text));

  registerApi(plop);
  registerController(plop);
  registerContentType(plop);
  registerPolicy(plop);
  registerMiddleware(plop);
  registerMigration(plop);
  registerService(plop);
};
