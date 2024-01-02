import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionByOsComponent } from './session-by-os.component';

describe('SessionByOsComponent', () => {
  let component: SessionByOsComponent;
  let fixture: ComponentFixture<SessionByOsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionByOsComponent]
    });
    fixture = TestBed.createComponent(SessionByOsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
