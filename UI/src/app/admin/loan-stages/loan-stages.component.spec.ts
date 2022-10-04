import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanStagesComponent } from './loan-stages.component';

describe('LoanStagesComponent', () => {
  let component: LoanStagesComponent;
  let fixture: ComponentFixture<LoanStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanStagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
