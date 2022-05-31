import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Album, AlbumDAO, AlbumMetadata } from './album';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  constructor(private http: HttpClient) {}

  //#region Request

  getOne(albumId: number) {
    return this.http
      .get<AlbumDAO>(`${environment.API_URL}/v1/album/${albumId}`)
      .pipe(map((dto) => new Album().restore(dto)));
  }

  getAll() {
    return this.http
      .get<AlbumDAO[]>(`${environment.API_URL}/v1/album/`)
      .pipe(map((dto) => dto.map((r) => new Album().restore(r))));
  }

  getByAuthor(userId: number) {
    return this.http
      .get<AlbumDAO[]>(`${environment.API_URL}/v1/album/author/${userId}`)
      .pipe(map((dto) => dto.map((r) => new Album().restore(r))));
  }

  getMyAlbums() {
    return this.http
      .get<AlbumDAO[]>(`${environment.API_URL}/v1/album/iam`)
      .pipe(map((dto) => dto.map((r) => new Album().restore(r))));
  }
  //#endregion
  //#region Command

  add(meta: AlbumMetadata) {
    return this.http
      .post<AlbumDAO>(`${environment.API_URL}/v1/album/`, meta)
      .pipe(map((dto) => new Album().restore(dto)));
  }

  edit(id: number, meta: AlbumMetadata) {
    return this.http
      .patch<AlbumDAO>(`${environment.API_URL}/v1/album/${id}`, meta)
      .pipe(map((dto) => new Album().restore(dto)));
  }

  upload(id: number, file: any) {
    const fd = new FormData();
    fd.append('image', file);
    return this.http
      .post<AlbumDAO>(`${environment.API_URL}/v1/album/${id}`, fd)
      .pipe(map((dto) => new Album().restore(dto)));
  }

  ban(id: number) {
    return this.http
      .patch<AlbumDAO>(`${environment.API_URL}/v1/album/${id}/ban`, {})
      .pipe(map((dto) => new Album().restore(dto)));
  }

  unban(id: number) {
    return this.http
      .patch<AlbumDAO>(`${environment.API_URL}/v1/album/${id}/unban`, {})
      .pipe(map((dto) => new Album().restore(dto)));
  }

  resort(id: number, photoIds: number[]) {
    return this.http.patch<boolean>(
      `${environment.API_URL}/v1/album/${id}/sort`,
      photoIds
    );
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${environment.API_URL}/v1/album/${id}`);
  }

  //#endregion
}
