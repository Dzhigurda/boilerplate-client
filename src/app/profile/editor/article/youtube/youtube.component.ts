import { Component, Input, OnInit } from '@angular/core';
import { TokenValue, YoutubeToken } from 'src/app/utilites/SerializeText';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss']
})
export class YoutubeComponent implements OnInit {

  @Input()
  token!: TokenValue;

  code?: string;
  constructor() { }

  ngOnInit(): void {
    const token = this.token;
    if(this.isYoutube(token)) {
      this.code = token.code;
    }
  }

  isYoutube(token: TokenValue): token is YoutubeToken {
    return token.type === 'youtube'
  }
}
