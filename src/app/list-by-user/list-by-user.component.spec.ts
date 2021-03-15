import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListByUserComponent } from './list-by-user.component';

describe('ListByUserComponent', () => {
  let component: ListByUserComponent;
  let fixture: ComponentFixture<ListByUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListByUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
