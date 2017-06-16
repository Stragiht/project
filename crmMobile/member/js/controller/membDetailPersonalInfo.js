/**
 * Created by lenovo on 2016/5/24.
 */
/*
 *会员详细资料（查看）
 * */
app.controller("membDetailPersonalInfoCtrl", ["$scope", "$sessionStorage", "$ionicPopup", "$stateParams", "comApi", "$filter", function($scope, $sessionStorage, $ionicPopup, $stateParams, comApi, $filter){

    $scope.membDetPerInfoInit = function() {
        //控制底部菜单栏的显示
        var navMenu = comApi.showFooterMenu("");
        $scope.$emit("navMenu.type", navMenu);

        $scope.pageShow = {
            detailShow: true,
            areaShow: false,
            skinStatusShow: false,
            skinCareShow: false,
            skinCareDmndShow: false
        };

        //会员的数据编号
        $scope.curMembNum  = $stateParams.membNum;


        //获取会员编号
        //var memNum = $sessionStorage.membInfoList[$scope.curMemIndex].membNum;
        //根据会员编号查询会员信息
        comApi.get("membBas/selectByMembNum/"+$scope.curMembNum, function(data){
            $scope.memInfo = data;
            $scope.memInfo.crtdTm = comApi.timeToTimestamp($scope.memInfo.crtdTm);
            comApi.myConsoleLog("会员信息详情===", $scope.memInfo.membSkinCareNeed, "===");
            console.log(comApi.isNotEmptyObject($scope.memInfo.membSkinCareNeed));
            if (comApi.isNotEmptyObject($scope.memInfo.membSkinCareNeed)){
                if (comApi.isNotNullAndUndefined($scope.memInfo.membSkinCareNeed.C026)){

                    $scope.memInfo.membSkinCareNeed.C026 = $scope.memInfo.membSkinCareNeed.C026.split(",");
                }

                if (comApi.isNotEmptyObject($scope.memInfo.membSkinCareNeed.C027)) {

                    $scope.memInfo.membSkinCareNeed.C027 = $scope.memInfo.membSkinCareNeed.C027.split(",");
                }

                if (comApi.isNotEmptyObject($scope.memInfo.membSkinCareNeed.C028)) {

                    $scope.memInfo.membSkinCareNeed.C028 = $scope.memInfo.membSkinCareNeed.C028.split(",");
                }
            }

            //所在地区
            /*if (comApi.isNotNullAndUndefined($scope.memInfo.locPref)) {
                $scope.localArea = $filter('addressFilter')($scope.memInfo.locProv) + $filter('addressFilter')($scope.memInfo.locCity)+$filter('addressFilter')($scope.memInfo.locPref);
            } else {
                $scope.localArea = $filter('addressFilter')($scope.memInfo.locProv)+$filter('addressFilter')($scope.memInfo.locCity);
            }
*/
            if (comApi.isNotNullAndUndefined($scope.memInfo.locPrefNm)) {
                $scope.localArea = $scope.memInfo.locProvNm + $scope.memInfo.locCityNm + $scope.memInfo.locPrefNm;
            } else {
                $scope.localArea = $scope.memInfo.locProvNm + $scope.memInfo.locCityNm;
            }

            //存储到session中
            $sessionStorage.membDetailPerSto = $scope.memInfo;

            comApi.myConsoleLog("===会员详细资料查看===",$scope.memInfo,"====");
            //存储会员信息详情数据
           // $sessionStorage.memInfoDetail = angular.copy(data);
        })
    };

    $scope.membDetPerInfoInit();

    //控制单页面的显示
    $scope.singlePageShow = function(detailShow, areaShow, skinStatusShow, skinCareShow, skinCareDmndShow) {
        $scope.pageShow = {
            detailShow: detailShow,
            areaShow: areaShow,
            skinStatusShow: skinStatusShow,
            skinCareShow: skinCareShow,
            skinCareDmndShow: skinCareDmndShow
        };

    }
}]);