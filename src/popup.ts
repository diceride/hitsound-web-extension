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

import './elements/volume-control';

import { syncAction, updateCountAction, updateVolumeAction } from './actions';
import { defaultOptions } from './config';
import { HTMLVolumeControlElement } from './elements/volume-control';
import { Game } from './game';
import { RpcService } from './port';
import { state, stateObservable } from './state';

document.addEventListener(
  'DOMContentLoaded',
  async function () {
    // Get the chrome tab id
    const tabId = await new Promise<number>(function (resolve) {
      // Parse the query string of the window URL
      const searchParams = new URLSearchParams(window.location.search);

      if (searchParams.has('tabId')) {
        resolve(Number(searchParams.get('tabId')!));
      } else {
        // Query the current chrome tab id
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs: chrome.tabs.Tab[]) {
            resolve(tabs[0].id!);
          }
        );
      }
    });

    // Create a new game
    const game = await new Game(
      document.querySelector('canvas')! as HTMLCanvasElement
    );
    game.onOptionsButtonClickObservable.add(function onOptionsButtonClick() {
      // Open the chrome options page
      chrome.runtime.openOptionsPage();
    });

    window.addEventListener('resize', function onWindowResize() {
      game.resize();
    });

    // Initialize the game
    await game.init();

    const volumeControlElement = document.querySelector(
      'volume-control'
    )! as HTMLVolumeControlElement;

    document.addEventListener(
      'keyup',
      function onDocumentKeyUp(event: KeyboardEvent) {
        // Toggle the volume control muted state if the user presses the `m` key
        if (event.key === 'm') {
          volumeControlElement.toggle();
        }
      }
    );

    function updateVolumeControl() {
      if (volumeControlElement.muted || volumeControlElement.value === '0') {
        volumeControlElement.button.title = chrome.i18n.getMessage('unmute');
        volumeControlElement.button.setAttribute(
          'aria-label',
          chrome.i18n.getMessage('unmute')
        );
      } else {
        volumeControlElement.button.title = chrome.i18n.getMessage('mute');
        volumeControlElement.button.setAttribute(
          'aria-label',
          chrome.i18n.getMessage('mute')
        );
      }
    }

    function onVolumeControlChange(event: CustomEvent) {
      updateVolumeControl();

      state.volume = Number(event.detail.value) / 100;
      state.muted = event.detail.muted;

      // Post a message to the chrome background
      rpcService.send(
        updateVolumeAction({ volume: state.volume, muted: state.muted })
      );
    }

    volumeControlElement.addEventListener(
      'change',
      onVolumeControlChange as EventListener
    );
    volumeControlElement.addEventListener(
      'mute',
      onVolumeControlChange as EventListener
    );

    // Restore options from the chrome local storage
    await new Promise<void>(function (resolve) {
      chrome.storage.local.get(defaultOptions, function ({ volume, muted }) {
        if (chrome.runtime.lastError) {
          console.debug(chrome.runtime.lastError.message);
          return;
        }

        volumeControlElement.value = Math.floor(volume * 100).toString();
        volumeControlElement.muted = muted;

        updateVolumeControl();

        // Set the game sound track volume
        game.volume = muted ? 0 : volume;

        state.volume = volume;
        state.muted = muted;

        resolve();
      });
    });

    // State event listener
    stateObservable.addEventListener('change', function onStateChange(
      event: CustomEvent
    ) {
      if (event.detail.count !== state.count) {
        // Update the game counter
        game.updateCounter(state.count);
      } else if (
        event.detail.volume !== state.volume ||
        event.detail.muted !== state.muted
      ) {
        // Update the game sound track volume
        game.volume = state.muted ? 0 : state.volume;
      }
    } as EventListener);

    // Connect to the chrome background
    const rpcService = new RpcService(
      chrome.runtime.connect({ name: tabId.toString() }),
      async function onMessage(action) {
        if (action.type === updateCountAction.type) {
          state.count = action.count;
        }
      }
    );

    // Synchronize with the chrome background
    const { count } = await rpcService.send<{ count: number }>(syncAction());

    state.count = count;
    state.synced = true;

    // Show the app
    const appElement = document.getElementById('app')! as HTMLDivElement;
    appElement.removeAttribute('hidden');

    game.resize();
  },
  { once: true }
);
