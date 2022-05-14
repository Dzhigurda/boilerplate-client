import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'; 
import { ArtilceTumbanian } from '../artilces.service';

@Component({
  selector: 'app-articles-item',
  templateUrl: './articles-item.component.html',
  styleUrls: ['./articles-item.component.scss']
})
export class ArticlesItemComponent implements OnInit {

  @Input()
  article!: ArtilceTumbanian;

  @Output()
  marked = new EventEmitter();

  isMarkbook = false;
  constructor() { }

  ngOnInit(): void {
  
  }

  addMarkbook() {
    this.isMarkbook = !this.isMarkbook;
    this.marked.emit(this.article.id);
  }
}
