import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { Observable, switchMap, timeout, timer } from 'rxjs';
import { Store } from '@ngrx/store';

import { Album } from '../services/album';
import { AlbumService } from '../services/album.service';
import { 
  selectAlbums,
} from '../../state/album/albums.selectors'; 
import { retrievedAlbumList } from '../../state/album/album.actions';
@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss'], 
})
export class AlbumListComponent implements OnInit {
  albums$ = this.store.select(selectAlbums); 

  editor = new EventEmitter<Album>();

  constructor(
    private albumService: AlbumService,
    private store: Store,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {  
    this.albumService
      .getAll()
      .subscribe((albums) =>
        this.store.dispatch(retrievedAlbumList({ albums }))
      );
  }
 
}
