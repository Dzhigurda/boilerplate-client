import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';
import { ClientUser } from 'src/app';
import { Category } from './Category';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categories!: readonly Category[];
  enabled!: readonly Category[];
  @Input() 
  user!: ClientUser;
  constructor(
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.update();
  }

  @ViewChild('orderDialog', { static: true })
  orderDialog: any;

  showDialog(): void {
    this.dialogService.open(this.orderDialog, {size: 's'}).subscribe();
  }
  update() {
    this.categoryService.getAll().subscribe((r) => {
      r.sort((a,b) => a.orderIndex - b.orderIndex);
      this.categories = r;
      this.enabled = r;
    });
  }

  create() {
    this.categoryService.add('News', 'template').subscribe({
      next: (art) => {
        this.update();
      },
      error: (err) => {
        alert(err);
        console.log(err);
      },
    });
  }
  
  saveOrder( data: readonly Category[]) {
    console.log(data);
    const order = data.map(r => r.id);
    this.categoryService.sort(order).subscribe(r => {
      this.alertService.open("Categories are sorted!").subscribe();
    })
  }
}
