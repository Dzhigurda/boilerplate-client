import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { TuiTbodyComponent } from '@taiga-ui/addon-table';
import { TaskPresenter } from '../Task';
import { UserTumbanianFactory } from '../UserTumbanianFactory';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  @Input()
  task!: TaskPresenter;
 
  get history() {
    return this.task.history;
  };
  readonly columns = ['date', 'name', 'comment','status' ];

  constructor(private ref: ChangeDetectorRef, private tumb: UserTumbanianFactory) { }

  @ViewChild("table", {static: true})
  table!: TuiTbodyComponent<any>;
  ngOnInit(): void { 
  }

}
