import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quote-art',
  templateUrl: './quote-art.component.html',
  styleUrls: ['./quote-art.component.scss']
})
export class QuoteArtComponent implements OnInit {

  @Input()
  author!: string;
  constructor() { }

  ngOnInit(): void {
  }

}
