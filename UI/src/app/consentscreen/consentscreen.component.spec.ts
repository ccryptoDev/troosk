import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentscreenComponent } from './consentscreen.component';

describe('ConsentscreenComponent', () => {
  let component: ConsentscreenComponent;
  let fixture: ComponentFixture<ConsentscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsentscreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
