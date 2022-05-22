
export enum UserContactType {
    PHONE = 1,
    EMAIL,
    ADDRESS,
    PROFILE, // vk, instagram, facebook, twitter, website
  }
export interface UserContactDTO {
    id: number;
    userId: number;
    title: string;
    type: UserContactType;
    value: string;
  }