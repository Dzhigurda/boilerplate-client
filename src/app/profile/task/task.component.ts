import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ClientUser } from 'src/app';
import { TuiStringHandler } from '@taiga-ui/cdk';
import { tuiItemsHandlersProvider } from '@taiga-ui/kit';
import { ClientUserTumbanian, TaskPresenter } from './Task';
import { ArtilcesService, ArtilceTumbanian } from '../artilces/artilces.service';
import { TaskService } from './task.service';
 

const STRINGIFY_EMPLOYEE: TuiStringHandler<ClientUserTumbanian> = (
  item: ArtilceTumbanian | ClientUserTumbanian
) => {
  if (item instanceof ClientUserTumbanian) {
    return `${item.firstName} ${item.lastName} (${item.roleName})`;
  } else if (item instanceof ArtilceTumbanian) {
    return `#${item.id} - ${item.title}`;
  } else {
    return '-';
  }
};

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'], 
  providers: [tuiItemsHandlersProvider({ stringify: STRINGIFY_EMPLOYEE })],
})
export class TaskComponent implements OnInit {
  @Input()
  user!: ClientUser;
  items: TaskPresenter[] = [];

  currentTask?: TaskPresenter;
  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getAllTask().subscribe(r => {
      this.items = r;
    });
  }

  select(task: TaskPresenter) {
    this.currentTask = task;
  }
}
