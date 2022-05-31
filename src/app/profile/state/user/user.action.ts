import { createAction, props } from '@ngrx/store';  
import { ClientUser } from 'src/app';
 
 
export const addUser = createAction(
  '[User List] Add User',
  props<{ user: ClientUser }>()
);
export const editUser = createAction(
  '[User List] Edit User',
  props<{  userId: number , meta: ClientUser}>()
);  

export const retrievedUserList = createAction(
  '[User List/API] Retrieve User Success',
  props<{ users: ClientUser[] }>()
);
     
