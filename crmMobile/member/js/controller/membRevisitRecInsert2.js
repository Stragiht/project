/**
 * Created by lenovo on 2016/6/3.
 */
app.controller("membRevisitRecInsert2Ctrl", function($scope, comApi, $state, $sessionStorage, $window, $ionicPopup, $rootScope, ionicDatePicker, $interval, $timeout, $ionicScrollDelegate){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit("navMenu.type", navMenu);

    //点击回退
    $scope.goFrontPage = function() {
        var confirmPopup = $ionicPopup.confirm({
            title : "提示",
            template : "确定要放弃此次操作？",
            okText : "确定",
            cancelText : "取消"

        });
        confirmPopup.then(function(res) {
            if (res) {
                //清空缓存
                $sessionStorage.selCurMembSto = "";
                $state.go("home");
            }
        });
    };

    $scope.pageShow = {
        membInsertShow: true,
        membSelectShow:false
    };

    //定义参数
    $scope.insertMembRevRec = {
        "membNum": "",
        "revisitCont": "",
        "revisitImg": "",
        "revisitTm": null,
        "revisitVoice": ""
        //"rtnTm": null
        //"stfNum": ""
    };

    //选中的会员名称
   /* if (comApi.isNotNullAndUndefined($sessionStorage.selCurMembSto)) {
        $scope.selMembNm = angular.copy($sessionStorage.selCurMembSto.membNm);
    }*/

    //保存新增会员回访记录
    $scope.membRevRecInsert2 = function() {

        //保存图片的字符串
        var imgStr = "";
        for (var i=0; i<$scope.imgss.length; i++) {
            if (i != $scope.imgss.length-1) {
                imgStr += $scope.imgss[i].img + ",";
            } else {
                imgStr += $scope.imgss[i].img;
            }
        }

        //保存音频的路径字符串
        var audioStr = "";
        for (var j=0; j<$scope.voicdss.length; j++) {
            if (j != $scope.voicdss.length-1) {
                audioStr += $scope.voicdss[j].voice + ",";
            } else {
                audioStr += $scope.voicdss[j].voice;
            }
        }

        //获取当前日期的时间戳
        var curTimestamp = new Date().getTime();

        if (!comApi.isNotNullAndUndefined($scope.insertMembRevRec.membNum)) {
            comApi.showErrorMessage("msg.member.10017");
            return;
        } else if (!comApi.isNotNullAndUndefined($scope.insertMembRevRec.revisitTm)) {
            comApi.showErrorMessage("msg.member.10018");
            return;
        } else if ($scope.insertMembRevRec.revisitTm > curTimestamp) {
            comApi.showErrorMessage("msg.member.10019");
            return;
        } else if (!comApi.isNotNullAndUndefined(imgStr) && !comApi.isNotNullAndUndefined(audioStr) && !comApi.isNotNullAndUndefined($scope.insertMembRevRec.revisitCont)) {
            comApi.showErrorMessage("msg.member.10020");
            return;
        }


        //$scope.insertMembRevRec.membNum = angular.copy($sessionStorage.selCurMembSto.membNum);
        $scope.insertMembRevRec.revisitImg = imgStr;
        $scope.insertMembRevRec.revisitVoice = audioStr;

        comApi.myConsoleLog("==",$scope.insertMembRevRec,"===");

        comApi.post('membRevisitRec/insertMembRevisitRecMakesUp4App', $scope.insertMembRevRec, function(data){
            //清空缓存
           // $sessionStorage.selCurMembSto = null;

            comApi.showSuccessMessage("msg.member.10005");

            setTimeout(function() {
                $state.go("home");
            },3000);

        }, true);
    };

    $scope.imgss = [
        /*{
            "img": "http://192.168.1.18:8081/uploadFiles/goods/images/20160606/73bcea8a-b8af-4cf2-b6dd-ef6453962abc.jpg"

        },
        {
            "img": "http://192.168.1.18:8081/uploadFiles/goods/images/20160606/73bcea8a-b8af-4cf2-b6dd-ef6453962abc.jpg"

        }*/

        /*{
            "img": "goods/images/20160606/73bcea8a-b8af-4cf2-b6dd-ef6453962abc.jpg",
            "imgCompress":"goods/images/20160606/73bcea8a-b8af-4cf2-b6dd-ef6453962abc.jpg"

        },
        {
            "img": "goods/images/20160606/73bcea8a-b8af-4cf2-b6dd-ef6453962abc.jpg",
            "imgCompress":"goods/images/20160606/73bcea8a-b8af-4cf2-b6dd-ef6453962abc.jpg"
        }
*/
    ];

    $scope.voicdss = [
         /*{
         "voice": "http://192.168.1.18:8081/uploadFiles/test.mp3",
         "dura":'2'+'"',
          "playAudio":false

         },
         {
         "voice": "http://192.168.1.18:8081/uploadFiles/goods/images/20160606/73bcea8a-b8af-4cf2-b6dd-ef6453962abc.mp3",
         "dura":'1'+'"',
         "playAudio":false
         }*/
    ];


    // 语音按钮是否可用
    var audioButtonStatus = true;
    var oMembRevRecInsert2TextArea = document.getElementById("membRevRecInsert2TextArea");
    var is_active = true;

    //定义一个超时上传语音的状态标识
    var timeOutStatus = false;

    // 语音按钮按住
    $scope.audioOnTouch = function() {

        if (document.activeElement.id == "membRevRecInsert2TextArea") {
            is_active = false;
            oMembRevRecInsert2TextArea.blur();
        } else {
            timeOutStatus = false;
            is_active = true;
            if (audioButtonStatus) {
                //按住录入语音
                document.getElementById("audioText").innerHTML = "松开结束";
                // 开始录音
                window.bdk.startVoiceRecord();
            }
        }

    };

    // 语音按钮松开
    $scope.audioOnRelease = function() {
        if (audioButtonStatus && is_active) {
            document.getElementById("audioText").innerHTML = "上传中...";
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

    $scope.addImg = function(){
        var index = 1;
        // 上传图片（index是如画面上有多个项目需要上传文件时区分是哪个项目上传的文件， type是文件的类型下面是指身份证）
        var data='{"token":"'+$sessionStorage.ustu+'","index":"'+index+'","type":"membrevImg"}';
        window.bdk.uploadPicture(data);
    };


    //测试获取语音调用示例
    $scope.getAudioTime = function(audioSrc) {

        //改变状态
        $scope.switchKeyOrVoice = !$scope.switchKeyOrVoice;

        window.bdk.play(url);
    };

    // 上传图片完成(因为原生上传文件是异步的，所以这个方法是提供给原生计算完以后回调的方法)
    $window.uploadComplete =function(data) {
        //index=1 表示上传图片   index=2表示上传语音
        var dataJson = JSON.parse(data);
        if (dataJson.success) {
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
            } /*else {
                timeOutStatus = false;
            }*/

            if (dataJson.result.index == 1) {
                comApi.showSuccessMessage("msg.member.10013");
                //$scope.$apply($scope.imgss.push({img:comApi.getFileServerPath() + dataJson.result.filePath}));
                $scope.$apply($scope.imgss.push({img: dataJson.result.filePath, imgCompress: comApi.pictureCompression(dataJson.result.filePath, 50, 50)}));

            } else if(dataJson.result.index == 2){
                var url = comApi.getFileServerPath() + dataJson.result.filePath;
                var dura = window.bdk.getMP3Time('{"url":"'+url+'"}');

                dura = JSON.parse(dura);
                //var dura = window.bdk.getMP3Time('{"url":"http://192.168.1.18:8081/uploadFiles/others/audios/20160704/2f614937-9950-4c48-a59a-c66ff22dda26.mp3"}');
                //document.getElementById("audioText").innerHTML = "上传完成，请保存或按住重新开始语音";
                document.getElementById("audioText").innerHTML = "按住重新开始语音";
                //$scope.voicdss.push({voice: dataJson.result.filePath, dura: dura+'"', playAudio:false});
                $scope.voicdss.push({voice: dataJson.result.filePath, dura: dura.time+'"', playAudio:false});

                //$scope.$apply($scope.voicdss.push({voice: dataJson.result.filePath, dura: dura+'"', playAudio:false}));
                $scope.$apply();

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
                document.getElementById("audioText").innerHTML = "按住重新开始语音";
                audioButtonStatus = true;
        	} else {
        		//图片上传失败
                comApi.appCallBackFaultHandle(dataJson, 1);
        	}
        }

    };


    //显示标志
    $scope.headerShow = true;
    $scope.contentShow = true;
    $scope.footerShow = true;
    $scope.pictureShowDiv = false;

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
            } else if (j % 4 == 2) {
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


    $scope.curDate = new Date();
    //日期控件
    $scope.openDatePicker = function($event) {
        ionicDatePicker.openDatePicker({
            //val为一个时间戳
            callback : function(val) {
                $scope.curDate = new Date(val);
                $scope.insertMembRevRec.revisitTm = val;
                $event.stopPropagation();
                comApi.myConsoleLog("==设施编辑的数据===", $scope.insertMembRevRec, "====");
            },
            inputDate:$scope.curDate
        });
    };


    //==================================改成单页面=================================================

    //光标初始化
    function cursorInit() {

        var oSearch =  document.getElementById("searchbox2");
        oSearch.focus();
    }

    //cursorInit();

    //var crtdStfNum = $sessionStorage.userId;

    $scope.MembBas4App = {
        "pageNum":$rootScope.PAGE_NUM,
        "pageSize":$rootScope.PAGE_SIZE,
        "params":{
            "phone":"",
            "crtdStfNum":"",
            "startTime":"",
            "endTime":""
        }};


    //定义上拉加载的标识，true可以上拉，false不能上拉，数据已经加载完成
    $scope.hasNextPage = false;
    //没有输入条件是不显示数据及样式
    $scope.dataShow = false;
    $scope.clickState = false;
    $scope.membNameAndPhoneList = [];

    $scope.searchMembByPhone = function(flg, ref) {

        $scope.dataShow = false;

        if (comApi.isNotNullAndUndefined($scope.MembBas4App.params.phone)) {
            $scope.clickState = true;
        } else {
            $scope.clickState = false;
        }

        if (flg == 1) {
            //初始化查询数据
            $scope.membNameAndPhoneList = [];
            $scope.hasNextPage = true;
            $scope.MembBas4App.pageNum = 1;
            if (!ref) {
                // 回到顶部
                $ionicScrollDelegate.$getByHandle("contentScrollSearch").scrollTop();
            }
        }

        //搜索会员信息列表
        comApi.post("/membBas/selectMembBas4App", $scope.MembBas4App, function(data){

            if (comApi.isNotNullAndUndefined(data.data)) {

                if (data.currnetPage < data.totalPage) {
                    $scope.hasNextPage = true;
                } else {
                    $scope.hasNextPage = false;
                }

                if (flg == 1) {
                    $scope.membNameAndPhoneList = angular.copy(data.data);
                } else if (flg == 2) {
                    $scope.membNameAndPhoneList = $scope.membNameAndPhoneList.concat(data.data);
                    //表示上拉结束(隐藏转圈的效果)
                    $scope.$broadcast("scroll.infiniteScrollComplete");
                }

            } else {
                $scope.hasNextPage = false;
                if ($scope.MembBas4App.pageNum == 1) {
                    $scope.dataShow = true;
                }
                $scope.$broadcast("scroll.refreshComplete");
            }

            //会员列表数据
            comApi.myConsoleLog("搜索会员返回的数据====",data,"===");
        });
    };

    //选择会员的操作
    $scope.membSelectShow = function(flg1, flg2) {

        $scope.pageShow = {
            membInsertShow: flg1,
            membSelectShow: flg2
        };

        //初始化搜索数据
        if (flg2) {
            $scope.searchMembByPhone(1, false);
        }
    };


    //===================数据刷新============================
    //下拉刷新(初始化数据)  flg = 1表示下拉更新
    $scope.doRefresh = function(){
        $scope.searchMembByPhone(1, true);
        $scope.$broadcast("scroll.refreshComplete");
    };

    // 上拉加载  flg = 2 标识上拉加载
    $scope.loadMore = function() {
        if ($scope.hasNextPage) {
            $scope.MembBas4App.pageNum = $scope.MembBas4App.pageNum+1;
            $scope.searchMembByPhone(2, false);
        }
    };

    //选择会员
    $scope.selectMemb = function(memb) {

        $scope.pageShow = {
            membInsertShow: true,
            membSelectShow:false
        };
        $scope.insertMembRevRec.membNum = memb.membNum;
        $scope.insertMembRevRec.membNm = memb.membNm;
    };

    //清空输入
    $scope.clearInput = function() {

        $scope.MembBas4App.params.phone = null;

        $scope.searchMembByPhone(1, false);

        // 回到顶部
       // $ionicScrollDelegate.$getByHandle('contentScrollSearch').scrollTop();
    };

    var oSearchBox2 = document.getElementById("searchbox2");

    $scope.hideKeyboard = function() {
        oSearchBox2.blur();
    };
});