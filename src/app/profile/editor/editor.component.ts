import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TuiMobileDialogService } from '@taiga-ui/addon-mobile';
import { TuiAlertService } from '@taiga-ui/core';
import { TuiTextAreaComponent } from '@taiga-ui/kit';
import FastAverageColor from 'fast-average-color';
import { forkJoin } from 'rxjs';
import { ClientUser } from 'src/app';
import {
  Ng4FilesConfig,
  Ng4FilesSelected,
  Ng4FilesService,
  Ng4FilesStatus,
} from 'src/app/utilites/ng4-files'; 
import { BaseArticle } from '../articles/Article';
import { ArtilcesService } from '../articles/artilces.service';
import { Category } from '../category/Category';
import { CategoryService } from '../category/category.service';
import { PreviewComponent } from './article/preview/preview.component';

export function TextFieldValidator(field: AbstractControl): Validators | null {
  return field.value !== ''
    ? null
    : {
        other: 'This field is required',
      };
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  @Input()
  user!: ClientUser;

  form = new FormGroup({
    id: new FormControl('', Validators.required),
    title: new FormControl('', [TextFieldValidator]),
    description: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required),
    keywords: new FormControl('', Validators.required),
    nick: new FormControl(''),
    photographer: new FormControl(''),
    source: new FormControl(''), 
  });

  authorControl = new FormControl('', Validators.required);
  editorControl = new FormControl('', Validators.required);

  catalogControl = new FormControl(0, Validators.required);
  article?: BaseArticle;

  activeItemIndex: number = 1;

  @ViewChild('text', { static: false })
  text?: TuiTextAreaComponent;

  @ViewChild('dynamic', { static: false })
  private preview!: PreviewComponent;

  id?: number;
  code?: string;
  error?: string;
  articleText: string = '';
  imageHB?: any;
  imageVS?: any;
  imageHS?: any;
  srcHB?: string;

  authors: any[] = [];
  editors: any[] = [];
  categories: Category[] = [];

  constructor(
    private router: ActivatedRoute,
    private articleService: ArtilcesService,
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private readonly dialogsService: TuiMobileDialogService,
    private ssd: DomSanitizer,
    private changeRef: ChangeDetectorRef,
    private ng4FilesService: Ng4FilesService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.ng4FilesService.addConfig(this.imageConfig);
    this.router.params.subscribe((params) => {
      this.id = +params['id'];
      this.updateArticle(this.id!);
    });  
  }

  updateDetectForm() {

    this.form.get('title')?.valueChanges.subscribe((value) => {
      this.preview.title = value;
    });
    this.form.get('text')?.valueChanges.subscribe((value) => {
      this.articleText = value;
      this.preview?.articleChange?.emit(value);
    });
    this.form.get('description')?.valueChanges.subscribe((value) => {
      this.preview.description = value;
    });

    this.catalogControl.valueChanges.subscribe((value: number) => {
      if(this.article?.category === value) return;
      this.articleService.setCategory(this.article!.getId(),  +value).subscribe(r => {
        return this.alertService.open('Category changed').subscribe();
      })
    })
 
    this.authorControl.valueChanges.subscribe((value: number) => {
      if(this.article?.author === value) return;
      this.articleService.setAuthor(this.article!.getId(),  value).subscribe(r => {
        return this.alertService.open('Author changed').subscribe();
      })
    })
    this.editorControl.valueChanges.subscribe((value: number) => {
      if(this.article?.editor === value) return;
      this.articleService.setEditor(this.article!.getId(),  value).subscribe(r => {
        return this.alertService.open('Editor changed').subscribe();
      })
    })
  }

  private updateArticle(id: number) {
    forkJoin([
      this.articleService.getOne(id),
      this.articleService.getAuthorsForAticle(id),
      this.articleService.getEditorsForArticle(id),
      this.categoryService.getAll()
    ]).subscribe(([article, authors, editors, categories]) => {
      this.article = article;
      this.authors = authors;
      this.editors = editors;
      this.categories = categories; 
      this.form.setValue(this.article.getTextForm(this.user.id));
      this.form.valid;   
      this.updateCategory();
      this.updateEditor();
      this.updateAuthor();
      this.updateImage();
      this.updatePreview();

      this.updateDetectForm(); 
    });
  }
  private updateCategory() {
    const currentCategoryId = this.article!.getCategory();
    if(currentCategoryId) {
      const category = this.getCategory(currentCategoryId);
      this.catalogControl.setValue(category)
    } 
  }
  private updateEditor() {
    const currentEditorId = this.article!.getEditor();
    if(currentEditorId) {
      const editor = this.getEditor(currentEditorId);
      this.editorControl.setValue(editor)
    } 
  }
  private updateAuthor() { 
    const currentAuthorId = this.article!.getAuthor();
    if(currentAuthorId) {
      const author = this.getAuthor(currentAuthorId);
      this.authorControl.setValue(author)
    }
  }
  private getAuthor(authorId: number) {
    return this.authors.find(r => r.id === authorId);
  }
  private getEditor(editorId: number) {
    return this.editors.find(r => r.id === editorId);
  }
  private getCategory(categoryId: number) {
    return this.categories.find(r => r.id === categoryId);
  }
  updatePreview() {
    this.preview.title = this.article?.title;
    this.preview.description = this.form.value.description;
    this.preview?.articleChange?.emit(this.article?.text);
    this.preview.image = this.imageHS; 
    this.preview?.updateView?.emit();
  }
  updateImage() {
    const h = Math.round(Math.random() * 10000);
    this.srcHB = this.article!.hasImages()
      ? this.articleService.getHorizontalLargeImage(this.article!.id!) + `?h=${h}`
      : '/assets/default.hb.jpg';
    let srcHS = this.article!.hasImages()
      ? this.articleService.getHorizontalSmallImage(this.article!.id!)+ `?h=${h}`
      : '/assets/default.hs.jpg';
    let srcVS = this.article!.hasImages()
      ? this.articleService.getVerticalSmallImage(this.article!.id!) + `?h=${h}`
      : '/assets/default.vs.png';

    this.imageHB = this.ssd.bypassSecurityTrustUrl(this.srcHB);
    this.imageHS = this.ssd.bypassSecurityTrustUrl(srcHS);
    this.imageVS = this.ssd.bypassSecurityTrustUrl(srcVS);
    this.calcMidColor(this.srcHB);
  }

  restore() {
    this.dialogsService
      .open('Do you want to restore a content of article?', {
        label: 'Are you sure',
        actions: ['Yes', 'Cancel'],
      })
      .subscribe((index: number) => {
        if (index !== 0) return;
        this.updateArticle(this.id!);
      });
  }
  save() {
    if (!this.form.valid) {
      this.alertService.open('Article is not valid').subscribe();
      return;
    }
    this.articleService.save(this.form.value).subscribe((r) => {
      console.log(r);
      return this.alertService.open('Article is saved').subscribe();
    });
  }
  canUnarchive() {
    return this.article?.canArchive(this.user.id);
  }
  unarchivate() {
    this.dialogsService
      .open('Do you want to restore a content of article?', {
        label: 'Are you sure',
        actions: ['Yes', 'Cancel'],
      })
      .subscribe((index: number) => {
        if (index != 0) return;
        this.articleService.restore(this.id!).subscribe((r) => {
          return this.alertService.open('Article is restore').subscribe();
        });
      });
  }
  canArchive() {
    return this.article?.canArchive(this.user.id);
  }
  archivate() {
    this.dialogsService
      .open('Do you want to archive a content of article?', {
        label: 'Are you sure',
        actions: ['Yes', 'Cancel'],
      })
      .subscribe((index: number) => {
        if (index != 0) return;
        this.articleService.archive(this.id!).subscribe((r) => {
          return this.alertService.open('Article is archived').subscribe();
        });
      });
  }
  canUnpublish() {
    return this.article?.canUnpublish(this.user.id);
  }
  unpublish() {
    this.dialogsService
      .open('Do you want to unpublish this article?', {
        label: 'Are you sure',
        actions: ['Yes', 'Cancel'],
      })
      .subscribe((index: number) => {
        if (index != 0) return;
        this.articleService.unpublish(this.id!).subscribe((r) => {
          return this.alertService.open('Article is not a public').subscribe();
        });
      });
  }
  canPublish() {
    return this.article?.canPublish(this.user.id);
  } 
  publish() {
    this.dialogsService
      .open('Do you want to publish this article?', {
        label: 'Are you sure',
        actions: ['Yes', 'Cancel'],
      })
      .subscribe((index: number) => {
        if (index != 0) return;
        this.articleService.publish(this.id!).subscribe((r) => {
          return this.alertService.open('Article is published').subscribe();
        });
      });
  }


  midColor: string = '#f0f0f0';
  calcMidColor(url: string) {
    const fac = new FastAverageColor();
    fac
      .getColorAsync(url, {
        ignoredColor: [
          [230, 230, 230, 255], // white
          [30, 30, 30, 255], // black
        ],
      })
      .then((color: any) => {
        this.midColor = color.hex;
        console.log('Average color', color);
        this.changeRef.detectChanges();
      })
      .catch((e: any) => {
        console.log(e);
      });
  }
  rgbToHex(r: number, g: number, b: number) {
    if (r > 255 || g > 255 || b > 255) throw 'Invalid color component';
    return ((r << 16) | (g << 8) | b).toString(16);
  }

  private imageConfig: Ng4FilesConfig = {
    acceptExtensions: ['jpg', 'png', 'jpeg'],
    maxFilesCount: 1,
    maxFileSize: 20971520, // 20 мгБайт
    totalFilesSize: 20971520,
  };

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
      this.articleService
        .uploadImage(this.article!.id!, file)
        .subscribe((res) => {
          this.alertService.open(
            'Изображение загружено: ' + selectedFiles.status
          );
          this.loaded_image = false;
          const random = Math.round(Math.random() * 10000);
          this.article?.setImages(
            `${res.sq}?h=${random}`,
            `${res.hl}?h=${random}`,
            `${res.hs}?h=${random}`,
            `${res.vl}?h=${random}`,
            `${res.vs}?h=${random}`
          );
          this.updateImage();
          this.updatePreview();
        });
      return file.name;
    });
  }
}
