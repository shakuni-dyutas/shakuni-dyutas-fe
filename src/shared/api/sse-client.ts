import { fetchEventSource } from '@microsoft/fetch-event-source';

import { getCurrentAccessToken } from '@/shared/api/api-client';
import { API_CONFIG } from '@/shared/config/constants';

type SseConnectionState = 'idle' | 'connecting' | 'open' | 'error' | 'closed';
type MessageHandler = (event: MessageEvent<string>) => void;

interface CreateEventSourceOptions {
  retryIntervalMs?: number;
  onConnectionStateChange?: (state: SseConnectionState) => void;
  onError?: (error: unknown) => void;
}

interface SseConnection {
  addEventListener(event: string, handler: MessageHandler): void;
  removeEventListener(event: string, handler: MessageHandler): void;
  close(): void;
}

function buildSseUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const base = API_CONFIG.BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${base}/${normalizedPath}`;
}

function createEventSource(
  path: string,
  { retryIntervalMs = 2000, onConnectionStateChange, onError }: CreateEventSourceOptions = {},
): SseConnection | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const url = buildSseUrl(path);
  const listeners = new Map<string, Set<MessageHandler>>();
  let abortController: AbortController | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;

  const notifyState = (state: SseConnectionState) => {
    onConnectionStateChange?.(state);
  };

  const emit = (eventType: string, payload: string) => {
    const handlers = listeners.get(eventType);
    if (!handlers || handlers.size === 0) {
      return;
    }
    const event = new MessageEvent<string>(eventType, { data: payload });
    handlers.forEach((handler) => {
      handler(event);
    });
  };

  const scheduleReconnect = () => {
    if (stopped) {
      return;
    }

    notifyState('connecting');
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      if (!stopped) {
        start();
      }
    }, retryIntervalMs);
  };

  const start = () => {
    if (stopped) {
      return;
    }

    notifyState('connecting');
    abortController = new AbortController();

    const headers: Record<string, string> = {
      Accept: 'text/event-stream',
    };

    const accessToken = getCurrentAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    void fetchEventSource(url, {
      method: 'GET',
      headers,
      credentials: 'include',
      signal: abortController.signal,
      openWhenHidden: true,
      onopen: async () => {
        notifyState('open');
      },
      onmessage: (event) => {
        const eventType = event.event ?? 'message';
        emit(eventType, event.data ?? '');
      },
      onclose: () => {
        if (stopped) {
          notifyState('closed');
          return;
        }
        scheduleReconnect();
      },
      onerror: (error) => {
        if (stopped) {
          return;
        }
        notifyState('error');
        onError?.(error);
        return retryIntervalMs;
      },
    }).catch((error) => {
      if (stopped) {
        return;
      }
      notifyState('error');
      onError?.(error);
      scheduleReconnect();
    });
  };

  start();

  const addEventListener = (event: string, handler: MessageHandler) => {
    if (!listeners.has(event)) {
      listeners.set(event, new Set());
    }
    listeners.get(event)?.add(handler);
  };

  const removeEventListener = (event: string, handler: MessageHandler) => {
    const handlers = listeners.get(event);
    handlers?.delete(handler);
    if (handlers && handlers.size === 0) {
      listeners.delete(event);
    }
  };

  const close = () => {
    if (stopped) {
      return;
    }

    stopped = true;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    listeners.clear();
    notifyState('closed');
    abortController?.abort();
  };

  return { addEventListener, removeEventListener, close };
}

export type { SseConnection, SseConnectionState };
export { createEventSource };
