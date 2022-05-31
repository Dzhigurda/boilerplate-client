import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  Subscription,
  switchMap,
} from 'rxjs';

export interface AlbumSearchForm {
  name: string;
  about: string;
  photographer: string;
  source: string;
}

@Component({
  selector: 'app-search-form-album',
  templateUrl: './search-form-album.component.html',
  styleUrls: ['./search-form-album.component.scss'],
})
export class SearchFormAlbumComponent implements OnInit, OnDestroy {

  @Output()
  add = new EventEmitter<void>();

  @Output()
  search = new EventEmitter<AlbumSearchForm>();

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

  constructor() {}

  ngOnInit(): void {
    this.sub = this.filters.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe((form: AlbumSearchForm) => {
        if (!this.filters.valid) return;
        return this.search.emit(form);
      }); 
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((r) => r.unsubscribe());
  }
}
