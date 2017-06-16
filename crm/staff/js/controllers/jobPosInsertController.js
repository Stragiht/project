app.controller('jobPosInsertController', ['toaster','$scope','$http','$state','comApi',function(toaster,$scope,$http,$state,comApi){
	//这里写对应页面要用的JS
	var datas = [{posGrdNm:"",posGrd:""}];
	//初始化是被选中
	$scope.poiSetFlg=1;
	$scope.datas = datas;
	$scope.fontStyle=true;
	$scope.refStr = 0;
	//添加等级
	$scope.addPosGrid=function(){
		 $scope.datas.push({posGrdNm:"",posGrdNm:""});
	}
	//隐藏或显示等级
	$scope.showorhide=function(flag){
		if(flag==1){
			angular.element("#PosGrid").show();
			angular.element("#PosGridGroup").show();
			$scope.datas=datas;
			$scope.fontStyle=true;
		}else if(flag==0){
			angular.element("#PosGrid").hide();
			angular.element("#PosGridGroup").hide();
			$scope.datas=[];
			$scope.fontStyle=false;
		}
	}
	//提交保存
	$scope.savePosGrid=function(valid){
		//提交时进行信息验证
		$scope.isSubmitted=true;
		
		//check验证选择设置等级信息时,至少保留一行table数据
		if($scope.poiSetFlg==1){
		if($scope.datas.length==0){
			comApi.HintMessage("error","错误","msg.common.00030",0,"");
    		return;
		}
		}else{
			$scope.datas=[];
		}
		var flag=isRepeat($scope.datas);
		//校验等级是否是不超过2位的数字
		var reg = new RegExp(/^([1-9]|[1-9][0-9])$/);		
		for(var i = 0;i<$scope.datas.length;i++){
    		if($scope.datas[i].posGrdNm==null || $scope.datas[i].posGrdNm==undefined || $scope.datas[i].posGrdNm==''){
    			comApi.HintMessage( ["error","职位等级名称"], "错误", "msg.common.00014",0, "");
        		return;
        	}
    		if($scope.datas[i].posGrd==null || $scope.datas[i].posGrd==undefined || $scope.datas[i].posGrd==''){
    			comApi.HintMessage( ["error","职位等级"], "错误", "msg.common.00014",0, "");
        		return;
        	}else{
        		if(!reg.test($scope.datas[i].posGrd)){
        			comApi.HintMessage("error","错误","msg.common.00029",0,"");
            		return;
        	    }
            }
    	}
		if(flag){		
			comApi.HintMessage( ["error","列表职位等级"], "错误", "msg.common.00017",0, "");
			return;
		}else{
		}
		//整理json数据
		var json= {posGridObject: $scope.datas,posNum:$scope.posNum,posNm:$scope.posNm,poiSetFlg:$scope.poiSetFlg,jobResponse:$scope.jobResponse,refStr:$scope.refStr==1};
		if(valid){
		//向后台添加数据
    	comApi.post("JobPos/insert",json,function(data) {
    		if(data==1){
				$scope.datas=[{}];
				comApi.HintMessage( ["success","职位管理数据"], "提示", "msg.common.00023",3000, "");	
				//重新加载session
				//1.职位信息表
				comApi.selectJobPosALL();
				//2.职位等级关联关系
				comApi.selectPosRelPosLvlALL();
				$state.go("app.staff.jobposSelect");
    		}else if(data==0){
    			comApi.HintMessage( ["error","该职位编号"], "错误", "msg.common.00016",0, "");
    			return;
    		}
		});
		}
	}
	//返回按钮
	$scope.fanhui=function(){
	   $state.go("app.staff.jobposSelect");
	}
}]);
//验证数组内元素重不重复,true重复,false不重复
function isRepeat(arr){ 

	var hash = {}; 

	for(var i in arr) { 

	if(hash[arr[i].posGrd]) 

	return true; 

	hash[arr[i].posGrd] = true; 

	} 

	return false; 

} 