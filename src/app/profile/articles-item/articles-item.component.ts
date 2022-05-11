import { Component, Input, OnInit } from '@angular/core'; 
import { ArtilceTumbanian } from '../articles/artilces.service';

@Component({
  selector: 'app-articles-item',
  templateUrl: './articles-item.component.html',
  styleUrls: ['./articles-item.component.scss']
})
export class ArticlesItemComponent implements OnInit {

  @Input()
  article!: ArtilceTumbanian;
  constructor() { }

  ngOnInit(): void {
  
  }

}
