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

export interface Action {
  type: string;
}

export declare interface TypedAction<T extends string> extends Action {
  readonly type: T;
}

export type FunctionWithParametersType<P extends unknown[], R = void> = (
  ...args: P
) => R;

export type Creator<
  P extends any[] = any[],
  R extends object = object
> = FunctionWithParametersType<P, R>;

export type ActionCreator<
  T extends string = string,
  C extends Creator = Creator
> = C & TypedAction<T>;

export interface Props<T> {
  _as: 'props';
  _p: T;
}

export function createAction<T extends string>(
  type: T
): ActionCreator<T, () => TypedAction<T>>;
export function createAction<T extends string, P extends object>(
  type: T,
  config: Props<P>
): ActionCreator<T, (props: P) => P & TypedAction<T>>;
export function createAction<T extends string, C extends Creator>(
  type: T,
  config?: object
): ActionCreator<T> {
  if (config) {
    return defineType(type, (props: object) => ({
      ...props,
      type
    }));
  }

  return defineType(type, () => ({ type }));
}

export function props<P extends object>(): Props<P> {
  return { _as: 'props', _p: undefined! };
}

function defineType<T extends string>(
  type: T,
  creator: Creator
): ActionCreator<T> {
  // @ts-ignore
  return Object.defineProperty(creator, 'type', {
    value: type,
    writable: false
  });
}
