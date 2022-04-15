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

import '@babylonjs/core/Animations';
import '@babylonjs/core/Audio/audioSceneComponent';
import '@babylonjs/core/Loading/Plugins/babylonFileLoader';
import '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/core/Materials/PBR/pbrMaterial';

import { Sound } from '@babylonjs/core/Audio/sound';
import { Skeleton } from '@babylonjs/core/Bones/skeleton';
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import { Engine } from '@babylonjs/core/Engines/engine';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import {
  AssetsManager,
  BinaryFileAssetTask,
  ContainerAssetTask,
  TextureAssetTask
} from '@babylonjs/core/Misc/assetsManager';
import { Observable } from '@babylonjs/core/Misc/observable';
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import { Scene } from '@babylonjs/core/scene';
import { Control3D } from '@babylonjs/gui/3D/controls/control3D';
import { MeshButton3D } from '@babylonjs/gui/3D/controls/meshButton3D';
import { StackPanel3D } from '@babylonjs/gui/3D/controls/stackPanel3D';
import { GUI3DManager } from '@babylonjs/gui/3D/gui3DManager';
import { Vector3WithInfo } from '@babylonjs/gui/3D/vector3WithInfo';

/**
 * Game controller
 */
export class Game {
  /**
   * Main scene
   */
  private _scene: Scene;

  private _assetsManager: AssetsManager;

  private _meshes: Map<string, Mesh> = new Map();
  private _skeletons: Map<string, Skeleton> = new Map();
  private _textures: Map<string, Texture> = new Map();
  private _sounds: Map<string, Sound> = new Map();

  private _guiManager: GUI3DManager;

  private _counterPanel: StackPanel3D;

  private _luckCounter: number = 0;

  /**
   * Sets the volume for the main sound track
   */
  set volume(value: number) {
    this._scene.mainSoundTrack.setVolume(value);
  }

  /**
   * An event triggered when the options button is clicked
   */
  onOptionsButtonClickObservable = new Observable<Vector3WithInfo>();

  /**
   * Creates a new `Game` instance
   * @param canvas An HTMLCanvasElement used to render
   */
  constructor(canvas: HTMLCanvasElement) {
    // Create a new engine
    const engine = new Engine(canvas, true);

    if (window.devicePixelRatio >= 2) {
      // HiDPI rendering
      engine.setHardwareScalingLevel(0.5);
    }

    // Create a new scene
    this._scene = new Scene(engine);
    this._scene.animationTimeScale = 2;
    this._scene.doNotHandleCursors = true;

    // Clear the render buffer before rendering a frame
    this._scene.autoClear = false;

    const camera = new UniversalCamera(
      'main',
      new Vector3(0, 0, -100),
      this._scene
    );
    camera.setTarget(Vector3.Zero());

    // Attach a camera to the scene and the canvas
    this._scene.activeCamera = camera;

    const hemisphericLight = new HemisphericLight(
      'light1',
      new Vector3(0, 1.54, 0),
      this._scene
    );
    hemisphericLight.diffuse = Color3.White();
    hemisphericLight.specular = Color3.Black();
    hemisphericLight.intensity = 2.1476;

    const directionalLight = new DirectionalLight(
      'light2',
      new Vector3(0, -1, 0),
      this._scene
    );
    directionalLight.parent = camera;

    // Create a new GUI manager
    this._guiManager = new GUI3DManager(this._scene);
    this._guiManager.utilityLayer!.utilityLayerScene.doNotHandleCursors = true;

    // Create a new stack panel to hold the numbers for the counter
    this._counterPanel = new StackPanel3D();
    this._counterPanel.margin = 4.2001;

    this._guiManager.addControl(this._counterPanel);

    // Create a new assets manager
    this._assetsManager = new AssetsManager(this._scene);
    this._assetsManager.useDefaultLoadingScreen = false;
    this._assetsManager.onTaskSuccessObservable.add((task) => {
      if (task instanceof ContainerAssetTask) {
        task.loadedMeshes.forEach((mesh) => {
          if (mesh instanceof Mesh) {
            mesh.setEnabled(false);
            mesh.scaling = new Vector3(1, 1, 1);

            this._meshes.set(mesh.name, mesh);
          }
        });

        task.loadedSkeletons.forEach((skeleton) => {
          this._skeletons.set(skeleton.name, skeleton);
        });
      } else if (task instanceof TextureAssetTask) {
        this._textures.set(task.name, task.texture);
      } else if (task instanceof BinaryFileAssetTask) {
        this._sounds.set(
          task.name,
          new Sound(task.name, task.data, this._scene)
        );
      }
    });
    this._assetsManager.onTaskErrorObservable.add(function (task) {
      console.error(
        'AssetsManager',
        task.errorObject.message,
        task.errorObject.exception
      );
    });

    this._assetsManager.addContainerTask(
      'numbers',
      '',
      '/assets/models/',
      'numbers.babylon'
    );
    this._assetsManager.addContainerTask(
      'settings',
      '',
      '/assets/models/',
      'settings_icon.babylon'
    );
    this._assetsManager.addTextureTask(
      'textureTwinkle',
      '/assets/textures/twinkle.png'
    );
    this._assetsManager.addBinaryFileTask(
      'soundNumberClickDefault',
      '/assets/sounds/number_click_default.wav'
    );
    this._assetsManager.addBinaryFileTask(
      'soundNumberClickRare',
      '/assets/sounds/number_click_rare.wav'
    );
  }

  async init(): Promise<void> {
    return this._assetsManager.loadAsync().then(() => {
      this._createHud();

      // Render the scene
      this._scene.getEngine().runRenderLoop(this._render.bind(this));
    });
  }

  /**
   * Resizes the scene
   */
  resize() {
    this._scene.getEngine().resize();
  }

  private _render() {
    this._scene.render();
  }

  private _createHud() {
    const anchor = new TransformNode('');
    anchor.scaling = Vector3.One();
    anchor.position.z = 14;
    anchor.parent = this._scene.activeCamera!;

    // Clone the mesh
    const settingsIconMesh = this._meshes.get('settings_icon')!.clone();
    settingsIconMesh.setEnabled(true);

    const optionsButton = new MeshButton3D(settingsIconMesh, 'options');
    optionsButton.pointerDownAnimation = () => {};
    optionsButton.pointerUpAnimation = () => {};
    optionsButton.pointerEnterAnimation = () => {};
    optionsButton.pointerOutAnimation = () => {};
    optionsButton.onPointerEnterObservable.add((control) => {
      this._scene.getEngine().getInputElement()!.style.cursor = 'pointer';
    });
    optionsButton.onPointerOutObservable.add(() => {
      this._scene.getEngine().getInputElement()!.style.cursor = '';
    });
    optionsButton.onPointerClickObservable.add((eventData) =>
      this.onOptionsButtonClickObservable.notifyObservers(eventData)
    );

    this._guiManager.addControl(optionsButton);

    optionsButton.linkToTransformNode(anchor);

    optionsButton.position.y = 5;
    optionsButton.position.x = 3;
  }

  /**
   * Updates the counter
   * @param count A numeric count to render on the scene
   */
  updateCounter(count: number) {
    console.log('test1', this._scene.beginAnimation);
    if (count === 0) {
      // Reset the luck counter
      this._luckCounter = 0;
    }

    let cleared = false;

    count
      .toString()
      .split('')
      .forEach((digit, i) => {
        if (!cleared) {
          const control: Control3D | undefined = this._counterPanel.children[i];

          if (control) {
            if (control.name === digit) {
              return;
            }

            this._counterPanel.children.slice(i).forEach((button) => {
              button.mesh!.skeleton!.dispose();
              this._counterPanel.removeControl(button);
              button.dispose();
            });

            cleared = true;
          }
        }

        // Clone the mesh
        const numberMesh = this._meshes.get(digit)!.clone();
        numberMesh.skeleton = this._skeletons
          .get('number_default')!
          .clone(numberMesh.name);
        console.log('test2', numberMesh._scene.beginAnimation);
        numberMesh.setEnabled(true);
        console.log('test3', numberMesh.getEngine().scenes[0].beginAnimation);

        let idleAnimation = numberMesh.skeleton!.beginAnimation('idle', true);

        // Create a new 3D button
        const button = new MeshButton3D(numberMesh, digit);
        button.pointerDownAnimation = () => {};
        button.pointerUpAnimation = () => {};
        button.pointerEnterAnimation = () => {};
        button.pointerOutAnimation = () => {};
        button.onPointerEnterObservable.add(() => {
          this._scene.getEngine().getInputElement()!.style.cursor = 'pointer';
        });
        button.onPointerOutObservable.add(() => {
          this._scene.getEngine().getInputElement()!.style.cursor = '';
        });
        button.onPointerClickObservable.add((eventData) => {
          let eventName = 'click_default';
          let soundName = 'soundNumberClickDefault';

          if (
            this._luckCounter >= 9 ||
            (Math.random() * (this._luckCounter > 3 ? 7 : 10)) << 0 === 0
          ) {
            eventName = 'click_rare';
            soundName = 'soundNumberClickRare';

            this._luckCounter = 0;
          } else {
            // Reset the luck counter
            this._luckCounter++;
          }

          if (idleAnimation) {
            idleAnimation.stop();
            idleAnimation = null;
          }

          button
            .mesh!.skeleton!.beginAnimation(eventName)!
            .onAnimationEndObservable.addOnce((eventData) => {
              if (!eventData.animationStarted && button.isVisible) {
                idleAnimation = numberMesh.skeleton!.beginAnimation(
                  'idle',
                  true
                );
              }
            });

          this._sounds.get(soundName)!.play();

          this._sparklesNumberClick(eventData.clone());
        });

        this._counterPanel.addControl(button);
      });
  }

  private _sparklesNumberClick(position: Vector3) {
    const emitter = new AbstractMesh('numberParticleEmitter', this._scene);
    emitter.position = position;

    // Number of particles
    const particles = Math.floor(Math.random() * (8 - 4 + 1) + 4);

    // Particle system
    const particleSystem = new ParticleSystem(
      'numberParticleSystem',
      particles,
      this._scene!
    );
    particleSystem.addLifeTimeGradient(0, 0.1, 0.2);
    particleSystem.addLifeTimeGradient(1, 0.2, 0.3);
    particleSystem.addSizeGradient(0.9, 1.2);
    particleSystem.addSizeGradient(1, 1);
    particleSystem.addSizeGradient(1, 0.001);
    particleSystem.addColorGradient(
      0,
      new Color4(0.96, 0.362, 0.902 + 0.08 * Math.random(), 0.28)
    );
    particleSystem.colorDead = new Color4(1, 1, 1, 0);
    particleSystem.emitter = emitter;
    particleSystem.particleTexture = this._textures
      .get('textureTwinkle')!
      .clone();
    particleSystem.createConeEmitter(0.1, Math.PI / 4);
    particleSystem.updateSpeed = 1 / 60;
    particleSystem.createSphereEmitter(0.8, 2.2);
    particleSystem.emitRate = particles * particles;
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.minSize = 1.3;
    particleSystem.maxSize = 1.6;
    particleSystem.targetStopDuration = 0.08;
    particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    particleSystem.disposeOnStop = true;
    particleSystem.start();
  }
}
