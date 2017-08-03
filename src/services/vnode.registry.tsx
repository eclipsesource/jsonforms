import * as snabbdomJsx from 'snabbdom-jsx';
import { VNode } from 'snabbdom/vnode';

import { html } from 'snabbdom-jsx';

declare let $;

const JSX = {createElement: snabbdomJsx.html};

export interface DialogHandler {
  open(): void;
  close(): void;
  create(title: string, description: string, content: VNode): VNode;
}

export interface DialogHandlerFactory {
  create(): DialogHandler;
}

class DefaultDialogHandler implements DialogHandler {

  private title;

  open(): void {
    const dialog: any = document.getElementById(`${this.title}-dialog`);
    dialog.showModal();
  }

  close(): void {
    const dialog: any = document.getElementById(`${this.title}-dialog`);
    dialog.close();
  }

  create(title: string, description: string, content: VNode): VNode {
    this.title = title;

    return (<dialog id={`${title}-dialog`}>
        <title>{title}</title>
        <p>{description}</p>
        <div>
          {content}
        </div>
        <button onclick={() => this.close()}>Close</button>
      </dialog>
    );
  }

}

export class VNodeRegistry {

  private static _dialogHandler: DialogHandler = new DefaultDialogHandler();

  static registerDialogHandler(dialogHandler: DialogHandler) {
    this._dialogHandler = dialogHandler;
  }

  static dialogHandler(): DialogHandler {
    return this._dialogHandler;
  }
}
