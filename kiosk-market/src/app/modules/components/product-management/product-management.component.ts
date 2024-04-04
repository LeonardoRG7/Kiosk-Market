import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/core/interfaces/product';
import { ProductsService } from 'src/app/core/services/products.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
})
export class ProductManagementComponent implements OnInit {
  previewImg: string = '';
  productForm: FormGroup;
  productId: number | null;
  nameTitle: string = 'Crear un nuevo producto';

  constructor(
    private sanitizer: DomSanitizer,
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    private _productsService: ProductsService,
    private _router: Router,
    public dialogRef: MatDialogRef<ProductManagementComponent>,
    @Inject(MAT_DIALOG_DATA)
    public product: {
      product: Product;
      productId: number | null;
      isUpdate: Boolean;
    }
  ) {
    this.productForm = this._fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      quantity: ['', Validators.required],
      image: [''],
    });

    this.productId = this.product ? this.product.productId : null;
  }

  ngOnInit(): void {
    console.log(this.product.isUpdate);
    this.isUpdate();
  }

  createProduct() {
    const PRODUCT: Product = {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      description: this.productForm.get('description')?.value,
      quantity: this.productForm.get('quantity')?.value,
      image: this.previewImg,
    };

    if (this.productId) {
      this._productsService.updateProduct(this.productId, PRODUCT).subscribe(
        (data) => {
          this._router.navigate(['/home']);
          this.closeModal();
          this._toastr.info('Producto actualizado!', 'Correctamente!');
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      if (!this.productForm.invalid) {
        this._productsService.createProduct(PRODUCT).subscribe(
          (data) => {
            this._router.navigate(['/home']);
            this.closeModal();
            this._toastr.success('Producto creado!', 'Correctamente');
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        this._toastr.error('Error en formulario');
      }
    }
  }

  isUpdate() {
    if (this.productId !== null) {
      this.nameTitle = 'Editar Producto';

      const product = this.product.product;

      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        description: product.description,
        quantity: product.quantity,
      });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  captureFile(event: any) {
    const file = event.target.files[0];
    this.extractBase64(file).then((image: any) => {
      this.previewImg = image.base;
    });
  }

  extractBase64 = async ($event: any) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      return await new Promise((resolve) => {
        reader.onload = () => {
          resolve({
            base: reader.result,
          });
        };
        reader.onerror = (error) => {
          resolve({
            blob: $event,
            image,
            base: null,
          });
        };
      });
    } catch (error) {
      return null;
    }
  };
}
