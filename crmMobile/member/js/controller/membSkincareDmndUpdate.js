/**
 * Created by lenovo on 2016/5/25.
 */
app.controller('membSkincareDmndUpdateCtrl', function($scope, $sessionStorage, $stateParams, comApi, $timeout){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit('navMenu.type', navMenu);

    //会员编号
    $scope.curMembNum = $stateParams.membNum;

    $scope.infoShow = true;

    $timeout(function() {
        $scope.infoShow = false;
    }, 3000);

    //护肤护理需求
    $scope.skinDailyDemands = comApi.getSelectSkin("C028",0);
    comApi.myConsoleLog('护肤护理需求===', $scope.skinDailyDemands, "===");
    $scope.careDmnd = [];

    if (comApi.isNotNullAndUndefined($sessionStorage.membSkinDmdUpdate)) {
        $scope.skinDailyDemands = angular.copy($sessionStorage.membSkinDmdUpdate);
    } else {
        //选中的状态标志
        if (comApi.isNotEmptyObject($sessionStorage.memInfoDetailEdit.membSkinCareNeed.C028)){

            //$scope.careDmnd = $sessionStorage.memInfoDetailEdit.membSkinCareNeed.C028.split(',');
            $scope.careDmnd = $sessionStorage.memInfoDetailEdit.membSkinCareNeed.C028;
            //$scope.careDmnd = $sessionStorage.memInfoDetailEdit.membSkinCareNeed.C028;
           // console.log($scope.careDmnd)
        }

        //选中的状态标志
        for (var i=0; i<$scope.skinDailyDemands.length; i++) {
            $scope.skinDailyDemands[i].checked = false;
            for (var j=0; j<$scope.careDmnd.length; j++) {
                if ($scope.skinDailyDemands[i].key == $scope.careDmnd[j]) {
                    $scope.skinDailyDemands[i].checked = true;
                    break;
                }
            }
        }
    }


    $scope.updateMembSkinDmn = function(){
        $sessionStorage.membSkinDmdUpdate = angular.copy($scope.skinDailyDemands);
        comApi.myConsoleLog('选中的护肤品需求===', $sessionStorage.membSkinDmdUpdate, "====");
    }

});