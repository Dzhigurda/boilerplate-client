import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TuiNotification } from '@taiga-ui/core';
import { ClientUser } from 'src/app';
import { UserContactDTO } from '../../../../../../server/src/domains/user';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  @Input()
  user!: ClientUser;

  private notifyOptions = {
    status: TuiNotification.Error,
  };

  private notifyOptionsSuccess = {
    status: TuiNotification.Success,
  };

  contacts: FormGroup[] = [];

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.initContacts();
  }

  ngOnDestroy(): void {}

  createContact(contact: any) {
    const group = new FormGroup({
      id: new FormControl(contact.id),
      userId: new FormControl(contact.userId, Validators.required),
      type: new FormControl(contact.type, Validators.required),
      value: new FormControl(contact.value, Validators.minLength(12)),
      title: new FormControl(contact.title, Validators.required),
    });
    this.contacts.push(group);
  }

  initContacts() {
    for (const contact of this.user.contacts) {
      this.createContact({
        userId: this.user.id,
        type: this.contactService.getType(contact.type),
        title: contact.title,
        value: this.getPhoneValue(contact),
        id: contact.id,
      });
    }
  }

  getPhoneValue(contact: UserContactDTO) {
    if (contact.type === 1) {
      return contact.value.substring(1);
    }
    return contact.value;
  }

  addContact() {
    this.createContact({
      userId: this.user.id,
      type: this.contactService.getType(1),
      title: 'Новый контакт',
      value: '',
      id: 0,
    });

  }

  removeContact(id: number, index: number) {
    this.contacts.splice(index, 1);
    const indexes = this.user.contacts.findIndex(r => r.id === id);
    if(~indexes) {
      this.user.contacts.splice(indexes, 1);
    }
  }
  setContact(dto: UserContactDTO, index: number) {
    this.user.contacts.push(dto);
  }
  updateContact(dto: UserContactDTO, index: number) {
    const indexes = this.user.contacts.findIndex(r => r.id === dto.id);
    if(~indexes) {
      this.user.contacts.splice(indexes, 1, dto);
    }
  }
}
