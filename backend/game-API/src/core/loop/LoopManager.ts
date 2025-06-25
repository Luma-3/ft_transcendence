import { GameObject } from "../GameObject";
import { ALoop } from "./ALoop.js";
import { GameLoop, NetworkLoop } from "./Loop.js";

export class LoopManager {
  private networkLoop: ALoop;
  private gameLoop: ALoop;

  public get deltaTime() {
    return this.gameLoop.deltaTime;
  }

  constructor() {
    this.networkLoop = new NetworkLoop(35);
    this.gameLoop = new GameLoop(60);
  }

  public start() {
    console.log("Starting LoopManager...");
    this.networkLoop.start();
    this.gameLoop.start();
  }

  public stop() {
    console.log("Stopping LoopManager...");
    this.networkLoop.stop();
    this.gameLoop.stop();
  }

  public addNetworkObject(obj: GameObject) {
    this.networkLoop.addObject(obj);
  }

  public addGameObject(obj: GameObject) {
    this.gameLoop.addObject(obj);
  }

  public removeNetworkObject(obj: GameObject) {
    this.networkLoop.removeObject(obj);
  }
  public removeGameObject(obj: GameObject) {
    this.gameLoop.removeObject(obj);
  }
}

