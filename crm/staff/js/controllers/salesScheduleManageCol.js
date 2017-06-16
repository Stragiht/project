/**
 * Created by 朱艳春 on 2016-3-10.
 */


 app.controller("salesScheduleManageCol", function ($scope, $http,$state,$location,comApi,toaster) {
	 	 //加载一览数据
		 comApi.get('SalesScheduleManage/salesScheduleSelect',function(data){
			 $scope.xsdq = data;
			 if(data==null){
				   $scope.countNumber=0;  
			   }else{
				   $scope.countNumber=data.length;		
			   } 
		 });
		 //点击删除的删除方法
		 
		 $scope.scheduleDelete = function (oid) {
		   $scope.rccFlag = 1; //放入回收站标识
		   comApi.openDelWindow(function(){
  		     comApi.post('SalesScheduleManage/scheduleDelete',{oid:oid},
                   function(data){
                   comApi.HintMessage( ["success","档期"], "提示", "msg.common.00031",3000, "");
                   comApi.selectphaALL();
                   comApi.get('SalesScheduleManage/salesScheduleSelect',function(data){
                       $scope.xsdq = data;
                       if(data==null){
                         $scope.countNumber=0;  
                       }else{
                           $scope.countNumber=data.length;      
                       } 
                   });
  		     });
            }, $scope.rccFlag)
	    	 
	    }
		 //点击编辑跳转页面
	    $scope.scheduleUpdate = function(oid){
	    	$location.path("/app/staff/salesScheduleUpdate/"+oid);
	    }
	    
 });
