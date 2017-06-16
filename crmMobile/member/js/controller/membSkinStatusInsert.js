/**
 * Created by lenovo on 2016/5/25.
 */
app.controller('membSkinStatusInsertCtrl', function($scope,$sessionStorage,$stateParams,comApi, $timeout){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit('navMenu.type', navMenu);

    $scope.infoShow = true;

    $timeout(function() {
        $scope.infoShow = false;
    }, 3000);

    //会员的数据编号
    /*$scope.curMemIndex = $stateParams.memIndex;
     $scope.addressDet = $sessionStorage.memInfoDetail;

     $scope.isChecked1 = true;
     $scope.isChecked2 = true;*/


    //肌肤问题
    $scope.skinProbs = comApi.getSelectSkin("C026",0);
    comApi.myConsoleLog('肌肤现状数据===', $scope.skinProbs, "===");

   // $scope.sel = ['D001','D011','D005'];

    //如果没有选中护肤品喜好，则全部值为空
    if (comApi.isNotNullAndUndefined($sessionStorage.membSkinStatusInsert)) {
        $scope.skinProbs = angular.copy($sessionStorage.membSkinStatusInsert);
    } else {
        //选中的状态标志
        for (var i=0; i<$scope.skinProbs.length; i++) {
            $scope.skinProbs[i].checked = false;
        }

    }

    $scope.saveMembSkinStatus = function(){
        $sessionStorage.membSkinStatusInsert = angular.copy($scope.skinProbs);
        comApi.myConsoleLog('选中肌肤现状数据===', $sessionStorage.membSkinStatusInsert, "====");
    };

});