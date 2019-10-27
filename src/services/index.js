import authservices from './authservices';
import userservices from "./userservice";
import FindUsersContact from "./contactService";
export const auth = authservices;
export const user = userservices;
export const contact = FindUsersContact;