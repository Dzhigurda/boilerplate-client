import { createFeatureSelector } from '@ngrx/store'; 
import { ClientUser } from 'src/app'; 

export const selectUser = createFeatureSelector<ReadonlyArray<ClientUser>>('users');