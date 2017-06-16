app.controller('stfBasSelect', [
		'$scope',
		'$stateParams',
		'NgTableParams',
		'comApi','Upload',
		function($scope, $stateParams,NgTableParams,comApi,Upload) {
			$scope.oneAtATime = true;
			// 初始化手風琴展開效果
			$scope.status = {
				jbxxopen : true,
				gwzzxxopen : true,
				gzkxxopen : true,
				zjdzsmxxopen : true,
				grjlxxopen : true,
				ldhtxxopen : true,
				ssmdopen : true,
				sbxxopen : true,
				gjjxxopen : true,
				zhxxopen : true
			};
			// 初始化变量
			$scope.insert = {};
			// 定义变量判断是否显示所属门店
			$scope.marknum = "1";

			comApi.get("staff/getStfBasInfo/" + $stateParams.stfNum, function(
					data) {

				$scope.insert = data;

				if( typeof ($scope.insert.dtOfBirth+0) != "number"){
					$scope.insert.dtOfBirth = $scope.insert.dtOfBirth.getTime();
				}

				// 获取是否是销售部
				comApi.get("/staff/stfbasmaknum/" + $scope.insert.posNum, function(data) {
					$scope.marknum = data == true ? "0" : $scope.marknum;
				});
				comApi.post("/staff/selectChnlInfo", $scope.insert,
						function(data) {
				   if(data[0]!=null){
                     $scope.chnlNm=data[0].chnlNm;
                     }
					
						});
				comApi.post("/staff/getSelectStoreList", $scope.insert,
						function(data) {
							// ng-table的实现绑定
							$scope.mdtableParams = new NgTableParams({
								// 显示的第几页
								page : 1,
								// 一页显示多少条
								count : 20
							}, {
								// 把data数据集绑定前台
								dataset : data,
								// 可以点击的显示自己想要一页显示多少条
								counts : [ 20, 50, 100, 200 ]
							});

						});
				if (data.supvrStfNum != null && data.supvrStfNum != undefined && data.supvrStfNum != "") {
				  comApi.get("/staff/getStfBasInfo/" + data.supvrStfNum,
                      function(data) {
                        if(data!=null){
                                  $scope.insert.supvrStfNums = data.stfNum + "."
                                          + data.stfNm;
                        }
                      });

                  comApi.get("/staff/getSupvrStfInfo/" + data.supvrStfNum,
                          function(data) {
                              if (data.supvrStfPosNum != "") {
                                  $scope.status.supvrStfInfoDisabled = true;
                                  $scope.supvrStfPosNum = data.supvrStfPosNum;
                                  $scope.supvrStfList = data.supvrStfList;
                              } else {
                                  $scope.status.supvrStfInfoDisabled = false;
                                  $scope.supvrStfPosNum = "";
                                  $scope.supvrStfList = {};
                              }
                  });
				}
				

			});
			comApi.get("/staff/getStfBasHistory/" + $stateParams.stfNum,
					function(data) {
						// ng-table的实现绑定
						$scope.tableParams = new NgTableParams({
							// 显示的第几页
							page : 1,
							// 一页显示多少条
							count : 20
						}, {
							// 把data数据集绑定前台
							dataset : data,
							// 可以点击的显示自己想要一页显示多少条
							counts : [ 20, 50, 100, 200 ]
						});
					});

		} ]);
