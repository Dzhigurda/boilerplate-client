import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core'; 
import { ArticlePhoto, PhotoURLs } from 'src/app/profile/photo/services/photo';
import { PhotoService } from 'src/app/profile/photo/services/photo.service';
import {
  Ng4FilesConfig,
  Ng4FilesSelected,
  Ng4FilesService,
  Ng4FilesStatus,
} from 'src/app/utilites/ng4-files';
import { TokenValue } from 'src/app/utilites/SerializeText';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent implements OnInit {
  loaded_image = false;

  @Input()
  articlePart!: TokenValue;
  @Output()
  needSave = new EventEmitter();

  @Output()
  addPhoto = new EventEmitter<{ token: TokenValue; tokenText: string }>();

  selectedFiles?: any[];

  private imageConfig: Ng4FilesConfig = {
    acceptExtensions: ['jpg', 'png', 'jpeg'],
    maxFilesCount: 1,
    maxFileSize: 20971520, // 20 мгБайт
    totalFilesSize: 20971520,
  };

  constructor(
    private readonly photoService: PhotoService,
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private ng4FilesService: Ng4FilesService
  ) {}

  ngOnInit(): void {
    this.ng4FilesService.addConfig(this.imageConfig);
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
      this.photoService.upload(file).subscribe({
        next: (res) => {
          this.alertService
            .open('Изображение загружено: ' + selectedFiles.status)
            .subscribe();
          this.loaded_image = false;
          const random = Math.round(Math.random() * 10000);
          this.updateImgae(res);
        },
        error: (err) => {
          this.alertService.open(err.error).subscribe();
        },
      });
      return file.name;
    });
  }

  updateImgae(res: ArticlePhoto & PhotoURLs) {
    this.addPhoto.emit({
      token: this.articlePart,
      tokenText: 'foto' + res.id,
    });
  }
  placeBlink = false;
  showPlace(event: any) { 
    this.placeBlink = true;
  }
  hidePlace(event: any) { 
    this.placeBlink = false; 
  }
}
