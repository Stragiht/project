app.controller('setStfInfoMgmtController',function($scope,comApi,$modal,$state) {

	/*$scope.openStaff = function(size) {
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
			if(selectedItem.length>0){
				$scope.deptStfCnfs.push({"stfNum": selectedItem[0].stfNum, "stfNm": selectedItem[0].stfNm});
				$scope.xxxs=false;
			}
		});

	};*/

	$scope.openStfs = function(size, operaParm) {

		var modalInstance = $modal.open({
			templateUrl : 'multiselectstaff.html',
			controller : 'multiSelectStaffController',
			size : size,
			resolve : {
				//配置需要注入JS
				deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/multiselectstaff.js']);}]
			}

		});
		//父子传递参数
		modalInstance.result.then(function(selectedItem) {

			var commState = 0;
			$scope.insertSelectedItem = angular.copy(operaParm);

			if (selectedItem.length < 1) {
				comApi.errorMessage("msg.common.20012");
				return;
			}

			if(typeof(operaParm) != "undefined"){

				for(var z=0;z<selectedItem.length;z++){
					for(var i=0; i<$scope.insertSelectedItem.length; i++){
						commState = selectedItem[z].stfNum== $scope.insertSelectedItem[i].stfNum?1:0;
						if (commState == 1) {
							//comApi.errorMessage("msg.common.20011");
							break;
						}
					}

					if (commState == 0) {
						operaParm.push({"stfNum": selectedItem[z].stfNum, "stfNm": selectedItem[z].stfNm});
					}
				}

			}

		});
	};


	//查看所有部门人员权限的人员列表  /systemSetting/showSelectAllDeptStfCnf
	$scope.searchSelectAllDeptStfCnf = function() {
		///          systemSetting/showSelectAllDeptStfCnf
		comApi.post("systemSetting/showSelectAllDeptStfCnf", $scope.allStfInfoMgmtData, function(data){
			comApi.myConsoleLog(angular.toJson(data));
			$scope.allDeptStfCnfs = data.data;

		})
	};

	//查询 【查看自身部门人员权限的人员】列表  /systemSetting/showSelectSelfDeptStfCnf
	$scope.searchSelectSelfDeptStfCnf = function() {
		           //systemSetting/showSelectSelfDeptStfCnf
		comApi.post("systemSetting/showSelectSelfDeptStfCnf", $scope.selStfInfoMgmtData, function(data){
			comApi.myConsoleLog(angular.toJson(data));
			$scope.selfDeptStfCnfs = data.data;

		})
	};

	//初始化
	$scope.init = function() {
		$scope.allStfInfoMgmtData = {
			"pageNum": 1,
			"pageSize": "",
			"params":{
				"stfNum": "",
				"stfNm": ""}
		};

		$scope.selStfInfoMgmtData = {
			"pageNum": 1,
			"pageSize": "",
			"params":{
				"stfNum": "",
				"stfNm": ""
			}
		};

		//tabFlg为1时表示tab在新增位置，为2时表示在编辑位置，用于保存的一个标志
		$scope.tabFlg = 1;

		$scope.allStfCode = [];
		$scope.selfStfCode = [];

		$scope.searchSelectAllDeptStfCnf();

		$scope.searchSelectSelfDeptStfCnf();
	};

	$scope.init();


	//保存 【查看所有部门人员权限的人员】
	$scope.saveSelectAllDeptStfCnf = function() {
		angular.forEach($scope.allDeptStfCnfs, function(data,index,array){
			$scope.allStfCode.push(data.stfNum)
		});
		comApi.post("systemSetting/saveSelectAllDeptStfCnf", $scope.allStfCode, function(data){
			comApi.successMessage("msg.common.20010");
		})
	};

	//保存 【查看自身部门人员权限的人员】
	$scope.saveSelectSelDeptStfCnf = function() {///systemSetting/saveSelectSelfDeptStfCnf
		angular.forEach($scope.selfDeptStfCnfs, function(data,index,array){
			$scope.selfStfCode.push(data.stfNum)
		});
		comApi.post("systemSetting/saveSelectSelfDeptStfCnf", $scope.selfStfCode, function(data){
			comApi.successMessage("msg.common.20010");
		})
	};

	$scope.save = function() {

		if ($scope.tabFlg == 1) {
			$scope.saveSelectAllDeptStfCnf();
		} else if($scope.tabFlg == 2) {
			$scope.saveSelectSelDeptStfCnf();
		}
	};

	$scope.tabLocal = function(loc) {
		$scope.tabFlg = loc;
	};


	// 删除
	$scope.delAllDeptStfCnf = function(index){
		$scope.allDeptStfCnfs.splice(index, 1);
	};

	$scope.delSelfDeptStfCnf = function(index){
		$scope.selfDeptStfCnfs.splice(index, 1);
	}
});
  