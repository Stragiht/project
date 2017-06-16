/**
 * Created by lenovo on 2016/5/27.
 */
app.controller('membRevisitFbkCtrl', function($scope, $sessionStorage, $state, comApi, $stateParams, $window, $interval, $ionicPopup, $timeout){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit("navMenu.type", navMenu);

    $scope.curIndex = $stateParams.curMembIndex;

    //是否放弃本次操作
    $scope.goFrontPage = function() {
        var confirmPopup = $ionicPopup.confirm({
            title : "提示",
            template : "确定要放弃此次操作？",
            okText : "确定",
            cancelText : "取消"

        });
        /*
         * $state.go("entryApplInfo", {
         entApplNum : $stateParams.entApplNum
         });
         * */
        confirmPopup.then(function(res) {
            if (res) {
                    $state.go("membRevisitTskDetail", {
                        curMembIndex : $scope.curIndex  //memInfo({memIndex:curMemIndex})
                    });
            }
        });
    };



    //回访指导的参数
    /*{
        "fbkCont": "fbkCont是文本指导内容；fbkVoice是指导语音url，多个用英文逗号隔开。",
        "fbkVoice": "audios/20160412/83522c1c-9f60-4b93-8727-0f24ceb54e8a.mp3",
        "membNum": "V000007",
        "rtnTm": 1462809600000,
        "stfNum": "BA0001"
    }*/

    //当前回访信息
    $scope.membRevTsk = $sessionStorage.membRevTskSto[$scope.curIndex];

    //新增回访参数列表
    $scope.membRevFbkData = {
        "membNum": $scope.membRevTsk.membNum,
        "fbkVoice": "",
        "fbkCont":'',
        "rtnTm": $scope.membRevTsk.rtnTm,
        "stfNum": $scope.membRevTsk.stfNum
    };

    /////membRevisitTsk/insertMembRevisitFbk4App

    $scope.voicdss = [
        /* {
         "voice": "http://192.168.1.18:8081/uploadFiles/goods/images/20160606/73bcea8a-b8af-4cf2-b6dd-ef6453962abc.mp3"

         },
         {
         "voice": "http://192.168.1.18:8081/uploadFiles/goods/images/20160606/73bcea8a-b8af-4cf2-b6dd-ef6453962abc.mp3"

         }*/];


    // 语音按钮是否可用
    var audioButtonStatus = true;
    var oMembRevFbkTextArea = document.getElementById("membRevFbkTextArea");
    var is_active = true;

    //定义一个超时上传语音的状态标识
    var timeOutStatus = false;

    // 语音按钮按住
    $scope.audioOnTouch = function() {
        if (document.activeElement.id == "membRevFbkTextArea") {
            is_active = false;
            oMembRevFbkTextArea.blur();
        } else {
            timeOutStatus = false;
            is_active = true;
            if (audioButtonStatus) {
                //按住录入语音
                document.getElementById("audioMembFbkText").innerHTML = "松开结束";
                // 开始录音
                window.bdk.startVoiceRecord();
            }
        }

    };

    // 语音按钮松开
    $scope.audioOnRelease = function() {
        if (audioButtonStatus && is_active) {
            document.getElementById("audioMembFbkText").innerHTML = "上传中...";
            audioButtonStatus = false;

            //index =  2 图片

            // 结束录音并上传
            var data = '{"token" : "' + $sessionStorage.ustu
                + '", "index" : "2", "type" : ""}';
            var resultJson = JSON.parse(window.bdk.stopVoiceRecord(data));
            //alert(resultJson);
        } else {
            audioButtonStatus = true;
        }
    };

    // 上传完成(因为原生上传文件是异步的，所以这个方法是提供给原生计算完以后回调的方法)
    $window.uploadComplete = function(data) {
        //index=1 表示上传图片   index=2表示上传语音
        var dataJson = JSON.parse(data);
        if (dataJson.success == true) {

            //录音超时
            if (dataJson.timeout) {
                var data = '{"token" : "' + $sessionStorage.ustu
                    + '", "index" : "2", "type" : ""}';
                comApi.showErrorMessage("msg.member.10015");
                //改变状态
                audioButtonStatus = false;
                timeOutStatus = true;
                window.bdk.stopVoiceRecord(data);
                return;
            } else {
                var url = comApi.getFileServerPath() + dataJson.result.filePath;
                var dura = window.bdk.getMP3Time('{"url":"'+url+'"}');
                dura = JSON.parse(dura);
                document.getElementById("audioMembFbkText").innerHTML = "按住重新开始语音";

                $scope.$apply($scope.voicdss.push({voice: dataJson.result.filePath, dura: dura.time+'"', playAudio:false}));

                if (timeOutStatus) {
                    //超时
                    audioButtonStatus = false;
                } else {
                    audioButtonStatus = true;
                }

            }

        } else {
//            if (dataJson.timeTooShort == true) {
//                comApi.showErrorMessage("msg.member.10025");
//            } else {
//                comApi.showErrorMessage("msg.member.10014");
//            }
      	    comApi.appCallBackFaultHandle(dataJson, 2);
            document.getElementById("audioMembFbkText").innerHTML = "按住重新开始语音";
            audioButtonStatus = true;
        }
    };

    $scope.membRevFbkInsert = function(){

        //保存音频的路径字符串
        var audioStr = '';
        for (var j=0; j<$scope.voicdss.length; j++) {
            if (j != $scope.voicdss.length-1) {
                audioStr += $scope.voicdss[j].voice + ",";
            } else {
                audioStr += $scope.voicdss[j].voice;
            }
        }

        $scope.membRevFbkData.fbkVoice = audioStr;

        if (!comApi.isNotNullAndUndefined($scope.membRevFbkData.fbkVoice) && !comApi.isNotNullAndUndefined($scope.membRevFbkData.fbkCont)) {
            comApi.showErrorMessage("msg.member.10023");
            return;
        }

        comApi.myConsoleLog("回访指导的参数====", $scope.membRevFbkData, "===");
        comApi.post("membRevisitTsk/insertMembRevisitFbk4App", $scope.membRevFbkData, function(data){

            comApi.showSuccessMessage("msg.member.10004");

            $timeout(function(){
                $state.go("membRevisitTskDetail", {
                    curMembIndex : $scope.curIndex
                });
            }, 3000);


        }, true);
    };

    //$scope.switchKeyOrAudio = true;

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
    //定义一个标志，控制语音切换输入
    $scope.switchKeyOrVoice = true;
    $scope.switchAnimateVoice = function() {
        $scope.switchKeyOrVoice = !$scope.switchKeyOrVoice;
    };
});