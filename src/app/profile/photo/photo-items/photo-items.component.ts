import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { Photo } from '../services/photo';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-photo-items',
  templateUrl: './photo-items.component.html',
  styleUrls: ['./photo-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoItemsComponent implements OnInit {
  @Input()
  photo!: Photo;

  @Output('open-image-editor')
  open = new EventEmitter<Photo>();
  url!: string;

  constructor() {}

  ngOnInit(): void {}

  onOpenEditor() {
    this.open.emit(this.photo);
  }
}
