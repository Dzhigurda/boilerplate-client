import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  articlesFiltered: ArtilceTumbanian[] = [];
  markedArticle = new Set();
  constructor(
    private articlesService: ArtilcesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMarked();
    this.articlesService.getAllTumbanian().subscribe((a) => {
      this.articles = a;
      this.filterByStatus('CREATED');
    });
  }

  btSelected = '';
  authorId: number = 0;
  isMarked = false;
  filterByMarked() {
    this.isMarked = !this.isMarked;
    this.filterArticles();
  }
  filterByUser(userId: number) {
    this.authorId = this.authorId === userId ? 0 : userId;
    this.filterArticles();
  }
  filterByStatus(status: string) {
    this.btSelected = status === this.btSelected ? '' : status;
    this.filterArticles();
  }
  filterArticles() {
    let articlesFilters = Array.from(this.articles);
    if (this.authorId) {
      articlesFilters = articlesFilters.filter(
        (r) => r.author === this.authorId
      );
    }
    if (this.btSelected) {
      articlesFilters = articlesFilters.filter(
        (r) => r.status === this.btSelected
      );
    }
    if (this.isMarked) {
      articlesFilters = articlesFilters.filter((r) =>
        this.markedArticle.has(r.id)
      );
    }
    this.articlesFiltered = articlesFilters;
  }

  get countMark() {
    return this.markedArticle.size || '';
  }
  toggleMarked(id: number) {
    if (this.markedArticle.has(id)) {
      this.markedArticle.delete(id);
    } else {
      this.markedArticle.add(id);
    }
    this.saveMarked();
  }

  saveMarked() {
    localStorage.setItem(
      'marked',
      JSON.stringify(Array.from(this.markedArticle.values()))
    );
  }
  loadMarked() {
    const arr = JSON.parse(localStorage.getItem('marked') ?? '[]');
    this.markedArticle = new Set(arr);
  }

  isArticleMarked(id: number) {
    return this.markedArticle.has(id);
  }
  create() {
    this.articlesService.create({}).subscribe({
      next: (art) => {
        this.articles.unshift(new ArtilceTumbanian().restore(art));
        this.router.navigateByUrl('/profile/articles/' + art.id!);
      },
      error: (err) => {
        alert(err);
        console.log(err);
      },
    });
  }
}
