import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GistListComponent } from './gist-list.component';

describe('GistListComponent', () => {
  let component: GistListComponent;
  let fixture: ComponentFixture<GistListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GistListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GistListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
