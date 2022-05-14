import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClientUser } from 'src/app';
import {
  ArtilcesService,
  ArtilceTumbanian,
} from '../../articles/artilces.service';
import { TaskPresenter } from '../Task';

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

  constructor(private readonly articlesService: ArtilcesService) {}

  ngOnInit(): void { 
    this.articlesService.getByAuthor(this.user.id).subscribe((art) => {
      this.articles = art.map(r => new ArtilceTumbanian().restore(r));
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
        this.task.setArticle(tsk.article);
        this.change.emit(this.task);
      } catch (ex) {
        this.updateForm();
      }
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
}
