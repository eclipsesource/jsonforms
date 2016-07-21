import angular from 'angular';
import {AbstractControl} from '../../../../components/renderers/controls/abstract-control';
import './table-control.css';
import registerNewControl from '../extension';

class TableController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver'];

    constructor(scope, pathResolver){
        super(scope, pathResolver);
        const dataSchema = this.pathResolver.resolveSchema(this.schema, this.schemaPath);
        const data = this.pathResolver.resolveInstance(this.data, this.schemaPath);
        const uiSchema = this.uiSchema;
        this.selectedElement = null;
        this.properties = _.keys(dataSchema.items['properties']);
        this.itemsData = data;
        this.shownProperties = uiSchema.options.primaryItems;
        this.itemSchema = dataSchema.items;
    }

    moreInfo(element){
        this.selectedElement = element;
    }

    backToTable(){
        this.selectedElement = null;
    }
}

registerNewControl('table-control', TableController, require('./table-control.html'), function(element, dataSchema, dataObject, pathResolver){
    if (element.type !== 'Control') {
        return -1;
    }

    var schemaPath = element['scope']['$ref'];
    var currentDataSchema = pathResolver.resolveSchema(dataSchema, schemaPath);
    if (currentDataSchema === undefined || currentDataSchema.type !== 'array' || !currentDataSchema.items) {
        return -1;
    }
    return 200;
});