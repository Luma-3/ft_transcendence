
export abstract class GameObject {

  public enabled: boolean = true; // Indicates if the object is enabled or not

  abstract update(): void;
  abstract onInstantiate(): void;
  abstract snapshot(): any;

  // abstract destroy(): void;
};
