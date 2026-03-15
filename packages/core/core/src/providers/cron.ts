import { defineProvider } from './provider';
import createCronService from '../services/cron';

export default defineProvider({
  init(leao) {
    leao.add('cron', () => createCronService());
  },
  async bootstrap(leao) {
    if (leao.config.get('server.cron.enabled', true)) {
      const cronTasks = leao.config.get('server.cron.tasks', {});
      leao.get('cron').add(cronTasks);
    }

    leao.get('cron').start();
  },
  async destroy(leao) {
    leao.get('cron').destroy();
  },
});
