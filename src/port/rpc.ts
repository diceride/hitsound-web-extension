/**
 * @license
 * Copyright aheadmode.com All rights reserved
 *
 * This web browser extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This web browser extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Browser Hits. If not, see <http://www.gnu.org/licenses/>.
 */

import { Action } from './action';

/**
 * RPC message
 */
export interface RpcMessage {
  id: string;
}

/**
 * RPC request
 */
export interface RpcRequest extends RpcMessage {
  action: Action;
}

/**
 * RPC response status
 */
export enum RpcResponseStatus {
  success,
  error
}

/**
 * RPC response
 */
export interface RpcResponse extends RpcMessage {
  status: RpcResponseStatus;
  data: any;
  error?: any;
}

/**
 * RPC observer
 */
export class RpcObserver {
  /**
   * Chrome ports
   */
  private readonly _ports: Set<chrome.runtime.Port> = new Set();

  /**
   * Creates a new `RpcObserver` instance
   * @param handler A handler function to be called on new RPC requests
   */
  constructor(handler: (portName: string, action: any) => void) {
    // Chrome frontend connection listener
    chrome.runtime.onConnect.addListener((port) => {
      this._ports.add(port);

      port.onMessage.addListener(async (message: RpcRequest, port) => {
        if (message.hasOwnProperty('action')) {
          try {
            const data = await handler(port.name, message.action);

            port.postMessage({
              id: message.id,
              status: RpcResponseStatus.success,
              data
            });
          } catch (error) {
            port.postMessage({
              id: message.id,
              status: RpcResponseStatus.error,
              error
            });
          }
        }
      });

      port.onDisconnect.addListener((port) => this._ports.delete(port));
    });
  }

  /**
   * Sends a RPC request to a given port name
   */
  async send<T>(
    portName: string,
    action: Action,
    timeout: number = 4000
  ): Promise<T[]> {
    return Promise.all<T>(
      Array.from(this._ports.values())
        .filter((port) => {
          return port.name === portName;
        })
        .map((port) => {
          return createAsyncMessage<T>(port, action, timeout);
        })
    );
  }
}

/**
 * RPC service
 */
export class RpcService {
  /**
   * Creates a new `RpcService` instance
   * @param handler A handler function to be called on new RPC requests
   */
  constructor(
    private _port: chrome.runtime.Port,
    handler: (action: any) => void
  ) {
    // Subscribe to the port
    this._port.onMessage.addListener(async (message: RpcRequest, port) => {
      if (message.hasOwnProperty('action')) {
        try {
          const data = await handler(message.action);

          port.postMessage({
            id: message.id,
            status: RpcResponseStatus.success,
            data
          });
        } catch (error) {
          port.postMessage({
            id: message.id,
            status: RpcResponseStatus.error,
            error
          });
        }
      }
    });

    window.addEventListener(
      'beforeunload',
      () => {
        // Gracefully disconnect from the chrome background
        this._port.disconnect();
      },
      { once: true }
    );
  }

  async send<T>(action: Action, timeout: number = 4000): Promise<T> {
    return createAsyncMessage<T>(this._port, action, timeout);
  }
}

function createUUIDv4(): string {
  return new Array(4)
    .fill(0)
    .map(function () {
      return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
    })
    .join('-');
}

function createAsyncMessage<T>(
  port: chrome.runtime.Port,
  action: Action,
  timeout: number
): Promise<T> {
  return new Promise(function (resolve, reject) {
    let handle: number | undefined;

    // Create a new UUIDv4
    const id = createUUIDv4();

    function onMessage(message: RpcResponse, port: chrome.runtime.Port) {
      if (message.id === id) {
        clearTimeout(handle);
        handle = undefined;

        port.onMessage.removeListener(onDisconnect);
        port.onMessage.removeListener(onMessage);

        if (message.status === RpcResponseStatus.success) {
          resolve(message.data as T);
        } else {
          reject(Error(message.error));
        }
      }
    }

    function onDisconnect() {
      clearTimeout(handle);
      handle = undefined;

      reject(Error('Port disconnected'));
    }

    handle = setTimeout(() => {
      port.onMessage.removeListener(onDisconnect);
      port.onMessage.removeListener(onMessage);

      reject(Error('Timeout'));
    }, timeout);

    port.onMessage.addListener(onMessage);
    port.onDisconnect.addListener(onDisconnect);

    port.postMessage({ id, action });
  });
}
