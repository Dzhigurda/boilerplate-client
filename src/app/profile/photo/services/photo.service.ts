import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment'; 
import { MetaDescriptionsPhoto, Photo } from './photo';
 
@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor(private http: HttpClient) {}

  upload(file: any) {
    const fd = new FormData();
    fd.append('image', file);
    return this.http
      .post<Photo>(`${environment.API_URL}/v1/photo/`, fd)
      .pipe(map((photo) => new Photo().restore(photo)));
  }
  getAll() {
    return this.http
      .get<Photo[]>(`${environment.API_URL}/v1/photo/`)
      .pipe(map((photos) => photos.map((photo) => new Photo().restore(photo))));
  }

  getOne(id: any) {
    return this.http
      .get<Photo>(`${environment.API_URL}/v1/photo/${id}`)
      .pipe(map((photo) => new Photo().restore(photo)));
  }
  getByAuthor(id: any) {
    return this.http
      .get<Photo[]>(`${environment.API_URL}/v1/photo/author/${id}`)
      .pipe(map((photos) => photos.map((photo) => new Photo().restore(photo))));
  }
  getByAlbum(id: any) {
    return this.http
      .get<Photo[]>(`${environment.API_URL}/v1/photo/album/${id}`)
      .pipe(map((photos) => photos.map((photo) => new Photo().restore(photo))));
  }

  ban(id: number) {
    return this.http.patch<boolean>(
      `${environment.API_URL}/v1/photo/${id}/ban`,
      {}
    );
  }
  unban(id: number) {
    return this.http.patch<boolean>(
      `${environment.API_URL}/v1/photo/${id}/unban`,
      {}
    );
  }
  delete(id: number) {
    return this.http.delete<boolean>(
      `${environment.API_URL}/v1/album/photo/${id}`
    );
  }

  save(id: number, meta: MetaDescriptionsPhoto) {
    return this.http.patch<boolean>(
      `${environment.API_URL}/v1/photo/${id}`,
      meta
    );
  }

  putToAlbum(id: number, photo: { id: number }): any {
    return this.http.patch<boolean>(
      `${environment.API_URL}/v1/photo/${photo.id}/toalbum`,
      { albumId: id }
    );
  }
 
}
