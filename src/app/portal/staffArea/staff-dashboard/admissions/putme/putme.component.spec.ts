import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PutmeComponent } from './putme.component';

describe('PutmeComponent', () => {
  let component: PutmeComponent;
  let fixture: ComponentFixture<PutmeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PutmeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PutmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
