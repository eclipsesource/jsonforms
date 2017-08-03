import { DialogHandler, DialogHandlerFactory } from '../src/services/vnode.registry';
import { VNode } from 'snabbdom/vnode';
import * as snabbdomJsx from 'snabbdom-jsx';

const JSX = {createElement: snabbdomJsx.html};

declare let $;

export class MaterializeDialogHandler implements DialogHandler {

  closeDialog() {
    $('#modal1').modal('close');
  }

  open(): void {
    console.log($('#modal1'))
    $('#modal1').modal('open');
  }

  close(): void {
    this.closeDialog();
  }

  create(title: string, description: string, content: VNode): VNode {
    return (
      <div id='modal1' classNames='modal'>
        <div classNames='modal-content'>
          <h4>{title}</h4>
          <p>{description}</p>
          {content}
        </div>
        <a href='#!'
           classNames='modal-action modal-close waves-effect waves-green btn'>Close</a>
      </div>
    );
  }
}
