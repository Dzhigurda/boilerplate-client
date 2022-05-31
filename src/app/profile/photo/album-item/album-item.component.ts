 
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Album } from '../services/album'; 

@Component({
  selector: 'app-album-item',
  templateUrl: './album-item.component.html',
  styleUrls: ['./album-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumItemComponent implements OnInit {
  @Input()
  album!: Album;

  @Output()
  open = new EventEmitter();
  url: any;
  constructor(private ssd: DomSanitizer) {}

  ngOnInit(): void {
    this.url = this.album.cover;
  }

  private getImageByType(url: string) {
    return `${environment.API_URL}${url}`;
  }
}
