app.controller('memRevisitTskSelectCtrl', ['$scope','NgTableParams', '$stateParams', 'comApi','$sce',function($scope,NgTableParams,$stateParams,comApi,$sce) {

    $scope.oneAtATime = true;
    $scope.status = {
        oneopen: true,
        twoopen:true,
        threeopen:true,
        fouropen:true

    };
    $scope.sce = $sce.trustAsResourceUrl;

    var rtnTm = $stateParams.rtnTm;
    var stfNum = $stateParams.stfNum;
    var membNum = $stateParams.membNum;

    //查询回访人、受访会员信息
    $scope.memRevInfo = comApi.memRevSea(stfNum,rtnTm,membNum);

    //查看回访任务请求参数
    $scope.membRevisitTask = {
        stfNum:stfNum,
        rtnTm:rtnTm,
        membNum:membNum
    };

    //查看回访任务（组）
    comApi.post('membRevisitTsk/selectMembRevisitTskDtlList', $scope.membRevisitTask, function(data){

        $scope.membRevDtls = data;

    });

    //查看回访指导列表  /membRevisitTsk/selectMembRevisitFbkList
    comApi.post('membRevisitTsk/selectMembRevisitFbkList', $scope.membRevisitTask, function(data){
        for (var i=0; i<data.length; i++) {

            if (data[i].fbkVoice != null && data[i].fbkVoice != undefined && data[i].fbkVoice != '') {
                data[i].audioArr = data[i].fbkVoice.split(',');
                for (var j=0; j<data[i].audioArr.length; j++) {
                    data[i].audioArr[j] = comApi.getFileServerPath() + data[i].audioArr[j];
                }

            }
        }
        $scope.membRevFbks = data;
    })



}]);
