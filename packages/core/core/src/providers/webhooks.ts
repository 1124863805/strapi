import { defineProvider } from './provider';
import { createWebhookStore, webhookModel } from '../services/webhook-store';
import createWebhookRunner from '../services/webhook-runner';

export default defineProvider({
  init(leao) {
    leao.get('models').add(webhookModel);

    leao.add('webhookStore', () => createWebhookStore({ db: leao.db }));
    leao.add('webhookRunner', () =>
      createWebhookRunner({
        eventHub: leao.eventHub,
        logger: leao.log,
        configuration: leao.config.get('server.webhooks', {}),
        fetch: leao.fetch,
      })
    );
  },
  async bootstrap(leao) {
    const webhooks = await leao.get('webhookStore').findWebhooks();
    if (!webhooks) {
      return;
    }

    for (const webhook of webhooks) {
      leao.get('webhookRunner').add(webhook);
    }
  },
});
