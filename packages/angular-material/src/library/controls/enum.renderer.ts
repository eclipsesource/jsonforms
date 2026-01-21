/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import type { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import {
  Actions,
  composeWithUi,
  ControlElement,
  EnumOption,
  isEnumControl,
  isOneOfEnumControl,
  JsonFormsState,
  mapStateToEnumControlProps,
  mapStateToOneOfEnumControlProps,
  OwnPropsOfControl,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
  StatePropsOfControl,
} from '@jsonforms/core';
import type { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'OneOfEnumControlRenderer',
  templateUrl: './enum.renderer.html',
  styleUrls: ['./enum.renderer.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
})
export class OneOfEnumControlRenderer
  extends JsonFormsControl
  implements OnInit
{
  @Input() options?: EnumOption[];
  valuesToTranslatedOptions?: Map<string, EnumOption>;
  filteredOptions: Observable<EnumOption[]>;
  shouldFilter: boolean;
  focused = false;

  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
  }

  protected override mapToProps(
    state: JsonFormsState
  ): StatePropsOfControl & OwnPropsOfEnum {
    return mapStateToOneOfEnumControlProps(state, this.getOwnProps());
  }

  getEventValue = (event: any) => event.target.value;

  override onChange(ev: any) {
    const eventValue = this.getEventValue(ev);
    const option = Array.from(
      this.valuesToTranslatedOptions?.values() ?? []
    ).find((option) => option.label === eventValue);
    if (!option) {
      super.onChange(ev);
      return;
    }

    this.jsonFormsService.updateCore(
      Actions.update(this.propsPath, () => option.value)
    );
    this.triggerValidation();
  }

  ngOnInit() {
    super.ngOnInit();
    this.shouldFilter = false;
    this.filteredOptions = this.form.valueChanges.pipe(
      startWith(''),
      map((val) => this.filter(val))
    );
  }

  override mapAdditionalProps(_props: StatePropsOfControl & OwnPropsOfEnum) {
    this.valuesToTranslatedOptions = new Map(
      (_props.options ?? []).map((option) => [option.value, option])
    );
  }

  updateFilter(event: any) {
    // ENTER
    if (event.keyCode === 13) {
      this.shouldFilter = false;
    } else {
      this.shouldFilter = true;
    }
  }

  onSelect(ev: MatAutocompleteSelectedEvent) {
    const path = composeWithUi(this.uischema as ControlElement, this.path);
    this.shouldFilter = false;
    const option: EnumOption = ev.option.value;
    this.jsonFormsService.updateCore(Actions.update(path, () => option.value));
    this.triggerValidation();
  }

  // use arrow function to bind "this" reference
  displayFn = (option?: string | EnumOption): string => {
    if (!option) {
      return '';
    }

    if (typeof option === 'string') {
      if (!this.valuesToTranslatedOptions) {
        return option; // show raw value until translations are ready
      }

      // if no option matches, it is a manual input
      return this.valuesToTranslatedOptions.get(option)?.label ?? option;
    }

    return option?.label ?? '';
  };

  filter(val: string | EnumOption | undefined): EnumOption[] {
    const options = Array.from(this.valuesToTranslatedOptions?.values() || []);

    if (!val || !this.shouldFilter) {
      return options;
    }

    const label = typeof val === 'string' ? val : val.label;
    return options.filter((option) =>
      option.label.toLowerCase().startsWith(label.toLowerCase())
    );
  }
  protected getOwnProps(): OwnPropsOfControl & OwnPropsOfEnum {
    return {
      ...super.getOwnProps(),
      options: this.options,
    };
  }
}

export const oneOfEnumControlTester: RankedTester = rankWith(
  5,
  isOneOfEnumControl
);

@Component({
  selector: 'EnumControlRenderer, AutocompleteControlRenderer',
  templateUrl: './enum.renderer.html',
  styleUrls: ['./enum.renderer.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
})
export class EnumControlRenderer extends OneOfEnumControlRenderer {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('options')
  set stringOptions(strOptions: string[]) {
    this.options = strOptions.map((str) => {
      return {
        label: str,
        value: str,
      };
    });
  }

  protected override mapToProps(
    state: JsonFormsState
  ): StatePropsOfControl & OwnPropsOfEnum {
    return mapStateToEnumControlProps(state, this.getOwnProps());
  }
}

/**
 * For {@link AutocompleteControlRenderer} class name backwards compatibility
 */
export { EnumControlRenderer as AutocompleteControlRenderer };

export const enumControlTester: RankedTester = rankWith(2, isEnumControl);
