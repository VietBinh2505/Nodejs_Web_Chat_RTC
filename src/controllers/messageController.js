import { validationResult } from 'express-validator/check';
import { message } from "./../services/index";
let addNewTextEmji = async (req, res) => {
	let errorArr = [];
	let validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		let errors = Object.values(validationErrors.mapped());
		errors.forEach(error => {
			errorArr.push(error.msg);
		});
		return res.status(500).send(errorArr);
	}
	try {
		let sender = {
			id: req.user._id,
			name: req.user.username,
			avatar: req.user.avatar,
		};
		// lấy dữ liệu truyền lên từ client
		let receiverId = req.body.uid;
		let messageVal = req.body.messageVal;
		let isChatGroup = req.body.isChatGroup;
		let newMessage = await message.addNewTextEmji(sender, receiverId, messageVal, isChatGroup);
		return res.status(200).send({message: newMessage});
	} catch (error) {
		console.log("loi tai messcontroller/ctl");
		console.log(error);
		return res.status(500).send(error);
	}
};
module.exports = {
	addNewTextEmji,
};