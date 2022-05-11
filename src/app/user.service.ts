import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientUser } from '.';
import { User, UserSettingDTO } from '../../../server/src/domains/user';
@Injectable({
  providedIn: 'root',
})
export class UserService { 
  
  constructor(private http: HttpClient) {}

  getMe() {
    return this.http.get<User>(environment.API_URL + '/v1/user/me').pipe(
      map((r: any) => {
        return new ClientUser().restore(r);
      })
    );
  }

  saveSetting(userId: number, dto: UserSettingDTO) {
    return this.http
      .patch<User>(environment.API_URL + '/v1/user/' + userId, dto)
      .pipe(
        map((r: any) => {
          return new ClientUser().restore(r);
        })
      );
  }

  getAll() {
    return this.http.get<ClientUser[]>(environment.API_URL + '/v1/user/').pipe(
      map((r: any[]) => {
        return r.map((u) => new ClientUser().restore(u));
      })
    );
  }
}
