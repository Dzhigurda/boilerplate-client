import { Component, Input, OnInit } from '@angular/core';
import { ClientUser } from 'src/app';
import { BaseArticle } from './Article';
import { ArtilcesService, ArtilceTumbanian } from './artilces.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  @Input()
  user!: ClientUser;

  articles: ArtilceTumbanian[] = [];
  constructor(private articlesService: ArtilcesService) { }

  ngOnInit(): void {
      this.articlesService.getAllTumbanian().subscribe((a) => {
        this.articles = a;
      });
  }

  btSelected = "";

  create() {

  }

  filterCreated() {

  }
}
