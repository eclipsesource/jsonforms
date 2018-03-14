"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var renderer_1 = require("../../core/renderer");
var actions_1 = require("../../actions");
var Control = /** @class */ (function (_super) {
    __extends(Control, _super);
    function Control(props) {
        var _this = _super.call(this, props) || this;
        // tslint:disable:no-object-literal-type-assertion
        _this.state = {
            value: props.data ? props.data : ''
        };
        return _this;
    }
    Control.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (this.props.data !== prevProps.data) {
            this.setState({ value: this.props.data });
        }
    };
    Control.prototype.handleChange = function (value) {
        this.setState({ value: value });
        this.updateData(value);
    };
    Control.prototype.updateData = function (value) {
        this.props.dispatch(actions_1.update(this.props.path, function () { return value; }));
    };
    return Control;
}(renderer_1.Renderer));
exports.Control = Control;
//# sourceMappingURL=Control.js.map