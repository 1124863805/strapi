const SERVER_HAS_NOT_BEEN_KILLED_MESSAGE = 'did-not-kill-server';
const SERVER_HAS_BEEN_KILLED_MESSAGE = 'server is down';

const getBackendURL = () =>
  (typeof window !== 'undefined' && (window as any).leao?.backendURL) || '';

const POLL_INTERVAL_MS = 150;
const STABILITY_CHECKS = 5;
const STABILITY_INTERVAL_MS = 200;
const VITE_READINESS_RETRIES = 10;
const VITE_READINESS_INTERVAL_MS = 500;
const POST_READY_DELAY_MS = 600;
const MAX_WAIT_MS = 90_000;
/** 首次轮询前等待，确保服务端已触发 reload（与 server 端 RELOAD_DELAY_MS 配合） */
const INITIAL_DELAY_MS = 2200;

/**
 * Server restart watcher
 * 1. 等待 INITIAL_DELAY_MS 后再开始轮询（确保服务端已触发重启）
 * 2. 轮询直到检测到服务器宕机
 * 3. 再轮询直到服务器恢复
 * 4. 稳定性检查 + Vite 就绪校验 + 额外延迟 后再 resolve
 */
export function serverRestartWatcher(
  response: any,
  didShutDownServer?: boolean,
  startTime?: number
) {
  const startedAt = startTime ?? Date.now();

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => resolve(response), MAX_WAIT_MS);

    const doResolve = () => {
      clearTimeout(timeoutId);
      resolve(response);
    };

    const doFetch = () => {
      fetch(`${getBackendURL()}/_health`, {
        method: 'HEAD',
        headers: { 'Content-Type': 'application/json', 'Keep-Alive': 'false' },
        cache: 'no-store',
      })
        .then((res) => {
          if (res.status >= 400) {
            throw new Error(SERVER_HAS_BEEN_KILLED_MESSAGE);
          }

          if (!didShutDownServer) {
            throw new Error(SERVER_HAS_NOT_BEEN_KILLED_MESSAGE);
          }

          runStabilityAndViteCheck().then(() =>
            setTimeout(doResolve, POST_READY_DELAY_MS)
          );
        })
        .catch((err) => {
          setTimeout(() => {
            serverRestartWatcher(
              response,
              err.message !== SERVER_HAS_NOT_BEEN_KILLED_MESSAGE,
              startedAt
            ).then((r) => {
              clearTimeout(timeoutId);
              resolve(r);
            });
          }, POLL_INTERVAL_MS);
        });
    };

    const isInitialCall = startTime === undefined;
    const delay = isInitialCall ? INITIAL_DELAY_MS : 0;
    setTimeout(doFetch, delay);
  });
}

function runStabilityChecks(): Promise<void> {
  return new Promise((resolve) => {
    let passed = 0;

    const check = () => {
      fetch(`${getBackendURL()}/_health`, { method: 'HEAD', cache: 'no-store' })
        .then((res) => {
          if (res.status < 400) {
            passed += 1;
            if (passed >= STABILITY_CHECKS) {
              resolve();
              return;
            }
          } else {
            passed = 0;
          }
          setTimeout(check, STABILITY_INTERVAL_MS);
        })
        .catch(() => {
          passed = 0;
          setTimeout(check, STABILITY_INTERVAL_MS);
        });
    };

    setTimeout(check, STABILITY_INTERVAL_MS);
  });
}

/**
 * 校验 Vite 是否就绪：能成功加载 admin 页面（避免 _health 先于 Vite 可用导致提前刷新）
 */
function verifyViteReady(): Promise<void> {
  return new Promise((resolve) => {
    let attempts = 0;

    const tryFetch = () => {
      const url = `${getBackendURL()}/admin`;
      fetch(url, { method: 'GET', cache: 'no-store' })
        .then((res) => {
          if (res.ok && res.headers.get('content-type')?.includes('text/html')) {
            resolve();
            return;
          }
          retry();
        })
        .catch(retry);
    };

    const retry = () => {
      attempts += 1;
      if (attempts >= VITE_READINESS_RETRIES) {
        resolve(); // 超时则放行，避免无限等待
        return;
      }
      setTimeout(tryFetch, VITE_READINESS_INTERVAL_MS);
    };

    setTimeout(tryFetch, 300); // 稳定性检查后稍等再测
  });
}

function runStabilityAndViteCheck(): Promise<void> {
  return runStabilityChecks()
    .then(() => verifyViteReady());
}
