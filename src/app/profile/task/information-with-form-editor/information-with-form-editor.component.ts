import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscriber, Subscription } from 'rxjs';
import { ClientUser } from 'src/app';
import { UserService } from 'src/app/user.service';
import {
  ArtilcesService,
  ArtilceTumbanian,
} from '../../artilces/artilces.service';
import { RoleService } from '../../role.service';
import { ClientUserTumbanian, TaskPresenter } from '../Task';
import { TuiDay } from '@taiga-ui/cdk';
import { TaskService } from '../task.service';

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

  @Output()
  change = new EventEmitter<TaskPresenter>();

  form = new FormGroup({
    editor: new FormControl(null, Validators.required),
    dateEnd: new FormControl(null, Validators.required),
    fee: new FormControl(null, Validators.min(0)),
    author: new FormControl(null),
    article: new FormControl(null),
  });

  users: ClientUserTumbanian[] = [];
  articles: ArtilceTumbanian[] = [];

  private form$?: Subscription;
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly articlesService: ArtilcesService,
    private readonly taskService: TaskService
  ) {}

  ngOnInit(): void {
    const roles = this.roleService.getAll();
    if (!this.form.get('editor')!.value) {
      this.form
        .get('editor')!
        .setValue(this.createClientUserTumbanian(this.user));
    }
    this.userService.getAll().subscribe((users) => {
      this.users = users.map((user) => this.createClientUserTumbanian(user));
      this.updateForm();
    });
    this.articles = this.articlesService.getAllForTask();

    this.taskChange.subscribe((r) => {
      this.updateForm();
    });
  }

  initForm() {
    this.form$ = this.form.valueChanges.subscribe((tsk) => {
      if (!this.form.valid) return alert(this.form.errors);
      try {
      this.task.setArticle(tsk.article);
      this.task.setAuthor(tsk.author);
      this.task.setEditor(tsk.editor);
      this.task.dateEnd = new Date(tsk.dateEnd.toUtcNativeDate());
      this.task.fee = tsk.fee;
      this.change.emit(this.task);
      } catch(ex) {
        this.updateForm();
      }
    });
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
      this.task.setEditor(this.createClientUserTumbanian(this.user));
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
    this.form.get('fee')?.setValue(this.task.fee ?? this.taskService.getConfig().defaultFee);
    this.initForm();
  }

  createClientUserTumbanian(user: ClientUser) {
    return new ClientUserTumbanian().restore(
      user,
      this.roleService.getOne(user.role)?.value.substring(0, 3)
    );
  }

  dateDecorator(date: Date) {
    return new TuiDay(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
// 214528
