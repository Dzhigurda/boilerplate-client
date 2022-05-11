import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TuiMobileDialogService } from '@taiga-ui/addon-mobile';
import { TuiAlertService } from '@taiga-ui/core';
import { TuiTextAreaComponent } from '@taiga-ui/kit';
import { ClientUser } from 'src/app';
import { BaseArticle } from '../articles/Article';
import { ArtilcesService } from '../articles/artilces.service';
import { PreviewComponent } from './article/preview/preview.component';

export function TextFieldValidator(
  field: AbstractControl
): Validators | null {
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

  constructor(
    private router: ActivatedRoute,
    private articleService: ArtilcesService,
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private readonly dialogsService: TuiMobileDialogService
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.id = +params['id'];
      this.updateArticle(this.id!);
    });
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
  }

  private updateArticle(id: number) {
    this.articleService.getOne(id).subscribe((r) => {
      this.article = r;
      this.form.setValue(this.article.getTextForm());
      this.form.valid;
      this.updatePreview();
    });
  }
  updatePreview() {
    this.preview.title = this.article?.title;
    this.preview?.articleChange?.emit(this.article?.text);
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
  archivate() {

    this.dialogsService
      .open('Do you want to restore a content of article?', {
        label: 'Are you sure',
        actions: ['Yes', 'Cancel'],
      })
      .subscribe((index: number) => {
        if(index != 0) return;
        this.articleService.archive(this.id!).subscribe(r => {
          return this.alertService.open('Article is archived').subscribe();
        })
      });
  }

  uploadFile(files: any) {
    console.log(files);
  }
}
