import { createReducer, on } from '@ngrx/store';

import {
  addPhoto,
  banPhoto,
  editPhoto,
  removePhoto,
  retrievedPhotoList,
  unbanPhoto,
} from './photo.actions'; 
import { sortIdDesc } from '../sort';
import { Photo } from '../../photo/services/photo';

export const initialState: Photo[] = [];
export const photoReducer = createReducer(
  initialState,
  on(retrievedPhotoList, (state, { photos }) =>
    Array.from(photos).sort(sortIdDesc)
  ),
  on(addPhoto, (state, { photo }) => {
    if (~state.findIndex(p => p.id === photo.id)) return state;
    return [photo, ...state].sort(sortIdDesc);
  }),
  on(removePhoto, (state, { photoId }) => {
    return state.filter((r) => r.id !== photoId).sort(sortIdDesc);
  }),
  on(editPhoto, (state, { photoId, meta }) => {
    const index = state.findIndex((r) => r.id === photoId);
    if (!~index) return state;
    const photo = new Photo().restore(state[index]).setMeta(meta);
    return [...state.filter((r) => r.id !== photoId), photo].sort(sortIdDesc);
  }),
  on(banPhoto, (state, { photoId }) => {
    const index = state.findIndex((r) => r.id === photoId);
    if (!~index) return state;
    const photo = new Photo().restore(state[index]).ban();
    return [...state.filter((r) => r.id !== photoId), photo].sort(sortIdDesc);
  }),
  on(unbanPhoto, (state, { photoId }) => {
    const index = state.findIndex((r) => r.id === photoId);
    if (!~index) return state;
    const photo = new Photo().restore(state[index]).unban();
    return [...state.filter((r) => r.id !== photoId), photo].sort(sortIdDesc);
  })
);
