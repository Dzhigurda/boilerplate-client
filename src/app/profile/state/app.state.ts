import { ClientUser } from "src/app";
import { Album } from "../photo/services/album"; 
import { Photo } from "../photo/services/photo";

export interface AppState {
  albums: ReadonlyArray<Album>;
  photo: ReadonlyArray<Photo>;
  users: ReadonlyArray<ClientUser>;
}