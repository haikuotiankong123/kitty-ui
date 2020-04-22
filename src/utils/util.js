
let util = {}

util.notify = (title, message) => {
	window.vm.$notify({
		title,
		message
	});

}

util.confirm = (title, func, callback) => {
	window.vm.$alert(title, {
		confirmButtonText: '确定',
		callback: function (action) {
			if (action === 'confirm') {
				(typeof callback === 'function') ? func().then(callback) : func()
			}
		}
	});
};

util.message = msg => {
    window.vm.$message(msg)
}

util.error = msg => {
    window.vm.$message.error(msg)
}

util.warning = msg => {
    window.vm.$message.warning(msg)
} 

const dateFormat = (date, fmt = 'yyyy-MM-dd') => {
    if(typeof(date) != 'object'){
        console.log('日期时间有误！！');
        return;
    }
	let o = {
		"M+": date.getMonth() + 1,
		"d+": date.getDate(),
		"H+": date.getHours(),
		"m+": date.getMinutes(),
		"s+": date.getSeconds(),
		"S+": date.getMilliseconds()
	};
	//因位date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：

	if (/(y+)/.test(fmt)) {
		//第一种：利用字符串连接符“+”给date.getFullYear()+""，加一个空字符串便可以将number类型转换成字符串。
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (let k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			//第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(String(o[k]).length)));
		}
	}
	return fmt;
}
util.dateFormat = dateFormat

export default util