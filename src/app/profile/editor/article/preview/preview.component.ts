import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { SerializeText } from 'src/app/utilites/SerializeText';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  @Input()
  article!: string;

  @Output()
  articleChange = new EventEmitter();

  @Output() 
  updateView = new EventEmitter<void>();
  @Input()
  title?: string;
  @Input()
  description?: string;
  @Input()
  image!: string;

  source?: any[];
  error?: string;

  constructor() {}

  ngOnInit(): void {
    this.articleChange.subscribe((text) => {
      this.article = text; 
      this.update();
    });
    this.updateView.subscribe(() => {
      this.update();
    })
  }

  update() {
    try {
      this.error ="";
      this.source = new SerializeText(this.article).render().getSource();
      console.log(this.source);
    } catch (ex: any) {
      console.log(ex);
      this.error = ex.message;
    }
  }
}
