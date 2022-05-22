import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { Subscription } from 'rxjs';
import { ClientUser } from 'src/app';
import {
  ArtilcesService,
  ArtilceTumbanian,
} from '../../articles/artilces.service';
import { TaskPresenter } from '../Task';
import { TaskService } from '../task.service';

interface Employee {
  readonly id: number;
  readonly name: string;
  readonly dept: {
    readonly id: number;
    readonly title: string;
  };
}

@Component({
  selector: 'app-information-with-form-article',
  templateUrl: './information-with-form-article.component.html',
  styleUrls: ['./information-with-form-article.component.scss'],
})
export class InformationWithFormArticleComponent implements OnInit, OnDestroy {
  private _task?: TaskPresenter;

  taskChange = new EventEmitter();

  @Input()
  set task(t: TaskPresenter) {
    if (this._task === t) return;
    this._task = t;
    this.taskChange.emit();
  }

  get task() {
    return this._task!;
  }

  @Input()
  user!: ClientUser;

  @Input()
  canSeeFee = false;

  form = new FormGroup({
    article: new FormControl(0),
  });

  articles: ArtilceTumbanian[] = [];

  @Output()
  change = new EventEmitter<TaskPresenter>();

  private form$?: Subscription;
  private notifyOptions = {
    status: TuiNotification.Error,
  };

  private notifyOptionsSuccess = {
    status: TuiNotification.Success,
  };

  constructor(
    private readonly articlesService: ArtilcesService,
    private readonly taskService: TaskService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.articlesService.getByAuthor(this.user.id).subscribe((art) => {
      this.articles = art.map((r) => new ArtilceTumbanian().restore(r));
    });

    this.taskChange.subscribe((r) => {
      this.updateForm();
    });
    this.updateForm();
  }

  ngOnDestroy(): void {
    this.form$?.unsubscribe();
  }

  initForm() {
    this.form$ = this.form.valueChanges.subscribe((tsk) => {
      if (!this.form.valid) return alert(this.form.errors);
      try {
        if (this.task?.art?.id != tsk.article?.id) {
          this.changeArticle(tsk.article);
        } 
      } catch (ex) {
        this.updateForm();
      }
    });
  }
  changeArticle(tumbanian?: ArtilceTumbanian) {
    if (this.task!.status !== 'DISTRIBUTED') {
      this.notificationsService
        .show('Not permited', this.notifyOptions)
        .subscribe();
      if (this.task.articleId) {
        this.form.get('article')?.setValue(this.task.art);
      }
      return;
    }
    if (!tumbanian?.id) {
      this.removeAticle();
    } else {
      this.setArticle(tumbanian.id);
    }
  }
  private removeAticle() {
    this.taskService.removeArticle(this.task.id!).subscribe((r) => {
      if (!r) {
        this.showDenie('Не удалось'); 
        this.form.get('article')?.setValue(this.task.art);
        this.ref.detectChanges();
        return;
      } 
      this.task.removeArticle(); 
      this.showSuccess('Статья убрана');
    });
  }

  private setArticle(articleId: number) {
    this.taskService.setArticle(this.task.id!, articleId).subscribe({
      next: (r) => {
        if (!r) {
          this.showDenie('Не удалось');
          return;
        }
        this.task.update(r);
        this.showSuccess('Статья закреплена');
      },
      error: (err) => {
        this.showError(err);
        this.form.get('article')?.setValue(this.task.art);
        this.ref.detectChanges();
      },
    });
  }

  public updateForm() {
    if (!this.task) return;
    this.form$?.unsubscribe();
    if (this.task.art) {
      this.form.get('article')?.setValue(this.task.art);
    } else {
      this.form.get('article')?.setValue(null);
    }
    this.initForm();
  }

  private showDenie(err: any) {
    this.notificationsService.show(err, this.notifyOptions).subscribe();
  }
  private showError(err: any) {
    this.notificationsService.show(err.error, this.notifyOptions).subscribe();
  }
  private showSuccess(msg: any) {
    this.notificationsService.show(msg, this.notifyOptionsSuccess).subscribe();
  }
}
