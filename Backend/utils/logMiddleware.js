// utils/logMiddleware.js
import fetch from 'node-fetch';

const LOG_SERVER = 'http://20.244.56.144/evaluation-service/logs';

/**
 * Default export: Log(stack, level, pkg, message, token = '')
 * Best-effort POST to evaluation log server. Does not throw on failure.
 *
 * Example:
 *   await Log('backend', 'info', 'controller', 'Created short link', 'optional-token');
 */
export default async function Log(stack, level, pkg, message, token = '') {
  // minimal validation
  if (!stack || !level || !pkg || !message) return;

  const payload = {
    stack,
    level,
    package: pkg,
    message
  };

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    // node-fetch v2 usage — best-effort, do not await long
    await fetch(LOG_SERVER, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
  } catch (err) {
    // swallow errors so logging failure doesn't break the app
    // (Do not use console.log for request/event logging in final submission,
    // but a minimal console.error here for dev diagnostics is acceptable)
    // console.error('Log send failed:', err && err.message ? err.message : err);
  }
}
