import { createReducer, on } from '@ngrx/store';
import { Album } from '../../photo/services/album';
import { Photo } from '../../photo/services/photo';
import { sortIdDesc } from '../sort';

import {
  addAlbum,
  addPhotoInAlbum,
  banAlbum,
  editAlbum,
  removeAlbum,
  removePhotoInAlbum,
  resortPhotoInAlbum,
  retrievedAlbumList,
  unbanAlbum,
  updateAllPhotoInAlbum,
} from './album.actions';

 
export const initialState: Album[] = []; 
export const albumsReducer = createReducer(
  initialState,
  on(retrievedAlbumList, (state, { albums }) => [...albums].sort(sortIdDesc)),
  on(addAlbum, (state, { album }) => {
    if (~state.findIndex(a => a.id == album.id)) return state;
    return [album, ...state].sort(sortIdDesc);
  }),
  on(removeAlbum, (state, { albumId }) => {
    return state.filter((r) => r.id !== albumId);
  }),
  on(editAlbum, (state, { albumId, meta }) => {
    const albumIndex = state.findIndex((r) => r.id === albumId);
    if (!~albumIndex) return state;
    const album = new Album().restore(state[albumIndex])?.setMetadata(meta);
    return [...state.filter((r) => r.id !== albumId), album].sort(sortIdDesc);
  }),
  on(banAlbum, (state, { albumId }) => {
    const albumIndex = state.findIndex((r) => r.id === albumId);
    if (!~albumIndex) return state;
    const album = new Album().restore(state[albumIndex])?.ban();
    return [...state.filter((r) => r.id !== albumId), album].sort(sortIdDesc);
  }),
  on(unbanAlbum, (state, { albumId }) => {
    const albumIndex = state.findIndex((r) => r.id === albumId);
    if (!~albumIndex) return state;
    const album = new Album().restore(state[albumIndex])?.unban();
    return [...state.filter((r) => r.id !== albumId), album].sort(sortIdDesc);
  }),
  on(resortPhotoInAlbum, (state, { albumId, ids }) => {
    const albumIndex = state.findIndex((r) => r.id === albumId);
    if (!~albumIndex) return state;
    const album = new Album().restore(state[albumIndex])?.resort(ids);
    return [...state.filter((r) => r.id !== albumId), album].sort(sortIdDesc);
  }),
  on(addPhotoInAlbum, (state, { albumId, photo }) => {
    const albumIndex = state.findIndex((r) => r.id === albumId);
    if (!~albumIndex) return state;
    const album = new Album().restore(state[albumIndex])?.addPhoto(photo);
    return [...state.filter((r) => r.id !== albumId), album].sort(sortIdDesc);
  }),
  on(removePhotoInAlbum, (state, { albumId, photoId }) => {
    const albumIndex = state.findIndex((r) => r.id === albumId);
    if (!~albumIndex) return state;
    const album = new Album().restore(state[albumIndex])?.removePhoto(photoId);
    return [...state.filter((r) => r.id !== albumId), album].sort(sortIdDesc);
  }),
  on(updateAllPhotoInAlbum, (state, { albumId, photo }) => {
    const albumIndex = state.findIndex((r) => r.id === albumId);
    if (!~albumIndex) return state;
 
    const album = new Album().restore(state[albumIndex])?.updatePhoto(photo);
    return [...state.filter((r) => r.id !== albumId), album].sort(sortIdDesc);
  })
);
