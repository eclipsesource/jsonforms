import { RankedTester } from '../core/testers';
import { RendererProps } from '../core/renderer';
export interface DispatchRendererProps extends RendererProps {
    renderers?: {
        tester: RankedTester;
        renderer: any;
    }[];
}
export declare const DispatchRenderer: ({ uischema, schema, path, renderers }: DispatchRendererProps) => any;
declare const _default: any;
export default _default;
