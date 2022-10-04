import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanStagesDetailsComponent } from './loan-stages-details.component';

describe('LoanStagesDetailsComponent', () => {
  let component: LoanStagesDetailsComponent;
  let fixture: ComponentFixture<LoanStagesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanStagesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanStagesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
