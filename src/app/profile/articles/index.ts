export type ArticleStatus = 'CREATED' | 'PUBLISHED' | 'ARCHIVED';
export interface Article {
  id: number;

  title: string;
  description: string;

  text: string;
  keywords: string;

  squareImage?: string;
  horizontalLargeImage?: string;
  horizontalSmallImage?: string;
  verticalLargeImage?: string;
  verticalSmallImage?: string;
  extraLargeImage?: string;

  category: number;
  author: number;
  editor: number;

  task?: number;

  source: string;
  nick: string;
  photographer: string;

  status: ArticleStatus;
}

export interface History {
  id?: number;
  date: number;
  user: number;
  status: string;
  comment: string;
}

export interface ArticleHistory extends History {
  article: number;
}

export interface ImageReposnce {
  originalPath: string;
  sq: string;
  hl: string;
  hs: string;
  vl: string;
  vs: string;
}

export interface CoverResponce {
  el: string;
}
