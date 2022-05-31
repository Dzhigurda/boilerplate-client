import { Component, Input, OnInit } from '@angular/core';
import { QuoteToken, TextToken, TokenValue } from 'src/app/utilites/SerializeText';

@Component({
  selector: 'app-quote-art',
  templateUrl: './quote-art.component.html',
  styleUrls: ['./quote-art.component.scss']
})
export class QuoteArtComponent implements OnInit {

  @Input()
  token!: TokenValue;
  author?: string;
  text?: TextToken;
  constructor() { }

  ngOnInit(): void {
    const token = this.token;
    if(this.isTokenQuote(token)) {
      this.author = token.author;
      this.text = token.text;
    }
  }

  isTokenQuote(token: TokenValue): token is QuoteToken {
    return token.type === 'quote';
  }

}
