export type FeeStatus = "CREATED" | "PAID" | "CANCELED";
export interface Fee {
  id: number;
  user: number;
  dateCreated: number;
  dateExecuted?: number;
  value: number;
  task: number;
  comment: string;
  status: FeeStatus;
  account?: string; 
  executeComment?: string;
} 
 

export class TaskFee {
    id!: number;
    user!: number; 
    value!: number;
    task!: number;

    comment!: string;
    executeComment?: string;
    account?: string; 

    status!: FeeStatus; 

    dateCreated!: number;
    dateExecuted?: number;

  constructor() {}
  getId() {
    return this.id;
  }

  getAuthor() {
    return this.user;
  }
  setAuthor(author: number) {
    if (this.status !== "CREATED") throw new Error("Уже закрыто");
    if (this.user === author) throw new Error("Уже определён");
    this.user = author;
  }
  setAccount(account: string) {
    this.account = account;
  } 

  pay(comment: string) {
    if (this.status === "PAID") throw new Error("Уже завершено");
    if (!this.value) throw new Error("Не указана сумма");
    if (!this.account) throw new Error("Не указан счёт");
    this.dateExecuted = +new Date();
    this.status = "PAID";
    this.executeComment = comment;
  }

  cancel(comment: string) {
    if (this.status != "CREATED") throw new Error("Уже завершено");
    this.status = "CANCELED";
    this.executeComment = comment;
  }

  restore(fee: Fee) {
    this.id = fee.id;
    this.user = fee.user;
    this.dateCreated = fee.dateCreated;
    this.dateExecuted = fee.dateExecuted;
    this.value = fee.value;
    this.task = fee.task;
    this.comment = fee.comment;
    this.status = fee.status;
    this.account = fee.account;
    this.executeComment = fee.executeComment;
    return this;
  }

  toJSON(): Fee {
    return {
      id: this.id,
      user: this.user,
      dateCreated: this.dateCreated,
      dateExecuted: this.dateExecuted,
      value: this.value,
      task: this.task,
      comment: this.comment,
      status: this.status,
      account: this.account,
      executeComment: this.executeComment,
    };
  }
}
