import {
  UserAuthorizationDTO,
  UserContactDTO,
  UserDTO,
} from '../../../server/src/domains/user';
export interface UserPage {
  user: ClientUser;
}
export class ClientUser {
  id!: number;
  STATUS!: string;
  firstName!: string;
  secondName!: string;
  lastName!: string;

  role!: number;

  contacts: UserContactDTO[] = [];

  restore(dto: UserDTO & UserAuthorizationDTO) {
    this.id = dto.id;
    this.STATUS = dto.STATUS;

    this.role = dto.role;

    this.firstName = dto.firstName;
    this.lastName = dto.lastName;
    this.secondName = dto.secondName;

    this.contacts = dto.contacts ?? [];
    return this;
  }
  toJSON(): UserDTO & UserAuthorizationDTO {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      secondName: this.secondName,
      STATUS: this.STATUS,
      role: this.role,
    };
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
