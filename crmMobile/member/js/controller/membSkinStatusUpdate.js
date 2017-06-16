/**
 * Created by lenovo on 2016/5/25.
 */
app.controller('membSkinStatusUpdateCtrl', function($scope,$sessionStorage,$stateParams,comApi, $timeout){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit('navMenu.type', navMenu);

    //会员的数据编号
    $scope.curMembNum = $stateParams.membNum;


    $scope.infoShow = true;

    $timeout(function() {
        $scope.infoShow = false;
    }, 3000);

//肌肤问题
    $scope.skinProbs = comApi.getSelectSkin("C026",0);
    comApi.myConsoleLog('肌肤现状数据===', $scope.skinProbs, "===");

    //$scope.sel = ['D001','D011','D005'];
    $scope.sel = [];

    //存储会员信息详情数据
    //$sessionStorage.memInfoDetailEdit = $scope.memInfo = data;

    if (comApi.isNotNullAndUndefined($sessionStorage.membSkinStatusUpdate)) {
        $scope.skinProbs = $sessionStorage.membSkinStatusUpdate;
    } else {
        if (comApi.isNotEmptyObject($sessionStorage.memInfoDetailEdit.membSkinCareNeed.C026)){

            //$scope.sel = $sessionStorage.memInfoDetailEdit.membSkinCareNeed.C026.split(',');
            $scope.sel = $sessionStorage.memInfoDetailEdit.membSkinCareNeed.C026;
           // $scope.sel = $sessionStorage.memInfoDetailEdit.membSkinCareNeed.C026;
        }

        //选中的状态标志
        for (var i=0; i<$scope.skinProbs.length; i++) {
            $scope.skinProbs[i].checked = false;
            for (var j=0; j<$scope.sel.length; j++) {
                if ($scope.skinProbs[i].key == $scope.sel[j]) {
                    $scope.skinProbs[i].checked = true;
                    break;
                }
            }
        }
    }

    $scope.updateMembSkinStatus = function(){
        $sessionStorage.membSkinStatusUpdate = angular.copy($scope.skinProbs);
        comApi.myConsoleLog('选中肌肤现状数据===', $sessionStorage.membSkinStatusUpdate, "====");
    };


});