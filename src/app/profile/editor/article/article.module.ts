import { Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoComponent } from './photo/photo.component';
import { AlbumComponent } from './album/album.component';
import { YoutubeComponent } from './youtube/youtube.component';
import { QuoteArtComponent } from './quote-art/quote-art.component';
import { PreviewComponent } from './preview/preview.component'; 
import { TuiSvgModule } from '@taiga-ui/core';

@NgModule({
  declarations: [
    PhotoComponent,
    AlbumComponent,
    YoutubeComponent,
    QuoteArtComponent,
    PreviewComponent,
  ],
  imports: [CommonModule, TuiSvgModule],
  exports: [PreviewComponent]
})
export class ArticleModule {

}
