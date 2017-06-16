/**
 * Created by dxm 意见反馈页面 Controller 2016/05/09
 */
app
    .controller(
        'feedbackCtrl',
        function($scope, $http, $sessionStorage, $ionicLoading, $ionicPopup, $interval,
            $timeout, $state, $window, comApi) {
        	
        	var navMenu = comApi.showFooterMenu("");
        	$scope.$emit('navMenu.type', navMenu); 
        	
          // 取得登录用户员工编号
          var userId = $sessionStorage.userId;
          $scope.fb = {};
          // 语音按钮文字
          $scope.audioText = "按住开始语音";
          // 语音按钮是否可用
          $scope.audioButtonStatus = true;
          // 语音记录
          $scope.voicdss = {};
          // 点击保存
          $scope.save = function() {
            // 意见反馈必须输入验证
            if (($scope.fb.fbkInfo == null || $scope.fb.fbkInfo == "" || $scope.fb.fbkInfo == undefined)
                && ($scope.fb.audio == null || $scope.fb.audio == "" || $scope.fb.audio == undefined)) {
            	// 弹出消息
                comApi.showMessage([ "error", "反馈意见" ], "msg.common.10002", 3000);
                return;
            } else {
            	// 保存参数
                var param = {
                  fbkInfo : $scope.fb.fbkInfo,
                  fbkUserNo : userId,
                  audio : $scope.fb.audio
                }
            	comApi.post(
                    "feedback/insertFeedback",
                    {
                    	fbkInfo : $scope.fb.fbkInfo,
                        fbkUserNo : userId,
                        audio : $scope.fb.audio
                     },function(data) {
                    	if (data > 0) {
                            // 弹出提示消息
                            comApi.showMessage("success", "msg.common.10001",
                                3000);
                            // 3秒后跳转
                            $timeout(function() {
                              $state.go("personalCenter");
                            }, 3000);
                          } else {
                            // 弹出错误消息
                            var alertPopup = $ionicPopup
                                .alert({
                                  title : '<span class="popheader"><i class="fa fa-times-circle-o"></i> 添加反馈信息失败</span>',
                                  template : '系统错误。',
                                  okText : '我知道了'
                                });
                          }
                    },true);
            }
          };
          
          var is_active = true;
          var timeOutStatus = false;

          // 语音按钮按住
          $scope.audioOnTouch = function() {
            if (document.activeElement.id == "fbkinfoTextarea") {
              document.getElementById("fbkinfoTextarea").blur();
            } else {
              if ($scope.audioButtonStatus) {
                $scope.audioText = "松开结束...";
                // 开始录音
                window.bdk.startVoiceRecord();
              }
            }
          }

          // 语音按钮松开
          $scope.audioOnRelease = function() {
            if ($scope.audioButtonStatus && is_active) {
              $scope.audioText = "上传中...";
              $scope.audioButtonStatus = false;
              // 结束录音并上传
              var data = '{"token" : "' + $sessionStorage.ustu
                  + '", "index" : "", "type" : ""}';
              var resultJson = JSON.parse(window.bdk.stopVoiceRecord(data));
            } else {
                $scope.audioButtonStatus = true;
            }
          }

          // 上传录音完成
          $window.uploadComplete = function(data) {
            var dataJson = JSON.parse(data);
            if (dataJson.success) {
            	if(dataJson.timeout) {
                    var data = '{"token" : "' + $sessionStorage.ustu
                        + '", "index" : "", "type" : ""}';
                    comApi.showErrorMessage("msg.member.10015");
                    //改变状态
                    $scope.audioButtonStatus = false;
                    timeOutStatus = true;
                    window.bdk.stopVoiceRecord(data);
                    return;
            	} else {
                    var alertPopup = $ionicPopup.alert({
                        title : '提示',
                        template : '上传完成，请保存或重新录音',
                        okText : '我知道了'
                      });
                      var url = comApi.getFileServerPath() + dataJson.result.filePath;
                      var dura = window.bdk.getMP3Time('{"url":"'+url+'"}');
                      dura = JSON.parse(dura);
                      
                      $scope.fb.audio = dataJson.result.filePath;
                      $scope.voicdss = {
                          voice: dataJson.result.filePath,
                          dura: dura.time+'"',
                          showDelete: false,
                          playAudio:false};

                      if (timeOutStatus) {
                          //超时
                    	  $scope.audioButtonStatus = false;
                      } else {
                    	  $scope.audioButtonStatus = true;
                      }
            	}
            } else {
//              if (dataJson.authorize) {
//                comApi.showMessage([ "error" ], "msg.common.10013", 3000);
//                $scope.fb.audio = "";
//              }

          	    comApi.appCallBackFaultHandle(dataJson, 2);
            }
            $scope.audioText = "按住重新开始语音";
            $scope.audioButtonStatus = true;
            $scope.$apply();
          }
          
          // 播放录音
          var timer = null;
          $scope.audioPlay = function(playObj) {
              //取消上一次的定时器
              $interval.cancel(timer);
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

               window.bdk.play('{"url":"'+comApi.getFileServerPath()+playObj.voice+'"}');
          };
          
          // 显示删除按钮
          $scope.playAudioOnTouch = function() {
            var confirmPopup = $ionicPopup.confirm({
              title : "提示",
              template : "确定要删除该段录音吗？",
              okText : "确定",
              cancelText : "取消"

            });
            confirmPopup.then(function(res) {
                if (res) {
                  $scope.voicdss = {};
                }
            });
          }
        });