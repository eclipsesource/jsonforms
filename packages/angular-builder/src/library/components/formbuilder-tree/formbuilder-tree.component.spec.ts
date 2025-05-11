import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormbuilderTreeComponent } from './formbuilder-tree.component';

describe('NgFormbuilderTreeComponent', () => {
  let component: FormbuilderTreeComponent;
  let fixture: ComponentFixture<FormbuilderTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormbuilderTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormbuilderTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
