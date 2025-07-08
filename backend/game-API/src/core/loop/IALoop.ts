// IALoop.ts
import { ALoop } from "./ALoop.js";

export class IALoop extends ALoop {
  constructor(tickRate: number) {
    super(tickRate); // Ex: 1 tick/seconde (tickRate=1)
  }

  protected update(): void {
    this.objects.forEach((obj) => {
      obj.update();
    });
  }
}
