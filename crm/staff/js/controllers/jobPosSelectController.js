app.controller('jobPosSelectController', ['toaster','$scope','$http','$state','comApi',function(toaster,$scope,$http,$state,comApi){
   function selectList(){
   comApi.get('JobPos/selectAll',function(data){
	   $scope.data=data;
	   if(data==null){
		   $scope.countNumber=0;  
	   }else{
		   $scope.countNumber=data.length;		
	   }  	
   });
   }
   //加载职位管理列表
   selectList();
   //逻辑删除操作
   $scope.del=function(posNum, jobRelPosGrdNum){
   //alert(posNum+"=============="+updtTm+"=============="+jobRelPosGrdNumAndUpdtTm);
   	$scope.rccFlag = 1; //放入回收站标识
   comApi.openDelWindow(function(){
	   var json={"posNum":posNum,"jobRelPosGrdNum":jobRelPosGrdNum};
	   comApi.post('JobPos/delete',json,function(data){
     		if(data==1){
     	        comApi.HintMessage( ["error","职位"], "错误", "msg.common.00015",0, "");
     			return;
     		}else if(data==2){	
    			//1.职位信息表
				comApi.selectJobPosALL();
				//2.职位等级关联关系
				comApi.selectPosRelPosLvlALL();
     		    selectList();
     		}
	   });
   },$scope.rccFlag)
   }
   //去向更新页面
   $scope.update=function(posNum){
		   $state.go("app.staff.jobposUpdate",{posNum:posNum});
   }
}]);