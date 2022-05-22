import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category, CategoryLike } from './Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<CategoryLike[]>(`${environment.API_URL}/v1/category/`).pipe(this.initMapPipe())
  }
  
  getOne(id: number) {
    return this.http.get<CategoryLike>(`${environment.API_URL}/v1/category/${id}`).pipe(this.initPipe())
  }

  edit(id: number, name: string, about: string) {
    return this.http.patch<boolean>(`${environment.API_URL}/v1/category/${id}`, {
      name, about
    }) 
  }

  add( name: string, about: string) {
    return this.http.post<CategoryLike>(`${environment.API_URL}/v1/category/`, {
      name, about
    }).pipe(this.initPipe())
  }

  publish(id: number) {
    return this.http.patch<boolean>(`${environment.API_URL}/v1/category/${id}/publish`, {})
  }

  unpublish(id: number) {
    return this.http.patch<boolean>(`${environment.API_URL}/v1/category/${id}/unpublish`, {})
  }

  sort(order: number[]) {
    return this.http.patch<boolean>(`${environment.API_URL}/v1/category/sort`, order)
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.API_URL}/v1/category/${id}`, {})
  }

  private initPipe() {
    return map<CategoryLike, Category>(r => (new Category().restore(r)))
  }
  private initMapPipe() {
    return map<CategoryLike[], Category[]>(r => r.map(c => new Category().restore(c)));
  }
}
