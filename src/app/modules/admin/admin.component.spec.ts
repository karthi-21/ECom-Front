import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminComponent } from './admin.component';
import { ToastrModule } from 'ngx-toastr';
import { ProductService } from 'src/app/providers/product.service';
import { Product } from 'src/app/models/product.model';
import { async, of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

const products: Product[] = [{
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
  },
  updateProduct(prod: Product) {
    return of({ status: true, product: prod });
  },
  addProduct(prod: Product) {
    return of({ status: true, product: prod });
  }
};

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let product: Product;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
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
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  it('should return products list', () => {
    fixture.detectChanges();
    expect(component.products.length).toBeGreaterThan(0);
  });

  it("should call delete method once", () => {
    const spy = spyOn(productServiceStub, 'deleteProduct').and.returnValue(of({ status: true, product: products[0] }));
    fixture.detectChanges();
    component.delete(products[0]._id);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should return true on deleting a product from service", () => {
    fixture.detectChanges();
    component.delete(products[0]._id);
    productServiceStub.deleteProduct().subscribe(res => {
      expect(res.status).toBeTruthy();
      expect(res.product).toEqual(products[0]);
    });
  });

  it('should call update() on click of update buttton', () => {
    fixture.detectChanges();
    let addButtonElement = fixture.debugElement.query(By.css('.update-btn'));
    expect(addButtonElement.nativeElement.textContent).toEqual('Update');
    addButtonElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.update).toHaveBeenCalled();
      expect(productServiceStub.updateProduct).toHaveBeenCalled();
    });
  });

  it("should update product and return status from service with updated objected", () => {
    fixture.detectChanges();
    component.update();
    productServiceStub.updateProduct(products[0]).subscribe(res => {
      expect(res.status).toBeTruthy();
      expect(res.product).toEqual(products[0]);
    });
  });

  it('should have add new product button', () => {
    fixture.detectChanges();
    let addButtonElement = fixture.debugElement.query(By.css('.add-new-product'));
    expect(addButtonElement.nativeElement.textContent).toEqual('+ Add New Product');
  });

  it('should call add() on click of add buttton', () => {
    fixture.detectChanges();
    let addButtonElement = fixture.debugElement.query(By.css('.add-btn'));
    expect(addButtonElement.nativeElement.textContent).toEqual('Add');
    addButtonElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(productServiceStub.addProduct).toHaveBeenCalled();
    });
  });

  it("should add a product to DB and return status with object from service", () => {
    fixture.detectChanges();
    component.add();
    productServiceStub.addProduct(products[0]).subscribe(res => {
      expect(res.status).toBeTruthy();
      expect(res.product).toEqual(products[0]);
      expect(component.products.length).toBeGreaterThanOrEqual(0);
    });
  });

  it('should call reset() on click of cancel button', () => {
    fixture.detectChanges();
    let cancelButtonElement = fixture.debugElement.query(By.css('.cancel-btn'));
    expect(cancelButtonElement.nativeElement.textContent).toEqual('Cancel');
    cancelButtonElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.reset).toHaveBeenCalled();
      expect(component.product.name).toEqual('');
    });
  });

  it('should has correct rows and columns', () => {
    fixture.detectChanges();
    const headRowDebugElements = fixture.debugElement.queryAll(By.css('thead tr'));
    expect(headRowDebugElements.length).toBe(1);

    const bodyRowHtmlElements = fixture.debugElement.nativeElement.querySelectorAll('tbody tr');
    expect(bodyRowHtmlElements.length).toBe(1);
  });

  it('should has correct columns', () => {
    fixture.detectChanges();

    const headRowHeadingDebugElements = fixture.debugElement.queryAll(By.css('thead tr th'));
    expect(headRowHeadingDebugElements.length).toBe(5);

    const bodyRowHeadingDebugElements = fixture.debugElement.queryAll(By.css('tbody tr td'));
    expect(bodyRowHeadingDebugElements.length).toBe(5);
  });
});

