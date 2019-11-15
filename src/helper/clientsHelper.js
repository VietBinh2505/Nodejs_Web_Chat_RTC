import moment from "moment";
export let bufferToBase64 = (bufferFrom) => {
	return Buffer.from(bufferFrom).toString("base64");
};

export let lastItemArray = (array) => { //lấy ra tin nhắn cuối cùng trong mảng
	if (!array.length) {
		return [];
	}
	else {
		return array[array.length - 1]; //lấy chỉ số cuối cùng của mảng
	}
};

export let convertTimestampToHumanTime = (timestamp) => {
	if(!timestamp){
		return "";
	}
	else{
		return moment(timestamp).locale("vi").startOf("seconds").fromNow();//vi là tiếng việt, second là giây, fromNow: kể từ now
	}
};