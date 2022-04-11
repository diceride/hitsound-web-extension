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

const template = document.createElement('template');
template.innerHTML = `<style>
.volume-panel {
  width: 52px;
  display: flex;
  align-items: center;
}

button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  border: none;
  outline: 0;
  padding: 0;
  color: inherit;
  cursor: pointer;
  text-align: inherit;
  font-size: 100%;
  font-family: inherit;
  line-height: inherit;
  background: none;
}

input {
  -webkit-appearance: none;
  width: 100%;
  height: 3px;
  background: var(--primary-color);
  outline: none;
  padding: 0;
  margin: 0 0 0 3px;
}

input::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

input:active::-webkit-slider-thumb {
  background: var(--primary-color);
}

input::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
}

input:active::-moz-range-thumb {
  background: var(--primary-color);
}
</style>
<button>
<svg xmlns="http://www.w3.org/2000/svg"
     width="40"
     height="40" 
     viewBox="0 0 36 36">
    <style>
:host {
  fill: currentColor;
}

.volume-speaker {
  transition: opacity 0.24s linear;
}

.volume-animation-mover {
  transition: transform 0.22s linear;
}

.volume-shadow {
  stroke: var(--secondary-color);
  stroke-opacity: 0.16;
  stroke-width: 2px;
  fill: none;
}
    </style>
    <use class="volume-shadow" xlink:href="#volume-icon"/>
    <use class="volume-shadow" xlink:href="#volume-animation-hider"/>
    <defs>
        <clipPath id="volume-animation-mask">
            <path d="m 14.35,-0.14 -5.86,5.86 20.73,20.78 5.86,-5.91 z"/>
            <path d="M 7.07,6.87 -1.11,15.33 19.61,36.11 27.80,27.60 z"/>
            <path class="volume-animation-mover" 
                  d="M 9.09,5.20 6.47,7.88 26.82,28.77 29.66,25.99 z"
                  transform="translate(0, 0)"/>
        </clipPath>
        <clipPath id="volume-animation-slash-mask">
            <path class="volume-animation-mover" 
                  d="m -11.45,-15.55 -4.44,4.51 20.45,20.94 4.55,-4.66 z"
                  transform="translate(0, 0)"/>
        </clipPath>
    </defs>
    <g id="volume-icon" clip-path="url(#volume-animation-mask)">
        <path d="M8,21h4l5,5V10l-5,5H8Zm11-7v8a4.39,4.39,0,0,0,2.5-4A4.49,4.49,0,0,0,19,14Z"/>
        <path class="volume-speaker"
              d="M19,11.29a7,7,0,0,1,0,13.42v2.06A9,9,0,0,0,19,9.23v2.06"/>
    </g>
    <path id="volume-animation-hider" clip-path="url(#volume-animation-slash-mask)"
          d="M 9.25,9 7.98,10.27 24.71,27 l 1.27,-1.27 Z"/>
</svg>
</button>
<div class="volume-panel">
  <input type="range" 
         min="0"
         max="100"
         step="1"/>
</div>`;

const $button = Symbol('button');
const $input = Symbol('input');
const $value = Symbol('value');
const $muted = Symbol('muted');
const $onChange = Symbol('onChange');
const $updateButton = Symbol('updateButton');

const defaultValue = '50';

/**
 * HTML volume control element
 */
export class HTMLVolumeControlElement extends HTMLElement {
  /**
   * The minimum permitted value
   */
  readonly min = '0';

  /**
   * The maximum permitted value
   */
  readonly max = '100';

  protected [$value]: string = defaultValue;

  /**
   * Sets the volume
   * @param value An integer values must fall between 0 and 100, where 0 is the
   *     minimum and 100 is maximum
   *
   * The value is never an empty string (""). The default value is halfway
   * between the specified minimum and maximum. If an attempt is made to set the
   * value lower than the minimum, it is set to the minimum. Similarly, an
   * attempt to set the value higher than the maximum results in it being set to
   * the maximum.
   */
  set value(value: string) {
    if (value === '') {
      return;
    }

    const num = Number(value);

    if (Number.isNaN(num)) {
      return;
    } else if (num < Number(this.min)) {
      value = this.min;
    } else if (num > Number(this.max)) {
      value = this.max;
    } else {
      value = Math.trunc(num).toString();
    }

    this[$value] = value;

    if (!this.muted) {
      this[$input].value = value;
    }

    this[$updateButton]();
  }

  get value(): string {
    return this[$value];
  }

  protected [$muted]: boolean = false;

  /**
   * Sets the muted state
   * @param value A boolean indicating whether the state is muted
   */
  set muted(value: boolean) {
    value = value != null && value.toString() !== 'false';

    this[$muted] = value;

    this[$input].value = value ? '0' : this[$value];

    this[$updateButton]();
  }

  get muted(): boolean {
    return this[$muted];
  }

  /**
   * An HTMLInputElement referencing the input element
   */
  protected [$input]: HTMLInputElement;

  /**
   * An HTMLButtonElement referencing the button element
   */
  protected [$button]: HTMLButtonElement;

  get button(): HTMLButtonElement {
    return this[$button];
  }

  /**
   * Creates a new `HTMLVolumeControlElement` instance
   */
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    const shadowRoot = this.shadowRoot!;
    shadowRoot.appendChild(template.content.cloneNode(true));

    this[$button] = shadowRoot.querySelector('button') as HTMLButtonElement;
    this[$button].addEventListener('click', this.toggle.bind(this));

    this[$input] = shadowRoot.querySelector('input') as HTMLInputElement;
    this[$input].value = this[$value];
    this[$input].addEventListener('change', this[$onChange].bind(this));
  }

  /**
   * Toggles the muted state
   */
  toggle() {
    if (this[$muted] && this[$value] === '0') {
      // Reset the value to 5
      this[$value] = '5';
    }

    this.muted = !this.muted;

    this.dispatchEvent(
      new CustomEvent('mute', {
        detail: this,
        composed: true,
        bubbles: true,
        cancelable: true
      })
    );
  }

  private [$onChange](event: Event) {
    event.preventDefault();

    this[$value] = this[$input].value;

    this[$muted] = this[$value] === '0';

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: this,
        composed: true,
        bubbles: true,
        cancelable: true
      })
    );

    this[$updateButton]();
  }

  private [$updateButton]() {
    const volumeDown = this[$muted] || this[$value] === '0';

    this.shadowRoot!.querySelector('.volume-speaker')!.setAttribute(
      'opacity',
      volumeDown || Number(this[$value]) > 50 ? '1' : '0'
    );

    this.shadowRoot!.querySelectorAll('.volume-animation-mover')!.forEach(
      function (element) {
        element.setAttribute(
          'transform',
          volumeDown ? 'translate(22, 22)' : 'translate(0, 0)'
        );
      }
    );
  }
}

customElements.define('volume-control', HTMLVolumeControlElement);

declare global {
  interface HTMLElementTagNameMap {
    'volume-control': HTMLVolumeControlElement;
  }
}
