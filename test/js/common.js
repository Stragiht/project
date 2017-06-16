function getCookie(cookieName) {
	var cookieString = document.cookie;
	var start = cookieString.indexOf(cookieName + '=');
	// 加上等号的原因是避免在某些 Cookie 的值里有
	// 与 cookieName 一样的字符串。
	if (start == -1)
		// 找不到
		return null;
	start += cookieName.length + 1;
	var end = cookieString.indexOf(';', start);
	if (end == -1)
		return unescape(cookieString.substring(start));
	return unescape(cookieString.substring(start, end));
}

function logout() {
	var expires = new Date(); 
	//expires.setTime(expires.getTime() + 3 * 30 * 24 * 60 * 60 * 1000); 
	expires.setTime(expires.getTime() - 1000); 
	/* 三个月 x 一个月当作 30 天 x 一天 24 小时 x 一小时 60 分 x 一分 60 秒 x 一秒 1000 毫秒 */ 
	document.cookie = 'X-Token=1;expires=' + expires.toGMTString() + ';path=/';
	window.open('','_self','');
	window.close();
}