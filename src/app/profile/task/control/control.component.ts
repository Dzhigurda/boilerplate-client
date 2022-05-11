import { Component, Inject, Input, OnInit } from '@angular/core';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { ClientUser } from 'src/app';
import { ClientUserTumbanian, TaskPresenter } from '../Task';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss'],
})
export class ControlComponent implements OnInit {
  @Input()
  task!: TaskPresenter;

  @Input()
  user!: ClientUser;
  constructor(
    private service: TaskService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {}

  ngOnInit(): void {}

  publish() {
    ///
    if (!this.task) return;
    this.service.publish(this.task.id!).subscribe({
      next: (task) => {
        this.showSuccess('Опубликовано');
        this.task.update(task);
      },
      error: (err) => this.showError(err),
    });
  }

  unpublish() {
    if (!this.task) return;
    this.service.unpublish(this.task.id!).subscribe({
      next: (task) => {
        this.showSuccess('Снять с публикации');
        this.task.update(task);
      },
      error: (err) => this.showError(err),
    });
  }
  accept() {
    // TODO Должность, сервис сохранения
    if (!this.task) return;
    this.service.distribute(this.task.id!).subscribe({
      next: (task) => {
        this.showSuccess('Закреплено');
        this.task.update(task);
      },
      error: (err) => this.showError(err),
    });
  }

  refuse() {
    if (!this.task) return;
    this.service.refuse(this.task.id!).subscribe({
      next: (task) => {
        this.showSuccess('Отказ принят');
        this.task.update(task);
      },
      error: (err) => this.showError(err),
    });
  }
  sendToResolve() {
    if (!this.task) return;
    this.service.sendToResolve(this.task.id!).subscribe({
      next: (task) => {
        this.showSuccess('Отправлено на проверку');
        this.task.update(task);
      },
      error: (err) => this.showError(err),
    });
  }
  revision() {
    if (!this.task) return;
    this.service.revision(this.task.id!).subscribe({
      next: (task) => {
        this.showSuccess('Отменена проверка');
        this.task.update(task);
      },
      error: (err) => this.showError(err),
    });
  }
  reject() {
    if (!this.task) return;
    this.service.reject(this.task.id!).subscribe({
      next: (task) => {
        this.showSuccess('Отклонено');
        this.task.update(task);
      },
      error: (err) => this.showError(err),
    });
  }
  resolve() {
    if (!this.task) return;
    this.service.resolve(this.task.id!).subscribe({
      next: (task) => {
        this.showSuccess('Принято');
        this.task.update(task);
      },
      error: (err) => this.showError(err),
    });
  }
  /**
   * @deprecated происходит когда редактор опубликовал закреплённую статью
   */
  end() {
    // if(!this.task) return;
    // this.service.end(this.task.id!).subscribe({
    //   next: () => {
    //     this.showSuccess('Принято');
    //     this.task?.end(this.user);
    //   },
    //   error: (err) => this.showError(err),
    // });
  }
  cancel() {
    if (!this.task) return;
    this.service.cancel(this.task.id!).subscribe({
      next: (task) => {
        this.showSuccess('Задача отменена');
        this.task.update(task);
      },
      error: (err) => this.showError(err),
    });
  }
  archive() {
    if (!this.task) return;
    this.service.archive(this.task.id!).subscribe({
      next: (task) => {
        this.showSuccess('Архив');
        this.task.update(task);
      },
      error: (err) => this.showError(err),
    });
  }

  //

  private notifyOptions = {
    status: TuiNotification.Error,
  };

  private notifyOptionsSuccess = {
    status: TuiNotification.Success,
  };

  private showSuccess(text: string) {
    this.notificationsService.show(text, this.notifyOptionsSuccess).subscribe();
  }
  private showError(err: any) {
    this.notificationsService.show(err.error, this.notifyOptions).subscribe();
  }
}
