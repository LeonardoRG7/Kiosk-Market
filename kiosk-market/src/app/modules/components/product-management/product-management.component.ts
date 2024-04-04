import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
})
export class ProductManagementComponent implements OnInit {
  previewImg: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  captureFile(event: any) {
    const file = event.target.files[0];
    this.extractBase64(file).then((image: any) => {
      this.previewImg = image.base;
      console.log(image);
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
