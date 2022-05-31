import { createSelector, createFeatureSelector } from '@ngrx/store';   
import { Photo } from '../../photo/services/photo';
import { selectUser } from '../user/user.selectors';

export const selectPhoto = createFeatureSelector<ReadonlyArray<Photo>>('photo');

export const selectPhotoByAuthor = createSelector(selectPhoto, selectUser, (s1, s2) => {
  const userId = s2[0]?.id ?? undefined;
  return s1.filter(r => r.userId === userId);
});
 
export const selectPhotoByAuthorAndNotAlbum = createSelector(selectPhotoByAuthor, (s1) => {
  return s1.filter(r => !r.albumId);
});