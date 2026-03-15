import { defineProvider } from './provider';
import { createCoreStore, coreStoreModel } from '../services/core-store';

export default defineProvider({
  init(leao) {
    leao.get('models').add(coreStoreModel);
    leao.add('coreStore', () => createCoreStore({ db: leao.db }));
  },
});
