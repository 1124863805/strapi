import { defineProvider } from './provider';
import loadAdmin from '../loaders/admin';

export default defineProvider({
  init(leao) {
    // eslint-disable-next-line node/no-missing-require
    leao.add('admin', () => require('@leao1/admin/leao-server'));
  },

  async register(leao) {
    await loadAdmin(leao);

    await leao.get('admin')?.register({ leao });
  },

  async bootstrap(leao) {
    await leao.get('admin')?.bootstrap({ leao });
  },

  async destroy(leao) {
    await leao.get('admin')?.destroy({ leao });
  },
});
