app.controller('memRevisitRecSelectCtrl', ['$scope','NgTableParams', 'comApi', '$stateParams', '$sce', function($scope,NgTableParams,comApi,$stateParams, $sce
) {

    $scope.oneAtATime = true;
    $scope.status = {
        oneopen: true,
        twoopen:true,
        threeopen:true

    };

    $scope.sce = $sce.trustAsResourceUrl;

    /*
        $scope.data = [{'a':'比度克拔毒膏','b':'2015-09-30','c':'第1次','d':'第1天','e':'电话联系'},
            {'a':'比度克拔毒膏','b':'2015-09-30','c':'第1次','d':'第1天','e':'电话联系'}]*/

    var oId = $stateParams.oId;
    comApi.get('membRevisitRec/selectMembRevisitRecDetailWithReplyList/'+oId, function(data){
        for(var i=0; i<data.replyList.length; i++) {
            if(data.replyList[i].fbkVoice && data.replyList[i].fbkVoice != null && data.replyList[i].fbkVoice != "") {
                data.replyList[i].fbkVoice = comApi.getFileServerPath() + data.replyList[i].fbkVoice;
            }
        }
        /*angular.forEach(data.replyList, function(repData){
            if(repData.fbkVoice && repData.fbkVoice != null && repData.fbkVoice != "") {
                repData.fbkVoice = comApi.getFileServerPath() + repData.fbkVoice;
            }
        })*/
        $scope.memRevRecInfo = data;

        //图片的url
        $scope.memRevRecInfo.revisitImg = $scope.memRevRecInfo.revisitImg.split(",");
        if ($scope.memRevRecInfo.revisitImg == null || $scope.memRevRecInfo.revisitImg == undefined || $scope.memRevRecInfo.revisitImg == '') {
            $scope.memRevRecInfo.revisitImg = [];
        }

        //语音的url
        $scope.memRevRecInfo.revisitVoice = $scope.memRevRecInfo.revisitVoice.split(",");
       // if ($scope.memRevRecInfo.revisitVoice == null || $scope.memRevRecInfo.revisitVoice == undefined || $scope.memRevRecInfo.revisitVoice == '') {
        if (comApi.isNotEmptyObject($scope.memRevRecInfo.revisitVoice)) {
            for(var i=0; i<$scope.memRevRecInfo.revisitVoice.length; i++) {
                $scope.memRevRecInfo.revisitVoice[i] = comApi.getFileServerPath() + $scope.memRevRecInfo.revisitVoice[i];
               /* if(data.replyList[i].fbkVoice && data.replyList[i].fbkVoice != null && data.replyList[i].fbkVoice != "") {
                    data.replyList[i].fbkVoice = comApi.getFileServerPath() + data.replyList[i].fbkVoice;
                }*/
            }
        } else {
            $scope.memRevRecInfo.revisitVoice = [];
        }


        //定义回复、收起回复的标志
        $scope.memRevRecInfo.shrinkFlg = true;
    });

    //控制回复框打开、收缩
    $scope.openRep = function(flg) {
        $scope.memRevRecInfo.shrinkFlg = !flg;
    }

}]);
