/**
 * Created by lenovo on 2016/5/27.
 */
app.controller("membRevisitRecDetailCtrl", function($scope, $stateParams, comApi, $window, $sessionStorage, $interval, $state, $rootScope, $filter){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit("navMenu.type", navMenu);

    //定义发表回复所需的参数
    $scope.pubRep = {
        fbkCont:'',
        fbkVoice:'',
        membRtnRecId:'',
        replyContId:''
    };

  //  var curIndex = $stateParams.curMembOid;
    //根据oId查询回访记录详情
    $scope.selectMembReplyList = function(flg) {
        if (flg == 1) {
            comApi.showLoading();
        }
        comApi.get("membRevisitRec/selectMembRevisitRecDetailWithReplyList/"+$stateParams.curMembOid, function (data) {
            comApi.myConsoleLog("BA记录详情返回的数据===", data, "====");

            $scope.membRevRecDetail = data;

            $scope.pubRep.membRtnRecId = $scope.membRevRecDetail.oId;

            //回访时间格式化处理
            $scope.dateFormatStr = $filter("dateFormat")($scope.membRevRecDetail.revisitTm);
            $scope.timeFormatStr = $filter("date")($scope.membRevRecDetail.revisitTm,"HH:mm:ss");

            //声音数组
            $scope.membRevDetVoiceShow = [
                /* {
                 "voice": "",
                 "dura":'1',
                 "playAudio":false

                 }*/
            ];

            //图片显示数组
            $scope.membRevDetImgShow = [];
            var voiceArr = [];
            var dura1 = 0, dura2 = 0;
            var duraObj1 = null, duraObj2 = null;

            //图片显示的数据
            if (comApi.isNotNullAndUndefined(angular.copy(data).revisitImg)) {
                $scope.membRevDetImgShow = angular.copy(data).revisitImg.split(",");
            }

            //声音的数据(上面不带回复的声音数据)
            if (comApi.isNotNullAndUndefined(angular.copy(data).revisitVoice)) {

                voiceArr = angular.copy(data).revisitVoice.split(",");
                for (var i = 0; i < voiceArr.length; i++) {
                    //调用插件查询音频时长  ('{"url":"'+url+'"}')
                    //dura =  window.bdk.getMP3Time('{"url":"'+comApi.getFileServerPath()+voiceArr[i]+'"}');
                    //dura = JSON.parse(dura);
                    duraObj1 =  JSON.parse(window.bdk.getMP3Time('{"url":"'+comApi.getFileServerPath()+voiceArr[i]+'"}'));
                    dura1 = duraObj1.time;
                    if (dura1 != -1) {
                        $scope.membRevDetVoiceShow.push({voice:voiceArr[i], dura: dura1 + '"', playAudio: false});
                    }
                }
            }

            //设置回复的默认值
            if (comApi.isNotEmptyObject($scope.membRevRecDetail.replyList)) {
                $scope.placeholderVal = "回复 " + $scope.membRevRecDetail.replyList[0].beRepliedUsrNm;
                $scope.pubRep.replyContId = $scope.membRevRecDetail.replyList[0].replyContId;
            } else {
                $scope.placeholderVal = "回复 " + $scope.membRevRecDetail.stfNm;
                $scope.pubRep.replyContId = null;
            }

            var url = "";

             //url = "http://192.168.1.18:8081/uploadFiles/test.mp3";
            //var ti = window.bdk.getMP3Time(comApi.getFileServerPath()+"others/audios/20160627/48c4fecb-a2b5-41ec-ad4e-d3b6e2fb91bc.mp3");
            //var ti = window.bdk.getMP3Time(url);

            //获取播放的音频文件的额时长
            for (var i=0; i<$scope.membRevRecDetail.replyList.length; i++) {
                if (comApi.isNotNullAndUndefined($scope.membRevRecDetail.replyList[i].fbkVoice)) {
                    //定义播放的标志
                    $scope.membRevRecDetail.replyList[i].playAudio = false;
                    //url = comApi.getFileServerPath() + $scope.membRevRecDetail.replyList[i].fbkVoice;
                    //$scope.membRevRecDetail.replyList[i].dura = JSON.parse(window.bdk.getMP3Time('{"url":"'+url+'"}')).time+'"';

                    duraObj2 = JSON.parse(window.bdk.getMP3Time('{"url":"'+comApi.getFileServerPath() + $scope.membRevRecDetail.replyList[i].fbkVoice+'"}'));
                    dura2 = duraObj2.time;
                    if (dura2 != -1) {
                        $scope.membRevRecDetail.replyList[i].dura = dura2 + '"';
                    } else {
                        $scope.membRevRecDetail.replyList[i].fbkVoice = null;
                    }
                }
            }
            comApi.hideLoading();
            //flg=2表示回复
            if (flg == 2) {
                 comApi.showSuccessMessage("msg.member.10012");
            }
        });
    };

    $scope.selectMembReplyList(1);


    //回复回访记录

    //回复
    $scope.replayMsg = function(bRepUsrNm, membRtnRecId, replyContId) {
        $scope.pubRep.fbkCont = '';
        $scope.placeholderVal = "回复 "+bRepUsrNm;
        $scope.pubRep.membRtnRecId = membRtnRecId;
        $scope.pubRep.replyContId = replyContId;
    };

    //回复的默认值
    $scope.placeholderVal = '';


    //语音

    // 语音按钮是否可用
    var audioButtonStatus = true;
    //定义一个超时上传语音的状态标识
    var timeOutStatus = false;

    // 语音按钮按住
    $scope.audioOnTouch = function() {
        timeOutStatus = false;
        if (audioButtonStatus) {
            //按住录入语音
            document.getElementById("audioRepText").innerHTML = "松开结束";
            // 开始录音
            window.bdk.startVoiceRecord();
        }
    };

    // 语音按钮松开
    $scope.audioOnRelease = function() {
        if (audioButtonStatus) {
            document.getElementById("audioRepText").innerHTML = "上传中...";
            audioButtonStatus = false;

            //index =  2 图片

            // 结束录音并上传
            var data = '{"token" : "' + $sessionStorage.ustu
                + '", "index" : "2", "type" : ""}';
            //var resultJson = JSON.parse(window.bdk.stopVoiceRecord(data));
            window.bdk.stopVoiceRecord(data);
        } else {
            audioButtonStatus = true;
        }
    };


    // 上传语音完成(因为原生上传文件是异步的，所以这个方法是提供给原生计算完以后回调的方法)
    $window.uploadComplete = function(data) {
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
                document.getElementById("audioRepText").innerHTML = "按住重新开始语音";
                $scope.$apply($scope.pubRep.fbkVoice =  dataJson.result.filePath);
                if (timeOutStatus) {
                    //超时
                    audioButtonStatus = false;
                } else {
                    audioButtonStatus = true;
                }
                //语音上传完成之后发表回复
                $scope.publishRep('audio');

            }
        } else {
//            if (dataJson.timeTooShort == true) {
//                comApi.showErrorMessage("msg.member.10025");
//            } else {
//                comApi.showErrorMessage("msg.member.10014");
//            }
      	    comApi.appCallBackFaultHandle(dataJson, 2);
            document.getElementById("audioRepText").innerHTML = "按住重新开始语音";
            audioButtonStatus = true;
        }
    };

    var oRecTextA = document.getElementById('revRecTextArea');

    //发表回复
    $scope.publishRep = function(flg){
        //回复的内容中只能存在语音或者文字
        $scope.pubRepCopy = angular.copy($scope.pubRep);
        if (flg == 'audio') {
            $scope.pubRepCopy.fbkCont = '';
        } else if (!comApi.isNotNullAndUndefined($scope.pubRepCopy.fbkCont)) {
            comApi.showErrorMessage("msg.member.10026");
            return;
        }

        comApi.showLoading();

        comApi.post('membRevisitRec/insertMembRtnRecReplyCont',$scope.pubRepCopy,function(data){
            oRecTextA.style.height = '30px';
            $scope.pubRep.fbkCont = "";
            $scope.pubRep.fbkVoice = "";

            $scope.selectMembReplyList(2);
        })

    };


    //定时器变量
    var timer = null;

    //语音播放
    $scope.audioPlay = function(audioSrc, playObj) {

        $interval.cancel(timer);

        //把所有的标志位空
        for (var i=0; i<$scope.membRevRecDetail.replyList.length; i++) {
            if (comApi.isNotNullAndUndefined($scope.membRevRecDetail.replyList[i].fbkVoice)) {
                $scope.membRevRecDetail.replyList[i].playAudio = false;
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
        //window.bdk.play("http://192.168.1.18:8081/uploadFiles/test.mp3");
    };

    //播放完成
    $window.playComplete = function(data){
        var jsonData = JSON.parse(data);

        if (jsonData.stop) {
            for (var i=0; i<$scope.membRevRecDetail.replyList.length; i++) {
                if (comApi.isNotNullAndUndefined($scope.membRevRecDetail.replyList[i].fbkVoice)) {
                    $scope.membRevRecDetail.replyList[i].playAudio = false;
                    $scope.$apply();
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

    //定义一个标志，控制语音、键盘切换输入
    //默认为true，键盘输入
    $scope.switchKeyOrAudio = true;

    //切换语音和手机键盘
    $scope.swichInp = function() {
        $scope.switchKeyOrAudio = !$scope.switchKeyOrAudio;
    };


    //定义一个标志，控制语音切换输入
    $scope.switchKeyOrVoice = true;
    $scope.switchAnimateVoice = function() {
        $scope.switchKeyOrVoice = !$scope.switchKeyOrVoice;
    };

    //控制输入框的高度(高度自适应的textarea)
    $scope.changeRow = function(){
       var oHideText =  document.getElementById("hideText");
        oHideText.value = oRecTextA.value;
        setTimeout(function(){
            oRecTextA.style.height=oHideText.scrollHeight + "px";
        }, 0);
    };

    //点击回退
    $scope.goFrontPage = function() {

        if ($rootScope.REVRECDET_FLG) {

            $state.go("membRevisitRec");

        } else {

            $state.go("membRevisitTskDetail", {
                curMembIndex : $sessionStorage.membRevTskIndex
            });
        }

    };

});