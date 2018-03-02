import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionLetterComponent } from './admission-letter.component';

describe('AdmissionLetterComponent', () => {
  let component: AdmissionLetterComponent;
  let fixture: ComponentFixture<AdmissionLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmissionLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
