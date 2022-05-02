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
import { map, onErrorResumeNext, switchMap, tap } from 'rxjs/operators';
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
    if (!refresh) {
      this.authService.logout();
      return EMPTY;
    }
    if (this.refreshTokenInProgress) {
      return new Observable((observer) => {
        this.tokenRefreshed$.subscribe(() => {
          observer.next();
          observer.complete();
        });
      });
    } else {
      this.refreshTokenInProgress = true;
      return this.authService.refreshToken(refresh).pipe(
        tap(() => {
          this.refreshTokenInProgress = false;
          this.tokenRefreshedSource.next();
        })
      );
    }
  }

  logout() {
    this.authService.logout();
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(request, next);
    request = this.addAuthHeader(request, 0);
    return next.handle(request).pipe(
      tap({
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.refreshToken()
                .pipe(
                  switchMap(() => {
                    request = this.addAuthHeader(request, 0);
                    return next.handle(request);
                  })
                )
                .subscribe();
            } else if (err.status === 402) {
              this.authService.logout();
            } else {
              // NOT
            }
          }
        },
      }),
      switchMap((event: HttpEvent<any>, index) => {
        console.log(index, event);
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
            this.authService.logout();
            return EMPTY;
          } else {
            of(event);
          }
        }
        return of(event);
      })
    );
  }
}
