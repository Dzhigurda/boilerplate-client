import { Article, ArticleHistory, ArticleStatus } from '.';

export class BaseArticle { 
  id?: number;
  title!: string;
  description!: string;
  text!: string;
  keywords!: string;
  squareImage?: string;
  horizontalLargeImage?: string;
  horizontalSmallImage?: string;
  verticalLargeImage?: string;
  verticalSmallImage?: string;
  extraLargeImage?: string | undefined;
  category!: number;
  author?: number;
  editor!: number;
  task?: number | undefined;
  source!: string;
  nick!: string;
  photographer!: string;
  status: ArticleStatus = 'CREATED';

  getId() {
    return this.id!;
  }

  getAuthor() {
    return this.author;
  }
  setAuthor(author?: number) {
    if (this.isPublished()) throw new Error('Не позволено');
    this.author = author;
  }
  getEditor() {
    return this.editor;
  }
  setEditor(editor: number) {
    if (this.isPublished()) throw new Error('Не позволено');
    this.editor = editor;
  }
  getCategory() {
    return this.category;
  }
  setCategory(category: number) {
    this.category = category;
  }
  getStatus() {
    return this.status;
  }

  getTask() {
    return this.task;
  }
  setTask(task?: number) {
    if (task === this.task) return;
    if (this.status != 'CREATED') throw new Error('Не позволено');
    this.task = task;
  }

  setNick(nick: string) {
    if (this.nick === nick) return;
    if (this.status != 'CREATED') throw new Error('Не позволено');
    this.nick = nick;
  }

  setSource(source: string) {
    if (this.source == source) return;
    if (this.isPublished()) throw new Error('Не позволено');
    this.source = source;
  }
  setPhotographer(photographer: string) {
    if (this.photographer == photographer) return;
    this.photographer = photographer;
  }
  setKey(keywords: string) {
    if (this.keywords == keywords) return;
    this.keywords = keywords;
  }
  setText(text: string) {
    if (this.text == text) return;
    this.text = text;
  }
  setDescription(description: string) {
    if (this.description == description) return;
    this.description = description;
  }
  setTitle(title: string) {
    if (this.title.length > 200)
      throw new Error('Не позволено, длина больше 200 символов');
    if (this.title == title) return;
    this.title = title;
  }

  isPublished() {
    return this.status === 'PUBLISHED';
  }

  createHistory(userId: number, comment?: string): ArticleHistory {
    return {
      date: +new Date(),
      article: this.id!,
      user: userId,
      status: this.status,
      comment: comment ?? '',
    };
  }
  publish(editor: number) {
    if (this.status === 'PUBLISHED') throw new Error('Не позволено');
    if (!this.author) throw new Error('Нельзя публиковать статью без автора');
    this.status = 'PUBLISHED';
    return this.createHistory(editor);
  }

  unpublish(editor: number) {
    if (this.status === 'CREATED') throw new Error('Не позволено');
    this.status = 'CREATED';
    return this.createHistory(editor);
  }

  archive(editor: number) {
    if (this.status === 'ARCHIVED') throw new Error('Не позволено');
    this.status = 'ARCHIVED';
    return this.createHistory(editor);
  }

  unarchive(editor: number) {
    if (this.status !== 'ARCHIVED') throw new Error('Не позволено');
    this.status = 'PUBLISHED';
    return this.createHistory(editor);
  }

  setImages(sq: string, hl: string, hs: string, vl: string, vs: string) {
    this.squareImage = sq;
    this.horizontalLargeImage = hl;
    this.horizontalSmallImage = hs;
    this.verticalLargeImage = vl;
    this.verticalSmallImage = vs;
  }

  setCover(el?: string) {
    this.extraLargeImage = el;
  }

  removeCover() {
    this.extraLargeImage = undefined;
  }

  restore(obj: Article) {
    this.id = obj.id;
    this.title = obj.title;
    this.description = obj.description;
    this.text = obj.text;
    this.keywords = obj.keywords;
    this.squareImage = obj.squareImage;
    this.horizontalLargeImage = obj.horizontalLargeImage;
    this.horizontalSmallImage = obj.horizontalSmallImage;
    this.verticalLargeImage = obj.verticalLargeImage;
    this.verticalSmallImage = obj.verticalSmallImage;
    this.extraLargeImage = obj.extraLargeImage;
    this.category = obj.category;
    this.author = obj.author;
    this.editor = obj.editor;
    this.task = obj.task;
    this.source = obj.source;
    this.nick = obj.nick;
    this.photographer = obj.photographer;
    this.status = obj.status;
    return this;
  }

  toJSON(): Article {
    return {
      id: this.id!,
      title: this.title,
      description: this.description,
      text: this.text,
      keywords: this.keywords,
      squareImage: this.squareImage,
      horizontalLargeImage: this.horizontalLargeImage,
      horizontalSmallImage: this.horizontalSmallImage,
      verticalLargeImage: this.verticalLargeImage,
      verticalSmallImage: this.verticalSmallImage,
      extraLargeImage: this.extraLargeImage,
      category: this.category,
      author: this.author!,
      editor: this.editor,
      task: this.task,
      source: this.source,
      nick: this.nick,
      photographer: this.photographer,
      status: this.status,
    };
  }

  getTextForm(): { [key: string]: any; } {
    return {
        id: this.id,

        title: this.title,
        description:  this.description,
        text: this.text,
        keywords: this.keywords,

        source: this.source,
        photographer: this.photographer,
        nick: this.nick,

    }
  }
}
