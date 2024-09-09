type State<T> = {
  promise: Promise<T>
} | {
  result: T
} | {
  error: unknown
};

/**
 * A resource of type T that is loaded asynchronously. Typically used via the
 * useAsyncResource hook.
 */
export default class AsyncResource<T> {
  private state: State<T>;

  constructor(p: Promise<T>) {
    this.state = {
      promise: p.then((r) => {
        this.state = { result: r };
        return r;
      }).catch((e) => {
        this.state = { error: e };
        throw e;
      }),
    };
  }

  read(): T {
    if ('promise' in this.state) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw this.state.promise;
    }

    if ('error' in this.state) {
      throw this.state.error;
    }

    return this.state.result;
  }
}
