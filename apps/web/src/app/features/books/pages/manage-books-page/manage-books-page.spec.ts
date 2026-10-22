import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageBooksPage } from './manage-books-page';

describe('ManageBooksPage', () => {
  let component: ManageBooksPage;
  let fixture: ComponentFixture<ManageBooksPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageBooksPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageBooksPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
