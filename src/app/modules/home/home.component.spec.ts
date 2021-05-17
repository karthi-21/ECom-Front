import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ProductService } from 'src/app/providers/product.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from 'src/app/common/product-card/product-card.component';

const products = [{
  name: 'SAMSUNG Fusion (16GB)',
  price: '24999',
  discount: '19',
  img: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQfBE96Xuu65DQ177d3DrUtz3OmYRB9pkDgPEmq1Dm13YJORa1RTRfFIlKvmHLrmC9s31yl2sBfme6giSHzpKznUftGWMnNR-PNNObF8hc&usqp=CAc',
  _id: '603432459303'
}];

const productServiceStub = {
  getAllProducts() {
    return of( products );
  },
  deleteProduct() {
    return of({ status: true, product: products[0] });
  }
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent, ProductCardComponent ],
      imports: [
        CommonModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()
      ],
      providers: [
        {
          provide: ProductService,
          useValue: productServiceStub
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have products', () => {
    fixture.detectChanges();
    expect(component.products.length).toBeGreaterThanOrEqual(0);
  });

  it('should call and get products on init', () => {
    const spy = spyOn(productServiceStub, 'getAllProducts').and.returnValue(of(products));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.products.length).toBeGreaterThan(0);
    expect(spy).toHaveBeenCalled();
  });
});
