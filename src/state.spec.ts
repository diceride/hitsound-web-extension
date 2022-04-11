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

import { state, stateObservable } from './state';

test('should update the state', () => {
  const initialState = Object.assign({}, state);

  const eventListenerSpyChange = jest.fn();
  stateObservable.addEventListener('change', eventListenerSpyChange, {
    once: true
  });

  stateObservable.addEventListener(
    'change',
    function (event: CustomEvent) {
      expect(event.detail.count).toBe(initialState.count);
      expect(state.count).toBe(1);
    } as EventListener,
    { once: true }
  );

  expect(state).toEqual(initialState);

  state.count = 1;

  expect(state.count).toBe(1);

  expect(eventListenerSpyChange).toHaveBeenCalled();

  stateObservable.addEventListener(
    'change',
    function (event: CustomEvent) {
      expect(event.detail.count).toBe(1);
      expect(state.count).toBe(2);
    } as EventListener,
    { once: true }
  );

  state.count = 2;

  expect(state.count).toBe(2);

  stateObservable.addEventListener(
    'change',
    function (event: CustomEvent) {
      expect(event.detail.muted).toBe(false);
      expect(state.muted).toBe(true);
    } as EventListener,
    { once: true }
  );

  state.muted = true;

  expect(state.muted).toBe(true);

  expect(eventListenerSpyChange).toHaveBeenCalled();
});
