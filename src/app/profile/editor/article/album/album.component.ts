import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {
  @Input()
  id!: number;
  
  @Input()
  count!: number;
  
  constructor() { }

  ngOnInit(): void {
  }

}
