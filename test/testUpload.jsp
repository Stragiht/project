<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<script src="js/jquery-1.9.1.min.js"></script> 
    	<script src="jquery.form.js"></script> 
		<script type="text/javascript">
			
			
			function downloadFileByContent(fileName, content){
			    var aLink = document.createElement('a');
			    var blob = new Blob([content]);
			    var evt = document.createEvent("HTMLEvents");
			    evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
			    aLink.download = fileName;
			    aLink.href = URL.createObjectURL(blob);
			    aLink.dispatchEvent(evt);
			}
			
			
			function upload(){
	    		$("#aa").ajaxSubmit(function(result){
					if(result && result.meta && result.meta != null){
						alert("返回结果：" + result.meta.success);
						if(result.meta.success == true){
							alert("导入成功：" + result.meta.message);
						}else if(result.data && result.data != null && result.data != ""){
							alert("导入出错，下文件链接：" + result.data);
							window.location = "http://192.168.1.18:8081/uploadFiles/" + url;
						}else{
							alert("出错原因：" + result.meta.message);
							downloadFileByContent("excle导入错误信息.txt", result.meta.message);
						}
					}else{
						downloadFileByContent("excle导入错误信息.txt", result+"");
					}
	    		});
			}
			
			
		</script>
	</head>
	<body>
		<form action="${pageContext.request.contextPath}/api/membBas/insertByExcelImport" method="POST" enctype="multipart/form-data" id="aa">
			文件n：<input name="file" type="file"/><br/><br/>
			<input type="button" value="确定上传" onclick="upload();" />
			<!-- <input type="submit" value="确定上传" /> -->
		</form>
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
	</body>
</html>