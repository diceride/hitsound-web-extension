import { createAction, props } from '../port';

/**
 * Update count action
 */
export const updateCountAction = createAction(
  '[Background] Update Count',
  props<{ count: number }>()
);
