import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ceil } from '@taiga-ui/cdk';
import { ClientUser, UserPage } from 'src/app';
 
import { FormGroup, FormControl } from '@angular/forms';

class Account {
  constructor(readonly name: string, readonly balance: number) {}

  toString(): string {
    return `${this.name} (${this.balance})`;
  }
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit, UserPage {
  @Input()
  user!: ClientUser;

  labels = ['Просмотры', 'Дочитывания'];
  readonly value = [
    [3660, 8281, 1069, 9034, 5797, 6918, 8495, 3234, 6204, 1392, 2088, 8637],
    [395, 367, 378, 532, 353, 410, 296, 332, 863, 475, 913, 119],
  ];

  readonly labelsX = [
    'Jan 2019',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'aug',
    'sep',
    'oct',
    'now',
    'dec',
  ];
  readonly labelsY = ['0', '10000'];

  getHeight(max: number): number {
    return (max / ceil(max, -3)) * 100;
  }

  //

  readonly accounts = [
    new Account('Rubles', 500),
    new Account('Dollar', 237),
    new Account('Euro', 100),
  ];
 

  testForm = new FormGroup({
    name: new FormControl(''),
    accounts: new FormControl(this.accounts[0]),
  });
  //

  constructor() {}

  ngOnInit(): void {}

  activeItemIndex = NaN;
  isItemActive(index: number): boolean {
    return this.activeItemIndex === index;
  }

  onHover(index: number, hovered: any) {
    console.log(index, hovered);
    this.activeItemIndex = hovered ? index : 0;
  }

  getColor(index: number): string {
    return `var(--tui-chart-${index})`;
  }
}
