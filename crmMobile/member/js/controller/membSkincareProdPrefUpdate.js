/**
 * Created by lenovo on 2016/5/25.
 */
app.controller('membSkincareProdPrefUpdateCtrl', function($scope,$sessionStorage,$stateParams,comApi, $timeout){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit('navMenu.type', navMenu);

    //会员的数据编号
    $scope.curMembNum = $stateParams.membNum;
   /* $scope.addressDet = $sessionStorage.memInfoDetail;

    $scope.isChecked1 = true;
    $scope.isChecked2 = true;
*/
    $scope.infoShow = true;

    $timeout(function() {
        $scope.infoShow = false;
    }, 3000);

    //护肤品喜好
    $scope.skinDemands  = comApi.getSelectSkin("C027",0);
    comApi.myConsoleLog('护肤品喜好===', $scope.skinDemands, "===");
    $scope.prodPre = [];

    //如果没有选中护肤品洗好，则全部值为空
    if (comApi.isNotNullAndUndefined($sessionStorage.membSkinCarePreUpdate)) {
        $scope.skinDemands = angular.copy($sessionStorage.membSkinCarePreUpdate);
    } else {
        //选中的状态标志
        if (comApi.isNotEmptyObject($sessionStorage.memInfoDetailEdit.membSkinCareNeed.C027)){

            //$scope.prodPre = $sessionStorage.memInfoDetailEdit.membSkinCareNeed.C027.split(',');
            $scope.prodPre = $sessionStorage.memInfoDetailEdit.membSkinCareNeed.C027;
            //$scope.prodPre = $sessionStorage.memInfoDetailEdit.membSkinCareNeed.C027;
        }
        //选中的状态标志
        for (var i=0; i<$scope.skinDemands.length; i++) {
            $scope.skinDemands[i].checked = false;
            for (var j=0; j<$scope.prodPre.length; j++) {
                if ($scope.skinDemands[i].key == $scope.prodPre[j]) {
                    $scope.skinDemands[i].checked = true;
                    break;
                }
            }
        }
    }



    $scope.updateMembSkinCare = function(){
        $sessionStorage.membSkinCarePreUpdate = angular.copy($scope.skinDemands);
        comApi.myConsoleLog('选中的护肤品喜好===', $sessionStorage.membSkinCarePreUpdate, "====");
    }

});