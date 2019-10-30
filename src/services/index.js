import authservices from './authservices';
import userservices from "./userservice";
import FindUsersContact from "./contactService";
import getNotifiCations from "./notifiCationService";
export const auth = authservices;
export const user = userservices;
export const contact = FindUsersContact;
export const notify = getNotifiCations;