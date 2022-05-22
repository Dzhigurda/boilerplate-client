import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Fee, TaskFee } from './Fee';

@Injectable({
  providedIn: 'root',
})
export class FeeService {
  constructor(private http: HttpClient) {}

  calculate(fee: Fee[]) {
    const result = {
      total: 0,
      canceled: 0,
      wait: 0,
      execute: 0,
    };
    for (let f of fee) {
      result.total += f.value;
      result.execute += f.status === 'PAID' ? f.value : 0;
      result.wait += f.status === 'CREATED' ? f.value : 0;
      result.canceled += f.status === 'CANCELED' ? f.value : 0;
    }
    return result;
  }

  getMe() {
    return this.http
      .get<Fee[]>(`${environment.API_URL}/v1/fee/me`)
      .pipe(this.decorate());
  }

  getAll() {
    return this.http
      .get<Fee[]>(`${environment.API_URL}/v1/fee/`)
      .pipe(this.decorate());
  }

  getByUserId(userId: number) {
    return this.http
      .get<Fee[]>(`${environment.API_URL}/v1/fee/author/${userId}`)
      .pipe(this.decorate());
  }

  pay(taskId: number, account: string, executeComment: string) {
    return this.http.patch<boolean>(
      `${environment.API_URL}/v1/fee/${taskId}/execute`,
      {
        comment: executeComment,
        account,
      }
    );
  }

  cancel(taskId: number, executeComment: string) {
    return this.http.patch<boolean>(
      `${environment.API_URL}/v1/fee/${taskId}/cancel`,
      {
        comment: executeComment,
      }
    );
  }

  getOne(id: number) {
    return this.http
      .get<Fee>(`${environment}/v1/fee/${id}`)
      .pipe(this.decorateOne());
  }

  private decorate() {
    return map<Fee[], TaskFee[]>((res) => {
      return res.map((fee) => new TaskFee().restore(fee));
    });
  }

  private decorateOne() {
    return map<Fee, TaskFee>((fee) => {
      return new TaskFee().restore(fee);
    });
  }
}
