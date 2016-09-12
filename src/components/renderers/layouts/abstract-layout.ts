import {Services, ServiceId} from '../../services/services';
import {IRuleService, IRuleServiceCallBack} from '../../services/rule/rule-service';
import {IDataProvider} from '../../services/data/data-providers';
import {ILayout, IRule} from '../../../uischema';

export abstract class AbstractLayout implements IRuleServiceCallBack {

    protected uiSchema: ILayout;
    // IRuleServiceCallBack
    public instance: any;
    public rule: IRule;
    public hide: boolean;

    constructor(protected scope: ng.IScope) {
        let services: Services = scope['services'];
        this.uiSchema = scope['uischema'];

        // IRuleServiceCallBack
        this.instance = services.get<IDataProvider>(ServiceId.DataProvider).getData();
        this.rule = this.uiSchema.rule;
        services.get<IRuleService>(ServiceId.RuleService).addRuleTrack(this);
    }
}
