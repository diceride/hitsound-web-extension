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

import init, { init_reader, lookup } from './geoip_wasm_bindgen';

export interface Action {
  action: string;
  data: Record<string, any>;
}

export interface WorkerEvent extends MessageEvent {
  readonly data: Action;
}

onmessage = async function (event: WorkerEvent) {
  switch (event.data.action) {
    case 'init':
      await init(fetch('/wasm/geoip/geoip_wasm_bindgen_bg.wasm'));

      // Load the GeoLite2 database (MMDB)
      const uint8View = await fetch(event.data.data.filepath! as string)
        .then((response) => {
          if (!response.ok) {
            throw Error('HTTP error, status = ' + response.status);
          }

          return response.arrayBuffer();
        })
        .then((arrayBuffer) => new Uint8Array(arrayBuffer));

      init_reader(uint8View);

      postMessage(undefined);
      break;

    case 'lookup':
      const city = lookup(event.data.data.ipAddress! as string);

      postMessage(city);
      break;
  }

  throw Error();
};
