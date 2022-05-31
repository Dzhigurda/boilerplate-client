import { createAction, props } from '@ngrx/store'; 
import { MetaDescriptionsPhoto, Photo } from '../../photo/services/photo'; 

export const addPhoto = createAction(
  '[Photo List] Add Photo',
  props<{ photo: Photo }>()
);
export const editPhoto = createAction(
  '[Photo List] Edit Photo',
  props<{ photoId: number; meta: MetaDescriptionsPhoto }>()
);
export const banPhoto = createAction(
  '[Photo List] Ban Photo',
  props<{ photoId: number }>()
);
export const unbanPhoto = createAction(
  '[Photo List] Unban Photo',
  props<{ photoId: number }>()
);

export const removePhoto = createAction(
  '[Photo Collection] Remove Photo',
  props<{ photoId: number }>()
);

export const retrievedPhotoList = createAction(
  '[Photo List/API] Retrieve Photo Success',
  props<{ photos: Photo[] }>()
);
