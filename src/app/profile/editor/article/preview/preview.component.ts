import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { AlbumToken, SerializeText, TokenValue } from 'src/app/utilites/SerializeText';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { debounceTime } from 'rxjs';
import { Album } from 'src/app/profile/photo/services/album';
import { ArticlePhoto, PhotoURLs } from 'src/app/profile/photo/services/photo';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  @Input()
  article!: string;

  @Output()
  textChange = new EventEmitter();

  @Output()
  needSave = new EventEmitter();

  @Input()
  title?: string;
  @Input()
  description?: string;
  @Input()
  image!: string;

  @Output("open-album-modal")
  openAlbumModal = new EventEmitter<Album>();
  @Output("open-photo-modal")
  openPhotoModal = new EventEmitter<number>();

  source?: TokenValue[];
  error?: string;

  constructor() {}

  ngOnInit(): void {
    // this.textChange.pipe(debounceTime(100)).subscribe((text) => {
    //   // changeDetect
    //   this.article = text;
    //   this.update();
    // });
  }
  appendToken(token: TokenValue, tokenText: string) {
    const text =
      this.source
        ?.map((r) => {
          if (r === token) {
            return `${r}\n${tokenText}\n`;
          }
          return r.toString();
        })
        .join('\n') ?? '';
    console.log(text);
    this.article = text;
    this.textChange.emit(text);
    this.update();
  }

  removeToken(token: TokenValue) {
    const text =
      this.source
        ?.map((r) => {
          if (r === token) {
            return ``;
          }
          return r.toString();
        })
        .join('\n') ?? '';
    console.log(text);
    this.article = text;
    this.textChange.emit(text);
    this.update();
  }

  setText(text: string) {
    this.article = text;
    this.update();
  }

  update() {
    try {
      this.error = '';
      this.source = new SerializeText(this.article).render().getSource();
      console.log(this.source);
    } catch (ex: any) {
      console.log(ex);
      this.error = ex.message;
    }
  }

  replacePhotoToAlbum(token: TokenValue, albumId: number) {
    if(!this.source) return; 
    const index = this.source.findIndex(t => t === token);
    if(!~index) return;
    const albumToken = new AlbumToken().setValue(albumId);
    this.source.splice(index, 1, albumToken);
    this.serialize();
  }

  drop(event: any) {
    moveItemInArray(this.source!, event.previousIndex, event.currentIndex);
    this.serialize();
  }
  serialize() {
    const text = this.source
      ?.map((r) => r.toString())
      .join('\n')
      .replace(/(\n{2,})/, '\n\n');
    console.log(text);
    this.textChange.emit(text);
  }
}
