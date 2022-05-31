import {
  Component,
  Inject,
  Input,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { filter, forkJoin, switchMap } from 'rxjs'; 
import { AlbumService } from 'src/app/profile/photo/services/album.service';
import { ArticlePhoto, Photo, PhotoURLs } from 'src/app/profile/photo/services/photo';
import { PhotoService } from 'src/app/profile/photo/services/photo.service';
import { addAlbum } from 'src/app/profile/state/album/album.actions';
import { AppState } from 'src/app/profile/state/app.state';
import { addPhoto } from 'src/app/profile/state/photo/photo.actions';
import {
  Ng4FilesConfig,
  Ng4FilesSelected,
  Ng4FilesService,
  Ng4FilesStatus,
} from 'src/app/utilites/ng4-files';
import { PhotoToken, TokenValue } from 'src/app/utilites/SerializeText';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoComponent implements OnInit {
  @Input()
  token!: TokenValue;

  error?: string;

  photo?: Photo; 

  @Output()
  updateText = new EventEmitter();

  @Output()
  needSave = new EventEmitter();

  @Output()
  replaceToAlbum = new EventEmitter<number>();

  @Output()
  remove = new EventEmitter<TokenValue>();

  @Output("open-modal")
  openModal = new EventEmitter<number>();
  @ViewChild('ng4file', { static: false })
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
    // ...
    this.ng4FilesService.addConfig(this.imageConfig);
    if (this.isPhoto(this.token)) {
      const id = this.token.id;
      this.preopen();
      this.store.select(s => s.photo.find(r => r.id === id)).pipe(
        filter(r => typeof r != 'undefined')
      ).subscribe(r => {
        this.updateImgae(r);
      })
      this.photoService.getOne(id).subscribe({
        next: (res) => {
          this.addLocal(res);
          this.updateImgae(res);
        },
        error: (err) => {
          this.error = err.error;
          this.removeLocal();
        },
      });
    }
  }
  isPhoto(token: TokenValue): token is PhotoToken {
    return token.type === 'photo';
  }

  preopen() {
    if (!this.isPhoto(this.token)) return;
    const str = localStorage.getItem(`attach.foto${this.token.id}`);
    if (!str) return;
    const res = JSON.parse(str);
    this.updateImgae(new Photo().restore(res));
  }

  addLocal(res: ArticlePhoto & PhotoURLs) {
    if (!this.isPhoto(this.token)) return;
    localStorage.setItem(`attach.foto${this.token.id}`, JSON.stringify(res));
  }

  removeLocal() {
    if (!this.isPhoto(this.token)) return;
    localStorage.removeItem(`attach.foto${this.token.id}`);
  }

  loaded_image = false;

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
      this.photoService.upload(file).subscribe({
        next: (res) => {
          this.alertService
            .open('Изображение загружено: ' + selectedFiles.status)
            .subscribe();
          this.loaded_image = false;
          this.store.dispatch(addPhoto({photo: res}));
          this.photoContainerToAlbum(res);
        },
        error: (err) => {
          this.alertService.open(err.error).subscribe();
        },
      });
      return file.name;
    });
  }

  photoContainerToAlbum(img: ArticlePhoto) {
    let albumId: number;
    this.albumService
      .add({
        name: this.photo?.name,
        about: this.photo?.about,
      })
      .pipe(
        switchMap((album) => {
          albumId = album.id;
          console.log("album",albumId);
          return forkJoin(
            this.photoService.putToAlbum(album.id, this.photo!),
            this.photoService.putToAlbum(album.id, img)
          );
        }),
        switchMap((p) => {
          console.log("album after",albumId);
          return this.albumService.getOne(albumId);
        })
      )
      .subscribe((album) => {
        this.store.dispatch(addAlbum({ album }));
        this.replaceToAlbum.emit(album.id);
      });
  }

  updateImgae(img: any) {
    this.photo = img; 
    this.store.dispatch(addPhoto({photo: img})); 
    if (this.isPhoto(this.token)) {
      if (this.token.id !== img.id) {
        this.token.id = img.id!;
        this.updateText.emit();
        this.needSave.emit();
      }
    }
    this.ref.detectChanges();
  }

  deleteImage() {
    this.photoService.delete((this.token as PhotoToken).id).subscribe({
      next: (res) => {
        this.alertService
          .open('Photo deleted', { status: TuiNotification.Success })
          .subscribe();
        this.remove.emit(this.token);
        this.needSave.emit();
      },
      error: (err) => {
        this.alertService
          .open(err.error, { status: TuiNotification.Error })
          .subscribe();
      },
    });
  }
  removeImage() {
    this.alertService.open('Remove is not implements').subscribe();
    this.remove.emit(this.token);
  }
  uploadImage() {
    this.alertService.open('Remove is not implements').subscribe();
  }
}
