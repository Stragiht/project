
app.controller('memBatUpdateOneByOneCtrl',['$scope','$state','NgTableParams','$element','comApi','$filter', '$rootScope', '$modal', function($scope,$state,NgTableParams,element,comApi,$filter,$rootScope,$modal){
    //直属主管弹窗
    $scope.openMemUpdOneByOne = function (index,size) {
        var modalInstance = $modal.open({
            templateUrl: 'radiostaff.html',
            controller: 'radioStaffController',
            size: size,
            resolve: {
                //传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
                flag: function () {
                    return 2;
                },
                //配置需要注入JS
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(['common/js/controllers/radiostaff.js']);
                }]
            }

        });

        //父子传递参数
        modalInstance.result.then(function (selectedItem) {
            //给text窗口赋显示格式的值
        	if(selectedItem && selectedItem.length > 0 && selectedItem[0] != null){
        		 $scope.memBatUpdateOneByOne[index].crtdStfNumNm = selectedItem[0].stfNum + "." + selectedItem[0].stfNm;  //ascription
                 $scope.memBatUpdateOneByOne[index].crtdStfNum = selectedItem[0].stfNum;  //ascription

        	}else{
        		 $scope.memBatUpdateOneByOne[index].crtdStfNumNm = "";  //ascription
                 $scope.memBatUpdateOneByOne[index].crtdStfNum = null;  //ascription
        	}
        });
    };

    //会员组别
    //$scope.membGrps = comApi.stoMembGrp(0);
    comApi.selectMemGrp(function(){
        $scope.membGrps = comApi.getMembGrp(0);
    });
    $scope.memBatUpdateOneByOne = $rootScope.memBatUpdateOBO;
    for(var i=0; i<$scope.memBatUpdateOneByOne.length; i++) {
    	if($scope.memBatUpdateOneByOne[i].crtdStfNum != null && $scope.memBatUpdateOneByOne[i].crtdStfNum != ""){
    		$scope.memBatUpdateOneByOne[i].crtdStfNumNm = $scope.memBatUpdateOneByOne[i].crtdStfNum + '.' +$scope.memBatUpdateOneByOne[i].crtdStfNm;
    	}else{
    		$scope.memBatUpdateOneByOne[i].crtdStfNumNm = "";
    	}
    }

    $scope.memBatUpdOneByOne = function() {
        //提交时备份数据
        $scope.memBatSubData = angular.copy($scope.memBatUpdateOneByOne);
        //删除不需要提交的数据
        for (var j=0; j<$scope.memBatSubData.length; j++) {
            delete $scope.memBatSubData[j]["bindWctAcct"];
            delete $scope.memBatSubData[j]["crtdStfNm"];
            delete $scope.memBatSubData[j]["crtdStfNumNm"];
            delete $scope.memBatSubData[j]["provChnl"];
            delete $scope.memBatSubData[j]["registTm"];
        }
            comApi.post('membBas/updateMembBasBatchByOne',$scope.memBatSubData, function(data){
            	comApi.successMessage('msg.member.10005');
                setTimeout(function() {
                    $state.go('app.member.memBatUpdate');
                },1000);
            })

    }

}]);
