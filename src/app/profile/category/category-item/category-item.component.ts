import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  TuiAlertService,
  TuiDialogContext,
  TuiDialogService,
  TuiNotification,
} from '@taiga-ui/core';
import { Category } from '../Category';
import { CategoryService } from '../category.service';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
})
export class CategoryItemComponent implements OnInit, OnDestroy {
  @Input()
  category!: Category;

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    about: new FormControl('', Validators.required),
    publish: new FormControl(null, Validators.required),
  });
  constructor(
    private categoryService: CategoryService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService
  ) {}

  private publish$!: Subscription;

  ngOnInit(): void {
    this.reset();
    this.publish$ = this.form.get('publish')!.valueChanges.subscribe((r) => {
      if(r) {
        this.categoryService.publish(this.category.id).subscribe({
          next: (res) => {
            this.alertService.open("Category published").subscribe();
            this.category.publish();
        }, error: (err) => {
          this.alertService.open(err.error, {status: TuiNotification.Error}).subscribe();
        }})
      } else {
        this.categoryService.unpublish(this.category.id).subscribe({
          next: (res) => {
            this.alertService.open("Category unpublished").subscribe();
            this.category.unpublish();
        }, error: (err) => {
          this.alertService.open(err.error, {status: TuiNotification.Error}).subscribe();
        }})
      }
    });
  }

  ngOnDestroy(): void {
    this.publish$?.unsubscribe();
  }

  open(content: PolymorpheusContent<TuiDialogContext>) {
    this.dialogService.open(content).subscribe();
  }

  reset() {
    this.form.setValue({
      name: this.category.name,
      about: this.category.about,
      publish: this.category.isPublish(),
    }); 
  }

  save(observer: { complete: () => void }) {
    if (!this.form.valid) {
      return;
    }

    this.categoryService
      .edit(
        this.category.id,
        this.form.get('name')!.value,
        this.form.get('about')!.value
      )
      .subscribe({
        next: (r) => {
          if (!r) {
            this.alertService
              .open('Not saved, some error!', { status: TuiNotification.Error })
              .subscribe();
            return;
          }
          this.category.name = this.form.get('name')!.value;
          this.category.about = this.form.get('about')!.value;
          observer.complete();
        },
        error: (err) => {
          this.alertService
            .open(err.error, { status: TuiNotification.Error })
            .subscribe();
        },
      });
  }
}
