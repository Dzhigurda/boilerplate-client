import { Component, Input, OnInit } from '@angular/core';
import { TextToken, TokenValue } from 'src/app/utilites/SerializeText';

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss'],
})
export class ParagraphComponent implements OnInit {
  @Input()
  token!: TokenValue;

  paragraph: string[] = [];
  constructor() {}

  ngOnInit(): void {
    const token = this.token;
    if (this.isParagraph(token)) {
      this.paragraph = token.text;
    }
  }

  isParagraph(token: TokenValue): token is TextToken {
    return token.type === 'text';
  }
}
