/**
 * Created by lenovo on 2016/5/3.
 */
app.controller('memBatUpdateAllCtrl', ['$scope','comApi', '$stateParams', '$sessionStorage', '$modal', '$state', '$rootScope',function($scope,comApi,$stateParams,$sessionStorage,$modal,$state,$rootScope) {

    //统一编辑的数据
    $scope.membBatUpdData = {
        "crtdStfNum": "",
        "grpId": "",
        "membNumAndUpdtTmList": [
            /*{
             "membNum": "",
             "updtTm": ""
             },
             {
             "membNum": "",
             "updtTm": ""
             },
             {
             "membNum": "",
             "updtTm": ""
             }*/
        ]
    }
    //直属主管弹窗
    $scope.openMemUpdAll = function (size) {
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
        		$scope.crtdStfNumNm = selectedItem[0].stfNum + "." + selectedItem[0].stfNm;  //ascription
        		$scope.membBatUpdData.crtdStfNum = selectedItem[0].stfNum;  //ascription
        	}else{
        		$scope.crtdStfNumNm = "";  //ascription
        		$scope.membBatUpdData.crtdStfNum = null;  //ascription
        	}
        });
    };

    $scope.membStr = '';
    if (($rootScope.editMembStr+"").indexOf('') != -1) {
        $scope.membStr = ($rootScope.editMembStr).substring(0,($rootScope.editMembStr).length-1);
    } else {
        $scope.membStr = $rootScope.editMembStr;
    }

    //会员组别
    //$scope.membGrps = comApi.stoMembGrp(0);
    comApi.selectMemGrp(function(){
        $scope.membGrps = comApi.getMembGrp(0);
        $scope.membBatUpdData.grpId = $scope.membGrps[0].key;
    });
    //统一编辑
    $scope.memBatUpdAll = function(){
        $scope.membBatUpdData.membNumAndUpdtTmList = $rootScope.membNumAndUpdtTmList;
        comApi.post('membBas/updateMembBasBatch',$scope.membBatUpdData, function(data){
        	comApi.successMessage('msg.member.10004');
            setTimeout(function() {
                $state.go('app.member.memBatUpdate');
            },1000);
        })
    }


}])

