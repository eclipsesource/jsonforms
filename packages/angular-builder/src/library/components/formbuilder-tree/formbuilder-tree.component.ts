import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'formbuilder-tree',
  imports: [CommonModule],
  templateUrl: './formbuilder-tree.component.html',
  styleUrl: './formbuilder-tree.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormbuilderTreeComponent {
  treeData = [
    {
      name: 'root',
      children: [
        {
          name: 'child1',
          children: [{ name: 'grandchild1' }, { name: 'grandchild2' }],
        },
        {
          name: 'child2',
          children: [{ name: 'grandchild3' }, { name: 'grandchild4' }],
        },
      ],
    },
  ];
}
