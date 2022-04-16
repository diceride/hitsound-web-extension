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

import type { Sound } from './config';
import { defaultOptions } from './config';

document.addEventListener(
  'DOMContentLoaded',
  async () => {
    document.querySelector('label[for="sound"]')!.textContent =
      chrome.i18n.getMessage('sound');

    const soundSelectElement = document.getElementById(
      'sound'
    )! as HTMLSelectElement;

    soundSelectElement.addEventListener(
      'change',
      function onSoundSelectChange() {
        // Save the option to chrome local storage
        chrome.storage.local.set({ soundId: soundSelectElement.value });
      }
    );

    // Load the sounds configuration
    await fetch('/assets/data/sounds.json')
      .then((response) => response.json())
      .then((data) => data.sounds as Sound[])
      .then((sounds: Sound[]) => {
        const locale = chrome.i18n.getUILanguage();

        sounds
          .sort((a, b) => {
            // Sort the sounds lexicographically by using the preferred
            // language of the client
            return a.id.localeCompare(b.id, locale);
          })
          .reduce((sounds, sound) => {
            // Put the default sound to the top of the list
            if (sound.id === defaultOptions.soundId) {
              return [sound, ...sounds];
            }

            return [...sounds, sound];
          }, [] as Sound[])
          .forEach((sound) => {
            const optionElement = document.createElement(
              'option'
            ) as HTMLOptionElement;
            optionElement.value = sound.id;
            optionElement.textContent = chrome.i18n.getMessage(
              'sound_' + sound.id
            );
            soundSelectElement.appendChild(optionElement);
          });
      })
      .catch((error) => {
        console.error(error);
      });

    // Restore options from the chrome local storage
    chrome.storage.local.get(defaultOptions, (options) => {
      if (chrome.runtime.lastError) {
        console.debug(chrome.runtime.lastError.message);
        return;
      }

      soundSelectElement!.value = options.soundId;
    });
  },
  { once: true }
);
