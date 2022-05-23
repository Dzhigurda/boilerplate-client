import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TuiPaymentSystem } from '@taiga-ui/addon-commerce';
import {
  TuiAlertService,
  TuiDialogService,
  TuiNotification,
} from '@taiga-ui/core';
import { Observable } from 'rxjs';
import { ClientUser } from 'src/app';
import { UserService } from 'src/app/user.service';
import {
  ArtilcesService,
  ArtilceTumbanian,
} from '../../articles/artilces.service';
import { TaskPresenter } from '../../task/Task';
import { TaskService } from '../../task/task.service';
import { TaskFee } from '../Fee';
import { FeeService } from '../fee.service';

@Component({
  selector: 'app-fee-item',
  templateUrl: './fee-item.component.html',
  styleUrls: ['./fee-item.component.scss'],
})
export class FeeItemComponent implements OnInit {
  @Input()
  fee!: TaskFee;
  cartType = TuiPaymentSystem.Visa;
  author?: ClientUser;
  task?: TaskPresenter;
  comment: string = '';
  status = new Map<
    string,
    { name: string; color: string; valueColor: string }
  >();

  menuItems = [
    { title: 'Goto article', iconName: 'tuiIconEyeOpen' }, 
    { title: 'Execute pay', iconName: 'tuiIconCard' },
    { title: 'Cancel fee', iconName: 'tuiIconClose' },
  ];

  constructor(
    private feeService: FeeService,
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private articleService: ArtilcesService,
    private userService: UserService,
    private taskService: TaskService,
    private router: Router
  ) {
    this.status.set('CREATED', {
      name: 'Wait for pay',
      color: '#f90',
      valueColor: '#888',
    });
    this.status.set('PAID', {
      name: 'Fee is paid',
      color: '#080',
      valueColor: '#000',
    });
    this.status.set('CANCELED', {
      name: 'Fee is canceled',
      color: '#a00',
      valueColor: '#ccc',
    });
  }

  ngOnInit(): void {
    this.comment = this.fee.comment;  
    this.userService.getOne(this.fee.getAuthor()).subscribe((u) => {
      this.author = u;
      this.updateMenu();
    });
    this.taskService.getOne(this.fee.task).subscribe((t) => {
      this.task = t;
      this.articleService.getOne(this.task!.articleId!).subscribe((a) => {
        this.task?.setArticle(new ArtilceTumbanian().restore(a));
        this.changeComment();
      });
    });
  }

  updateMenu() { 
    if (this.fee.status != 'CREATED') {
      this.menuItems.length = 1;
    }
  }

  changeComment() {
    if (!this.task) return;
    this.comment = this.fee.comment
      .replace(
        '@article' + this.task.articleId,
        `<b>${this.task.art!.title}</b>`
      )
      .replace('@task' + this.task.id, `<b>${this.task!.title}</b>`);
  }

  executeContextmenuCommand(action: string, contextInfo: unknown): void {
    if ('Execute pay' === action) {
      this.dialogService.open(this.executeDialog).subscribe();
      return;
    } else if ('Cancel fee' === action) {
      this.dialogService.open(this.cancelDialog).subscribe();
      return;
      // this.dialogService.open(`Поле комментария `).subscribe();
    } else if ('Goto article' === action) {
      // Открываем
      this.router.navigateByUrl(`/profile/articles/${this.task?.articleId}`);
      return;
    } else {
      this.dialogService
        .open(`[${action}]: ${JSON.stringify(contextInfo)}`)
        .subscribe();
    }
  }

  @ViewChild('cancelDialog', { static: true })
  cancelDialog: any;
  @ViewChild('executeDialog', { static: true })
  executeDialog: any;

  account = '9871';
  executeComment: string = '';

  cancelFee(observer: any) {
    if (!this.executeComment) {
      this.showError('Comment is requier');
      return;
    }
    this.feeService.cancel(this.fee.id, this.executeComment).subscribe({
      next: (r) => {
        this.showSuccess('Canceled');
        observer.complete();
      },
      error: (r) => {
        this.showError("You doesn't do this");
      },
    });
  }

  executeFee(observer: any) {
    if (!this.executeComment) {
      this.showError('Comment is requier');
      return;
    }
    if (!this.account) {
      this.showError('Account is requier');
      return;
    }
    this.feeService
      .pay(this.fee.id, this.account, this.executeComment)
      .subscribe({
        next: (r) => {
          this.showSuccess('Executed');
          observer.complete();
        },
        error: (r) => {
          this.showError("You doesn't do this");
        },
      });
  }

  showSuccess(message: string): void {
    this.alertService
      .open(message, { status: TuiNotification.Success })
      .subscribe();
  }
  showError(message: string): void {
    this.alertService
      .open(message, { status: TuiNotification.Error })
      .subscribe();
  }
}
