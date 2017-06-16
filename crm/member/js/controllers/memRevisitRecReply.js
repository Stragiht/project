app.controller('memRevisitRecReplyCtrl', ['$scope','NgTableParams', '$stateParams', 'comApi', '$state', '$sce',function($scope,NgTableParams,$stateParams,comApi,$state,$sce) {

    $scope.oneAtATime = true;
    $scope.status = {
        oneopen: true,
        twoopen:true,
        threeopen:true,
        fouropen:true

    };
    $scope.sce = $sce.trustAsResourceUrl;

    //定义发表回复所需的参数
    $scope.pubRep = {
        fbkCont:'',
        fbkVoice:'',
        membRtnRecId:'',
        replyContId:''
    }


    /*$scope.data = [{'a':'比度克拔毒膏','b':'2015-09-30','c':'第1次','d':'第1天','e':'电话联系'},
        {'a':'比度克拔毒膏','b':'2015-09-30','c':'第1次','d':'第1天','e':'电话联系'}];*/

    var oId = $stateParams.oId;
    //初始化回访记录
    $scope.initMemRevisitFbk = function() {
        comApi.get('membRevisitRec/selectMembRevisitRecDetailWithReplyList/'+oId, function(data){
            $scope.memRevRecInfo = data;
            $scope.pubRep.membRtnRecId = $scope.memRevRecInfo.oId;

            $scope.memRevRecInfo.shrinkFlg = true;
            //定义回复、收起回复的标志
            /*if (flg ==true) {
                $scope.memRevRecInfo.shrinkFlg = true;
            } else {
                $scope.memRevRecInfo.shrinkFlg = false;
            }*/
            //定义文件访问的路径
            angular.forEach($scope.memRevRecInfo.replyList, function(data, index){
                if (data.fbkVoice && data.fbkVoice != null && data.fbkVoice != "") {
                    data.fbkVoice =  comApi.getFileServerPath() + data.fbkVoice;
                }
            })
            //设置回复的默认值
            $scope.placeholderVal = "回复 "+$scope.memRevRecInfo.replyList[0].beRepliedUsrNm;
            //设置回复的默认值
            //$scope.pubRep.membRtnRecId = $scope.memRevRecInfo.replyList[0].oId;
           // $scope.pubRep.membRtnRecId = $scope.memRevRecInfo.oId;
            $scope.pubRep.replyContId = $scope.memRevRecInfo.replyList[0].replyContId;
            //if ($scope.memRevRecInfo.replyList[0].replyUsrNm != '')

        })
    }

    $scope.initMemRevisitFbk();

    //控制回复框打开、收缩
    $scope.openRep = function(flg) {
        $scope.memRevRecInfo.shrinkFlg = !flg;
    }

    //回复
    $scope.replayMsg = function(bRepUsrNm, membRtnRecId, replyContId) {
        $scope.pubRep.fbkCont = '';
        $scope.placeholderVal = "回复 "+bRepUsrNm;
        $scope.pubRep.membRtnRecId = membRtnRecId;
        $scope.pubRep.replyContId = replyContId;
    }


    //回复的默认值
    $scope.placeholderVal = '';
    //发表回复
    $scope.publishRep = function(){
       // $scope.pubRep.membRtnRecId = membNum;
       // $scope.pubRep.replyContId = membNum;
        comApi.post('membRevisitRec/insertMembRtnRecReplyCont',$scope.pubRep,function(data){
        	comApi.successMessage('msg.member.10011');
            $scope.pubRep.fbkCont = "";
            $scope.pubRep.fbkVoice = "";
            setTimeout(function() {
               // $state.go('app.member.memBatUpdate');
                $scope.initMemRevisitFbk();
                //$scope.memRevRecInfo.shrinkFlg = true;
            },1000);
        })
    }



}]);
