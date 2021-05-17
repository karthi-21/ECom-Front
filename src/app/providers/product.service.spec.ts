import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';
import { HttpParams, HttpResponse } from '@angular/common/http';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;
  let product: Product;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.get(HttpTestingController);
    product = {
      name: 'SAMSUNG Fusion (16GB)',
      price: '24999',
      discount: '19',
      img: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQfBE96Xuu65DQ177d3DrUtz3OmYRB9pkDgPEmq1Dm13YJORa1RTRfFIlKvmHLrmC9s31yl2sBfme6giSHzpKznUftGWMnNR-PNNObF8hc&usqp=CAc',
      _id: '603432459303'
    };
    service = TestBed.inject(ProductService);
  });

  afterEach(() => {
    httpTestingController.verify(); //Verifies that no requests are outstanding.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should return data", () => {
    let result: Product[];
    service.getAllProducts().subscribe(t => {
      result = t;
      expect(result[0]).toEqual(product);
    });

    const req = httpTestingController.expectOne({
      method: "GET",
      url: environment.baseUrl + environment.restUrl + 'product/products'
    });
    req.flush([product]);
  });

  it('should have getAllProducts function', () => {
    expect(service.getAllProducts).toBeTruthy();
   });

   it('should have addProduct function', () => {
    expect(service.addProduct).toBeTruthy();
   });

   it('should add product and return new object on success with status', () => {
    service.addProduct(product).subscribe(data => {
        expect(data.product).toEqual(product, 'should return the employee');
        expect(data.status).toBeTruthy();
      },
      fail
    );
    const req = httpTestingController.expectOne(environment.baseUrl + environment.restUrl + 'product/create');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(product);

    req.flush({
        status: true,
        product
      });
   });

   it('should have updateProduct function', () => {
    expect(service.updateProduct).toBeTruthy();
   });

   it('should have update Product and return updated product object', () => {
    service.updateProduct(product).subscribe(t => {
      expect(t.status).toBeTruthy();
      expect(t.product).toEqual(product, 'should return the employee');
    });
    const req = httpTestingController.expectOne(environment.baseUrl + environment.restUrl + 'product/update?productID=' + product._id);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(product);

    req.flush({
      status: true,
      product
    });
   });

   it('should have deleteProduct function', () => {
    expect(service.deleteProduct).toBeTruthy();
   });

   it('should delete product and return status', () => {
    service.deleteProduct(product._id).subscribe(t => {
      expect(t.status).toBeTruthy();
      expect(t.product).toEqual(product, 'should return the employee');
    });
    const req = httpTestingController.expectOne(environment.baseUrl + environment.restUrl + 'product/delete?productID=' + product._id);
    expect(req.request.method).toEqual('DELETE');

    req.flush({
      status: true,
      product
    });
   });
});
