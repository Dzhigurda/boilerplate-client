import { Injectable } from '@angular/core';

export class ArtilceTumbanian {
  id!: number;
  title!: string;
  image!: string;
  imageSq!: string;

  restore(article: any) {
    this.id = article.id;
    this.title = article.title;
    this.image = article.image;
    this.imageSq = article.imageSq
    return this;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ArtilcesService {
  private items = [
    {
      id: 1,
      image:
        'https://fake-mm.ru//system/imagebvs/905198504/normal/photo750230074_1640097457.jpg', 
        imageSq:
        'https://fake-mm.ru//system/imagemvs/905198504/normal/photo750230074_1640097457.jpg',
      title:
        'Новая группа из Беларуси выпустила свой первый клип с режиссером Мальбэк и Сюзанны, Доры и Loc Doc',
    },
    {
      id: 2,
      image:
        'https://fake-mm.ru//system/imagebvs/905198532/normal/photo750230507_1648226627.jpg',
        imageSq:
        'https://fake-mm.ru//system/imagemvs/905198532/normal/photo750230507_1648226627.jpg',
      title: 'Художник-дизайнер Max13: Искусство для меня – это моя жизнь',
    },
    {
      id: 3,
      image:
        'https://fake-mm.ru//system/imagebvs/905198525/normal/photo750230074_1643638681.jpg',
        imageSq:
        'https://fake-mm.ru//system/imagemvs/905198525/normal/photo750230074_1643638681.jpg',
        title: 'Новый клип MADFORS — честный разговор о принятии себя',
    },
    {
      id: 4,
      image:
        'https://fake-mm.ru//system/imagebvs/905198483/normal/photo750230494_1636110520.jpg',
        imageSq:
        'https://fake-mm.ru//system/imagemvs/905198483/normal/photo750230494_1636110520.jpg',
      title: 'ТОП 5 женщин-режиссёров',
    },
    {
      id: 5,
      image:
        'https://fake-mm.ru//system/imagebvs/905198500/normal/photo750230494_1639209355.jpg',
        imageSq:
        'https://fake-mm.ru//system/imagemvs/905198500/normal/photo750230494_1639209355.jpg',
      title: 'Кого любят и ненавидят в Ривердейле',
    },
    {
      id: 6,
      image:
        'https://fake-mm.ru//system/imagebvs/905198523/normal/photo750230670_1643211671.jpg',
        imageSq:
        'https://fake-mm.ru//system/imagemvs/905198523/normal/photo750230670_1643211671.jpg',
      title: 'Киберпанк. Нуар. Сеул',
    },
  ].map((r) => new ArtilceTumbanian().restore(r));
  constructor() {}

  getAllForTask() {
    return this.items;
  }
}
