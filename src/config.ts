export interface Sound {
  id: string;
  tracks: string[];
}

export type SoundsData = {
  sounds: Sound[];
};

/**
 * Chrome storage options
 */
export interface Options {
  soundId: string;
  volume: number;
  muted: boolean;
}

/**
 * Default chrome storage options
 */
export const defaultOptions: Options = {
  soundId: 'default',
  volume: 0.64,
  muted: false
};
