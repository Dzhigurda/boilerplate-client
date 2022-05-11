import {
  UserAuthorizationDTO,
  UserContactDTO,
  UserDTO,
} from '../../../server/src/domains/user';
import { Role, UserRole } from './profile/role.service';
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
  roleRef!: UserRole;

  restore(dto: UserDTO & UserAuthorizationDTO & {roleRef: Role}) {
    this.id = dto.id;
    this.STATUS = dto.STATUS;

    this.role = dto.role;

    this.firstName = dto.firstName;
    this.lastName = dto.lastName;
    this.secondName = dto.secondName;

    this.contacts = dto.contacts ?? [];

    this.roleRef = new UserRole().restore(dto.roleRef)
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
