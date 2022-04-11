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

import './volume-control';
import { HTMLVolumeControlElement } from './volume-control';

const defaultValue = '50';

let element: HTMLVolumeControlElement;
let input: HTMLInputElement;

beforeEach(() => {
  element = document.body.appendChild(
    document.createElement('volume-control') as HTMLVolumeControlElement
  );
  input = element.shadowRoot!.querySelector('input')!;
});

afterEach(() => {
  document.body.removeChild(element);
});

test('should register a custom element', () => {
  expect(element.constructor.name).toBe('HTMLVolumeControlElement');
});

test('should use the default values', () => {
  expect(element.min).toBe('0');
  expect(element.max).toBe('100');
  expect(element.value).toBe(defaultValue);
  expect(element.muted).toBe(false);
  expect(element.button.constructor.name).toBe('HTMLButtonElement');
});

test('should fit the range (min/max)', () => {
  element.value = element.min;

  expect(element.value).toBe(element.min);
  expect(element.muted).toBe(false);
  expect(input.value).toBe(element.value);

  element.value = element.max;

  expect(element.value).toBe(element.max);
  expect(element.muted).toBe(false);
  expect(input.value).toBe(element.value);

  element.value = '-1';

  expect(element.value).toBe(element.min);
  expect(element.muted).toBe(false);
  expect(input.value).toBe(element.value);

  element.value = '1';

  expect(element.value).toBe('1');
  expect(input.value).toBe(element.value);

  element.value = '99';

  expect(element.value).toBe('99');
  expect(input.value).toBe(element.value);

  element.value = '100';

  expect(element.value).toBe('100');
  expect(input.value).toBe(element.value);

  element.value = '101';

  expect(element.value).toBe(element.max);
  expect(input.value).toBe(element.value);
});

test('should remove all decimal points', () => {
  element.value = Math.PI.toString();

  expect(element.value).toBe('3');
  expect(input.value).toBe(element.value);

  element.value = '99.999';

  expect(element.value).toBe('99');
  expect(input.value).toBe(element.value);
});

test('should reject invalid values', () => {
  expect(element.value).toBe(defaultValue);
  expect(element.muted).toBe(false);
  expect(input.value).toBe(element.value);

  element.value = '';

  expect(element.value).toBe(defaultValue);
  expect(element.muted).toBe(false);
  expect(input.value).toBe(element.value);

  element.value = 'foo';

  expect(element.value).toBe(defaultValue);
  expect(element.muted).toBe(false);
  expect(input.value).toBe(element.value);

  element.value = '1';
  element.value = 'bar';

  expect(element.value).toBe('1');
  expect(element.muted).toBe(false);
  expect(input.value).toBe(element.value);
});

test('should set the property muted', () => {
  element.muted = true;

  expect(element.value).toBe(defaultValue);
  expect(element.muted).toBe(true);
  expect(input.value).toBe('0');

  element.muted = false;

  expect(element.value).toBe(defaultValue);
  expect(element.muted).toBe(false);
  expect(input.value).toBe(defaultValue);
});

test('should toggle the muted state', () => {
  const eventListenerSpyMute = jest.fn();
  const eventListenerSpyChange = jest.fn();

  element.value = '100';
  element.muted = true;
  element.addEventListener('mute', eventListenerSpyMute, { once: true });
  element.addEventListener('change', eventListenerSpyChange, { once: true });

  expect(element.value).toBe('100');
  expect(element.muted).toBe(true);
  expect(input.value).toBe('0');

  element.toggle();

  expect(element.value).toBe('100');
  expect(element.muted).toBe(false);
  expect(input.value).toBe(element.value);

  expect(eventListenerSpyMute).toHaveBeenCalled();
  expect(eventListenerSpyChange).not.toHaveBeenCalled();
});

test('should toggle the muted state and reset the value from 0 to 5', () => {
  const eventListenerSpyMute = jest.fn();
  const eventListenerSpyChange = jest.fn();

  element.value = '0';
  element.muted = true;
  element.addEventListener('mute', eventListenerSpyMute, { once: true });
  element.addEventListener('change', eventListenerSpyChange, { once: true });

  expect(element.value).toBe('0');
  expect(element.muted).toBe(true);
  expect(input.value).toBe(element.value);

  element.toggle();

  expect(element.value).toBe('5');
  expect(element.muted).toBe(false);
  expect(input.value).toBe(element.value);

  expect(eventListenerSpyMute).toHaveBeenCalled();
  expect(eventListenerSpyChange).not.toHaveBeenCalled();
});

test('should change the value with the input range slider', () => {
  const eventListenerSpyMute = jest.fn();
  const eventListenerSpyChange = jest.fn();

  element.addEventListener('mute', eventListenerSpyMute, { once: true });
  element.addEventListener('change', eventListenerSpyChange, { once: true });

  expect(element.value).toBe(defaultValue);
  expect(element.muted).toBe(false);
  expect(input.value).toBe(defaultValue);

  input.value = '1';
  input.dispatchEvent(new Event('change'));

  expect(element.value).toBe('1');
  expect(element.muted).toBe(false);
  expect(input.value).toBe('1');

  expect(eventListenerSpyMute).not.toHaveBeenCalled();
  expect(eventListenerSpyChange).toHaveBeenCalled();
});

test('should toggle the muted state with the input range slider', () => {
  const eventListenerSpyMute = jest.fn();
  const eventListenerSpyChange = jest.fn();

  element.addEventListener('mute', eventListenerSpyMute, { once: true });
  element.addEventListener('change', eventListenerSpyChange, { once: true });

  expect(element.value).toBe(defaultValue);
  expect(element.muted).toBe(false);
  expect(input.value).toBe(defaultValue);

  input.value = '0';
  input.dispatchEvent(new Event('change'));

  expect(element.value).toBe('0');
  expect(element.muted).toBe(true);
  expect(input.value).toBe(element.value);

  expect(eventListenerSpyMute).not.toHaveBeenCalled();
  expect(eventListenerSpyChange).toHaveBeenCalled();
});

test('should toggle the muted state with the input range slider', () => {
  const eventListenerSpyMute = jest.fn();
  const eventListenerSpyChange = jest.fn();

  element.value = '0';
  element.muted = true;
  element.addEventListener('mute', eventListenerSpyMute, { once: true });
  element.addEventListener('change', eventListenerSpyChange, { once: true });

  expect(element.value).toBe('0');
  expect(element.muted).toBe(true);
  expect(input.value).toBe(element.value);

  input.value = '100';
  input.dispatchEvent(new Event('change'));

  expect(element.value).toBe('100');
  expect(element.muted).toBe(false);
  expect(input.value).toBe(element.value);

  expect(eventListenerSpyMute).not.toHaveBeenCalled();
  expect(eventListenerSpyChange).toHaveBeenCalled();
});
