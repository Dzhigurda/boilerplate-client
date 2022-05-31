import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store'; 
import { AppState } from '../../state/app.state';
import { retrievedPhotoList } from '../../state/photo/photo.actions';
import { selectPhoto, selectPhotoByAuthorAndNotAlbum } from '../../state/photo/photo.selectors';
import { Photo } from '../services/photo';
 
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss'],
})
export class PhotoListComponent implements OnInit { 

  photoFiltered$ = this.store.select(selectPhotoByAuthorAndNotAlbum); 
  openPhotoModal = new EventEmitter<number>();
  constructor(
    private photoService: PhotoService,
    private store: Store<AppState>,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.photoService
      .getAll()
      .subscribe((photos) =>
        this.store.dispatch(retrievedPhotoList({ photos }))
      );

    
  }
 
}
