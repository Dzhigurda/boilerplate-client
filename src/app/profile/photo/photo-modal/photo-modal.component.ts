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
import { FormControl, FormGroup } from '@angular/forms';
import {
  TuiAlertService,
  TuiDialogContext,
  TuiDialogService,
  TuiNotification,
} from '@taiga-ui/core';
import { PhotoService } from '../services/photo.service';

import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { clamp } from '@taiga-ui/cdk';
import {
  ArticlePhoto,
  MetaDescriptionsPhoto,
  Photo,
  PhotoURLs,
} from '../services/photo';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import {
  banPhoto,
  editPhoto,
  removePhoto,
  unbanPhoto,
} from '../../state/photo/photo.actions';
import { removePhotoInAlbum } from '../../state/album/album.actions';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoModalComponent implements OnInit {
  photo!: Photo;

  @ViewChild('modalEditor', { static: true })
  modalEditor: any;

  @Input('open-modal')
  open!: EventEmitter<number>;

  form = new FormGroup({
    name: new FormControl(''),
    about: new FormControl(''),
    photographer: new FormControl(''),
    photographerLink: new FormControl(''),
    source: new FormControl(''),
    sourceLink: new FormControl(''),
  });
  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private photoService: PhotoService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.open
      .pipe(
        tap({ next: () => this.showDialog(this.modalEditor) }),
        switchMap((id) =>
          this.store.select(
            (state) => state.photo.filter((photo) => photo.id === id)?.[0]
          )
        ),
        filter((photo) => !!photo)
      )
      .subscribe((photo) => {
        this.photo = photo;
  
        this.form.setValue({
          name: this.photo.name || '',
          about: this.photo.about || '',
          photographer: this.photo.photographer || '',
          photographerLink: this.photo.photographerLink || '',
          source: this.photo.source || '',
          sourceLink: this.photo.sourceLink || '',
        });
      });
  } 
  showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogService.open(content).subscribe({
      complete: () => {},
    });
  }

  save(observer: any) {
    if (!this.form.valid) return this.showError('Check form');
    this.photoService.save(this.photo.id!, this.form.getRawValue()).subscribe({
      next: () => {
        observer.complete();
        this.updatePhoto(this.form.getRawValue());
        this.showMessage('Saved');
      },
      error: (err) => {
        this.showError(err.error);
      },
    });
  }

  delete(observer: any) {
    this.photoService.delete(this.photo.id!).subscribe({
      next: () => {
        observer.complete();
        this.removeInAlbum();
        this.removePhoto();
        this.showMessage('Deleted');
      },
      error: (err) => {
        this.showError(err.error);
      },
    });
  }

  ban(observer: any) {
    this.photoService.ban(this.photo.id!).subscribe({
      next: () => {
        this.store.dispatch(banPhoto({ photoId: this.photo.id! }));
        this.showMessage('Banned');
      },
      error: (err) => {
        this.showError(err.error);
      },
    });
  }

  unban(observer: any) {
    this.photoService.unban(this.photo.id!).subscribe({
      next: () => {
        this.store.dispatch(unbanPhoto({ photoId: this.photo.id! }));
        this.showMessage('Unbanned');
      },
      error: (err) => {
        this.showError(err.error);
      },
    });
  }

  private updatePhoto(meta: MetaDescriptionsPhoto) {
    this.store.dispatch(editPhoto({ photoId: this.photo.id, meta }));
  }
  private removePhoto() {
    this.store.dispatch(
      removePhoto({
        photoId: this.photo.id!,
      })
    );
  }
  private removeInAlbum() {
    if (!this.photo.albumId) return;
    this.store.dispatch(
      removePhotoInAlbum({
        albumId: this.photo.albumId!,
        photoId: this.photo.id!,
      })
    );
  }

  private showMessage(message: string) {
    this.alertService
      .open(message, { status: TuiNotification.Success })
      .subscribe();
  }
  private showError(message: string) {
    this.alertService
      .open(message, { status: TuiNotification.Error })
      .subscribe();
  }
}
