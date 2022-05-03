import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiMobileDialogService } from '@taiga-ui/addon-mobile';
import { TuiNotificationsService } from '@taiga-ui/core';
import { debounceTime, Subscription } from 'rxjs';
import { ClientUser } from 'src/app';
import {
  User,
  UserContactDTO,
} from '../../../../../../server/src/domains/user';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit, OnDestroy {
  readonly control = new FormControl('', Validators.minLength(12));

  @Input()
  contactForm!: FormGroup;

  @Output()
  remove = new EventEmitter<number>();
  @Output()
  save = new EventEmitter<UserContactDTO>();
  
  @Output()
  add = new EventEmitter<UserContactDTO>();

  @Output()
  update = new EventEmitter<UserContactDTO>();

  @Input()
  user!: ClientUser;

  types: any[] = [];

  constructor(
    private contactService: ContactService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private readonly dialogsService: TuiMobileDialogService
  ) {
    this.save.subscribe((dto) => {
      console.log(dto);
      if (!this.contactForm.get('id')?.value) {
        this.contactService.add(dto).subscribe((contact: UserContactDTO) => {
          this.contactForm.get('id')?.setValue(contact!.id);
          this.notificationsService.show('Контакт добавлен').subscribe();
          this.add.emit(contact);
        });
      } else {
        this.contactService.patch(dto).subscribe((contact: UserContactDTO) => {
          this.notificationsService.show('Контакт изменён').subscribe();
          this.update.emit(contact);
        });
      }
    });

    this.remove.subscribe((res) => {
      if (!res) return;
      this.contactService.delete(res).subscribe(() => {
        this.notificationsService.show('Контакт удалён').subscribe();
      });
    });
  }
  subForm!: Subscription;
  ngOnDestroy(): void {
    this.subForm.unsubscribe();
  }

  ngOnInit(): void {
    this.types = this.contactService.getTypes();
    this.subForm = this.contactForm.valueChanges
      .pipe(debounceTime(1200))
      .subscribe((part) => {
        if (!this.contactForm.valid) return;
        // save
        this.save.emit({
          id: +this.contactForm.get('id')?.value,
          userId: +this.contactForm.get('userId')?.value,
          type: +this.contactForm.get('type')?.value?.id,
          title: this.contactForm.get('title')?.value,
          value: this.contactForm.get('value')?.value,
        });
      });
  }

  onRemove(id: number | undefined) {
    // remove
    this.dialogsService
      .open('Do you want to delete this contact?', {
        label: 'Are you sure',
        actions: ['Yes', 'Cancel'],
        data: id,
      })
      .subscribe((index) => {
        if (index === 0) this.remove.emit(id);
      });
  }
}
