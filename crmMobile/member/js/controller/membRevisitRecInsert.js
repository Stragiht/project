/**
 * Created by lenovo on 2016/5/27.
 */
app.controller("membRevisitRecInsertCtrl", function($scope, $sessionStorage, comApi, $stateParams, $window, $interval, $ionicPopup, $state, $timeout){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit("navMenu.type", navMenu);

    $scope.curIndex = $stateParams.curMembIndex;

    //是否放弃本次操作
    $scope.goFrontPage = function() {
        var confirmPopup = $ionicPopup.confirm({
            title : "提示",
            template : "确定要放弃此操作吗？",
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


    //当前回访信息
    $scope.membRevTsk = $sessionStorage.membRevTskSto[$scope.curIndex];

    //新增回访参数列表
    $scope.membRevRecData = {
        "membNum": $scope.membRevTsk.membNum,
        "revisitCont": "",
        "revisitImg": "",
        "revisitVoice": "",
        //"revisitTm":1461041552216,
        "rtnTm": $scope.membRevTsk.rtnTm,
        "stfNum": $scope.membRevTsk.stfNum
    };

    comApi.myConsoleLog('回访记录的参数====', $scope.membRevRecData, "===");

    $scope.membRevRecInsert = function(){

        //保存图片的字符串
        var imgStr = '';
        for (var i=0; i<$scope.imgss.length; i++) {
            if (i != $scope.imgss.length-1) {
                imgStr += $scope.imgss[i].img + ",";
            } else {
                imgStr += $scope.imgss[i].img;
            }
        }

        //保存音频的路径字符串
        var audioStr = '';
        for (var j=0; j<$scope.voicdss.length; j++) {
            if (j != $scope.voicdss.length - 1) {
                audioStr += $scope.voicdss[j].voice + ",";
            } else {
                audioStr += $scope.voicdss[j].voice;
            }
        }

        $scope.membRevRecData.revisitImg = imgStr;
        $scope.membRevRecData.revisitVoice = audioStr;

        comApi.myConsoleLog('回访记录的参数====', $scope.membRevRecData, "===");
        comApi.post('membRevisitRec/insertMembRevisitRec4App', $scope.membRevRecData, function(data){
            //改变回访状态  D001已回访
            $sessionStorage.membRevTskSto[$scope.curIndex].rtnStat = "D001";
            comApi.showSuccessMessage("msg.member.10005");
            $timeout(function() {
                $state.go("membRevisitTskDetail", {
                    curMembIndex : $scope.curIndex
                });
            },3000);
        }, true);
    };


    $scope.imgss = [
        /* {
         "img": "http://192.168.1.18:8081/uploadFiles/goods/images/20160606/73bcea8a-b8af-4cf2-b6dd-ef6453962abc.jpg"

         },
         {
         "img": "http://192.168.1.18:8081/uploadFiles/goods/images/20160606/73bcea8a-b8af-4cf2-b6dd-ef6453962abc.jpg"

         }*/];

    $scope.voicdss = [
        /* {
         "voice": "http://192.168.1.18:8081/uploadFiles/goods/images/20160606/73bcea8a-b8af-4cf2-b6dd-ef6453962abc.mp3"

         },
         {
         "voice": "http://192.168.1.18:8081/uploadFiles/goods/images/20160606/73bcea8a-b8af-4cf2-b6dd-ef6453962abc.mp3"

         }*/];


    // 语音按钮是否可用
    var audioButtonStatus = true;
    var oMembRevRecInsertTextarea = document.getElementById("membRevRecInsertTextarea");
    var is_active = true;

    //定义一个超时上传语音的状态标识
    var timeOutStatus = false;

    // 语音按钮按住
    $scope.audioOnTouch = function() {
        /*if (audioButtonStatus) {
            //按住录入语音
            document.getElementById("audioMembInsertText").innerHTML = "松开结束";
            // 开始录音
            window.bdk.startVoiceRecord();
        }*/

        if (document.activeElement.id == "membRevRecInsertTextarea") {
            is_active = false;
            oMembRevRecInsertTextarea.blur();
        } else {
            timeOutStatus = false;
            is_active = true;
            if (audioButtonStatus) {
                //按住录入语音
                document.getElementById("audioMembInsertText").innerHTML = "松开结束";
                // 开始录音
                window.bdk.startVoiceRecord();
            }
        }
    };

    // 语音按钮松开
    $scope.audioOnRelease = function() {
        if (audioButtonStatus && is_active) {
            document.getElementById("audioMembInsertText").innerHTML = "上传中...";
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

    $scope.addImg = function(){
        var index = 1;
        // 上传图片（index是如画面上有多个项目需要上传文件时区分是哪个项目上传的文件， type是文件的类型下面是指身份证）
        var data='{"token":"'+$sessionStorage.ustu+'","index":"'+index+'","type":"membrevImg"}';
        window.bdk.uploadPicture(data);
    };

    // 上传图片完成(因为原生上传文件是异步的，所以这个方法是提供给原生计算完以后回调的方法)
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
            }

            if (dataJson.result.index == 1) {
                //$scope.$apply($scope.imgss.push({img:comApi.getFileServerPath() + dataJson.result.filePath}));
                $scope.$apply($scope.imgss.push({img: dataJson.result.filePath}));
            } else if(dataJson.result.index == 2){

                var url = comApi.getFileServerPath() + dataJson.result.filePath;
                var dura = window.bdk.getMP3Time('{"url":"'+url+'"}');
                dura = JSON.parse(dura);
                document.getElementById("audioMembInsertText").innerHTML = "按住重新开始语音";

                $scope.$apply($scope.voicdss.push({voice: dataJson.result.filePath, dura: dura.time+'"', playAudio:false}));

                if (timeOutStatus) {
                    //超时
                    audioButtonStatus = false;
                } else {
                    audioButtonStatus = true;
                }
            }
        } else {
        	if(dataJson.isRecording) {
    	        comApi.appCallBackFaultHandle(dataJson, 2);
                document.getElementById("audioMembInsertText").innerHTML = "按住重新开始语音";
                audioButtonStatus = true;
        	} else {
        		//图片上传失败
                comApi.appCallBackFaultHandle(dataJson, 1);
        	}
        }
    };

    $scope.pictureShow = function(imgUrl,idx) {
        $scope.pictureShowDiv = true;
        $scope.headerShow = false;
        $scope.contentShow = false;
        $scope.footerShow = false;
        //显示的当前图片
        $scope.showImgUrl = comApi.getFileServerPath() + imgUrl;
        //当前图片的id
        $scope.curIdx = idx;

    };

    $scope.cancelPicture = function() {
        $scope.pictureShowDiv = false;
        $scope.headerShow = true;
        $scope.contentShow = true;
        $scope.footerShow = true;

    };


    //删除图片
    $scope.delImg = function(idx) {
        // $scope.gdsDtl.gdsSpecDtlVoList.splice(idx, 1);
        $scope.imgss.splice(idx, 1);
        comApi.myConsoleLog("删除后==", $scope.imgss, "===");
        //删除后隐藏
        $scope.cancelPicture();
    };


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


       // window.bdk.play(comApi.getFileServerPath()+audioSrc);
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

    //定义一个标志，控制语音、键盘切换输入
    //默认为true，键盘输入
    $scope.switchKeyOrAudio = true;

    //切换语音和手机键盘
    $scope.swichInp = function() {
        $scope.switchKeyOrAudio = !$scope.switchKeyOrAudio;
    };
});