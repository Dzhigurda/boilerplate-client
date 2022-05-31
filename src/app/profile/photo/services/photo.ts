import { environment } from "src/environments/environment";

export interface MetaDescriptionsPhoto {
  name?: string;
  about?: string;

  photographer?: string;
  photographerLink?: string;

  source?: string;
  sourceLink?: string;
}
export interface ArticlePhoto extends MetaDescriptionsPhoto {
  id: number;
  url?: string;

  orderIndex?: number;
  albumId?: number;
  userId?: number;
  createAt?: number;
  status?: PhotoStatusType;

  colorBanned?: string;
}

export type PhotoStatusType = 'PENDING_CREATE' | 'CREATED' | 'BANNED';

export interface PhotoURLs {
  pathTumbanian: string;
  pathImage: string;
  pathOriginal: string;
}

type prefixType = 'sq' | 'el';

export class Photo implements ArticlePhoto, PhotoURLs {
 

  id!: number;
  url?: string;
  orderIndex?: number;
  albumId?: number;
  userId?: number;
  createAt?: number;
  status?: PhotoStatusType;
  colorBanned?: string;
  name?: string;
  about?: string;
  photographer?: string;
  photographerLink?: string;
  source?: string;
  sourceLink?: string;
  pathTumbanian!: string;
  pathImage!: string;
  pathOriginal!: string;

  ban() {
    this.status = 'BANNED';
    this.colorBanned = 'var(--tui-error-fill)';
    return this;
  }

  unban() {
    this.status = "CREATED";
    this.colorBanned = '';
    return this;
  }

  getSquierImage() {
    return this.getImageByType(this.id, 'sq');
  }

  getCoverImage() {
    return this.getImageByType(this.id, 'el');
  }

  private getImageByType(id: number, type: prefixType) {
    return `${environment.API_URL}/images/photo/normal/${id}.${type}.png`;
  }

  setMeta(meta: MetaDescriptionsPhoto) {
    this.name = meta.name;
    this.about = meta.about;
    this.photographer = meta.photographer;
    this.photographerLink = meta.photographerLink;
    this.source = meta.source;
    this.sourceLink = meta.sourceLink;
    return this;
 }

  restore(obj: ArticlePhoto & PhotoURLs) {
    this.id = obj.id;
    this.url = obj.url;
    this.orderIndex = obj.orderIndex;
    this.albumId = obj.albumId;
    this.userId = obj.userId;
    this.createAt = obj.createAt;
    this.status = obj.status;
    this.colorBanned = obj.status === "BANNED" ? 'var(--tui-error-fill)' : '';
    this.name = obj.name;
    this.about = obj.about;
    this.photographer = obj.photographer;
    this.photographerLink = obj.photographerLink;
    this.source = obj.source;
    this.sourceLink = obj.sourceLink;
    this.pathTumbanian = obj.pathTumbanian;
    this.pathImage = obj.pathImage;
    this.pathOriginal = obj.pathOriginal;
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      url: this.url,
      orderIndex: this.orderIndex,
      albumId: this.albumId,
      userId: this.userId,
      createAt: this.createAt,
      status: this.status,
      colorBanned: this.colorBanned,
      name: this.name,
      about: this.about,
      photographer: this.photographer,
      photographerLink: this.photographerLink,
      source: this.source,
      sourceLink: this.sourceLink,
      pathTumbanian: this.pathTumbanian,
      pathImage: this.pathImage,
      pathOriginal: this.pathOriginal,
    }
  }
}
