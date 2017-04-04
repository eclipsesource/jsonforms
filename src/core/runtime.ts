export enum RUNTIME_TYPE {
  VALIDATION_ERROR, VISIBLE, ENABLED
}
export interface RuntimeListener {
  notify(type: RUNTIME_TYPE): void;
}
export class Runtime {
  private _validationErrors: Array<string>;
  private _visible = true;
  private _enabled = true;
  private _listeners: Array<RuntimeListener> = [];

  get visible(): boolean {return this._visible; };
  get enabled(): boolean {return this._enabled; };
  get validationErrors(): Array<string> {return this._validationErrors; };

  set visible(visible: boolean) {
    this._visible = visible;
    this.notifyListeners(RUNTIME_TYPE.VISIBLE);
  };

  set enabled(enabled: boolean) {
    this._enabled = enabled;
    this.notifyListeners(RUNTIME_TYPE.ENABLED);
  };

  set validationErrors(validationErrors: Array<string>) {
    this._validationErrors = validationErrors;
    this.notifyListeners(RUNTIME_TYPE.VALIDATION_ERROR);
  };

  addListener(listener: RuntimeListener): void {
    this._listeners.push(listener);
  }

  removeListener(listener: RuntimeListener): void {
    this._listeners.splice(this._listeners.indexOf(listener), 1);
  }

  private notifyListeners(type: RUNTIME_TYPE): void {
    this._listeners.forEach(listener => listener.notify(type));
  }
}
