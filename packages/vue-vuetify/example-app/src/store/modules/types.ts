import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

// declare your own store states
export interface AppState {
  drawer: boolean | null;
  settings: boolean | null;
  jsonforms: {
    readonly: boolean;
    validationMode: 'ValidateAndShow' | 'ValidateAndHide' | 'NoValidation';
    config: {
      restrict: boolean;
      trim: boolean;
      showUnfocusedDescription: boolean;
      hideRequiredAsterisk: boolean;
      collapseNewItems: boolean;
      initCollapsed: boolean;
      breakHorizontal: false | string;
      hideAvatar: boolean;
      hideArraySummaryValidation: boolean;
      vuetify?: Record<string, any>;
    };
    locale: string;
  };
  monaco: {
    schemaModel: monaco.editor.ITextModel | undefined;
    uischemaModel: monaco.editor.ITextModel | undefined;
    dataModel: monaco.editor.ITextModel | undefined;
  };
}
