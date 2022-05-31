import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiAlertService } from '@taiga-ui/core';
import { filter } from 'rxjs';
import { Album } from 'src/app/profile/photo/services/album';
import { AlbumService } from 'src/app/profile/photo/services/album.service';
import { Photo } from 'src/app/profile/photo/services/photo';
import { PhotoService } from 'src/app/profile/photo/services/photo.service';
import {
  addAlbum,
  updateAllPhotoInAlbum,
} from 'src/app/profile/state/album/album.actions';
import { selectAlbums } from 'src/app/profile/state/album/albums.selectors';
import { AppState } from 'src/app/profile/state/app.state';
import { addPhoto } from 'src/app/profile/state/photo/photo.actions';
import {
  Ng4FilesConfig,
  Ng4FilesSelected,
  Ng4FilesService,
  Ng4FilesStatus,
} from 'src/app/utilites/ng4-files';
import { AlbumToken, TokenValue } from 'src/app/utilites/SerializeText';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumComponent implements OnInit {
  id!: number;
  count!: number;

  album?: Album;
  cover?: string;
  error?: string;

  @Input()
  token!: TokenValue;

  @Output()
  remove = new EventEmitter<TokenValue>();

  @Output()
  updateText = new EventEmitter();

  @Output()
  needSave = new EventEmitter();

  @Output()
  openModal = new EventEmitter<Album>();
  @ViewChild('ng4file', { static: false })
  loaded_image = false;
  imageButton: any;
  private imageConfig: Ng4FilesConfig = {
    acceptExtensions: ['jpg', 'png', 'jpeg'],
    maxFilesCount: 1,
    maxFileSize: 20971520, // 20 мгБайт
    totalFilesSize: 20971520,
  };
  constructor(
    private readonly photoService: PhotoService,
    private readonly albumService: AlbumService,
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private ng4FilesService: Ng4FilesService,
    private store: Store<AppState>,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const token = this.token;
    console.log(token);
    if (this.isAlbum(token)) {
      this.id = token.id;
      this.count = token.count; 
      this.preopen();

      this.store.select(selectAlbums).subscribe((albums) => {
        if (!this.album) return;
        this.album = albums.filter((r) => r.id === this.id)[0] ?? null;
        this.updateImgae(this.album);
      }); 

      this.albumService.getOne(token.id).subscribe({
        next: (album) => { 
          this.updateImgae(album);
        },
        error: (err) => {
          this.error = err.error;
          this.removeLocal();
        },
      });
    }
    this.ng4FilesService.addConfig(this.imageConfig);
  }
  preopen() {
    if (!this.isAlbum(this.token)) return;
    const str = localStorage.getItem(`attach.album${this.token.id}`);
    if (!str) return;
    const res = JSON.parse(str);
    this.updateImgae(new Album().restore(res));
  }

  get base() {
    return `${environment.API_URL}`;
  }
  updateImgae(album: Album) {
    if(!album) return;
    this.album = album;
    this.store.dispatch(addAlbum({ album }));
    this.album?.photo
      .map((r) => new Photo().restore(r))
      .forEach((photo) => {
        this.store.dispatch(addPhoto({ photo }));
      });

    this.addLocal(album); 
    this.cover = album.cover;
    if (this.isAlbum(this.token)) {
      if (this.token.id !== album.id) {
        this.token.id = album.id!;
        this.updateText.emit();
        this.needSave.emit();
      }
    }
    this.ref.detectChanges();
  }

  addLocal(res: Album) {
    if (!this.isAlbum(this.token)) return;
    localStorage.setItem(`attach.album${this.token.id}`, JSON.stringify(res));
  }

  removeLocal() {
    if (!this.isAlbum(this.token)) return;
    localStorage.removeItem(`attach.album${this.token.id}`);
  }

  isAlbum(token: TokenValue): token is AlbumToken {
    return token.type === 'albums';
  }
  removeImage() {
    this.remove.emit(this.token);
  }

  selectedFiles?: any[];
  filesSelect(selectedFiles: Ng4FilesSelected) {
    if (selectedFiles.status !== Ng4FilesStatus.STATUS_SUCCESS) {
      this.alertService
        .open('Не удалось загрузить изображение: ' + selectedFiles.status)
        .subscribe();
      return;
    }
    this.loaded_image = true;
    this.selectedFiles = Array.from(selectedFiles.files).map((file: File) => {
      this.albumService.upload(this.album!.id!, file).subscribe({
        next: (res: Album) => {
          this.alertService
            .open('Изображение загружено: ' + selectedFiles.status)
            .subscribe();
          this.loaded_image = false;
          this.store.dispatch(
            updateAllPhotoInAlbum({ albumId: res.id, photo: res.photo })
          );
          this.updateImgae(res);
        },
        error: (err) => {
          this.alertService.open(err.error).subscribe();
        },
      });
      return file.name;
    });
  }
}
