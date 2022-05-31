import { Component, Input, OnInit } from '@angular/core';
import { ClientUser } from 'src/app';
import { TaskFee } from './Fee';
import { FeeService } from './fee.service';

@Component({
  selector: 'app-fee',
  templateUrl: './fee.component.html',
  styleUrls: ['./fee.component.scss'],
})
export class FeeComponent implements OnInit {
  fee: TaskFee[] = [];
  total?: { total: number; canceled: number; wait: number; execute: number };
  status = new Map<
    string,
    { name: string; color: string; valueColor: string }
  >();

  @Input()
  user!: ClientUser;

  constructor(private feeService: FeeService) {
    this.status.set('CREATED', {
      name: 'Wait for pay',
      color: '#f90',
      valueColor: '#888',
    });
    this.status.set('PAID', {
      name: 'Fee is paid',
      color: '#080',
      valueColor: '#000',
    });
    this.status.set('CANCELED', {
      name: 'Fee is canceled',
      color: '#a00',
      valueColor: '#ccc',
    });
  }

  ngOnInit(): void {
    this.feeService.getMe().subscribe((r) => {
      r.reverse();
      this.fee = r;
      this.calculate();
    });
  }

  calculate() {
    this.total = this.feeService.calculate(this.fee);
  }
}
