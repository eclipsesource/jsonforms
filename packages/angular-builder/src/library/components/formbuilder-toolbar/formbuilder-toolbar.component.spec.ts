import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormbuilderToolbarComponent } from './formbuilder-toolbar.component';

describe('NgFormbuilderToolbarComponent', () => {
  let component: FormbuilderToolbarComponent;
  let fixture: ComponentFixture<FormbuilderToolbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormbuilderToolbarComponent]
    });
    fixture = TestBed.createComponent(FormbuilderToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
