/**
 * Created by lenovo on 2016/5/24.
 */
/*
 *会员详细资料（查看）
 * */
app.controller('membDetailPersonalInfoCtrl', ['$scope','$sessionStorage','$ionicPopup','$stateParams','comApi',function($scope,$sessionStorage,$ionicPopup,$stateParams,comApi){
    //会员的数据编号
    $scope.curMemIndex = $stateParams.memIndex;
    //获取会员编号
    var memNum = $sessionStorage.membInfoList[$scope.curMemIndex].membNum;
    //根据会员编号查询会员信息
    comApi.get('membBas/selectByMembNum/'+memNum, function(data){
        $scope.memInfo = data;
        comApi.myConsoleLog('会员信息详情===', data, "===");
        //存储会员信息详情数据
        $sessionStorage.memInfoDetail = angular.copy(data);
    })
}]);