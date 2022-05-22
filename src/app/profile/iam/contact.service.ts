import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserContactDTO } from '.';
 
export class ContactTypeItem {
  constructor(public id: number, public name: string, public icon: string) {}
  toString() {
    return this.name;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  readonly types: { id: number; name: string; icon: string }[] = [
    new ContactTypeItem(1, 'Phone', 'tuiIconCallInLarge'),
    new ContactTypeItem(2, 'Email', 'tuiIconMailLarge'),
    new ContactTypeItem(3, 'Address', 'tuiIconCompanyLarge'),
    new ContactTypeItem(4, 'Link', 'tuiIconLinkLarge'),
  ];
  constructor(private http: HttpClient) {}

  getTypes() {
    return this.types;
  }

  getType(id: number) {
    return this.types.find((r) => r.id === id);
  }

  add(contact: any) {
    return this.http.post<UserContactDTO>(
      environment.API_URL + '/v1/user/contact',
      {
        title: contact.title,
        type: contact.type,
        userId: contact.userId,
        value: contact.value,
      }
    );
  }
  patch(contact: UserContactDTO) {
    return this.http.patch<UserContactDTO>(
      environment.API_URL + '/v1/user/contact/' + contact.id,
      contact
    );
  }

  delete(contactId: number) {
    return this.http.delete<boolean>(
      environment.API_URL + '/v1/user/contact/' + contactId
    );
  }
}
