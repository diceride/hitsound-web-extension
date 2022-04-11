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

import { defaultOptions, Sound } from './config';

document.addEventListener(
  'DOMContentLoaded',
  async function () {
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
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return data.sounds as Sound[];
      })
      .then(function (sounds: Sound[]) {
        const locale = chrome.i18n.getUILanguage();

        sounds
          .sort(function (a, b) {
            // Sort the sounds lexicographically by using the browser's language
            return a.id.localeCompare(b.id, locale);
          })
          .reduce(function (sounds, sound) {
            // Put the default sound to the top of the list
            if (sound.id === defaultOptions.soundId) {
              return [sound, ...sounds];
            }

            return [...sounds, sound];
          }, [] as Sound[])
          .forEach(function (sound) {
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
      .catch(function (err) {
        console.error(err);
      });

    // Restore options from the chrome local storage
    chrome.storage.local.get(defaultOptions, function (options) {
      if (chrome.runtime.lastError) {
        console.debug(chrome.runtime.lastError.message);
        return;
      }

      soundSelectElement!.value = options.soundId;
    });
  },
  { once: true }
);
