/**
 * State
 */
export interface State {
  synced: boolean;
  count: number;
  volume: number;
  muted: boolean;
}

const initialState: State = {
  synced: false,
  count: 0,
  volume: 0,
  muted: false
};

/**
 * State observable
 */
export const stateObservable = new EventTarget();

/**
 * State singleton
 */
export const state = new Proxy<State>(initialState, {
  set(target, p: string | number | symbol, value: any) {
    const event = new CustomEvent('change', { detail: { ...target } });

    Object.assign(target, { [p]: value });

    // Dispatch a state change event
    stateObservable.dispatchEvent(event);

    return true;
  }
});
