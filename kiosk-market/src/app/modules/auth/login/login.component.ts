import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private _toastrService: ToastrService) {}

  ngOnInit(): void {
    this._toastrService.success('Prrueba', 'prueba');
  }
}
