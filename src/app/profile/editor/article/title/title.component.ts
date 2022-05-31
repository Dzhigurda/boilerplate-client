import { Component, Input, OnInit } from '@angular/core';
import { Subtitle, TokenValue } from 'src/app/utilites/SerializeText';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  @Input()
  token!: TokenValue;

  title?: string;
  constructor() { }

  ngOnInit(): void {
    if(this.isTitle(this.token)) {
      this.title = this.token.title;
    }
  }
  isTitle(token: TokenValue): token is Subtitle {
    return token.type === "subtitle";
  }

}
