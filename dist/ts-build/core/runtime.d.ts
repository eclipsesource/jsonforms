export declare enum RUNTIME_TYPE {
    VALIDATION_ERROR = 0,
    VISIBLE = 1,
    ENABLED = 2,
}
export interface RuntimeListener {
    notify(type: RUNTIME_TYPE): void;
}
export declare class Runtime {
    private _validationErrors;
    private _visible;
    private _enabled;
    private _listeners;
    visible: boolean;
    enabled: boolean;
    validationErrors: Array<string>;
    addListener(listener: RuntimeListener): void;
    removeListener(listener: RuntimeListener): void;
    private notifyListeners(type);
}
