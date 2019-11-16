import authValidation from './authValidation';
import userValidation from './userValidation';
import contactValidation from './contactValidation';
import checkMessageLength from "./messageValidation"
export const authValid = authValidation;
export const userValid = userValidation;
export const contactValid = contactValidation;
export const MessageValid = checkMessageLength;
