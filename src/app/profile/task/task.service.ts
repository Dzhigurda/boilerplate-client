import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FakeMMTask, TaskPresenter } from './Task';

@Injectable({
  providedIn: 'root',
})
export class TaskService { 
  constructor(
    private http: HttpClient, 
  ) {}

  getConfig() {
    return {
      defaultDuration: new Date(+new Date() + 1000 * 60 * 60 * 24 * 14),
      defaultFee: 150,
    };
  }
  //#region request

  getAll() {
    return this.http.get<FakeMMTask[]>(environment.API_URL + `/v1/task/`).pipe(
      map((r) => {
        return r.map((ref) => TaskPresenter.create(ref));
      })
    );
  }
  getOne(id: number) {
    return this.http
      .get<FakeMMTask>(environment.API_URL + `/v1/task/${id}`)
      .pipe(
        map((r) => {
          return TaskPresenter.create(r);
        })
      );
  }
  getByAuthor(id: number) {
    return this.http
      .get<FakeMMTask[]>(environment.API_URL + `/v1/task/author/${id}`)
      .pipe(
        map((r) => {
          return r.map((ref) => TaskPresenter.create(ref));
        })
      );
  }
  getByEditor(id: number) {
    return this.http
      .get<FakeMMTask[]>(environment.API_URL + `/v1/task/editor/${id}`)
      .pipe(
        map((r) => {
          return r.map((ref) => TaskPresenter.create(ref));
        })
      );
  }
  getByArticle(id: number) {
    return this.http
      .get<FakeMMTask>(environment.API_URL + `/v1/task/article/${id}`)
      .pipe(
        map((r) => {
          return TaskPresenter.create(r);
        })
      );
  }
  //#endregion
  //#region EDIT
  create() {
    return this.http
      .post<FakeMMTask>(environment.API_URL + `/v1/task/`, {})
      .pipe(
        map((r) => {
          return TaskPresenter.create(r);
        })
      );
  }

  editDescription(
    id: number,
    taskDescription: { title: string; description: string }
  ) {
    return this.http
      .patch<FakeMMTask>(
        `${environment.API_URL}/v1/task/${id}`,
        taskDescription
      )
      .pipe(
        map((r) => {
          return TaskPresenter.create(r);
        })
      );
  }
  setDateEnd(id: number, date: Date) {
    return this.http
      .patch<FakeMMTask>(`${environment.API_URL}/v1/task/${id}/set/dateEnd`, {
        dateEnd: date,
      })
      .pipe(
        map((r) => {
          return TaskPresenter.create(r);
        })
      );
  }
  setFee(id: number, fee: number) {
    return this.http
      .patch<FakeMMTask>(`${environment.API_URL}/v1/task/${id}/set/fee`, {
        fee,
      })
      .pipe(
        map((r) => {
          return TaskPresenter.create(r);
        })
      );
  }
  setAuthor(id: number, author: number) {
    return this.http
      .patch<FakeMMTask>(`${environment.API_URL}/v1/task/${id}/set/author`, {
        author,
      })
      .pipe(
        map((r) => {
          return TaskPresenter.create(r);
        })
      );
  }
  setEditor(id: number, editor: number) {
    return this.http
      .patch<FakeMMTask>(`${environment.API_URL}/v1/task/${id}/set/editor`, {
        editor,
      })
      .pipe(
        map((r) => {
          return TaskPresenter.create(r);
        })
      );
  }
  //#endregion
  //#region Command

  private sendSimpleCommand(name: string, id: number) {
    return this.http
      .patch<FakeMMTask>(`${environment.API_URL}/v1/task/${id}/${name}`, {})
      .pipe(
        map((r) => {
          return TaskPresenter.create(r);
        })
      );
  }
  publish(id: number) {
    return this.sendSimpleCommand('publish', id);
  }
  unpublish(id: number) {
    return this.sendSimpleCommand('unpublish', id);
  }
  distribute(id: number) {
    return this.sendSimpleCommand('distribute', id);
  }
  refuse(id: number) {
    return this.sendSimpleCommand('refuse', id);
  }
  sendToResolve(id: number) {
    return this.sendSimpleCommand('sendToResolve', id);
  }
  revision(id: number) {
    return this.sendSimpleCommand('revision', id);
  }
  reject(id: number) {
    return this.sendSimpleCommand('reject', id);
  }
  resolve(id: number) {
    return this.sendSimpleCommand('resolve', id);
  }
  cancel(id: number) {
    return this.sendSimpleCommand('cancel', id);
  }
  archive(id: number) {
    return this.sendSimpleCommand('archive', id);
  }
  //#endregion
}
