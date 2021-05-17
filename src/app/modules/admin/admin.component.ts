import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../providers/product.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  product: Product = {
    name: '',
    price: '',
    discount: '',
    img: null
  };
  editProduct: Product = {
    name: '',
    price: '',
    discount: '',
    img: null
  };

  constructor(private service: ProductService, private toastr: ToastrService, private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.service.getAllProducts().subscribe(res => {
      this.products = res ? res : [];
    }, err => {
      this.toastr.error('Problem while getting data from DB', 'Error occured');
    }, () => {
      this.ngxService.stop();
    });
  }

  add() {
    this.service.addProduct(this.product).subscribe(res => {
      if (res && res.success) {
        this.products.push(res.product);
        this.reset();
        this.toastr.success(res.message);
      } else {
        this.toastr.error('Try again later', 'Error occured');
      }
    }, err => {
      this.toastr.error('Try again later', 'Error occured');
    });
  }

  edit(product: Product) {
    this.editProduct = Object.assign({}, product)
  }

  update() {
    this.service.updateProduct(this.editProduct).subscribe(res => {
      if (res && res.success) {
        const indx = this.products.findIndex(p => p._id === (this.editProduct as any)._id);
        this.products[indx] = this.editProduct;
        this.toastr.success(res.message, 'Updated');
      } else {
        this.toastr.error('Try again later', 'Error occured');
      }
    }, err => {
      this.toastr.error('Try again later', 'Error occured');
    });
  }

  delete(id: string) {
    this.service.deleteProduct(id).subscribe(res => {
      if (res && res.success) {
        const indx = this.products.findIndex(p => p._id === id);
        this.products.splice(indx, 1);
        this.toastr.success(res.message, 'Product Deleted!');
      } else {
        this.toastr.error('Try again later', 'Error occured');
      }
    }, err => {
      this.toastr.error('Try again later', 'Error occured');
    });
  }

  onChangeImg(event: any) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.product.img = reader.result;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
      me.toastr.error('Error: ' + error, 'Image upload Error!');
    };
  }

  onChangeEditImg(event: any) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.editProduct.img = reader.result;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
      me.toastr.error('Error: ' + error, 'Image upload Error!');
    };
  }

  reset() {
    this.product = {
      name: '',
      price: '',
      discount: '',
      img: null
    };
    (<HTMLInputElement>document.getElementById('uploadNewProduct')).value = "";
    this.editProduct = {
      name: '',
      price: '',
      discount: '',
      img: null
    };
    (<HTMLInputElement>document.getElementById('uploadForEditProduct')).value = "";
  }

}
