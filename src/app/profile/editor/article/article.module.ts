import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoComponent } from './photo/photo.component';
import { AlbumComponent } from './album/album.component';
import { YoutubeComponent } from './youtube/youtube.component';
import { QuoteArtComponent } from './quote-art/quote-art.component';
import { PreviewComponent } from './preview/preview.component';
import { TuiButtonModule, TuiDataListModule, TuiSvgModule } from '@taiga-ui/core';
import { Ng4FilesModule } from 'src/app/utilites/ng4-files';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UploaderComponent } from './uploader/uploader.component';
import { ParagraphComponent } from './paragraph/paragraph.component';
import { TitleComponent } from './title/title.component';
import { TuiCarouselModule, TuiDropdownContextModule } from '@taiga-ui/kit';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';

@NgModule({
  declarations: [
    PhotoComponent,
    AlbumComponent,
    YoutubeComponent,
    QuoteArtComponent,
    PreviewComponent,
    UploaderComponent,
    ParagraphComponent,
    TitleComponent,
  ],
  imports: [
    CommonModule,
    TuiSvgModule,
    Ng4FilesModule,
    DragDropModule,
    TuiDropdownContextModule,
    TuiButtonModule,
    TuiDataListModule,
    TuiCarouselModule,
    TuiActiveZoneModule
  ],
  exports: [PreviewComponent],
})
export class ArticleModule {}
