import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GistEditComponent } from './gist-edit.component';

describe('GistEditComponent', () => {
  let component: GistEditComponent;
  let fixture: ComponentFixture<GistEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GistEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GistEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
