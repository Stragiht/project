/**
 * 推送通知Controller
 */
app
    .controller(
        'pushManagementPageCtrl',
        function($scope, $state, $sessionStorage, $stateParams, comApi) {
        	
        	var navMenu = comApi.showFooterMenu("");
        	$scope.$emit('navMenu.type', navMenu); 

          // 从原生获取登陆信息
          var dataJson = JSON.parse(window.bdk.getPassword());

//          var dataJson = JSON
//              .parse("{\"success\":true, \"result\":{\"username\":\"\",\"password\":\"\"}}");

          if (dataJson.success) {
            // 登陆
            comApi
                .post(
                    'login/mobileLogin',
                    {
                      name : dataJson.result.username,
                      password : dataJson.result.password
                    },
                    function(data) {
                      if (data.status == "1") {
                        $sessionStorage.userId = dataJson.result.username;
                        $sessionStorage.ustu = data.logStatus;
                        // 取得当前用户权限
                        comApi.selectUserPower(function(value) {
                          $sessionStorage.userPower = value;

                          comApi.getFileServerUrl();
                          // 从消息文件中取得前台使用的消息
                          comApi.selectMessageALL();
                          var goUrl = "";
                          var goParam = {};
                          // 跳转页面
                          if($stateParams.url == '0002'){
                        	  goUrl = 'entryApplInfo';
                        	  goParam = {"jumpFlg":"0002","entryApplId":$stateParams.applNum};
                          }else if ($stateParams.url == '0003'){
                        	  goUrl = 'dimiApplInfo';
                        	  goParam = {"jumpFlg":"0003","dimiApplId":$stateParams.applNum};
                          }   else if ($stateParams.url == '0004'){
                        	  goUrl = 'persActInfo';
                        	  goParam = {"jumpFlg":"0004","persActId":$stateParams.applNum};
                          }  else if ($stateParams.url == '0005'){
                        	  goUrl = 'baShiftMngApplInfo';
                        	  goParam = {"jumpFlg":"0005","baShiftMngApplId":$stateParams.applNum};
                          }  else if ($stateParams.url == '0006'){
                        	  goUrl = 'baShiftMngApplInfo';
                        	  goParam = {"jumpFlg":"0006","baShiftMngApplId":$stateParams.applNum};
                          }  else if ($stateParams.url == '0007'){
                        	  goUrl = 'appAttendReportInfo';
                        	  goParam = {"jumpFlg":"0007","appAttendReportId":$stateParams.applNum};
                          }  else if ($stateParams.url == '0008'){
                        	  goUrl = 'reportApprovalDetails';
                        	  goParam = {"jumpFlg":"0008","reportApprovalDetailsId":$stateParams.applNum};
                          }  else if ($stateParams.url == '0009'){
                        	  goUrl = 'approvalDetails';
                        	  goParam = {"jumpFlg":"0009","approvalDetailsId":$stateParams.applNum};
                          }                 
                          
                          comApi.post('messageCallback/updatePushMsgStatusByHaveRead',goParam, function(data) {
                        	  
                          });
                          
                          if(goUrl != ""){
                              $state.go(goUrl, {
                                  applNum : $stateParams.applNum
                                });
                          }
                        });
                      } else {
                        // 弹出错误消息
                        var alertPopup = $ionicPopup
                            .alert({
                              title : '<span class="popheader"><i class="fa fa-times-circle-o"></i> 登录失败</span>',
                              template : '用户名或密码错误。',
                              okText : '我知道了'
                            });
                      }
                    });
          }

        });