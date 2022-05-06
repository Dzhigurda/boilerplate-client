import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientUser } from 'src/app';
import { ClientUserTumbanian, TaskPresenter } from '../Task';

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

  constructor() {}

  ngOnInit(): void {
    this.taskChange.subscribe(r => {
      // this.updateForm();
      this.cancel();
    })
  }
  edit() {
    this.mode = 'EDIT';
    this.updateForm();
  }
  save() {
    this.mode = 'VIEW';
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
    return [2, 3].includes(this.user.role)  && this.task?.isBelongAuthor(this.user);
  }
  isEditor() {
    return [5, 6, 7].includes(this.user.role) && this.task?.isBelongEditor(this.user);
  }

  updateForm() {
    if(!this.task) return;

    this.form.get('title')?.setValue(this.task.title);
    this.form.get('description')?.setValue(this.task.description);
  }
}
