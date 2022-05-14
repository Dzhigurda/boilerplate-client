import { Component, Input, OnInit } from '@angular/core';
import { ClientUser } from 'src/app';
import { BaseArticle } from './Article';
import { ArtilcesService, ArtilceTumbanian } from './artilces.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
  @Input()
  user!: ClientUser;

  articles: ArtilceTumbanian[] = [];
  markedArticle = new Set();
  constructor(private articlesService: ArtilcesService) {}

  ngOnInit(): void {
    this.articlesService.getAllTumbanian().subscribe((a) => {
      this.articles = a;
    });
  }

  btSelected = '';
 

  filterCreated() {}

  get countMark() {
    return this.markedArticle.size || "";
  }
  toggleMarked(id: number) {
    if (this.markedArticle.has(id)) {
      this.markedArticle.delete(id);
    } else {
      this.markedArticle.add(id);
    }
  }
  create() {
    this.articlesService.create({}).subscribe(art => {
      this.articles.unshift(new ArtilceTumbanian().restore(art));
    })
  }
}
