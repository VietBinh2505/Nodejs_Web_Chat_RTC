import {check} from 'express-validator/check';
import {tranValidation} from "./../../lang/vi";

let checkMessageLength = [
  check("messageVal", tranValidation.find_users_contact).isLength({min: 1, max: 400})
];

module.exports = {
    checkMessageLength,
}