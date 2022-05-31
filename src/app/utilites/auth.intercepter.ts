import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';

import { Router } from '@angular/router';

import { Subject, Observable, empty, of, EmptyError, EMPTY, NEVER } from 'rxjs';
import {
  catchError,
  map,
  onErrorResumeNext,
  switchMap,
  tap,
} from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  refreshTokenInProgress = false;

  tokenRefreshedSource = new Subject<void>();
  tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

  constructor(private router: Router, private authService: AuthService) {}

  addAuthHeader(request: any, method: any) {
    let access = this.authService.getJWT();

    if (access && method == 0) {
      request = request.clone({
        setHeaders: { Authorization: `Barer ${access}` },
      });
    }

    return request;
  }

  refreshToken() {
    let refresh = this.authService.getRefreshJWT();
    if (!refresh) return this.logout();
    if (this.refreshTokenInProgress) {
      return new Observable((observer) => {
        this.tokenRefreshed$.subscribe(() => {
          observer.next();
          observer.complete();
        });
      });
    }
    this.refreshTokenInProgress = true;
    return this.authService.refreshToken(refresh).pipe(
      tap(() => {
        this.refreshTokenInProgress = false;
        this.tokenRefreshedSource.next();
      })
    );
  }

  logout() {
    this.authService.logout();
    return EMPTY;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = this.addAuthHeader(request, 0);
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            return this.refreshToken()
              .pipe(
                switchMap(() => {
                  request = this.addAuthHeader(request, 0);
                  return next.handle(request);
                })
              )
          } else if (error.status === 402) {
            return this.logout();
          } else {
            // NOT
          }
        }
        throw error;
      }),
      switchMap((event: HttpEvent<any>, index) => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            return of(event);
          } else if (event.status === 401) {
            return this.refreshToken().pipe(
              switchMap(() => {
                request = this.addAuthHeader(request, 0);
                return next.handle(request);
              })
            );
          } else if (event.status === 402) {
            return this.logout();
          } else {
            of(event);
          }
        }
        return of(event);
      })
    );
  }
}
