import { createReducer, on } from '@ngrx/store';

import { ClientUser } from "src/app";
import { sortIdAsc } from '../sort';
import { addUser, editUser, retrievedUserList } from "./user.action";

export const initialState: ClientUser[] = []; 
export const userReducer = createReducer(
  initialState,
  on(retrievedUserList, (state, { users }) => users),
  on(addUser, (state, { user }) => {
    if (~state.indexOf(user)) return state;
    return [user, ...state].sort((a, b) => a.id - b.id);
  }),
  on(editUser, (state, { userId, meta }) => {
    const index = state.findIndex((r) => r.id === userId);
    if (!~index) return state;
    const user = Object.assign(state[index], meta);
    return [...state.filter((r) => r.id !== userId), user].sort(sortIdAsc);
  })
);
