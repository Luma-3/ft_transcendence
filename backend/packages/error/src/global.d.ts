export { };

declare global {
  interface ErrorConstructor {
    captureStackTrace(error: Object, constructor?: Function): void;
  }
}
