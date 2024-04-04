import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
    private _toastrService: ToastrService,
    private _router: Router,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('token')) {
      this._router.navigate(['/home']);
    }
  }

  login() {
    this._authService.loginUser(this.username, this.password).subscribe(
      (response) => {
        if (response && response.length > 0) {
          sessionStorage.setItem('token', JSON.stringify(response)); // Guardamos el token en sessionStorage para mantener nuestra sesión
          this._router.navigate(['/home']);
          this._toastrService.success('Inicio de sesión exitoso', 'Éxito');
        } else {
          this._toastrService.error('Credenciales inválidas', 'Error');
        }
      },
      (error) => {
        console.error('Error al iniciar sesión:', error);
        this._toastrService.error('Error al iniciar sesión', 'Error');
      }
    );
  }
}
