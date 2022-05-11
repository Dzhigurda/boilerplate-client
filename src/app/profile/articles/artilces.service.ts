import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Article, ArticleStatus, CoverResponce, ImageReposnce } from '.';
import { BaseArticle } from './Article';
type prefixType = 'sq' | 'hl' | 'hs' | 'vl' | 'vs' | 'el';
export class ArtilceTumbanian {
  id!: number;
  title!: string;
  image!: string;
  imageSq!: string;
  createdAt!: Date;
  status!: ArticleStatus;

  createDif!: number;

  restore(article: any) {
    this.id = article.id;
    this.title = article.title;
    this.image = article.image ? environment.API_URL + "/" + article.image : "/assets/default.vs.png";
    this.imageSq = article.imageSq ? environment.API_URL + "/" + article.imageSq : "/assets/default.sq.png";
    this.status = article.status;
    this.createdAt = new Date(article.createdAt);
    this.createDif = +new Date() - article.createdAt;
    return this;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ArtilcesService {
  constructor(private http: HttpClient) {}

  getAllTumbanian() {
    return this.http
      .get<Article[]>(`${environment.API_URL}/v1/articles/tumbanian`)
      .pipe(this.restoreArtilceTumbanianEntityArray());
  }
  getAll() {
    return this.http
      .get<Article[]>(`${environment.API_URL}/v1/articles/`)
      .pipe(this.restoreBaseArticleEntityArray());
  }
  getOne(id: number) {
    return this.http
      .get<Article>(`${environment.API_URL}/v1/articles/${id}`)
      .pipe(this.restoreBaseArticleEntity());
  }

  getByAuthor(authorId: number) {
    return this.http
      .get<Article[]>(`${environment.API_URL}/v1/articles/author/${authorId}`)
      .pipe(this.restoreBaseArticleEntityArray());
  }
  getByEditor(editorId: number) {
    return this.http
      .get<Article[]>(`${environment.API_URL}/v1/articles/editor/${editorId}`)
      .pipe(this.restoreBaseArticleEntityArray());
  }
  getByTask(taskId: number) {
    return this.http
      .get<Article>(`${environment.API_URL}/v1/articles/task/${taskId}`)
      .pipe(this.restoreBaseArticleEntity());
  }
  getByCategory(categoryId: number) {
    return this.http
      .get<Article[]>(`${environment.API_URL}/v1/articles/task/${categoryId}`)
      .pipe(this.restoreBaseArticleEntityArray());
  }

  create(article: any) {
    return this.http
      .post<Article>(`${environment.API_URL}/v1/articles/`, article)
      .pipe(this.restoreBaseArticleEntity());
  }
  save(article: any) {
    return this.http
      .patch<Article>(
        `${environment.API_URL}/v1/articles/${article.id}`,
        article
      )
      .pipe(this.restoreBaseArticleEntity());
  }
  uploadImage(id: number, file: any) {
    const fd = new FormData();
    fd.append('image', file);
    return this.http.post<ImageReposnce>(
      `${environment.API_URL}/v1/articles/${id}`,
      fd
    );
  }
  uploadCover(id: number, file: any) {
    const fd = new FormData();
    fd.append('cover', file);
    return this.http.post<CoverResponce>(
      `${environment.API_URL}/v1/articles/${id}`,
      fd
    );
  }

  restore(id: number) {
    return this.http
      .patch<Article>(`${environment.API_URL}/v1/articles/${id}/restore`, {})
      .pipe(this.restoreBaseArticleEntity());
  }
  publish(id: number) {
    return this.http
      .patch<Article>(`${environment.API_URL}/v1/articles/${id}/publish`, {})
      .pipe(this.restoreBaseArticleEntity());
  }

  unpublish(id: number) {
    return this.http
      .patch<Article>(`${environment.API_URL}/v1/articles/${id}/unpublish`, {})
      .pipe(this.restoreBaseArticleEntity());
  }
  archive(id: number) {
    return this.http
      .patch<Article>(`${environment.API_URL}/v1/articles/${id}/archive`, {})
      .pipe(this.restoreBaseArticleEntity());
  }

  attachTask(id: number, taskId: number) {
    return this.http.patch(`${environment.API_URL}/v1/articles/${id}/task`, {
      taskId,
    });
  }

  detachTask(id: number) {
    return this.http.delete(`${environment.API_URL}/v1/articles/${id}/task`);
  }

  private restoreArtilceTumbanianEntityArray() {
    return map((r: Article[]) => {
      return r.map((a) => new ArtilceTumbanian().restore(a));
    });
  }
  private restoreBaseArticleEntityArray() {
    return map((r: Article[]) => {
      return r.map((a) => new BaseArticle().restore(a));
    });
  }
  private restoreBaseArticleEntity() {
    return map((r: Article) => {
      return new BaseArticle().restore(r);
    });
  }

  getSquierImage(id: number) {
    return this.getImageByType(id, 'sq');
  }
  getHorizontalLargeImage(id: number) {
    return this.getImageByType(id, 'hl');
  }
  getHorizontalSmallImage(id: number) {
    return this.getImageByType(id, 'hs');
  }
  getVerticalLargeImage(id: number) {
    return this.getImageByType(id, 'vl');
  }
  getVerticalSmallImage(id: number) {
    return this.getImageByType(id, 'vs');
  }
  getCoverImage(id: number) {
    return this.getImageByType(id, 'el');
  }

  private getImageByType(id: number, type: prefixType) {
    return `${environment.API_URL}/images/normal/${id}.${type}.png`;
  }
}
