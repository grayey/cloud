import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JambRecordComponent } from './jamb-record.component';

describe('JambRecordComponent', () => {
  let component: JambRecordComponent;
  let fixture: ComponentFixture<JambRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JambRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JambRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
