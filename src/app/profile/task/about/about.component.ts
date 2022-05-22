import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiMobileDialogService } from '@taiga-ui/addon-mobile';
import {
  TuiNotification,
  TuiNotificationsService,
} from '@taiga-ui/core';
import { ClientUser } from 'src/app';
import { TaskPresenter } from '../Task';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  private _task?: TaskPresenter;

  taskChange = new EventEmitter();

  @Input()
  set task(t: TaskPresenter | undefined) {
    if (this._task === t) return;
    this._task = t;
    this.taskChange.emit();
  }

  @Input()
  canSeeFee = false;

  get task() {
    return this._task!;
  }

  @Input()
  user!: ClientUser;

  mode: 'VIEW' | 'EDIT' = 'VIEW';
  icon = this.mode === 'EDIT' ? 'tuiIconCheckCircle' : 'tuiIconSettings';

  readonly form = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  private notifyOptions = {
    status: TuiNotification.Error,
  };

  private notifyOptionsSuccess = {
    status: TuiNotification.Success,
  };

  constructor(
    private ref: ChangeDetectorRef,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private taskService: TaskService,
    private readonly dialogsService: TuiMobileDialogService
  ) {}

  ngOnInit(): void {
    this.taskChange.subscribe((r) => {
      // this.updateForm();
      this.cancel();
    });
  }
  edit() {
    this.mode = 'EDIT';
    this.updateForm();
  }
  save() {
    if (!this.form.valid) return;
    this.taskService
      .editDescription(this.task!.id!, {
        title: this.form.get('title')?.value,
        description: this.form.get('description')?.value,
      })
      .subscribe((res) => {
        this.task!.title = res.title;
        this.task!.description = res.description;
        this.notificationsService.show('Сохранено', this.notifyOptionsSuccess);
        this.mode = 'VIEW';
      });
  }
  cancel() {
    this.mode = 'VIEW';
  }
  isView() {
    return this.mode === 'VIEW';
  }
  isGuest() {
    return !this.isAuthor() && !this.isEditor();
  }
  isAuthor() {
    return (
      [2, 3].includes(this.user.role) && this.task?.isBelongAuthor(this.user)
    );
  }
  isEditor() {
    return (
      [5, 6, 7].includes(this.user.role) && this.task?.isBelongEditor(this.user)
    );
  }

  isFinished() {
    return this.task!.isFinished();
  }

  updateForm() {
    if (!this.task) return;
    this.form.get('title')?.setValue(this.task.title);
    this.form.get('description')?.setValue(this.task.description);
  }

  canCanceled() {
    return this.task!.canCanceled(this.user);
  }
  cancelTask() {
    this.dialogsService
      .open('Do you want to cancel this task?', {
        label: 'Are you sure',
        actions: ['Yes', 'Cancel'],
      })
      .subscribe((index) => {
        if (index !== 0) return;
        this.taskService.cancel(this.task!.id!).subscribe((res) => {
          this.task!.update(res);
        });
      });
  }
  canArchive() {
    return this.task!.canArchive(this.user);
  }
  archiveTask() {
    this.dialogsService
      .open('Do you want to archivate this task?', {
        label: 'Are you sure',
        actions: ['Yes', 'Cancel'],
      })
      .subscribe((index) => {
        if (index !== 0) return;
        this.taskService.archive(this.task!.id!).subscribe((res) => {
          this.task!.update(res);
        });
      });
  }
}
