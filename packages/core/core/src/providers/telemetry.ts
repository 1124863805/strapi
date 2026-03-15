import { defineProvider } from './provider';
import createTelemetry from '../services/metrics';

export default defineProvider({
  init(leao) {
    leao.add('telemetry', () => createTelemetry(leao));
  },
  async register(leao) {
    leao.get('telemetry').register();
  },
  async bootstrap(leao) {
    leao.get('telemetry').bootstrap();
  },
  async destroy(leao) {
    leao.get('telemetry').destroy();
  },
});
