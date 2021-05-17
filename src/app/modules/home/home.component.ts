import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/providers/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

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

}
