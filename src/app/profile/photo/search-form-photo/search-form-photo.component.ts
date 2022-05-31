import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

export interface PhotoSearchForm {
  name: string;
  about: string;
  photographer: string;
  source: string;
}

@Component({
  selector: 'app-search-form-photo',
  templateUrl: './search-form-photo.component.html',
  styleUrls: ['./search-form-photo.component.scss'],
})
export class SearchFormPhotoComponent implements OnInit, OnDestroy {
  filters = new FormGroup({
    name: new FormControl(''),
    about: new FormControl(''),
    photographer: new FormControl(''),
    source: new FormControl(''),
  });

  private subscriptions: Subscription[] = [];
  private set sub(sub: Subscription) {
    this.subscriptions.push(sub);
  }

  @Output()
  search = new EventEmitter<PhotoSearchForm>();

  constructor() {}

  ngOnInit(): void {
    this.sub = this.filters.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe((form: PhotoSearchForm) => {
        if (!this.filters.valid) return;
        return this.search.emit(form);
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((r) => r.unsubscribe());
  }
}
