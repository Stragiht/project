/**
 * Created by lenovo on 2016/5/26.
 */
app.controller('membSkincareProdPrefInsertCtrl', function($scope,$sessionStorage,$stateParams,comApi, $timeout){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit('navMenu.type', navMenu);

    $scope.infoShow = true;

    $timeout(function() {
        $scope.infoShow = false;
    }, 3000);
    //会员的数据编号
    /* $scope.curMemIndex = $stateParams.memIndex;
     $scope.addressDet = $sessionStorage.memInfoDetail;

     $scope.isChecked1 = true;
     $scope.isChecked2 = true;*/
    //护肤品喜好
    $scope.skinDemands  = comApi.getSelectSkin("C027",0);
    comApi.myConsoleLog('护肤品喜好===', $scope.skinDemands, "===");

    //如果没有选中护肤品洗好，则全部值为空
    if (comApi.isNotNullAndUndefined($sessionStorage.membSkinCarePreInsert)) {
        $scope.skinDemands = angular.copy($sessionStorage.membSkinCarePreInsert);
    } else {
        //选中的状态标志
        for (var i=0; i<$scope.skinDemands.length; i++) {
            $scope.skinDemands[i].checked = false;
        }
    }


    $scope.saveMembSkinCare = function(){
        $sessionStorage.membSkinCarePreInsert = angular.copy($scope.skinDemands);
        comApi.myConsoleLog('选中的护肤品喜好===', $sessionStorage.membSkinCarePreInsert, "====");
    }

});