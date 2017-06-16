app.controller('memRevisitFbkCtrl', ['$scope','NgTableParams', 'comApi','$stateParams','$state','$sce',function($scope,NgTableParams,comApi,$stateParams,$state,$sce) {

    $scope.oneAtATime = true;
    $scope.status = {
        oneopen: true,
        twoopen:true,
        threeopen:true,
        fouropen:true,
        fiveopen:true

    };
    $scope.sce = $sce.trustAsResourceUrl;

    var rtnTm = $stateParams.rtnTm;
    var stfNum = $stateParams.stfNum;
    var membNum = $stateParams.membNum;

    //查看回访任务请求参数
    $scope.membRevisitFbkTask = {
        stfNum:stfNum,
        rtnTm:rtnTm,
        membNum:membNum
    };

    //查询回访人、受访会员信息
    $scope.memRevFbkInfo = comApi.memRevSea(stfNum,rtnTm,membNum);

    //查看回访任务（组）
    comApi.post('membRevisitTsk/selectMembRevisitTskDtlList', $scope.membRevisitFbkTask, function(data){

        $scope.memRevFbkDtls = data;

    });

    //定义语音
    //$scope.audioArr = [];

    //查看回访指导列表  /membRevisitTsk/selectMembRevisitFbkList
    comApi.post('membRevisitTsk/selectMembRevisitFbkList', $scope.membRevisitFbkTask, function(data){

        for(var i=0; i<data.length; i++) {

            if (data[i].fbkVoice != null && data[i].fbkVoice != undefined && data[i].fbkVoice != '') {
                data[i].audioArr = data[i].fbkVoice.split(',');
                for (var j=0; j<data[i].audioArr.length; j++) {
                    data[i].audioArr[j] = comApi.getFileServerPath() + data[i].audioArr[j];
                }

            }
        }
        $scope.membRevFbkLis = data;

    });

    //新增回访指导参数
    $scope.insertRevisitFbk = {
        fbkCont:'',
        fbkVoice:'',
        membNum:membNum,
        rtnTm:rtnTm,
        stfNum:stfNum
    }

    //新增回访指导
    $scope.insertMembRevisitFbk = function() {
        comApi.post("membRevisitTsk/insertMembRevisitFbk", $scope.insertRevisitFbk, function(data){
            //消息提示
        	comApi.successMessage('msg.member.10010');
            setTimeout(function() {
                $state.go('app.member.memRevisitTsk');
            },1000);
        })
    }

}]);
