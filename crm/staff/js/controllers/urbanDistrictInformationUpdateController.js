app.controller('urbanDistrictInformationUpdateController', ['toaster','test','$scope','$stateParams','$state','comApi',function(toaster,test,$scope,$stateParams,$state,comApi) {
//	alert(test.getParameter("测试"));
//	alert(test.property);
//	alert($stateParams.pageIndex);
//	alert($stateParams.partiNum);
	//toaster.pop('error', '错误', "您的信息不正确!", 2000, 'trustedHtml', function () {});
	//对模型初始化,否则会报undefind异常
	$scope.add = {};
	//编辑页面初始化
	comApi.post("UrbanDistrictInformation/selectByPartiNum", {partiNum:$stateParams.partiNum},function (data) {

	///////////////////////////////////////////////////////////////////////////	
    //加载渠道信息
	//清空刷新渠道列表下拉表;
	$scope.ChnlInfoList="";
	//给渠道下拉框赋值
	$scope.ChnlInfoList = comApi.getChnlList("PGSTFW0240003", 0);	
	//默认第一项被选中
//	$scope.add.subChnl=$scope.ChnlInfoList[0].key;
	$scope.add.subChnl=data.subChnl;
	//加载大区信息 	
	//清空刷新大区列表下拉表
	$scope.MajRegInfoList="";
	//给大区下拉框赋值
	$scope.MajRegInfoList=comApi.getMajRgnList($scope.add.subChnl, 0);
	//默认第一项被选中
//	$scope.add.majRgnNum=$scope.MajRegInfoList[0].key;
	$scope.add.majRgnNum=data.majRgnNum;
	//加载省份信息    	
	//清空刷新省份下拉表
	$scope.proVinceInfoList="";
	//给省份下拉框赋值
	$scope.proVinceInfoList=comApi.getProList($scope.add.subChnl,$scope.add.majRgnNum,0);
	//默认第一项被选中
//	$scope.add.rgnNum=$scope.proVinceInfoList[0].key;
	$scope.add.rgnNum=data.rgnNum;
	//加载城市信息
	//清空刷新城市下拉表
	$scope.cityInfoList="";
	//给城市下拉框赋值
	$scope.cityInfoList=comApi.getCityList($scope.add.subChnl,$scope.add.majRgnNum,$scope.add.rgnNum,0);
	//默认第一项被选中
//	$scope.add.city=$scope.cityInfoList[0].key;
	$scope.add.city=data.city;
	//////////////////////////////////////////////////////////////////////////
    //初始化赋值
	$scope.add.partiNum=data.partiNum;
	$scope.add.partiNm=data.partiNm;
	//往数组里添加元素
	$scope.add.updtTm=data.updtTm;
	});
	//联动城市
	$scope.changecityInfo=function(subChnl,majRgnNum,proRgnNum){
		if(subChnl==""||subChnl==null||subChnl==undefined){
			subChnl=$scope.add.subChnl;
		}
		
		if(majRgnNum==""||majRgnNum==null||majRgnNum==undefined){
			majRgnNum=$scope.add.majRgnNum;
		}
		if(proRgnNum==""||proRgnNum==null||proRgnNum==undefined){
			proRgnNum=$scope.add.rgnNum;
		}
		    //加载城市信息
			//清空刷新下拉框
			$scope.cityInfoList="";
			//给城市下拉框赋值
			var data=comApi.getCityList(subChnl,majRgnNum,proRgnNum,0);
			$scope.cityInfoList=data;
			//第一项被选中
			$scope.add.city=$scope.cityInfoList[0].key;
	}
	//联动省份
	$scope.changeproVinceInfo=function(subChnl,majRgnNum){	
		//console.log("接收参数:"+$scope.add.majRgnNum);
		if(subChnl==""||subChnl==null||subChnl==undefined){
			subChnl=$scope.add.subChnl;
		}
		if(majRgnNum==""||majRgnNum==null||majRgnNum==undefined){
			majRgnNum=$scope.add.majRgnNum;
		}
		//加载省份信息
		//清空刷新下拉表
		$scope.proVinceInfoList="";
		$scope.cityInfoList="";
		//给省份下拉框赋值
		var data=comApi.getProList(subChnl,majRgnNum,0);
		$scope.proVinceInfoList=data;
		//第一项被选中
		$scope.add.rgnNum=$scope.proVinceInfoList[0].key;
		$scope.changecityInfo(subChnl,$scope.add.majRgnNum,$scope.add.rgnNum);
	}
    //联动大区
	$scope.changeMajRegInfo=function(subChnl){	
		if(subChnl==""||subChnl==null||subChnl==undefined){
			subChnl=$scope.add.subChnl;
		}
	    //加载大区信息
		var data=comApi.getMajRgnList(subChnl, 0);
		//清空刷新大区省城市下拉表
		$scope.MajRegInfoList="";
		$scope.proVinceInfoList="";
		$scope.cityInfoList="";
		//给大区下拉框赋值
		$scope.MajRegInfoList=data;
		//第一项被选中
		$scope.add.majRgnNum=$scope.MajRegInfoList[0].key;
		$scope.changeproVinceInfo(subChnl,$scope.add.majRgnNum);
	}
	//点击确定编辑数据
	$scope.submit=function(isValid){
	//提交表单时进行验证
    $scope.isSubmitted = true;
	//alert($scope.add.partiNum);
	//alert($stateParams.updtTm);
	//编辑保存数据
	if(isValid){
    comApi.post("UrbanDistrictInformation/update",$scope.add,function (data) {
     if(data==1){
	    //操作提示
	    comApi.HintMessage( ["success","城市分区数据"], "提示", "msg.common.00023",3000, "");	
  	    //重新加载session
  	    //1.城市分区信息
  	    comApi.selectUrbDistricALL();
  	    $state.go("app.staff.urbandistrictinformationSelect",{pageIndex:$stateParams.pageIndex,count:$stateParams.count,pageCount:$stateParams.pageCount});
       //$location.path("/app/staff/urbandistrictinformationSelect/"+$stateParams.pageIndex);
     }else{
	   //操作提示
       comApi.HintMessage( ["error","该城市分区"], "错误", "msg.common.00019",0, "");
	   return;
     }
    });
	}
}
//点击返回
$scope.fanhui=function(){
		$state.go("app.staff.urbandistrictinformationSelect",{pageIndex:$stateParams.pageIndex,count:$stateParams.count,pageCount:$stateParams.pageCount, isBack:true});
//       $location.path("/app/staff/urbandistrictinformationSelect/");
}
}]);
//工厂测试
app.factory("test",function(){
	var Array={};
	
	Array.getParameter=function(flag){
		return flag;
	}
	Array.property="获取参数!";
	return Array;
});