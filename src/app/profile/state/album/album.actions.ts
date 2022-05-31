import { createAction, props } from '@ngrx/store'; 
import { Album, AlbumMetadata } from '../../photo/services/album'; 
import { Photo } from '../../photo/services/photo';

export const addAlbum = createAction(
  '[Album List] Add Album',
  props<{ album: Album }>()
);
export const editAlbum = createAction(
  '[Album List] Edit Album',
  props<{  albumId: number , meta: AlbumMetadata}>()
);
export const banAlbum = createAction(
  '[Album List] Ban Album',
  props<{ albumId: number  }>()
);
export const unbanAlbum = createAction(
  '[Album List] Unban Album',
  props<{  albumId: number  }>()
);

export const removeAlbum = createAction(
  '[Album Collection] Remove Album',
  props<{ albumId: number }>()
);

export const retrievedAlbumList = createAction(
  '[Album List/API] Retrieve Albums Success',
  props<{ albums: Album[] }>()
);
 
export const resortPhotoInAlbum = createAction(
  '[Album Collection] Resort photo in album',
  props<{ albumId: number, ids: number[] }>()
);

export const addPhotoInAlbum = createAction(
  '[Album Collection] Add photo in album',
  props<{ albumId: number, photo: Photo }>()
);

export const removePhotoInAlbum = createAction(
  '[Album Collection] Remove photo in album',
  props<{ albumId: number, photoId: number }>()
);

export const updateAllPhotoInAlbum = createAction(
  '[Album Collection] Update photo in album',
  props<{ albumId: number, photo: Photo[] }>()
);
