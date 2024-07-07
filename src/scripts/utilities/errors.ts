abstract class ErrorClass extends Error {
  constructor(className: string, type: string, message: string) {
    super(`[ERROR | ${type}] :: ${className} : ${message}`);
    Error.captureStackTrace(this, this.constructor);
  }
}

class MultipleSingletonInstancesError extends ErrorClass {
  constructor(className: string) {
    super(
      className,
      MultipleSingletonInstancesError.name,
      `Attempting to create multiple instances of ${className} which is a singleton class.`
    );
  }
}

class UnknownPageType extends ErrorClass {
  constructor(className: string, pageName: string) {
    super(className, UnknownPageType.name, `Page of the type ${pageName} is not available.`);
  }
}

class FailedToLoadStorageData extends ErrorClass {
  constructor(className: string) {
    super(className, FailedToLoadStorageData.name, 'Failed to load Storage data from the browser.');
  }
}

class FailedToLoadBookmarks extends ErrorClass {
  constructor(className: string) {
    super(className, FailedToLoadBookmarks.name, 'Failed to load bookmarks from the browser.');
  }
}

class NotImplmentedError extends ErrorClass {
  constructor(className: string, methodName: string) {
    super(
      className,
      NotImplmentedError.name,
      `Method ${className}.${methodName} is not implemented.`
    );
  }
}

class InvalidArgumentError extends ErrorClass {
  constructor(className: string, methodName: string, argName: string, argValue: any) {
    super(
      className,
      InvalidArgumentError.name,
      `Invalid value: ${argValue}, for argument ${argName} in method ${methodName}.`
    );
  }
}

class ToDo extends ErrorClass {
  constructor(className: string, methodName: string) {
    super(className, ToDo.name, `Method ${className}.${methodName} is yet to be implemented.`);
  }
}

export {
  MultipleSingletonInstancesError,
  UnknownPageType,
  FailedToLoadStorageData,
  FailedToLoadBookmarks,
  NotImplmentedError,
  InvalidArgumentError,
  ToDo
};
