import { EventEmitter } from '@angular/core';
import { ClientUser } from 'src/app'; 
import { ArtilceTumbanian } from '../articles/artilces.service';
import { HistoryPresenter, History } from './History';

export class ClientUserTumbanian {
  id!: number;
  firstName!: string;
  lastName!: string;
  roleName!: string;

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
  restore(user: ClientUser, roleName: string) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.roleName = roleName;
    return this;
  }
}

export type TaskStatus =
  | 'CREATED'
  | 'PUBLISHED'
  | 'DISTRIBUTED'
  | 'PENDING_RESOLVE'
  | 'REJECTED'
  | 'FINISHED'
  | 'CANCELED'
  | 'ENDED'
  | 'ARCHIVED';

export interface FakeMMTask {
  id: number;

  title: string;
  description: string;
  status?: TaskStatus;

  editor?: number;
  dateEnd?: Date;
  fee?: number;
  author?: number;
  article?: number;
  editorRef?: any;
  authorRef?: any;
  articleRef?: any;

  history: History[];
}

export class TaskPresenter { 
  private _id?: number;
  private _title!: string;
  private _description!: string;
  private _status: TaskStatus = 'CREATED';
  private _fee = 0;
  private _dateEnd?: Date;

  private author?: number;
  private article?: number;
  private editor?: number;

  // Only presenter
  private _art?: ArtilceTumbanian;
  private _authorRef?: ClientUserTumbanian;
  private _editorRef?: ClientUserTumbanian;

  changeHistory = new EventEmitter();
  get id() {
    return this._id;
  }
  get title() {
    return this._title;
  }

  get authorId() {
    return this.author;
  }

  get editorId() {
    return this.editor;
  }

  get articleId() {
    return this.article;
  }

  set title(value: string) {
    if (this._title == value) return;
    if (this.status != 'CREATED') throw new Error('Не позволено');
    this._title = value;
  }

  get description() {
    return this._description;
  }
  set description(value: string) {
    if (this._description == value) return;
    if (this.status != 'CREATED') throw new Error('Не позволено');
    this._description = value;
  }

  get status() {
    return this._status;
  }

  get dateEnd(): Date | undefined {
    return this._dateEnd;
  }

  set dateEnd(value: Date | undefined) {
    if (this._dateEnd?.valueOf() == value?.valueOf()) return;
    if (!value) throw new Error('Дата не валидна');
    if (value < new Date())
      throw new Error('Нельзя ставить дату сдачи меньше текущей');
    if (['ENDED', 'FINISHED', 'ARCHIVED', 'CANCELED'].includes(this.status))
      throw new Error(
        'Дату разрешено менять только на активном участке исполнения задания'
      );
    this._dateEnd = value;
  }

  get fee() {
    return this._fee;
  }

  set fee(value: number) {
    if (this._fee == value) return;
    if (this.status != 'CREATED') throw new Error('Не позволено');
    this._fee = value;
  }

  get art() {
    return this._art;
  }
 

  get authorRef() {
    return this._authorRef;
  }

  get editorRef() {
    return this._editorRef;
  }

  get image() {
    if (this.art) return this.art.image;
    return `https://fake-mm.ru/system/imagemhs/1069603861/normal/8824_r_7.webp`;
  }

  get statusClass() {
    return TaskPresenter.getStatusClass(this.status);
  }

  static getStatusClass(status: TaskStatus) {
    switch (status) {
      case 'CREATED':
        return 'primary';
      case 'PUBLISHED':
        return 'warning';
      case 'DISTRIBUTED':
        return 'success';
      case 'PENDING_RESOLVE':
        return 'warning';
      case 'REJECTED':
        return 'error';
      case 'FINISHED':
        return 'success';
      case 'ENDED':
        return 'primary';
      case 'ARCHIVED':
        return 'default';
      case 'CANCELED':
        return 'error';
      default:
        return 'custom';
    }
  }


  isFinished() {
    return ['CANCELED', 'ARCHIVED', 'ENDED', 'FINISHED' ].includes(this.status);
  }
  get history() {
    return this._history;
  }
  private _history: HistoryPresenter[] = [];

  appendHisotry(userName: string) {
    // this._history.push(new HistoryPresenter.pr{
    //   date: new Date(),
    //   name: userName,
    //   status: this.status,
    //   statusClass: this.statusClass,
    // });
    // this.changeHistory.emit();
  }

  setArticle(art?: ArtilceTumbanian) {
    if (this.article === art?.id) return;
    if (['ENDED', 'FINISHED', 'ARCHIVED', 'CANCELED'].includes(this.status))
      throw new Error('Нельзя заменять статью после одобрения');
    if (art) {
      this._art = art;
      this.article = art.id;
    } else {
      this._art = undefined;
      this.article = undefined;
    }
  }
  removeArticle() {
    this.setArticle();
  }

  setAuthor(user?: ClientUserTumbanian) {
    if (this.author === user?.id) return;
    if (!['CREATED', 'PUBLISHED'].includes(this.status))
      throw new Error('Нельзя заменять Автора после одобрения');
    if (user) {
      this._authorRef = user;
      this.author = user.id;
    } else {
      this.clearAuthor();
    }
  }

  private clearAuthor() {
    this._authorRef = undefined;
    this.author = undefined;
  }

  isBelongAuthor(user: ClientUser) {
    return this.author === user.id;
  }
  setEditor(user?: ClientUserTumbanian) {
    if (this.editor === user?.id) return;
    if (this.status !== 'CREATED' && !user)
      throw new Error('Нельзя у активного задания убирать автора');
    if (user) {
      this._editorRef = user;
      this.editor = user.id;
    } else {
      this._editorRef = undefined;
      this.editor = undefined;
    }
  }
  isBelongEditor(user: ClientUser) {
    return this.editor === user.id;
  }

  update(ref: TaskPresenter) {
    this.restore(ref.toJSON())
  }
  private restore(ref: FakeMMTask) {
    this._id = ref.id;
    this._title = ref.title ?? '';
    this._description = ref.description ?? '';
    this._fee = ref.fee ?? 0;
    if (ref.dateEnd) this._dateEnd = new Date(ref.dateEnd);
    this._status = ref.status ?? 'CREATED';

    this.author = ref.author;
    this.article = ref.article;
    this.editor = ref.editor;
    if (this.editor) {
      this._editorRef = new ClientUserTumbanian().restore(
        ref.editorRef,
        ref.editorRef.roleName
      );
    }

    if (this.author) {
      this._authorRef = new ClientUserTumbanian().restore(
        ref.authorRef,
        ref.authorRef.roleName
      );
    }
    if(this.article) {
      this._art = (ref.articleRef instanceof ArtilceTumbanian) ? ref.articleRef : new ArtilceTumbanian().restore(ref.articleRef)
    }
    this._history = ref.history.map((h) => {
      let name = h.user === ref.editor ?  this._editorRef?.getFullName() : undefined;
          name = !name && h.user === ref.author ?  this._authorRef?.getFullName() : name;
      
      return new HistoryPresenter().restore(h,name ?? "Неизвестно")
    });
    return this;
  }

  toJSON(): FakeMMTask {
    return {
      id: this._id!,
      title: this._title,
      description: this._description,
      status: this._status,
      fee: this._fee,
      dateEnd: this._dateEnd,
      author: this.author,
      authorRef: this.authorRef,
      article: this.article,
      articleRef: this._art,
      editor: this.editor,
      editorRef: this.editorRef,
      history: this.history.map((r) => r.toJSON()),
    };
  }
 
  static create(
    ref: FakeMMTask,
    users?: ClientUserTumbanian[],
    articles?: ArtilceTumbanian[]
  ) {
    const task = new TaskPresenter();
    if (ref.author && users) {
      const author = users.find((r) => r.id === ref.author)!;
      task.setAuthor(author);
    }
    if (ref.editor && users) {
      const editor = users.find((r) => r.id === ref.editor)!;
      task.setEditor(editor);
    }
    if (ref.article && articles) {
      const article = articles.find((r) => r.id === ref.article)!;
      task.setArticle(article);
    }
    return task.restore(ref);
  }

  public canPublish(editor: ClientUser) {
    if (this.status != 'CREATED') return false;
    if (!this.title) return false;
    if (!this.description) return false;
    if (!this.dateEnd || +this.dateEnd == 0) return false;
    if (!this.editor) return false;
    if (typeof this.fee === 'undefined') return false;
    if (!this.isBelongEditor(editor)) return;
    return true;
  }

  publish(editor: ClientUser) {
    if (this.status === 'PUBLISHED') return;
    if (!this.canPublish(editor)) throw new Error('Не позволено');
    if (this.author) {
      return this.distribute(this.authorRef as any);
    }
    this._status = 'PUBLISHED';
    this.appendHisotry(editor.getFullName());
  }

  public canUnpublish(editor: ClientUser) {
    return this.status === 'PUBLISHED' && this.isBelongEditor(editor);
  }
  unpublish(editor: ClientUser) {
    if (!this.canUnpublish(editor)) throw new Error('Не позволено');
    this._status = 'CREATED';
    this.appendHisotry(editor.getFullName());
  }

  public canDistribute(author: ClientUser) {
    if (this.status != 'CREATED' && this.status != 'PUBLISHED') return false;
    if (!this.author) return false;
    if (!this.isBelongAuthor(author)) return;
    return true;
  }

  distribute(author: ClientUser) {
    if (this.status === 'DISTRIBUTED') return;
    if (!this.canDistribute(author)) throw new Error('Не позволено');
    this._status = 'DISTRIBUTED';
    this.appendHisotry(author.getFullName());
  }

  public canRefuse(author: ClientUser) {
    return this.status === 'DISTRIBUTED' && this.isBelongAuthor(author);
  }

  refuse(author: ClientUser) {
    if (this.status === 'CREATED') return;
    if (!this.canRefuse(author)) throw new Error('Не позволено');
    this._status = 'PUBLISHED';
    this.setAuthor();
    this.appendHisotry(author.getFullName());
  }

  public canSendToResolve(author: ClientUser) {
    if (this.status === 'PENDING_RESOLVE') return false;
    if (this.status != 'DISTRIBUTED' && this.status != 'REJECTED') return false;
    if (!this.article) return false;
    if (!this.isBelongAuthor(author)) return false;
    return true;
  }

  sendToResolve(author: ClientUser) {
    if (this.status === 'PENDING_RESOLVE') return;
    if (!this.canSendToResolve(author)) throw new Error('Не позволено');
    this._status = 'PENDING_RESOLVE';
    this.appendHisotry(author.getFullName());
  }

  public canRevision(author: ClientUser) {
    if (this.status === 'DISTRIBUTED') return false;
    return this.status === 'PENDING_RESOLVE' && this.isBelongAuthor(author);
  }

  revision(author: ClientUser) {
    if (this.status === 'DISTRIBUTED') return;
    if (!this.canRevision(author)) throw new Error('Не позволено');
    this._status = 'DISTRIBUTED';
    if (!this.isBelongAuthor(author)) return;
    this.appendHisotry(author.getFullName());
  }

  public canReject(editor: ClientUser) {
    if (this.status === 'REJECTED') return false;
    return this.status === 'PENDING_RESOLVE' && this.isBelongEditor(editor);
  }

  reject(editor: ClientUser) {
    if (this.status === 'REJECTED') return;
    if (this.status != 'PENDING_RESOLVE') throw new Error('Не позволено');
    if (!this.isBelongEditor(editor))
      throw new Error('Вы не ответственный редактор');
    this._status = 'REJECTED';
    this.appendHisotry(editor.getFullName());
  }

  public canResolve(editor: ClientUser) {
    if (this.status === 'FINISHED') return false;
    return this.status == 'PENDING_RESOLVE' && this.isBelongEditor(editor);
  }

  resolve(editor: ClientUser) {
    if (this.status === 'FINISHED') return;
    if (this.status != 'PENDING_RESOLVE') throw new Error('Не позволено');
    if (!this.isBelongEditor(editor))
      throw new Error('Вы не ответственный редактор');
    this._status = 'FINISHED';
    this.appendHisotry(editor.getFullName());
  }

  public canEnd(editor: ClientUser) {
    if (this.status === 'ENDED') return false;
    return this.status === 'FINISHED' && this.isBelongEditor(editor);
  }

  end(editor: ClientUser) {
    if (this.status === 'ENDED') return;
    if (this.status != 'FINISHED') throw new Error('Не позволено');
    if (!this.isBelongEditor(editor))
      throw new Error('Вы не ответственный редактор');
    this._status = 'ENDED';
    this.appendHisotry(editor.getFullName());
  }

  public canCanceled(editor: ClientUser) {
    if (this.status === 'CANCELED') return false;
    return this.isBelongEditor(editor);
  }

  cancel(editor: ClientUser) {
    if (this.status === 'CANCELED') return;
    if (!this.isBelongEditor(editor))
      throw new Error('Вы не ответственный редактор');
    this._status = 'CANCELED';
    this.appendHisotry(editor.getFullName());
  }

  public canArchive(editor: ClientUser) {
    if (this.status === 'ARCHIVED') return false;
    return this.status === 'ENDED' || this.status === 'CANCELED';
  }

  archive(editor: ClientUser) {
    if (this.status === 'ARCHIVED') return;
    if (!this.canArchive(editor)) throw new Error('Не позволено');
    this._status = 'ARCHIVED';
    this.appendHisotry(editor.getFullName());
  }
}
