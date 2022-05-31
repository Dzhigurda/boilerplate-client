export type CategoryStatus = 'CREATED' | 'PUBLISH';
export interface CategoryLike {
  id: number;
  name: string;
  about: string;
  orderIndex: number;
  status: CategoryStatus;
}

export interface CategoryAbout {
  name: string;
  about: string;
}

export class Category {
  id!: number;
  name: string = '';
  about: string = '';
  orderIndex: number = 0;
  status: CategoryStatus = 'CREATED';

  getId() {
    return this.id;
  }
  //#region command

  edit(name: string, about: string) {
    this.name = name;
    this.about = about;
  }

  isPublish() {
    return this.status === "PUBLISH";
  }
  publish() {
    if (!this.name) throw new Error('Нельзя опубликовать');
    if (!this.about) throw new Error('Нельзя опубликовать');
    this.status = 'PUBLISH';
  }

  unpublish() {
    this.status = 'CREATED';
  }

  setOrder(index: number) {
    this.orderIndex = index;
  }

  //#endregion

  restore(cat: CategoryLike) {
    this.id = cat.id;
    this.name = cat.name;
    this.about = cat.about;
    this.orderIndex = cat.orderIndex;
    this.status = cat.status;
    return this;
  }

  toString() {
    return this.name;
  }

  valueOf() {
    return this.id;
  }

  toJSON(): CategoryLike {
    return {
      id: this.id,
      name: this.name,
      about: this.about,
      status: this.status,
      orderIndex: this.orderIndex,
    };
  }
}
