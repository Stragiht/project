<%@ page language = "java" contentType = "text/html; charset=UTF-8" pageEncoding = "UTF-8" %>
<%@ page import = "com.pokeepera.common.util.HttpRequestDeviceUtil" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv = "Content-Type" content = "text/html; charset=UTF-8">
		<title>404</title>
		<script type = "text/javascript" language = "JavaScript">
			var isPc = <%= HttpRequestDeviceUtil.isPCDevice(request)%>;
			var url = "${pageContext.request.contextPath}/crmMobile/";
			if(isPc == true){
				url = "${pageContext.request.contextPath}/crm/";
			}
			<% response.setHeader("b-us-dw-biduke", "/system/404"); %>
			window.location.href = url;
		</script>
	</head>
	<body>
	
	</body>
</html>