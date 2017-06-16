<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>


<!--

	<form action="${pageContext.request.contextPath}/api/upload/files" method="POST" enctype="multipart/form-data">
		 文件功能模块类型：<br/>
		个人头像：userfhotourl<br/>
		银行卡照片：bankfhotourl<br/>
		身份证正面：idcardposurl<br/>
		附件：attachment<br/>
		其他：不用输入，或输入的值不在上面范围<br/>
		<br/>
		请输入文件功能模块类型：<input type="text" name="type"/><br/>
		请上传图片：<br/>
		文件1：<input name="file" type="file"/><br/><br/>
		
 -->
 
 	<form action="${pageContext.request.contextPath}/api/gdsInfo/insertGdsByImportExcel" method="POST" enctype="multipart/form-data">
		文件n：<input name="file" type="file"/><br/><br/>
		<input type="submit" value="确定上传" />
	</form>

</html>