import { GameObject } from "../GameObject";
import { ALoop } from "./ALoop.js";
import { GameLoop, NetworkLoop, AILoop } from "./Loop.js";

export class LoopManager {
  private networkLoop: ALoop;
  private gameLoop: ALoop;
  private aiLoop: AILoop;

  public get deltaTime() {
    return this.gameLoop.deltaTime;
  }

  constructor() {
    this.networkLoop = new NetworkLoop(25);
    this.gameLoop = new GameLoop(60);
    this.aiLoop = new AILoop(1);
  }

  public start() {
    console.log("Starting LoopManager...");
    this.networkLoop.start();
    this.gameLoop.start();
    this.aiLoop.start();
  }

  public stop() {
    console.log("Stopping LoopManager...");
    this.networkLoop.stop();
    this.gameLoop.stop();
    this.aiLoop.stop();
  }

  public addNetworkObject(obj: GameObject) {
    this.networkLoop.addObject(obj);
  }

  public addGameObject(obj: GameObject) {
    this.gameLoop.addObject(obj);
  }

  public addAIObject(obj: any) { // ← nouvelle méthode pour les objets IA
    this.aiLoop.addObject(obj);
  }

  public removeNetworkObject(obj: GameObject) {
    this.networkLoop.removeObject(obj);
  }
  public removeGameObject(obj: GameObject) {
    this.gameLoop.removeObject(obj);
  }
  public removeAIObject(obj: any) { // ← pour retirer un bot si besoin
    this.aiLoop.removeObject(obj);
  }
}

