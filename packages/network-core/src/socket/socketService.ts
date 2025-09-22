import { io, Socket } from 'socket.io-client';

export interface SocketServiceConfig {
  url: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
}

export class SocketService {
  protected config: SocketServiceConfig;
  protected sockets: Map<string, Socket> = new Map();

  constructor(config: SocketServiceConfig) {
    this.config = config;
  }

  /**
   * 특정 네임스페이스의 소켓을 생성하고 연결
   */
  async createChannel(namespace: string): Promise<Socket> {
    if (this.sockets.has(namespace)) {
      const existingSocket = this.sockets.get(namespace);
      if (existingSocket.connected) {
        return existingSocket;
      }
      // 연결이 끊어진 소켓은 제거
      this.sockets.delete(namespace);
    }

    return new Promise((resolve, reject) => {
      // ✅ 네임스페이스 연결 방식 수정
      const socket = io(`${this.config.url}/${namespace}`, {
        autoConnect: this.config.autoConnect ?? true,
        reconnection: this.config.reconnection ?? true,
        reconnectionAttempts: this.config.reconnectionAttempts ?? 3,
        transports: ['websocket'], // WebSocket 우선 시도,
        timeout: 20000,
      });

      socket.on('connect', () => {
        console.log(`Socket connected to namespace: /${namespace}`);
        this.sockets.set(namespace, socket);
        resolve(socket);
      });

      socket.on('connect_error', error => {
        console.error(`Socket connection error for namespace /${namespace}:`, error);
        reject(error);
      });

      socket.on('disconnect', reason => {
        console.log(`Socket disconnected from namespace /${namespace}, reason: ${reason}`);
        this.sockets.delete(namespace);
      });
    });
  }

  /**
   * 특정 채널의 소켓 가져오기
   */
  getChannel(channel: string): Socket | null {
    return this.sockets.get(channel) || null;
  }

  /**
   * 특정 채널 연결 해제
   */
  disconnectChannel(channel: string): void {
    const socket = this.sockets.get(channel);
    if (socket) {
      socket.disconnect();
      this.sockets.delete(channel);
    }
  }

  /**
   * 모든 채널 연결 해제
   */
  disconnectAll(): void {
    this.sockets.forEach((socket, channel) => {
      socket.disconnect();
      console.log(`Disconnected from channel: ${channel}`);
    });
    this.sockets.clear();
  }

  /**
   * 연결된 채널 목록
   */
  getConnectedChannels(): string[] {
    return Array.from(this.sockets.keys());
  }
}
