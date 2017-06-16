app.controller('depMngSelectController',function ($scope,$http,NgTableParams,comApi,toaster,$state) {
    
    //部门管理一览初始化
    comApi.get('depMng/depMngSelect',function(data){
        $scope.data = data;
        $scope.gydst=data.length;
    });
    //去向编辑页面
    $scope.depMngUpdate=function(depNum){
    	$state.go("app.staff.depMngUpdate",{depNum:depNum});
    }
    //删除操作
    $scope.depMngDelete = function(depNum) {
    	$scope.rccFlag = 1; //放入回收站标识
    comApi.openDelWindow(function(){
        comApi.post('depMng/depMngDelete',{depNum:depNum},function(data){
        if(data == 1){
		 //重新加载session
		 //1.部门信息
		 comApi.selectDepartmentALL();
          comApi.get('depMng/depMngSelect',function(data){
              $scope.data = data;
              $scope.gydst=data.length;
          });
        }else if(data == 0){
          comApi.HintMessage( ["error","部门"], "错误", "msg.common.00015",0, "");
 	  	  return;
        }
        
        });
       
    },$scope.rccFlag)
    }
});