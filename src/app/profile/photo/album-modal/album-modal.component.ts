import {
  EventEmitter,
  Component,
  Input,
  OnInit,
  Output,
  ViewChild,
  Inject,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  TuiAlertService,
  TuiDialogContext,
  TuiDialogService,
  TuiNotification,
} from '@taiga-ui/core';
import { Album } from '../services/album';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { AlbumService } from '../services/album.service';
import { ArticlePhoto, PhotoURLs } from '../services/photo';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Ng4FilesConfig,
  Ng4FilesSelected,
  Ng4FilesService,
  Ng4FilesStatus,
} from 'src/app/utilites/ng4-files';
import { Store } from '@ngrx/store';
import {
  banAlbum,
  editAlbum,
  removeAlbum,
  resortPhotoInAlbum,
  unbanAlbum,
  updateAllPhotoInAlbum,
} from '../../state/album/album.actions';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Subscriber,
  Subscription,
} from 'rxjs';
import { AppState } from '../../state/app.state';

@Component({
  selector: 'app-album-modal',
  templateUrl: './album-modal.component.html',
  styleUrls: ['./album-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumModalComponent implements OnInit {
  album!: Album;

  photo: any[] = [];
  @ViewChild('modalEditor', { static: true })
  modalEditor: any;

  @Input('open-modal')
  open!: EventEmitter<Album>;

  openPhotoModal = new EventEmitter<number>();

  selectedFiles?: any[];
  loaded_image = false;
  placeBlink = false;

  cover!: string;
  form = new FormGroup({
    id: new FormControl(),
    name: new FormControl(''),
    about: new FormControl(''),
    defaultPhotographer: new FormControl(''),
    defaultPhotographerLink: new FormControl(''),
    source: new FormControl(''),
    sourceLink: new FormControl(''),
  });

  private imageConfig: Ng4FilesConfig = {
    acceptExtensions: ['jpg', 'png', 'jpeg'],
    maxFilesCount: 10,
    maxFileSize: 20971520, // 20 мгБайт
    totalFilesSize: 20971520,
  };

  constructor(
    private ng4FilesService: Ng4FilesService,
    private albumService: AlbumService,
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private ref: ChangeDetectorRef,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.ng4FilesService.addConfig(this.imageConfig);
    this.store.pipe(distinctUntilChanged()).subscribe((state: any) => {
      console.log('result', state);
      if (this.album) {
        this.album = state.albums.find((r: any) => r.id === this.album.id);
        this.cover = this.album.cover;
        this.updateForm();
        this.ref.detectChanges();
      }
    });
    this.open.subscribe((album: Album) => {
      this.album = album;
      this.cover = album.cover;
      this.updateForm();
      this.showDialog(this.modalEditor);
    });
  }

  onSave(observer?: any) {
    if (!this.form.valid) {
      this.alertService
        .open('No valid', { status: TuiNotification.Error })
        .subscribe();
      return;
    }
    this.albumService.edit(this.album.id, this.form.getRawValue()).subscribe({
      next: () => {
        observer?.complete();
        this.store.dispatch(
          editAlbum({ albumId: this.album.id, meta: this.form.getRawValue() })
        );
        // this.alertService
        //   .open('Saved', { status: TuiNotification.Success })
        //   .subscribe();
      },
      error: (err) => {
        this.alertService
          .open(err.error, { status: TuiNotification.Error })
          .subscribe();
      },
    });
  }

  onBan(observer: any) {
    this.albumService.ban(this.album.id!).subscribe({
      next: () => {
        this.store.dispatch(banAlbum({ albumId: this.album.id }));
        this.alertService
          .open('Banned', { status: TuiNotification.Success })
          .subscribe();
      },
      error: (err) => {
        this.alertService
          .open(err.error, { status: TuiNotification.Error })
          .subscribe();
      },
    });
  }

  onUnban(observer: any) {
    this.albumService.unban(this.album.id!).subscribe({
      next: () => {
        this.store.dispatch(unbanAlbum({ albumId: this.album.id }));
        this.alertService
          .open('Unbanned', { status: TuiNotification.Success })
          .subscribe();
      },
      error: (err) => {
        this.alertService
          .open(err.error, { status: TuiNotification.Error })
          .subscribe();
      },
    });
  }

  onDelete(observer: any) {
    this.albumService.delete(this.album.id!).subscribe({
      next: () => {
        observer.complete();
        this.store.dispatch(removeAlbum({ albumId: this.album.id }));
        this.alertService
          .open('Deleted', { status: TuiNotification.Success })
          .subscribe();
      },
      error: (err) => {
        this.alertService
          .open(err.error, { status: TuiNotification.Error })
          .subscribe();
      },
    });
  }

  onRemovePhoto(id: number) {
    this.album.photo = this.album.photo.filter((r) => r.id != id);
  }

  private sub?: Subscription;
  private updateForm() {
    if (this.album.id != this.form.get('id')?.value) {
      this.sub?.unsubscribe();

      this.form.setValue({
        id: this.album.id || undefined,
        name: this.album.name || '',
        about: this.album.about || '',
        defaultPhotographer: this.album.defaultPhotographer || '',
        defaultPhotographerLink: this.album.defaultPhotographerLink || '',
        source: this.album.source || '',
        sourceLink: this.album.sourceLink || '',
      });

      this.sub = this.form.valueChanges
        .pipe(debounceTime(600), distinctUntilChanged())
        .subscribe((r) => {
          this.onSave();
        });

      console.log('Photo init');
      this.sub = this.store
        .select((state) =>
          state.photo
            .filter((p) => p.albumId === this.album.id)
        )
        .subscribe((photo) => {
          this.photo = []
          this.album.photo.forEach((p) => {
            this.photo.push(photo.find(item => item.id === p.id)!);
          }) 
        });
    }
  }

  showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogService
      .open(content, {
        size: 'page',
      })
      .subscribe({
        complete: () => {},
      });
  }

  drop(event: any) {
    moveItemInArray(this.photo, event.previousIndex, event.currentIndex);
    const ids = this.photo.map((r) => r.id!);
    this.albumService.resort(this.album.id, ids).subscribe({
      next: () => {
        this.store.dispatch(
          resortPhotoInAlbum({ albumId: this.album.id, ids })
        );
        this.cover = this.album.cover;
        this.alertService
          .open('Resorted', { status: TuiNotification.Success })
          .subscribe();
      },
      error: (err) => {
        moveItemInArray(this.photo, event.currentIndex, event.previousIndex);
        this.ref.detectChanges();
        this.alertService
          .open(err.error, { status: TuiNotification.Error })
          .subscribe();
      },
    });
  }

  filesSelect(selectedFiles: Ng4FilesSelected) {
    if (selectedFiles.status !== Ng4FilesStatus.STATUS_SUCCESS) {
      this.alertService
        .open('Не удалось загрузить изображение: ' + selectedFiles.status)
        .subscribe();
      return;
    }
    this.loaded_image = true;
    this.selectedFiles = Array.from(selectedFiles.files).map((file: File) => {
      this.albumService.upload(this.album.id, file).subscribe({
        next: (res) => {
          this.alertService
            .open('Изображение загружено: ' + selectedFiles.status)
            .subscribe();
          this.loaded_image = false;
          this.updateImgae(res);
        },
        error: (err) => {
          this.alertService.open(err.error).subscribe();
        },
      });
      return file.name;
    });
  }

  updateImgae(res: Album) {
    this.store.dispatch(
      updateAllPhotoInAlbum({ albumId: this.album.id, photo: res.photo })
    );
  }

  showPlace(event: any) {
    this.placeBlink = true;
  }
  hidePlace(event: any) {
    this.placeBlink = false;
  }
}
