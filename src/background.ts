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

import { syncAction, updateCountAction, updateVolumeAction } from './actions';
import { AudioPlayer } from './audio-player';
import { defaultOptions, Options, Sound } from './config';
import { RpcObserver } from './port';

/**
 * Tab cache entry
 */
interface TabEntry {
  host: string;
  count: number;
}

/**
 * Tab cache entries
 */
const tabCache: Map<number, TabEntry> = new Map();

(async function () {
  const [sounds, options] = await Promise.all([
    // Load the sounds configuration
    fetch('/assets/data/sounds.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data.sounds as Sound[];
      }),
    new Promise<Options>(function (resolve) {
      // Restore options from the chrome local storage
      chrome.storage.local.get(defaultOptions, (options) => {
        if (chrome.runtime.lastError) {
          throw Error(chrome.runtime.lastError.message);
        }

        resolve(options as Options);
      });
    })
  ]);

  // Create a new audio player
  const audioPlayer = new AudioPlayer(sounds, '/assets/sounds');
  audioPlayer.sound = options.soundId;
  audioPlayer.volume = options.muted ? 0 : options.volume;

  // Create a new Geo IP worker
  const geoIpWorker = new Worker('/wasm/geoip/worker_bundle.js', {
    type: 'module'
  });

  // Create a new RPC observer
  const rpcObserver = new RpcObserver(async function onRpcMessage(
    portName,
    action
  ) {
    const tabId = Number(portName);

    if (action.type === syncAction.type) {
      let count: number = 0;

      if (tabCache.has(tabId)) {
        // Get the count from the tab cache
        count = tabCache.get(tabId)!.count;
      }

      return { count };
    } else if (action.type === updateVolumeAction.type) {
      // Update the audio player volume
      audioPlayer.volume = action.muted ? 0 : action.volume;

      // Save options to the chrome local storage
      return new Promise<void>(function (resolve) {
        chrome.storage.local.set(
          { volume: action.volume, muted: action.muted },
          () => {
            resolve();
          }
        );
      });
    }

    return null;
  });

  // Chrome storage event listener
  chrome.storage.onChanged.addListener(function onStorageChanged(changes) {
    if (changes.hasOwnProperty('soundId')) {
      audioPlayer.sound = changes.soundId.newValue;
    }
  });

  // Chrome tabs event listener
  chrome.tabs.onCreated.addListener(function onTabsCreated(tab) {
    if (tab.id && tab.url) {
      // Update the chrome tab in the cache
      tabCache.set(tab.id!, { host: new URL(tab.url!).host, count: 0 });
    }
  });

  // Chrome tabs event listener
  chrome.tabs.onUpdated.addListener(function onTabsUpdated(
    tabId,
    changeInfo,
    tab
  ) {
    if (tab.id && tab.url) {
      // Determine whether the tab is reloading
      if (changeInfo.status && changeInfo.status === 'loading') {
        // Update the chrome tab in the cache
        tabCache.set(tab.id!, { host: new URL(tab.url!).host, count: 0 });

        // Reset the chrome tab badge
        chrome.browserAction.setBadgeText({ tabId: tab.id!, text: '' });
      }
    }
  });

  // Chrome tabs event listener
  chrome.tabs.onRemoved.addListener(function onTabsRemoved(tabId) {
    // Delete the chrome tab from the cache
    tabCache.delete(tabId);
  });

  // Initialize the tab cache
  await new Promise<void>((resolve) => {
    // Query all chrome tabs
    chrome.tabs.query({}, (tabs) => {
      tabs
        .filter(function (tab) {
          return tab.id && tab.url && !tabCache.has(tab.id);
        })
        .forEach(function (tab) {
          // Update the chrome tab in the cache
          tabCache.set(tab.id!, { host: new URL(tab.url!).host, count: 0 });
        });

      resolve();
    });
  });

  // Load the Geo IP database
  await new Promise<void>((resolve, reject) => {
    let handle: number | undefined;

    geoIpWorker.addEventListener(
      'message',
      (error) => {
        console.log('Message received from worker', error);
        clearTimeout(handle);

        resolve();
      },
      { once: true }
    );

    handle = setTimeout(() => {
      reject(Error('Timeout'));
    }, 120000);

    geoIpWorker.postMessage({
      action: 'init',
      data: {
        filepath: '/assets/mmdb/GeoLite2-City.mmdb.lzma'
      }
    });
  });

  // Start listening to chrome web requests
  chrome.webRequest.onResponseStarted.addListener(
    function onWebRequestResponseStarted(
      details: chrome.webRequest.WebResponseCacheDetails
    ) {
      if (
        !details.fromCache &&
        details.tabId > 0 &&
        details.url &&
        !details.url.startsWith('chrome://') &&
        !details.url.startsWith('moz-extension://')
      ) {
        // Get the specified chrome tab
        chrome.tabs.get(details.tabId, (tab) => {
          if (chrome.runtime.lastError) {
            console.debug(chrome.runtime.lastError.message);
            return;
          }

          if (tab.url) {
            if (details.initiator) {
              const tabEntry = tabCache.get(details.tabId)!;
              if (tabEntry.host === new URL(tab.url).host) {
                tabEntry.count++;

                // Update the chrome tab in the cache
                tabCache.set(details.tabId, tabEntry);

                // Set the chrome tab badge text
                chrome.browserAction.setBadgeText({
                  tabId: details.tabId,
                  text:
                    tabEntry.count > 999 ? '999+' : tabEntry.count.toString()
                });

                if (tab.active) {
                  // Post a message to the chrome frontend
                  rpcObserver.send<void>(
                    details.tabId.toString(),
                    updateCountAction({ count: tabEntry.count })
                  );
                }
              }
            }

            if (tab.active) {
              // Get the specified chrome window
              chrome.windows.getCurrent((window) => {
                if (window.id === tab.windowId) {
                  // Play the sound
                  audioPlayer.play();
                }
              });
            }
          }
        });
      }
    },
    { urls: ['http://*/*', 'https://*/*'] }
  );
})().catch((error) => {
  console.error(error);
});
