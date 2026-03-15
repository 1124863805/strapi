import admin from './admin';
import coreStore from './coreStore';
import cron from './cron';
import registries from './registries';
import webhooks from './webhooks';

import type { Provider } from './provider';

export const providers: Provider[] = [registries, admin, coreStore, webhooks, cron];
