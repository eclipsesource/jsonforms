import { EnumControl, enumControlTester } from '../src/renderers/controls/enum.control';
import { and, rankWith, schemaMatches, uiTypeIs } from '../src/core/testers';
import { registerStartupRenderer } from '../src/renderers/renderer.util';
import { connect } from 'inferno-redux';
import { mapStateToControlProps } from '../src/renderers/controls/base.control';
declare let $;

const materializedEnumControlTester = rankWith(3, and(
  uiTypeIs('Control'),
  schemaMatches(schema => schema.hasOwnProperty('enum'))
));

export class MaterializedEnumControl extends EnumControl {

  componentDidMount() {
    $('select').material_select();
  }

  componentDidUpdate() {
    $('select').material_select();
  }
}

export default registerStartupRenderer(
  materializedEnumControlTester,
  connect(mapStateToControlProps)(MaterializedEnumControl)
);
