import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime, Subscriber, Subscription } from 'rxjs';
import { ClientUser } from 'src/app';
import { UserService } from 'src/app/user.service';
import {
  ArtilcesService,
  ArtilceTumbanian,
} from '../../articles/artilces.service';
import { RoleService } from '../../role.service';
import { ClientUserTumbanian, TaskPresenter } from '../Task';
import { TuiDay } from '@taiga-ui/cdk';
import { TaskService } from '../task.service';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { UserTumbanianFactory } from '../UserTumbanianFactory';

@Component({
  selector: 'app-information-with-form-editor',
  templateUrl: './information-with-form-editor.component.html',
  styleUrls: ['./information-with-form-editor.component.scss'],
})
export class InformationWithFormEditorComponent implements OnInit {
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

  @Output()
  change = new EventEmitter<TaskPresenter>();

  form = new FormGroup({
    editor: new FormControl(null, Validators.required),
    dateEnd: new FormControl(null, Validators.required),
    fee: new FormControl(null, Validators.min(0)),
    author: new FormControl(null),
    article: new FormControl(null),
  });

  authors: ClientUserTumbanian[] = [];
  editors: ClientUserTumbanian[] = [];
  articles: ArtilceTumbanian[] = [];

  private form$?: Subscription;

  private notifyOptions = {
    status: TuiNotification.Error,
  };

  private notifyOptionsSuccess = {
    status: TuiNotification.Success,
  };

  constructor( 
    private readonly roleService: RoleService,
    private readonly articlesService: ArtilcesService,
    private readonly taskService: TaskService,
    private readonly tumb: UserTumbanianFactory,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {}

  ngOnInit(): void {
    const roles = this.roleService.getAll();
    if (!this.form.get('editor')!.value) {
      this.form
        .get('editor')!
        .setValue(this.tumb.createFromClientUser(this.user));
    }
    this.tumb.takeAllAuthor().subscribe((userSpec) => {
      this.authors = userSpec.authors.map((u) =>
        this.tumb.createFromClientUser(u)
      );
      this.editors = userSpec.editors.map((u) =>
        this.tumb.createFromClientUser(u)
      );
      this.updateForm();
    });
    this.articlesService.getAllTumbanian().subscribe((art) => {
      this.articles = art;
    });

    this.taskChange.subscribe((r) => {
      this.updateForm();
    });
  }

  initForm() {
    this.form$ = this.form.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((tsk) => {
        if (!this.form.valid) return alert(this.form.errors);
        try {
          // TODO: После завершения блока статей
          this.task.setArticle(tsk.article);

          if (this.task?.authorId !== tsk.author?.id) {
            this.changeAuthor(tsk.author);
          }

          if (this.task?.editorId !== tsk.editor?.id) {
            this.changeEditor(tsk.author);
          }

          const newDateEnd = new Date(tsk.dateEnd.toUtcNativeDate());
          if (+this.task.dateEnd! !== +newDateEnd) {
            this.changeDateEnd(newDateEnd);
          }

          if (this.task.fee !== tsk.fee) {
            this.changeFee(tsk.fee);
          }
        } catch (ex) {
          this.updateForm();
        }
      });
  }

  changeAuthor(author: ClientUserTumbanian) {
    this.taskService.setAuthor(this.task.id!, author.id).subscribe({
      next: (res) => {
        this.task.setAuthor(author);
        this.notificationsService.show('Исполнитель был изменён').subscribe();
        this.change.emit(this.task);
      },
      error: (err) => this.showError(err),
    });
  }
  changeFee(fee: number) {
    this.taskService.setFee(this.task.id!, fee).subscribe({
      next: (res) => {
        this.task.fee = fee;
        this.notificationsService.show('Гонорар изменён').subscribe();
        this.change.emit(this.task);
      },
      error: (err) => this.showError(err),
    });
  }
  changeEditor(editor: ClientUserTumbanian) {
    this.taskService.setEditor(this.task.id!, editor.id).subscribe({
      next: (res) => {
        this.task.setEditor(editor);
        this.notificationsService.show('Редактор был изменён').subscribe();
        this.change.emit(this.task);
      },
      error: (err) => this.showError(err),
    });
  }
  changeDateEnd(dateEnd: Date) {
    this.taskService.setDateEnd(this.task.id!, dateEnd).subscribe({
      next: (res) => {
        this.task.dateEnd = dateEnd;
        this.notificationsService.show('Срок сдачи изменён').subscribe();
        this.change.emit(this.task);
      },
      error: (err) => this.showError(err),
    });
  }

  private showError(err: any) {
    this.notificationsService.show(err.error, this.notifyOptions).subscribe();
  }

  updateForm() {
    this.form$?.unsubscribe();

    if (!this.task) {
      console.log('NOT HAVE TASK');
      return;
    }

    if (this.task.authorRef) {
      this.form.get('author')?.setValue(this.task.authorRef);
    } else {
      this.form.get('author')?.setValue(null);
    }
    if (!this.task.editorRef) {
      this.task.setEditor(this.tumb.createFromClientUser(this.user));
    }
    this.form.get('editor')?.setValue(this.task.editorRef);

    if (this.task.art) {
      this.form.get('article')?.setValue(this.task.art);
    } else {
      this.form.get('article')?.setValue(null);
    }
    if (!this.task.dateEnd) {
      this.task.dateEnd = this.taskService.getConfig().defaultDuration;
    }
    this.form.get('dateEnd')?.setValue(this.dateDecorator(this.task.dateEnd));
    this.form
      .get('fee')
      ?.setValue(this.task.fee ?? this.taskService.getConfig().defaultFee);
    this.initForm();
  }

  dateDecorator(date: Date) {
    return new TuiDay(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
