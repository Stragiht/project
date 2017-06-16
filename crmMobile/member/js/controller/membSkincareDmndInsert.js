/**
 * Created by lenovo on 2016/5/26.
 */
app.controller('membSkincareDmndInsertCtrl', function($scope,$sessionStorage,$stateParams,comApi, $timeout){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit('navMenu.type', navMenu);

    $scope.infoShow = true;

    $timeout(function() {
        $scope.infoShow = false;
    }, 3000);

    //护肤护理需求
    $scope.skinDailyDemands = comApi.getSelectSkin("C028",0);
    comApi.myConsoleLog('护肤护理需求===', $scope.skinDailyDemands, "===");

    if (comApi.isNotNullAndUndefined($sessionStorage.membSkinDmdInsert)) {
        $scope.skinDailyDemands = angular.copy($sessionStorage.membSkinDmdInsert);
    } else {
        //选中的状态标志
        for (var i=0; i<$scope.skinDailyDemands.length; i++) {
            $scope.skinDailyDemands[i].checked = false;
        }
    }

    $scope.saveMembSkinDmn = function(){
       $sessionStorage.membSkinDmdInsert = angular.copy($scope.skinDailyDemands);
        comApi.myConsoleLog('选中的肌肤现状===', $sessionStorage.membSkinDmdInsert, "====");
    }

});