import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ClientUser } from 'src/app';
import { TuiStringHandler } from '@taiga-ui/cdk';
import { tuiItemsHandlersProvider } from '@taiga-ui/kit';
import { ClientUserTumbanian, TaskPresenter, TaskStatus } from './Task';
 
import { TaskService } from './task.service';
import { FormControl, FormGroup } from '@angular/forms';
import {
  TuiDialogContext,
  TuiDialogService,
  TuiNotification,
  TuiNotificationsService,
} from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { AccessItem } from '../role.service';
import { UserTumbanianFactory } from './UserTumbanianFactory';
import { ArtilceTumbanian } from '../articles/artilces.service';

const STRINGIFY_EMPLOYEE: TuiStringHandler<ClientUserTumbanian> = (
  item: ArtilceTumbanian | ClientUserTumbanian | string
) => {
  if (item instanceof ClientUserTumbanian) {
    return `${item.firstName} ${item.lastName} (${item.roleName})`;
  } else if (item instanceof ArtilceTumbanian) {
    return `#${item.id} - ${item.title}`;
  } else {
    return item;
  }
};

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  providers: [tuiItemsHandlersProvider({ stringify: STRINGIFY_EMPLOYEE })],
})
export class TaskComponent implements OnInit {
  @Input()
  user!: ClientUser;
  items: TaskPresenter[] = [];
  tasks: TaskPresenter[] = [];

  filter = new FormGroup({
    status: new FormControl(),
    author: new FormControl(),
    editor: new FormControl(),
    article: new FormControl(),
  });

  currentTask?: TaskPresenter;
  authors!: ClientUserTumbanian[];
  editors!: ClientUserTumbanian[];
  statuses: TaskStatus[] = ["CREATED", "PUBLISHED", "DISTRIBUTED", "PENDING_RESOLVE", "REJECTED", "FINISHED", "CANCELED", "ENDED", "ARCHIVED"];

  private notifyOptions = {
    status: TuiNotification.Error,
  };

  private notifyOptionsSuccess = {
    status: TuiNotification.Success,
  };

  isCanSeeFee = false;

  @ViewChild('filterDialog', { static: true })
  filterDialog!: PolymorpheusContent<TuiDialogContext>;
  constructor(
    private taskService: TaskService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private tumb: UserTumbanianFactory
  ) {}

  ngOnInit(): void {
    this.taskService.getAll().subscribe((r) => {
      this.items = r.filter((task) => this.isMyTask(task));
      this.tasks = this.items;
    });
    this.isCanSeeFee = this.canSeeFee();
    this.tumb.takeAllAuthor().subscribe((userSpec) => {
      this.authors = userSpec.authors.map((u) =>
        this.tumb.createFromClientUser(u)
      );
      this.editors = userSpec.editors.map((u) =>
        this.tumb.createFromClientUser(u)
      );
    });
  }

  btSelected = '';
  openCreated() {
    if(this.btSelected === "CREATED") {
      return this.cleanFilter();
    }
    this.btSelected = "CREATED";
    this.filter.get("status")?.setValue(["CREATED"])
    this.onFilter();
  }
  openPubllish() {
    if(this.btSelected === "PUBLISHED") {
      return this.cleanFilter();
    }
    this.btSelected = "PUBLISHED";
    this.filter.get("status")?.setValue(["PUBLISHED"])
    this.onFilter();
  }
  openCanceled() {
    if(this.btSelected === "CANCELED") {
      return this.cleanFilter();
    }
    this.btSelected = "CANCELED";
    this.filter.get("status")?.setValue(["CANCELED","ARCHIVED","ENDED"])
    this.onFilter();
  }
  openDistribute() {
    if(this.btSelected === "DISTRIBUTED") {
      return this.cleanFilter();
    }
    this.btSelected = "DISTRIBUTED";
    this.filter.get("status")?.setValue(["DISTRIBUTED","PENDING_RESOLVE","REJECTED","FINISHED"])
    this.onFilter();
  }

  cleanFilter() {
    this.btSelected = "";
    this.filter.get("status")?.setValue(null);
    this.filter.get("author")?.setValue(null);
    this.filter.get("edit")?.setValue(null);
    this.onFilter();
    return;
  }
  isEmptyFilter() {
    const value = this.filter.value;
    if(value.author) return false;
    if(value.edit) return false;
    if(value.status) return false;
    return true;
  }

  archive() {
    // TODO: удалить this.currentTask
    this.taskService.archive(this.currentTask!.id!).subscribe({
      next: (r) => {
        this.removeItem();
        this.showSuccess('Задание архивированно');
      },
      error: (err) => this.showError(err),
    });
  }
  cancel() {
    // TODO: удалить this.currentTask
    this.taskService.cancel(this.currentTask!.id!).subscribe({
      next: (r) => {
        this.removeItem();
        this.showSuccess('Задание отменено');
      },
      error: (err) => this.showError(err),
    });
  }
  private removeItem() {
    const index = this.items.findIndex((r) => r === this.currentTask);
    if (~index) {
      this.items.splice(index, 1);
      this.currentTask = undefined;
    }
  }
  private showSuccess(text: string) {
    this.notificationsService.show(text, this.notifyOptionsSuccess).subscribe();
  }
  private showError(err: any) {
    this.notificationsService.show(err.error, this.notifyOptions).subscribe();
  }
  select(task: TaskPresenter) {
    this.currentTask = task;
  }

  add() {
    this.taskService.create().subscribe((task) => {
      this.items.push(task);
      this.currentTask = task;
    });
  }

  openFilterForm() {
    this.dialogService.open(this.filterDialog).subscribe();
  }

  onFilter() {
    const filter = this.filter.value; 
    console.log(filter.status);
    this.items = this.tasks.filter((task) => {
      if (filter.author && filter.author.id !== task.authorId) return false;
      if (filter.editor && filter.editor.id !== task.editorId) return false;
      if (filter.status && filter.status.length > 0 && !filter.status.includes(task.status)) return false;
      return true;
    });
  }

  canCreate() {
    return this.user.roleRef.right.includes(AccessItem.CAN_CREATE_TASK);
  }
  canPutEditor() {
    return this.user.roleRef.right.includes(AccessItem.CAN_PUT_EDITOR_IN_TASK);
  }
  isMyTask(task: TaskPresenter) {
    if (this.canPutEditor()) return true;
    return task.isBelongAuthor(this.user) || task.isBelongEditor(this.user) || task.status === "PUBLISHED";
  } 
  canSeeFee() {
    return this.user.roleRef.right.includes(AccessItem.CAN_SEE_FEE);  
  }
}
