import { createAction, props } from '../port';

/**
 * Sync action
 */
export const syncAction = createAction('[Popup] Sync');

/**
 * Update volume action
 */
export const updateVolumeAction = createAction(
  '[Popup] Update Volume',
  props<{ volume: number; muted: boolean }>()
);
