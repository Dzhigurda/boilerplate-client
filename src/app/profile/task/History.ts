import { TuiStatusT } from '@taiga-ui/kit';
import { TaskPresenter, TaskStatus } from './Task';

export interface History {
  id: number;
  task: number;
  date: number;
  user: number;
  status: TaskStatus;
  comment: string;
}

export class HistoryPresenter {
  date!: Date;
  private userName: string = "-";
  get name() {
    return this.userName;
  }
  get status() {
    return this.history.status;
  }
  statusClass!: TuiStatusT;

  get comment() {
    return this.history.comment;
  }

  private history!: History;
  restore(history: History, userName: string) {
    this.history = history;
    this.userName = userName;
    this.statusClass = TaskPresenter.getStatusClass(history.status);
    this.date = new Date(history.date);
    return this;
  }

  toJSON() {
      return this.history;
  }
}
