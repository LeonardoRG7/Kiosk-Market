import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private _http: HttpClient) {}

  loginUser(user: string, password: string) {
    return this._http.get<any>(
      `${this.apiUrl}/login?user=${user}&password=${password}`
    );
  }
}
