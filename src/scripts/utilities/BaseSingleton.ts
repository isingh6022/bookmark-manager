import { MultipleSingletonInstancesError } from '@proj-scripts';

export abstract class BaseSingleton {
  private static _instances = new Map<string, BaseSingleton>();

  protected static _getInstance<T extends BaseSingleton>(MyClass: {
    new (...args: any[]): T;
  }): T | undefined {
    return <T>BaseSingleton._instances.get(MyClass.name);
  }

  constructor() {
    if (BaseSingleton._instances.has(this.constructor.name)) {
      throw new MultipleSingletonInstancesError(this.constructor.name);
    }
    BaseSingleton._instances.set(this.constructor.name, this);
  }
}
