/**
 * Created by lenovo on 2016/5/27.
 */
app.controller('membRevisitFbkDetailCtrl', function($scope, comApi, $stateParams, $sessionStorage, $interval, $window){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit("navMenu.type", navMenu);

    $scope.voicdss = [
        /* {
         "voice": "http://192.168.1.18:8081/uploadFiles/goods/images/20160606/73bcea8a-b8af-4cf2-b6dd-ef6453962abc.mp3"

         },
         {
         "voice": "http://192.168.1.18:8081/uploadFiles/goods/images/20160606/73bcea8a-b8af-4cf2-b6dd-ef6453962abc.mp3"

         }*/];


    $scope.initMembRevFbkDet = function() {
        $scope.curIndex = $stateParams.curMembIndex;
        var thisIndex = $stateParams.curIndex;
        $scope.membRevFbkDetail = $sessionStorage.membRevFbkListSto[thisIndex];
        comApi.myConsoleLog("===",  $scope.membRevFbkDetail, "===");

        var voiceArr = [];
        if (comApi.isNotNullAndUndefined($scope.membRevFbkDetail.fbkVoice)) {
            voiceArr  = $scope.membRevFbkDetail.fbkVoice.split(",");
            for (var i = 0 ; i < voiceArr.length; i++) {
                var url = comApi.getFileServerPath() + voiceArr[i];
                var dura = window.bdk.getMP3Time('{"url":"'+url+'"}');
                dura = JSON.parse(dura);
                $scope.voicdss.push({voice: voiceArr[i], dura: dura.time+'"', playAudio:false});
                comApi.myConsoleLog("==",$scope.voicdss, "==" )
            }
        }

        comApi.myConsoleLog("===",  $scope.membRevFbkDetail, "===");
    };

    $scope.initMembRevFbkDet();

    var timer = null;
    $scope.audioPlay = function(audioSrc, playObj) {
        //取消上一次的定时器
        $interval.cancel(timer);

        for (var i=0; i<$scope.voicdss.length; i++) {
            if (comApi.isNotNullAndUndefined($scope.voicdss[i].voice)) {
                $scope.voicdss[i].playAudio = false;
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
            for (var i=0; i<$scope.voicdss.length; i++) {
                if (comApi.isNotNullAndUndefined($scope.voicdss[i].voice)) {
                    $scope.voicdss[i].playAudio = false;
                    $scope.$apply();
                }
            }
            $interval.cancel(timer);
        }
    };
});