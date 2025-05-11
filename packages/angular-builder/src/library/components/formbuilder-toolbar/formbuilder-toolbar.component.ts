import { Component } from '@angular/core';
import { ToolCategory } from '../../interfaces/tools.interface';

@Component({
  selector: 'formbuilder-toolbar',
  templateUrl: './formbuilder-toolbar.component.html',
  styleUrls: ['./formbuilder-toolbar.component.scss'],
  host: {
    class: 'flex-column',
  },
})
export class FormbuilderToolbarComponent {
  toolCategories: ToolCategory[] = [
    {
      name: 'Control',
      category: 'control',
      tools: [
        {
          name: 'Text',
          icon: 'text_fields',
        },
        {
          name: 'Number',
          icon: 'looks_one',
        },
        {
          name: 'Email',
          icon: 'email',
        },
        {
          name: 'Password',
          icon: 'lock',
        },
        {
          name: 'Date',
          icon: 'calendar_today',
        },
        {
          name: 'Select',
          icon: 'arrow_drop_down',
        },
        {
          name: 'Checkbox',
          icon: 'check_box',
        },
        {
          name: 'Radio',
          icon: 'radio_button_checked',
        },
      ],
    },
    {
      name: 'Layout',
      category: 'layout',
      tools: [
        {
          name: 'Vertical',
          icon: 'vertical_distribute',
        },
        {
          name: 'Horizontal',
          icon: 'horizontal_distribute',
        },
        {
          name: 'Group',
          icon: 'web_asset',
        },
        {
          name: 'Tabs',
          icon: 'tab',
        },
      ],
    },
  ];
}
