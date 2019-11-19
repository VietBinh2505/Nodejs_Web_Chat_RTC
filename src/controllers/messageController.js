import { validationResult } from 'express-validator/check';
import { message } from "./../services/index";
import multer from 'multer';
import { app } from './../config/app';
import { transErrors, transSuccess } from './../../lang/vi';
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
		return res.status(200).send({ message: newMessage });
	} catch (error) {
		console.log("loi tai messcontroller/ctl");
		console.log(error);
		return res.status(500).send(error);
	}
};
let storageImagechat = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, app.image_message_directory);
	},
	filename: (req, file, callback) => {
		let math = app.image_message_type;
		if (math.indexOf(file.mimetype) === -1) {
			console.log("loi tai filename/messctl");
			return callback(transErrors.image_message_type, null);
		};
		let imageName = `${Date.now()}-${file.originalname}`;
		callback(null, imageName);
	}
});
let imageMessUploadFile = multer({
	storage: storageImagechat,
	limits: { fileSize: app.image_message_limit_size }
}).single("my-image-chat");

let addNewImage = (req, res) => {
	imageMessUploadFile(req, res, async (error) => {
		if (error) {
			if (error.message) {
				return res.status(500).send(transErrors.image_size); //ảnh khong được vượt quá 1Mb
			}
			return res.status(500).send(error);
		}
		try {
			let sender = {
				id: req.user._id,
				name: req.user.username,
				avatar: req.user.avatar,
			};
			// lấy dữ liệu truyền lên từ client
			let receiverId = req.body.uid;
			let messageVal = req.file;
			let isChatGroup = req.body.isChatGroup;
			let newMessage = await message.addNewImage(sender, receiverId, messageVal, isChatGroup);
	
			//upload arnh vafo mongodb sau do xoa di
	
			return res.status(200).send({ message: newMessage });
		} catch (error) {
			console.log("loi tai messcontroller/ctl");
			console.log(error);
			return res.status(500).send(error);
		}
	});
};


module.exports = {
	addNewTextEmji,
	addNewImage,
};