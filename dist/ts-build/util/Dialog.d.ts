import { VNode } from 'snabbdom/vnode';
export interface DialogHandler {
    open(): void;
    close(): void;
    create(title: string, description: string, content: VNode): VNode;
}
export interface DialogHandlerFactory {
    create(): DialogHandler;
}
export declare class VNodeRegistry {
    private static nodeRegistry;
    private static factory;
    static register(dialogHandlerFactory: DialogHandlerFactory): void;
    static registerVnode(id: string, vnode: VNode): void;
    static prepare(): DialogHandlerFactory;
    static get(id: string): VNode;
}
