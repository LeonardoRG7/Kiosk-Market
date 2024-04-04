import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/interfaces/product';
import { ProductsService } from 'src/app/core/services/products.service';
import { ProductManagementComponent } from '../product-management/product-management.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
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
    this.getProducts();
  }

  getProducts(): void {
    this._productService.getProducts().subscribe((res) => {
      this.products = res;

      this.products.forEach((product) => {
        if (product.quantity <= 10) {
          this._toastr.info(
            `La cantidad de ${product.name} es baja`,
            'Cantidad baja'
          );
        }
      });
    });
  }
  createProduct() {
    this._dialog.open(ProductManagementComponent, {
      maxWidth: '30vw',
      width: '100%',
      height: 'auto',
      panelClass: 'create-product-dialog',
      data: {
        isUpdate: false,
      },
    });
  }

  updateProduct(product: Product) {
    this._dialog.open(ProductManagementComponent, {
      maxWidth: '30vw',
      width: '100%',
      height: 'auto',
      panelClass: 'edit-product-dialog',
      data: {
        product: product,
        productId: product?.id,
        isUpdate: true,
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

  addCard(product: Product) {
    if (product) {
      // Buscar si el producto ya está en el carrito
      const existingProduct = this.productsCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        // Si el producto ya existe, actualizar la cantidad sumando 1
        existingProduct.quantity++;
      } else {
        // Si el producto no existe, añadirlo al carrito con cantidad 1
        const cartItem: Partial<Product> = {
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          quantity: 1,
        };
        this.productsCart.push(cartItem as Product);
      }

      this.showCart();
      this.updateTotalPrice();
    }
  }

  decrementQuantity(item: Product): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateTotalPrice();
    }
  }

  incrementQuantity(item: Product): void {
    item.quantity++;
    this.updateTotalPrice();
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

  updateTotalPrice(): void {
    this.totalPrice = this.productsCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
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
    // Actualiza el subtotal
    this.updateTotalPrice();

    const subtotal = this.totalPrice;
    const iva = subtotal * 0.19;
    const totalWithIVA = subtotal + iva;

    const documentDefinition = {
      content: [
        { text: 'Factura', style: 'header', margin: [0, 20, 0, 10] },
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
                { text: `$${product.price}`, alignment: 'right' },
              ]),
              [
                { text: 'Subtotal', colSpan: 3, alignment: 'right' },
                '',
                '',
                { text: `$${subtotal.toFixed(2)}`, alignment: 'right' },
              ],
              [
                { text: 'IVA (19%)', colSpan: 3, alignment: 'right' },
                '',
                '',
                { text: `$${iva.toFixed(2)}`, alignment: 'right' },
              ],
              [
                {
                  text: 'Total a pagar (IVA incluido)',
                  colSpan: 3,
                  alignment: 'right',
                },
                '',
                '',
                { text: `$${totalWithIVA.toFixed(2)}`, alignment: 'right' },
              ],
            ],
          },
          margin: [0, 20, 0, 0],
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
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }
}
