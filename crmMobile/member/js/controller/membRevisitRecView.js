/**
 * Created by lenovo on 2016/5/24.
 */
app.controller("membRevisitRecViewCtrl", ["$scope", "$ionicPopover", "comApi", "$sessionStorage", "$stateParams", "$interval", "$window", function ($scope, $ionicPopover, comApi, $sessionStorage, $stateParams, $interval, $window) {

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit("navMenu.type", navMenu);

    //页面初始化
    $scope.initMembRevRecView = function() {
        //当前会员回访信息索引
        var curMemBuyIndex = $stateParams.memRevisIndex;
        //会员信息索引
        $scope.curMembNum = $stateParams.membNum;
        $scope.membRevisits = $sessionStorage.membRevisitLists[curMemBuyIndex];
        // $scope.membBuyDetl = $sessionStorage.membBuyDetlLists[curMemBuyIndex];
        comApi.myConsoleLog("=数据==", $scope.membRevisits, "========");

        //定义声音数组
        var voiceArr = [];

        //带标志的声音数组
        $scope.membRevDetVoiceShow = [
            /* {
             "voice": "",
             "dura":'1',
             "playAudio":false

             }*/
        ];


        //图片显示数组
        $scope.membRevDetImgShow = [];
        //音频时间
        var dura1 = 0, dura2 = 0;
        var duraObj1 = null, duraObj2 = null;

        //图片显示的数据
        if (comApi.isNotNullAndUndefined(angular.copy($scope.membRevisits).revisitImg)) {
            $scope.membRevDetImgShow = angular.copy($scope.membRevisits).revisitImg.split(",");
        }

        //声音的数据
        if (comApi.isNotNullAndUndefined(angular.copy($scope.membRevisits).revisitVoice)) {

            voiceArr = angular.copy($scope.membRevisits).revisitVoice.split(",");
            for (var i=0; i<voiceArr.length; i++) {
                duraObj1 =  JSON.parse(window.bdk.getMP3Time('{"url":"'+comApi.getFileServerPath()+voiceArr[i]+'"}'));
                dura1 = duraObj1.time;
                if (dura1 != '-1') {
                    $scope.membRevDetVoiceShow.push({voice:voiceArr[i], dura: dura1 + '"', playAudio: false});
                }
            }
        }

        //回复的声音数据
        //获取播放的音频文件的额时长
        for (var j=0; j<$scope.membRevisits.replyList.length; j++) {
            if (comApi.isNotNullAndUndefined($scope.membRevisits.replyList[j].fbkVoice)) {
                //定义播放的标志
                $scope.membRevisits.replyList[j].playAudio = false;
                //var time11 = new Date().getTime();
                duraObj2 =  JSON.parse(window.bdk.getMP3Time('{"url":"' + comApi.getFileServerPath() + $scope.membRevisits.replyList[j].fbkVoice + '"}'));
                //var time22 = new Date().getTime();
                //alert(time22 - time11);
                dura2 = duraObj2.time;
                if (dura2 != -1) {
                    $scope.membRevisits.replyList[j].dura = dura2 + '"';
                } else {
                    $scope.membRevisits.replyList[j].fbkVoice = null;
                }
            }
        }
    };

    $scope.initMembRevRecView();

    var timer = null;

    $scope.audioPlay = function(audioSrc, playObj) {
        //取消上一次的定时器
        $interval.cancel(timer);

        //把所有的标志位空
        for (var i=0; i<$scope.membRevisits.replyList.length; i++) {
            if (comApi.isNotNullAndUndefined($scope.membRevisits.replyList[i].fbkVoice)) {
                $scope.membRevisits.replyList[i].playAudio = false;
            }
        }

        for (var t=0; t<$scope.membRevDetVoiceShow.length; t++) {
            if (comApi.isNotNullAndUndefined($scope.membRevDetVoiceShow[t].voice)) {
                $scope.membRevDetVoiceShow[t].playAudio = false;
            }
        }

        playObj.playAudio = true;

        var j = 1;

        $scope.audioImg = "common/images/cv_yy_4.png";

        timer = $interval(function(){
            if (j % 4 == 1) {
                $scope.audioImg = "common/images/cv_yy_2.png";
            } else if (j % 4 == 2){
                $scope.audioImg = "common/images/cv_yy_3.png";
            } else if (j % 4 == 3) {
                $scope.audioImg = "common/images/cv_yy_4.png";
            }
            j++;
            if (j >= 4) {
                j = 1;
            }
        }, 500);

        window.bdk.play('{"url":"'+comApi.getFileServerPath()+audioSrc+'"}');
    };


    //播放完成
    $window.playComplete = function(data){
        var jsonData = JSON.parse(data);
        if (jsonData.stop) {

            for (var i=0; i<$scope.membRevisits.replyList.length; i++) {
                if (comApi.isNotNullAndUndefined($scope.membRevisits.replyList[i].fbkVoice)) {
                    $scope.membRevisits.replyList[i].playAudio = false;
                }
            }

            for (var j=0; j<$scope.membRevDetVoiceShow.length; j++) {
                if (comApi.isNotNullAndUndefined($scope.membRevDetVoiceShow[j].voice)) {
                    $scope.membRevDetVoiceShow[j].playAudio = false;
                }
            }

            $interval.cancel(timer);
        }
    };

}]);