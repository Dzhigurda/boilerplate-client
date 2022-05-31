import { environment } from 'src/environments/environment';
import { ArticlePhoto, Photo, PhotoURLs } from './photo';

export type AlbumStatusType = 'CREATED' | 'FULLED';
export interface AlbumDAO {
  id: number;
  name: string;
  about: string;

  defaultPhotographer?: string;
  defaultPhotographerLink?: string;

  source?: string;
  sourceLink?: string;

  userId: number;
  status: AlbumStatusType;
  createAt: Date;
  banned: boolean;
}

export interface AlbumMetadata {
  name?: string;
  about?: string;

  defaultPhotographer?: string;
  defaultPhotographerLink?: string;

  source?: string;
  sourceLink?: string;
}

export interface AlbumCDO extends AlbumMetadata {
  userId: number;
}

export class Album {
  id!: number;
  name!: string;
  about!: string;

  defaultPhotographer?: string;
  defaultPhotographerLink?: string;

  source?: string;
  sourceLink?: string;

  userId!: number;

  banned = false;
  status: AlbumStatusType = 'CREATED';
  createAt: Date = new Date();

  photo: Photo[] = [];

  get cover() {
    return this.photo.length > 0
      ? this.getImageByType(this.photo[0].pathImage)
      : '/assets/default.hb.jpg';
  }
  constructor() {}

  static create(cdo: AlbumCDO) {
    return new Album().setOwner(cdo.userId).setMetadata(cdo);
  }

  setFull() {
    this.status = 'FULLED';
    return this;
  }

  setEmpty() {
    this.status = 'CREATED';
    return this;
  }

  isOwner(owner: number) {
    return this.userId === owner;
  }

  setOwner(userId: number) {
    this.userId = userId;
    return this;
  }

  setMetadata(meta: AlbumMetadata) {
    this.name = meta.name ?? '';
    this.about = meta.about ?? '';
    this.source = meta.source;
    this.sourceLink = meta.sourceLink;
    this.defaultPhotographer = meta.defaultPhotographer;
    this.defaultPhotographerLink = meta.defaultPhotographerLink;
    return this;
  }

  getId() {
    return this.id;
  }

  getOwner() {
    return this.userId;
  }

  isFulled() {
    return !this.isNotFulled();
  }

  isNotFulled() {
    return this.status === 'CREATED';
  }

  isBanned() {
    return this.banned;
  }

  isNotBanned() {
    return !this.isBanned();
  }

  ban() {
    this.banned = true;
    return this;
  }

  unban() {
    this.banned = false;
    return this;
  }

  resort(ids: number[]) {
    let nextPhoto = [];
    for (let id of ids) {
      const photo = this.photo.find((r) => r.id === id);
      if (!photo) continue;
      nextPhoto.push(photo);
    }
    this.photo = this.distPhoto(nextPhoto);
    return this;
  }

  private distPhoto(photo: Photo[]) {
    const distinctPhoto = [];
    const distinctPhotoId = new Set();
    for (let p of photo) {
      if (distinctPhotoId.has(p.id)) continue;
      distinctPhotoId.add(p.id);
      distinctPhoto.push(p);
    }
    return distinctPhoto;
  }
  updatePhoto(photo: Photo[]) {
    this.photo = this.distPhoto(photo);
    if (this.photo.length) this.status = 'FULLED';
    return this;
  }

  addPhoto(photo: Photo) {
    this.photo.push(photo);
    this.photo = this.distPhoto(this.photo);
    if (this.photo.length) this.status = 'FULLED';
    return this;
  }

  removePhoto(id: number) {
    this.photo = this.photo.filter((r) => r.id !== id);
    this.photo = this.distPhoto(this.photo);
    if (!this.photo.length) this.status = 'CREATED';
    return this;
  }

  restore(obj: (AlbumDAO & { photo?: Photo[] }) | Album) {
    this.id = obj.id;
    this.name = obj.name;
    this.about = obj.about;
    this.defaultPhotographer = obj.defaultPhotographer;
    this.defaultPhotographerLink = obj.defaultPhotographerLink;
    this.source = obj.source;
    this.sourceLink = obj.sourceLink;
    this.status = obj.status;
    this.userId = obj.userId;
    this.createAt = new Date(obj.createAt);
    this.banned = obj.banned;
    if (obj.photo) {
      this.photo = this.distPhoto(obj.photo);
    }
    return this;
  }

  toJSON(): AlbumDAO & { photo?: Photo[] } {
    return {
      id: this.id,
      name: this.name,
      about: this.about,
      defaultPhotographer: this.defaultPhotographer,
      defaultPhotographerLink: this.defaultPhotographerLink,
      source: this.source,
      sourceLink: this.sourceLink,
      userId: this.userId,
      status: this.status,
      createAt: this.createAt,
      banned: this.banned,
      photo: this.photo,
    };
  }

  toString() {
    return `${this.id} ${this.name}`;
  }

  valueOf() {
    return this.id;
  }

  private getImageByType(url: string) {
    return `${environment.API_URL}${url}`;
  }
}
