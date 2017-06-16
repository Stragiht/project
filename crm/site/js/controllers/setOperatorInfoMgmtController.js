app.controller('setOperatorInfoMgmtController',function($scope,comApi,$modal,$state) {

	/*$scope.openStaff = function(size, flg) {
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
				if (flg == 1) {
					$scope.stfRecvDbMsgCnfs.push({"stfNum": selectedItem[0].stfNum, "stfNm": selectedItem[0].stfNm});
				} else if (flg == 2) {
					$scope.updateStfRecvDbMsgCnfs.push({"stfNum": selectedItem[0].stfNum, "stfNm": selectedItem[0].stfNm});
				}

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

	//查询 【接收新增人员触发的站内信人员】列表
	$scope.searchInsertStfRecvDbMsgCnf = function() {
		comApi.post("systemSetting/showInsertStfRecvDbMsgCnf", $scope.insertStfRecvDbMsgCnfData, function(data){
			$scope.stfRecvDbMsgCnfs = data.data;

		})
	};

	//查询 【接收编辑/批量修改人员触发的站内信人员】列表
	$scope.searchUpdateStfRecvDbMsgCnf = function() {
		comApi.post("systemSetting/showUpdateStfRecvDbMsgCnf", $scope.updateStfRecvDbMsgCnfData, function(data){
			$scope.updateStfRecvDbMsgCnfs = data.data;

		})
	};

	$scope.init = function() {
		$scope.insertStfRecvDbMsgCnfData = {
			"pageNum": 1,
			"pageSize": "",
			"params":{
				"stfNum": "",
				"stfNm": ""
			}
		};

		$scope.updateStfRecvDbMsgCnfData = {
			"pageNum": 1,
			"pageSize": "",
			"params":{
				"stfNum": "",
				"stfNm": ""
			}
		};

		//tabFlg为1时表示tab在新增位置，为2时表示在编辑位置，用于保存的一个标志
		$scope.tabFlg = 1;

		$scope.stfCode = [];
		$scope.updateStfCode = [];
		$scope.searchInsertStfRecvDbMsgCnf();
		$scope.searchUpdateStfRecvDbMsgCnf();
	};

	$scope.init();

	//保存 【接收新增人员触发的站内信人员】
	$scope.saveInsertStfRecvDbMsgCnf = function() {
		angular.forEach($scope.stfRecvDbMsgCnfs, function(data,index,array){
			$scope.stfCode.push(data.stfNum)
		});
		comApi.post("systemSetting/saveInsertStfRecvDbMsgCnf", $scope.stfCode, function(data){
			comApi.successMessage("msg.common.20010");
		})
	};



	//保存 【接收编辑/批量修改人员触发的站内信人员】列表
	$scope.saveUpdateStfRecvDbMsgCnf = function() {
		angular.forEach($scope.updateStfRecvDbMsgCnfs, function(data,index,array){
			$scope.updateStfCode.push(data.stfNum);
		});
		comApi.post("systemSetting/saveUpdateStfRecvDbMsgCnf", $scope.updateStfCode, function(data){
			comApi.successMessage("msg.common.20010");
		})
	};

	$scope.save = function() {

		if ($scope.tabFlg == 1) {
			$scope.saveInsertStfRecvDbMsgCnf();
		} else if($scope.tabFlg == 2) {
			$scope.saveUpdateStfRecvDbMsgCnf();
		}
	};

	$scope.tabLocal = function(loc) {
		$scope.tabFlg = loc;
	};


	// 删除
	$scope.delInsert = function(index){
		$scope.stfRecvDbMsgCnfs.splice(index, 1);
	};

	$scope.delUpdate = function(index){
		$scope.updateStfRecvDbMsgCnfs.splice(index, 1);
	};
});
  