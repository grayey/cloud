import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExceptionsComponent } from './student-exceptions.component';

describe('StudentExceptionsComponent', () => {
  let component: StudentExceptionsComponent;
  let fixture: ComponentFixture<StudentExceptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentExceptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentExceptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
