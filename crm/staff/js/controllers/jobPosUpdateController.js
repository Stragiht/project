app.controller('jobPosUpdateController', ['toaster','$scope','$http','$state','comApi','$stateParams',function(toaster,$scope,$http,$state,comApi,$stateParams){
	$scope.datas = [];
	//编辑时需要把相关信息根据职位编号检索出来赋值到页面,所以这段代码注释掉,也是区别于添加的地方
	//这里写对应页面要用的js
	//var datas = [{posGrdNm:"",posGrd:""}];
	//初始化是被选中
	//$scope.poiSetFlg=1;
	//$scope.datas = datas;
	var dataparams;
	var posNum=comApi.myEncodeURIComponent($stateParams.posNum);
	comApi.get('JobPos/selectByPosNum/'+posNum,function(data){
		dataparams=data;
		//给职位信息赋值
		$scope.posNum=data[0].posNum;
		$scope.posNm=data[0].posNm;
		$scope.poiSetFlg=data[0].poiSetFlg;
		$scope.jobResponse=data[0].jobResponse;
		//初始化时添加职位信息的更新时间
		$scope.jobPosUpdtTm=data[0].jobPosUpdtTm;
		$scope.refStr = data[0].refStr ? 1 : 0;
		if($scope.poiSetFlg==1){
			angular.element("#PosGrid").show();
			angular.element("#PosGridGroup").show();
			$scope.fontStyle=true;
		}else if($scope.poiSetFlg==0){
			angular.element("#PosGrid").hide();
			angular.element("#PosGridGroup").hide();
			$scope.fontStyle=false;
			$scope.datas=[];
			return;
		}
		//给职位和职位等级关联关系赋值
		for(var i=0;i<data.length;i++){
		var obj = {};
		obj.posGrdNum=data[i].posGrdNum;
		obj.jobRelPosUpdtTm=data[i].jobRelPosUpdtTm;
		obj.posGrdNm= data[i].posGrdNm;
		obj.posGrd= data[i].posGrd;
		obj.flag = "1";
		$scope.datas.push(obj);	
		}
		return;
	});
    //点击删除按钮更新flag
    $scope.del = function(delId){
    	if($scope.datas[delId].posGrdNum){
    		$scope.datas[delId].flag = "0";
    	}else{
    		$scope.datas.splice(delId,"1");
    	}
    
    }
	//添加等级
	$scope.addPosGrid=function(){
		 $scope.datas.push({posGrdNm:"",posGrd:"",flag:"2"});
	}
	//隐藏或显示等级
	$scope.showorhide=function(flag){
	if(flag==1){
		angular.element("#PosGrid").show();
		angular.element("#PosGridGroup").show();
		$scope.fontStyle=true;
		//给职位和职位等级关联关系赋值
		//此处理主要是考虑设置添加完职位等级后去编辑页面改为否保存然后再改为是,这时应该把已经添加的记录显示出来,
		//而不是单一的在table加一个空行,好让用户知道之前我添加选择是时对等级信息进行了哪些操作,同时判断此职位如果从来没设置过等级,这时应该给个空行
//		if(dataparams[0].posGrdNum==undefined||dataparams[0].posGrdNum==null){
//			//清空刷新table
//			$scope.datas=[];
//			$scope.datas.push({posGrdNm:"",posGrd:"",flag:"2"});
//		}else{
//		  //清空刷新table
//		  $scope.datas=[];
//		  for(var i=0;i<dataparams.length;i++){
//			 var obj = {};
//			 obj.posGrdNum=dataparams[i].posGrdNum;
//			 obj.jobRelPosUpdtTm=dataparams[i].jobRelPosUpdtTm;
//			 obj.posGrdNm= dataparams[i].posGrdNm;
//			 obj.posGrd= dataparams[i].posGrd;
//			 obj.flag = "1";
//			 $scope.datas.push(obj);				
//			}
//		}
		//$scope.datas.push({posGrdNm:"",posGrd:"",flag:"2"});
	    //如果编辑时选择是否设置职位等级选否,然后提交保存,到后台逻辑删除此职位
	}else if(flag==0){
		angular.element("#PosGrid").hide();
		angular.element("#PosGridGroup").hide();
		$scope.fontStyle=false;
//		if(dataparams[0].posGrdNum==undefined||dataparams[0].posGrdNum==null){
//			 $scope.datas=[];
//		}else{		
//          //清空刷新table
//		  $scope.datas=[];
//		  for(var i=0;i<dataparams.length;i++){
//			 var obj = {};
//			 obj.posGrdNum=dataparams[i].posGrdNum;
//			 obj.jobRelPosUpdtTm=dataparams[i].jobRelPosUpdtTm;
//			 obj.posGrdNm= dataparams[i].posGrdNm;
//			 obj.posGrd= dataparams[i].posGrd;
//			 obj.flag = "0";
//			 $scope.datas.push(obj);				
//			}
//	     }
	  }
	}
	//提交保存
	$scope.savePosGrid=function(valid){
		//提交时进行信息验证
		$scope.isSubmitted=true;
		//check验证选择设置等级信息时,至少保留一行table数据
		if($scope.poiSetFlg==1){
            var delflag= 0;
		    for(var i=0;i<$scope.datas.length;i++){
		        delflag = $scope.datas[i].flag == 0 ? (0+delflag) : (1+delflag);
		    }
  		    if(delflag==0){
                comApi.HintMessage("error","错误","msg.common.00030",0,"");
                return;
            }
		}else{
			if(dataparams[0].posGrdNum==undefined||dataparams[0].posGrdNum==null){
				 $scope.datas=[];
			}
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
		if(!$scope.poiSetFlg){
		  $scope.datas=[];
		}
		//整理json数据
		var json= {posGridObject:$scope.datas,posNum:$scope.posNum,posNm:$scope.posNm,poiSetFlg:$scope.poiSetFlg,jobResponse:$scope.jobResponse,jobPosUpdtTm:$scope.jobPosUpdtTm,refStr:$scope.refStr==1};
		if(valid){
		//向后台保存数据
    	comApi.post("JobPos/update",json,function(data) {
    		if(data==0){
    			comApi.HintMessage( ["error","该职位"], "错误", "msg.common.00019",0, "");
    			return;
    		}else if(data==1){
    			comApi.HintMessage( ["success","职位管理数据"], "提示", "msg.common.00023",3000, "");	
    			//重新加载session
				//1.职位信息表
				comApi.selectJobPosALL();
				//2.职位等级关联关系
				comApi.selectPosRelPosLvlALL();
    			$state.go("app.staff.jobposSelect");
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