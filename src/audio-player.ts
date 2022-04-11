import { Sound } from './config';

/**
 * Audio player
 */
export class AudioPlayer {
  private readonly _channel: HTMLAudioElement = new Audio();

  private _sound: Sound | undefined;

  /**
   * Sets the audio sound
   * @param value The Sound object
   */
  set sound(value: string) {
    this._sound = this._sounds.find(function (sound) {
      return sound.id === value;
    })!;
  }

  /**
   * Gets the audio sound
   */
  get sound(): string {
    return this._sound!.id;
  }

  private _volume: number = 0;

  /**
   * Sets the volume at which the audio will be played
   *
   * @param value A double values must fall between 0 and 1, where 0 is
   * effectively muted and 1 is the loudest possible value
   */
  set volume(value: number) {
    this._volume = value;

    this._channel.volume = value;
  }

  /**
   * Gets the volume at which the audio is being played
   */
  get volume(): number {
    return this._volume;
  }

  /**
   * Creates a new `AudioPlayer` instance
   */
  constructor(private _sounds: Sound[], private _rootPath: string) {}

  /**
   * Attempts to begin playback of the audio
   */
  play() {
    if (this._sound) {
      if (this._channel.paused) {
        const length = this._sound.tracks.length;

        if (length === 1) {
          // Select the default sound track
          this._channel.src = this._rootPath + '/' + this._sound.tracks[0];
        } else {
          // Select a random sound track
          this._channel.src =
            this._rootPath +
            '/' +
            this._sound.tracks[(Math.random() * length) >> 0];
        }

        this._channel.play();
      } else {
        if (this._channel.currentTime >= 0.026) {
          this._channel.currentTime = 0;
        }
      }
    }
  }

  /**
   * Pauses playback of the audio, if the audio is already in a paused state
   * this method will have no effect
   */
  pause() {
    this._channel.pause();
  }
}
