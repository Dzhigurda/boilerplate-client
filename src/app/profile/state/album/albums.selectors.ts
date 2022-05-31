import { createFeatureSelector } from '@ngrx/store';
import { Album } from '../../photo/services/album';

export const selectAlbums = createFeatureSelector<ReadonlyArray<Album>>('albums');
