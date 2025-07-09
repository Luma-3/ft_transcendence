import { GameObject } from "../GameObject";
import { ALoop } from "./ALoop.js";
import { GameLoop, NetworkLoop, IALoop } from "./Loop.js";

export class LoopManager {
  private networkLoop: ALoop;
  private gameLoop: ALoop;
  private iaLoop: IALoop; 

  public get deltaTime() {
    return this.gameLoop.deltaTime;
  }

  constructor() {
    this.networkLoop = new NetworkLoop(20);
    this.gameLoop = new GameLoop(60);
    this.iaLoop = new IALoop(1);
  }

  public start() {
    console.log("Starting LoopManager...");
    this.networkLoop.start();
    this.gameLoop.start();
    this.iaLoop.start();
  }

  public stop() {
    console.log("Stopping LoopManager...");
    this.networkLoop.stop();
    this.gameLoop.stop();
    this.iaLoop.stop();
  }

  public addNetworkObject(obj: GameObject) {
    this.networkLoop.addObject(obj);
  }

  public addGameObject(obj: GameObject) {
    this.gameLoop.addObject(obj);
  }

  public addIAObject(obj: any) { // ← nouvelle méthode pour les objets IA
    this.iaLoop.addObject(obj);
  }

  public removeNetworkObject(obj: GameObject) {
    this.networkLoop.removeObject(obj);
  }
  public removeGameObject(obj: GameObject) {
    this.gameLoop.removeObject(obj);
  }
  public removeIAObject(obj: any) { // ← pour retirer un bot si besoin
    this.iaLoop.removeObject(obj);
  }
}

