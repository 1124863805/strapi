/**
 * 延迟 reload，确保客户端收到 HTTP 响应后再退出进程，避免过早刷新。
 * 与 admin 端 serverRestartWatcher 的 INITIAL_DELAY_MS 配合使用。
 */
export const RELOAD_DELAY_MS = 2500;

export function scheduleReloadAfterResponse(): void {
  setTimeout(() => leao.reload(), RELOAD_DELAY_MS);
}
