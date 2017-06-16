app.controller('depMngInsertController',function($scope,comApi,$modal,$state) {
	//新增部门信息
	$scope.depMng = {};
	$scope.open5 = function(size) {
	  var modalInstance = $modal.open({
	      templateUrl : 'radiostaff.html',
	      controller : 'radioStaffController',
	      size : size,
	      resolve : {
	        flag : function() {
              return 1;
            },
	        //配置需要注入JS
	        deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/radiostaff.js']);}]
	      }
	  
	  });
	  //父子传递参数
	  modalInstance.result.then(function(selectedItem) {
		  if(selectedItem.length==0){
			  $scope.depMng.depMgr="";
		  }else{	  
			  //清空刷新部门经理
			  $scope.depMng.depMgr="";
			  $scope.depMng.depMgr=selectedItem[0].stfNum+"."+selectedItem[0].stfNm;
		  }
	  });

	};
	//提交保存
    $scope.insertDep = function (valid) {
    	$scope.isSubmitted=true;
    	if(valid){
        comApi.post('depMng/insertDepInfo',$scope.depMng,function(data){
        if(data == 1){
            comApi.HintMessage( ["success","部门管理数据"], "提示", "msg.common.00023",3000, "");	
			//重新加载session
			//1.部门信息
			comApi.selectDepartmentALL();
			$state.go("app.staff.depMngSelect");
            }
        else if(data == 2){
            comApi.HintMessage( ["error","该部门编号"], "错误", "msg.common.00016",0, "");
    		return;	
        }
        });
    	}
    }
});
  