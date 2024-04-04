import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/interfaces/product';
import { ProductsService } from 'src/app/core/services/products.service';
import { ProductManagementComponent } from '../product-management/product-management.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ViewProductComponent } from '../view-product/view-product.component';
import { Router } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isShowCart: boolean = false;
  totalPrice: number = 0;
  products: Product[] = [];
  productsCart: Product[] = [];

  constructor(
    private _productService: ProductsService,
    private _dialog: MatDialog,
    private _toastr: ToastrService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._productService.getProducts().subscribe((res) => {
      this.products = res;
    });
  }

  createProduct() {
    this._dialog.open(ProductManagementComponent, {
      maxWidth: '35vw',
      maxHeight: '45vw',
      width: '100%',
      height: '100%',
      panelClass: 'create-product-dialog',
    });
  }

  updateProduct(product: Product) {
    this._dialog.open(ProductManagementComponent, {
      maxWidth: '35vw',
      maxHeight: '45vw',
      width: '100%',
      height: '100%',
      panelClass: 'edit-product-dialog',
      data: {
        product: product,
        productId: product?.id,
      },
    });
  }

  deleteProduct(id: number) {
    if (id) {
      this._productService.deleteProduct(id).subscribe((res) => {
        this.ngOnInit();
        this._toastr.success('Producto eliminado con exito!');
      });
    } else {
      console.error('ID is undefined or null');
    }
  }

  viewProduct(product: Product) {
    this._dialog.open(ViewProductComponent, {
      maxWidth: '65vw',
      maxHeight: '45vw',
      width: '100%',
      height: '100%',
      panelClass: 'view-product-dialog',
      data: {
        product: product,
      },
    });
  }

  addCard(product: Product) {
    if (product) {
      const cartItem: Partial<Product> = {
        name: product.name,
        price: product.price,
        description: product.description,
        quantity: product.quantity,
      };

      this.productsCart.push(cartItem as Product);
      this.showCart();
      this.updateTotalPrice();
    }
  }

  showCart() {
    this.isShowCart = true;
  }

  hideCart() {
    this.isShowCart = false;
  }

  removeCartItem(index: number): void {
    this.productsCart.splice(index, 1);
    this.hideCart();
    this.updateTotalPrice();
  }

  private updateTotalPrice(): void {
    this.totalPrice = this.productsCart.reduce(
      (sum, item) => sum + item.price,
      0
    );
  }

  createNewCard() {
    this.hideCart();
  }

  logout() {
    sessionStorage.removeItem('token');
    this._router.navigate(['/']);
    this._toastr.success('Sesión cerrada correctamente', 'Éxito');
  }

  generatePdf() {
    const documentDefinition = {
      content: [
        { text: 'Factura', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'Nombre', style: 'tableHeader' },
                { text: 'Descripción', style: 'tableHeader' },
                { text: 'Cantidad', style: 'tableHeader' },
                { text: 'Precio', style: 'tableHeader' },
              ],
              ...this.productsCart.map((product) => [
                product.name,
                product.description,
                product.quantity,
                product.price,
              ]),
              [
                { text: 'Total a pagar', colSpan: 3, alignment: 'right' },
                '',
                '',
                this.totalPrice,
              ],
            ],
          },
        },
        {
          text: '© RiascosDEV.me All right reserved\nMade with ❤️ in Colombia',
          style: 'footer',
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        footer: {
          fontSize: 10,
          alignment: 'center',
          margin: [0, 30, 0, 0],
        },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }
}
