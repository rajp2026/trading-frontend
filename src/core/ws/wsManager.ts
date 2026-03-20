/**
 * Shared WebSocket Manager — Singleton
 *
 * Single WS connection to the backend.
 * Supports multiple subscription channels (market, candle).
 * Auto-reconnects with exponential backoff.
 */

type MessageHandler = (data: any) => void;

class WSManager {
  private ws: WebSocket | null = null;
  private url: string;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isIntentionallyClosed = false;

  // Queued messages to send once connected
  private pendingMessages: string[] = [];

  constructor(url: string) {
    this.url = url;
  }

  /** Connect (or reconnect) to the WebSocket server */
  connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    this.isIntentionallyClosed = false;

    try {
      this.ws = new WebSocket(this.url);
    } catch (_e) {
      this._scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      console.log("[WS] Connected ✅");
      this.reconnectDelay = 1000; // reset backoff

      // Flush pending messages
      for (const msg of this.pendingMessages) {
        this.ws?.send(msg);
      }
      this.pendingMessages = [];
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const type = msg.type;

        // Respond to heartbeat pings
        if (type === "ping") {
          this.ws?.send(JSON.stringify({ type: "pong" }));
          return;
        }

        // Dispatch to registered handlers
        const typeHandlers = this.handlers.get(type);
        if (typeHandlers) {
          for (const handler of typeHandlers) {
            handler(msg);
          }
        }
      } catch (e) {
        console.error("[WS] Message parse error:", e);
      }
    };

    this.ws.onerror = (err) => {
      console.error("[WS] Error:", err);
    };

    this.ws.onclose = () => {
      console.log("[WS] Closed ❌");
      if (!this.isIntentionallyClosed) {
        this._scheduleReconnect();
      }
    };
  }

  /** Disconnect intentionally */
  disconnect() {
    this.isIntentionallyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
    this.ws = null;
  }

  // ──────────────────────────────────────────────
  // Subscription methods
  // ──────────────────────────────────────────────

  subscribeMarket(symbols: string[]) {
    this._send({
      type: "subscribe_market",
      symbols,
    });
  }

  subscribeCandle(symbol: string, interval: string) {
    this._send({
      type: "subscribe_candle",
      symbol,
      interval,
    });
  }

  unsubscribeCandle(symbol: string, interval: string) {
    this._send({
      type: "unsubscribe_candle",
      symbol,
      interval,
    });
  }

  // ──────────────────────────────────────────────
  // Handler registration
  // ──────────────────────────────────────────────

  onMessage(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
  }

  offMessage(type: string, handler: MessageHandler) {
    this.handlers.get(type)?.delete(handler);
  }

  // ──────────────────────────────────────────────
  // Internal
  // ──────────────────────────────────────────────

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private _send(data: object) {
    const msg = JSON.stringify(data);
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(msg);
    } else {
      // Queue for when connection opens
      this.pendingMessages.push(msg);
    }
  }

  private _scheduleReconnect() {
    if (this.reconnectTimer) return;

    console.log(`[WS] Reconnecting in ${this.reconnectDelay}ms...`);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, this.reconnectDelay);

    // Exponential backoff
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
  }
}

// ──────────────────────────────────────────────
// Singleton instance
// ──────────────────────────────────────────────

const WS_URL = "ws://localhost:8000/ws";
export const wsManager = new WSManager(WS_URL);

// Auto-connect on module import
wsManager.connect();
