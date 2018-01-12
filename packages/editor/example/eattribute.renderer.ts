// FIXME implement EAttribute renderer
// import {
//   and,
//   JsonFormsRenderer,
//   optionIs,
//   RankedTester,
//   rankWith,
//   uiTypeIs
// } from 'jsonforms';
// import { ETypeControl } from './etype.renderer';

// export const eAttributeRendererTester: RankedTester =
//   rankWith(
//     3,
//     and(
//       uiTypeIs('Control'),
//       optionIs('id', 'eAttribute')
//     )
//   );

// const standardDatatypes = [
//   'http://www.eclipse.org/emf/2002/Ecore#//EBoolean',
//   'http://www.eclipse.org/emf/2002/Ecore#//EDate',
//   'http://www.eclipse.org/emf/2002/Ecore#//EDouble',
//   'http://www.eclipse.org/emf/2002/Ecore#//EInt',
//   'http://www.eclipse.org/emf/2002/Ecore#//EString'
// ];

// @JsonFormsRenderer({
//   selector: 'jsonforms-eattribute-control',
//   tester: eAttributeRendererTester
// })
// class EAttributeControl extends ETypeControl {

//   protected getDefaultOptionLabel(): string {
//     return 'Select Datatype:';
//   }

//   protected addOptions(input) {
//     super.addOptions(input);
//     // add standard emf datatypes
//     standardDatatypes.forEach((datatype, index) => {
//       const option = document.createElement('option');
//       option.value = datatype;
//       option.label = datatype;
//       option.innerText = datatype;
//       input.appendChild(option);
//     });
//   }
// }
