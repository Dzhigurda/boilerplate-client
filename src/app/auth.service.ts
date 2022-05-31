import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserDAO } from '../../../server/src/domains/user/';

export interface AuthAndUserDAO {
  access: string;
  refresh: string;
  user: UserDAO;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  public logIn(
    login: string,
    password: string,
    saveRefresh: boolean = false,
    token?: string
  ) {
    return this.http
      .post<AuthAndUserDAO>(environment.API_URL + '/v1/user/login', {
        login,
        password,
        token,
      })
      .pipe(
        map((r) => this.saveJWTTokens(r, saveRefresh)),
        tap({
          next: () => {
            this.router.navigateByUrl('/profile');
          },
        })
      );
  }

  private context: any;
  public saveContext(login: string, password: string, keep: boolean = false) {
    this.context = {
      login,
      password,
      keep,
    };
  }

  getContext() {
    const ctx = this.context;
    this.context = null;
    return ctx;
  }
  public registration(
    login: string,
    password: string,
    saveRefresh: boolean = false
  ) {
    return this.http
      .post<AuthAndUserDAO>(environment.API_URL + '/v1/user/registration', {
        login,
        password,
      })
      .pipe(map((r) => this.saveJWTTokens(r, saveRefresh)));
  }
  public remind(login: string) {
    return this.http.post(environment.API_URL + '/v1/user/remind', {
      login,
    });
  }
  public changePassword(
    code: string,
    userId: string,
    password: string,
    saveRefresh: boolean = false
  ) {
    return this.http
      .patch<AuthAndUserDAO>(environment.API_URL + '/v1/user/remind/' + code, {
        password,
        userId,
      })
      .pipe(map((r) => this.saveJWTTokens(r, saveRefresh)));
  }

  private saveJWTTokens(r: AuthAndUserDAO, saveRefresh: boolean) {
    this.setJWT(r.access);
    if (saveRefresh) this.setRefreshJWT(r.refresh);
    return r;
  }
  public refreshToken(refresh: string) {
    if (!refresh) throw new Error('Нет токена');
    return this.http
      .post<AuthAndUserDAO>(environment.API_URL + '/v1/user/refresh', {
        refresh,
      })
      .pipe(map((r) => this.saveJWTTokens(r, true)));
  }

  public setJWT(access: string) {
    localStorage.setItem('access', access);
  }
  public getJWT() {
    return localStorage.getItem('access');
  }
  public hasJWT() {
    return 0 != (localStorage.getItem('access')?.length ?? 0);
  }

  public setRefreshJWT(access: string) {
    localStorage.setItem('refresh', access);
  }
  public getRefreshJWT() {
    return localStorage.getItem('refresh');
  }
  public hasRefreshJWT() {
    return 0 != (localStorage.getItem('refresh')?.length ?? 0);
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
    return of(true);
  }

  getLogin(id: number) {
    return this.http.get(environment.API_URL + `/v1/user/${id}/login`);
  }
  setPassword(password: string) {
    return this.http.patch<any>(environment.API_URL + `/v1/user/password`, {
      password,
    });
  }

  get2FAQRURL() {
    return this.http.get<{ id: number; qr: string }>(
      environment.API_URL + `/v1/user/2fa/qr`
    );
  }

  enable2FA(token: string) {
    return this.http.patch<boolean>(
      environment.API_URL + '/v1/user/2fa/enable',
      { token }
    );
  }
  disable2FA() {
    return this.http.patch<boolean>(
      environment.API_URL + '/v1/user/2fa/disable',
      {}
    );
  }

  getReserveCodes() {
    return this.http.get<string[]>(
      environment.API_URL + '/v1/user/2fa/restoreCodes'
    );
  }

  isEnable2FA(): Observable<boolean> {
    return this.http.get<boolean>(
      environment.API_URL + '/v1/user/2fa/chekcEnable'
    );
  }

  verifyAccount(code: string) {
    return this.http.post<boolean>(
      environment.API_URL + '/v1/user/verify/' + code,
      {}
    );
  }

  remove() {
    return this.http.delete<boolean>(
      `${environment.API_URL}/v1/user/remove`,
      {}
    );
  }
  delete() {
    return this.http.delete<boolean>(
      `${environment.API_URL}/v1/user/delete`,
      {}
    );
  }
  recover() {
    return this.http.post<boolean>(
      `${environment.API_URL}/v1/user/recover`,
      {}
    );
  }
}
