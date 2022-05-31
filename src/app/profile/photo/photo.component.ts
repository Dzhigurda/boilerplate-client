import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subscription, take } from 'rxjs';
import { ClientUser } from 'src/app';
import { Album } from './services/album';
import { AlbumService } from './services/album.service';
import { ArticlePhoto, PhotoURLs } from './services/photo';
import { PhotoService } from './services/photo.service';
import { Store } from '@ngrx/store'; 
import { TuiAlertService } from '@taiga-ui/core';
import { PhotoSearchForm } from './search-form-photo/search-form-photo.component';
import { addAlbum } from '../state/album/album.actions';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoComponent implements OnInit, OnDestroy {
  @Input()
  user!: ClientUser;
  photo: (ArticlePhoto & PhotoURLs)[] = [];
  albums: Album[] = [];
  activeItemIndex = 0;
  photoFiltered: (ArticlePhoto & PhotoURLs)[] = [];
  
  openPhotoModal = new EventEmitter<ArticlePhoto & PhotoURLs>();

  private subscriptions: Subscription[] = [];
  private set sub(sub: Subscription) {
    this.subscriptions.push(sub);
  }

  constructor(
    @Inject(TuiAlertService)
    private alertService: TuiAlertService,
    private albumService: AlbumService,
    private service: PhotoService,
    private ref: ChangeDetectorRef,
    private router: ActivatedRoute, 
    private store: Store
  ) {}

  ngOnInit(): void {
 
    this.sub = this.router.data.subscribe((data) => {
      // this.activeItemIndex = data?.['tab'] ?? 0;
    });
    this.sub = this.service.getByAuthor(this.user.id).subscribe((photo) => {
      for (let item of photo) {
        if (item.status === 'BANNED')
          item.colorBanned = 'var(--tui-error-fill)';
      }
      this.photo = photo;
      this.filter();
      this.ref.detectChanges();
    });
 
  }
  onSearchPhoto(params: PhotoSearchForm) {
    this.filter(params);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((r) => r.unsubscribe());
  }

  update() {
    this.ref.detectChanges();
  }

  private filter(raw?: PhotoSearchForm) {
    if (!raw) {
      this.photoFiltered = this.photo;
      this.ref.detectChanges();
      return;
    }
    let tmpFitered = this.photo;
    // if(raw.about) {
    //   const reg = new RegExp("("+raw.about+")", "i");
    //   tmpFitered = tmpFitered.filter(p => p.about && reg.test(p.about));
    // }
    if (raw.name) {
      tmpFitered = tmpFitered.filter(
        (p) => p.name && this.fuzzy(p.name, raw.name)
      );
    }
    if (raw.about) {
      tmpFitered = tmpFitered.filter(
        (p) => p.about && this.fuzzy(p.about, raw.about)
      );
    }
    if (raw.photographer) {
      tmpFitered = tmpFitered.filter(
        (p) => p.photographer && this.fuzzy(p.photographer, raw.photographer)
      );
    }
    if (raw.source) {
      tmpFitered = tmpFitered.filter(
        (p) => p.source && this.fuzzy(p.source, raw.source)
      );
    }

    this.photoFiltered = tmpFitered;
    this.ref.detectChanges();
  }

  addAlbum() {
    this.albumService.add({}).subscribe({
      error: () => {

      },
      next: (album) => {
        this.store.dispatch(addAlbum({ album })); 
      }
    });
  }

  searchAlbum(form: any) {
    this.alertService.open("Search", form).subscribe(); 
      // this.store.dispatch(addSearchParams({ form })); 
 
  }
  

  fuzzy(str1: string, str2: string) {
    var hay = str1.toLowerCase(),
      i = 0,
      n = -1,
      l;
    str2 = str2.toLowerCase();
    for (; (l = str2[i++]); ) if (!~(n = hay.indexOf(l, n + 1))) return false;
    return true;
  }

 
}
