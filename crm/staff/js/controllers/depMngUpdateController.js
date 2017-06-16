app.controller('depMngUpdateController',function($scope,$stateParams,comApi,$modal,$state) {
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
    //编辑部门页一览
    comApi.get('depMng/depMngInfo/' + $stateParams.depNum,function(data){
        $scope.depMng.depNum = data.depNum;
        $scope.depMng.depNm = data.depNm;
        if(data.depMgr == "" || data.depMgr == null){
            $scope.depMng.depMgr = data.depMgr;
        }else{
            $scope.depMng.depMgr = data.depMgr + '.' + data.stfNm;
        }
        $scope.depMng.depDesc = data.depDesc;
        //赋值时间做排他
        $scope.depMng.updtTm=data.updtTm;
    });
    
    //更新部门
    $scope.updateDep = function (valid) {
       	$scope.isSubmitted=true;
    	if(valid){
        comApi.post('depMng/updateDepInfo',$scope.depMng,function(data){
        	if(data==1){
                comApi.HintMessage( ["success","部门管理数据"], "提示", "msg.common.00023",3000, "");	
				//重新加载session
				//1.部门信息
				comApi.selectDepartmentALL();
				$state.go("app.staff.depMngSelect");
        	}else if(data==0){
        		comApi.HintMessage( ["error","该部门"], "错误", "msg.common.00019",0, "");
        		return;
        	}
        });
    	}
    }
    
});
