// 服务器上传路径
var fileServerPath = "";

/**
 * 编辑入职流程
 */
app
    .controller(
        'entryApplUpdateCtrl',
        function($scope, $sessionStorage, $ionicPopup, $ionicScrollDelegate,
            $stateParams, $timeout, $state, $window, $filter, comApi, ionicDatePicker) {
        	
        	var positionDis = "";
        	var selectedPos = "";
        	
        	var navMenu = comApi.showFooterMenu("");
        	$scope.$emit('navMenu.type', navMenu); 
        	
          $scope.entryInfo = {}; // 入职流程信息
          $scope.selectedPro = {}; // 选定的省信息
          $scope.selectedPos = {}; // 选定职位信息
          $scope.selectedChnl = ""; // 选定的渠道
          $scope.selectedDate = new Date();

          $scope.infoShow = false; // 提示信息是否显示
          $scope.entFormShow = true; // 入职流程表单是否显示
          $scope.sexSelectShow = false; // 性别选择页面是否显示
          $scope.locationSelectShow = false; // 所在城市选择页面是否显示
          $scope.positionSelectShow = false; // 职位等级选择页面是否显示
          $scope.supvrStfSelectShow = false; // 直属主管选择页面是否显示
          $scope.subStoreSelectShow = false; // 所属门店选择页面是否显示
          // 保存服务器上传路径
          fileServerPath = $sessionStorage.upload;

          // 初始化
          $scope.init = function() {
            // 取得性别列表
            comApi.getSelectBoxDic("C003", 0).then(function(data) {
              $scope.dicList = data;
            });
            // 取得省列表
            comApi.getSelectBoxPCV("1", 0).then(function(data) {
              $scope.provinceList = data;
            });
            // 取得直属主管人员列表
            comApi.getSelectBoxUndStf($sessionStorage.userId, 0, 0).then(
                function(data) {
                  $scope.undStfList = data;
                });

            /*
             * lg
             * */
            $scope.positionList = [];

            comApi.get("entryAppl/selectJobPosAndLevel4App", function (data) {
              $scope.posAndPosLevelList = data;
              for (var i = 0; i <data.length; i++) {
                $scope.positionList.push({
                  "posNum": data[i].posNum,
                  "posNm": data[i].posNm
                })
              }
            });

            // 取得入职流程信息
            comApi
                .post(
                    "entryAppl/getEntryApplInfoForUpdatePageM",
                    {
                      entApplNum : $stateParams.entApplNum,
                      updtTm : $stateParams.updtTm
                    },
                    function(data) {
                      $scope.entryInfo = data.entApplInfo;
                      $scope.selectedPos.stfNum = $scope.entryInfo.stfPos;
                      document.getElementById("idCardPosPic").value = data.entApplInfo.idCardPosPic;
                      document.getElementById("idCardPosPicSrc").src = fileServerPath
                          + data.entApplInfo.idCardPosPic;
                      document.getElementById("idCardOppPic").value = data.entApplInfo.idCardOppPic;
                      document.getElementById("idCardOppPicSrc").src = fileServerPath
                          + data.entApplInfo.idCardOppPic;
                      $scope.selectedDate = new Date($scope.entryInfo.stfEntDt);
                      //$scope.positionList = data.posList;
                      $scope.chnlList = data.chnlList;
                      var chnlWidth = 100 / Number($scope.chnlList.length);
                      $scope.chnlWidth = chnlWidth + "%";
                      if ($scope.chnlList.length > 0) {
                        $scope.selectedChnl = $scope.chnlList[0].chnlNum;
                      }
                      // 显示门店
                      var subStoreArray = $scope.entryInfo.subStoreNm
                          .split(",");
                      if (subStoreArray.length == 1) {
                        $scope.entryInfo.subStoreDisplay = subStoreArray[0];
                      } else {
                        $scope.entryInfo.subStoreDisplay = subStoreArray[0]
                            + "...";
                      }
                    });
          };

          // 执行初始化方法
          $scope.init();

          /**
           * 性别
           */
          // 显示性别选择页面
          $scope.sexSelect = function() {
            $scope.entFormShow = false;
            $scope.sexSelectShow = true;
            $scope.locationSelectShow = false;
            $scope.positionSelectShow = false;
            $scope.supvrStfSelectShow = false;
            $scope.subStoreSelectShow = false;
          };
          // 选定性别
          $scope.clickSex = function(dic) {
            $scope.entryInfo.sexDis = dic.text;
            $scope.goBack();
          };
          // 返回
          $scope.goBack = function() {
            $scope.entFormShow = true;
            $scope.sexSelectShow = false;
            $scope.locationSelectShow = false;
            $scope.positionSelectShow = false;
            $scope.supvrStfSelectShow = false;
            $scope.subStoreSelectShow = false;
            $scope.posLvlListShow=false;
          };
          $scope.goBack1 = function() {
            $scope.entFormShow = true;
            $scope.sexSelectShow = false;
            $scope.locationSelectShow = false;
            $scope.positionSelectShow = false;
            $scope.supvrStfSelectShow = false;
            $scope.subStoreSelectShow = false;
            $scope.citListShow = false;
            $scope.proListShow=false;
          };
          $scope.goBack2 = function() {
            comApi.getSelectBoxPCV("1", 0).then(function(data) {
              $scope.provinceList = data;
            });
            $scope.entFormShow = false;
            $scope.sexSelectShow = false;
            $scope.positionSelectShow = false;
            $scope.proListShow=true;
            $scope.supvrStfSelectShow = false;
            $scope.subStoreSelectShow = false;
            $scope.locationSelectShow = true;
            $scope.citListShow = false;

          };
          $scope.goBack3 = function() {
            // 取得职位列表,门店列表
               /*comApi.post("entryAppl/getCtrlMstInfoM", {supvrStfNum:$sessionStorage.userId},
                       function(data) {
                 $scope.positionList = data.posList;
               });*/
               
               $scope.entFormShow = false;
               $scope.sexSelectShow = false;
               $scope.positionSelectShow = true;
               $scope.proListShow=false;
               $scope.supvrStfSelectShow = false;
               $scope.subStoreSelectShow = false;
               $scope.locationSelectShow = false;
               $scope.citListShow = false;
               $scope.posLvlListShow=false;

             };
             $scope.goBack4 = function() {
               $scope.entFormShow = true;
               $scope.sexSelectShow = false;
               $scope.locationSelectShow = false;
               $scope.positionSelectShow = false;
               $scope.supvrStfSelectShow = false;
               $scope.subStoreSelectShow = false;
               $scope.posLvlListShow=false;
             };
          /**
           * 所在城市
           */
          // 显示所在城市选择页面
          $scope.locationSelect = function() {
            // 调用原生定位 TODO
            window.bdk.getCurrentCity();
            // 回到顶部
            $ionicScrollDelegate.$getByHandle('locationScrollPro').scrollTop();

            $scope.selectedPro.key=$scope.entryInfo.stfFrProv;
            $scope.proListShow = true;
            $scope.citListShow = false;

            $scope.entFormShow = false;
            $scope.sexSelectShow = false;
            $scope.locationSelectShow = true;
            $scope.positionSelectShow = false;
            $scope.supvrStfSelectShow = false;
            $scope.subStoreSelectShow = false;
          };
          // 点击定位到的位置
          $scope.clickLocation = function() {
            if (document.getElementById("locationSuccess").value) {
              var proName = document.getElementById("locationProvince").value;
              var cityName = document.getElementById("locationCity").value;
              // 确定省
              for(var i=0;i<$scope.provinceList.length;i++){
                if($scope.provinceList[i].text==proName){
                  $scope.entryInfo.stfFrProv = $scope.provinceList[i].key;
                  break;
                }
              }
              // 确定市
              comApi.getSelectBoxPCV($scope.entryInfo.stfFrProv, 0).then(function(data) {
                for(var i=0;i<data.length;i++){
                  if(data[i].text==cityName){
                    $scope.entryInfo.stfFrCity = data[i].key;
                    break;
                  }
                }
                $scope.entryInfo.locationDis = proName + " " + cityName;
                $scope.goBack1();
              });
              
            }
          };
          // 选定省
          $scope.clickProvince = function(pro) {
            // 保存选定的省信息
            $scope.selectedPro = pro;
            // 回到顶部
            $ionicScrollDelegate.$getByHandle('locationScroll').scrollTop();
            // 取得省对应的市列表
            comApi.getSelectBoxPCV(pro.key, 0).then(function(data) {
              $scope.cityList = data;
              $scope.proListShow = false;
              $scope.citListShow = true;
            });
          };
          // 选定市
          $scope.clickCity = function(cit) {
            $scope.entryInfo.locationDis = $scope.selectedPro.text + " "
                + cit.text;
            $scope.entryInfo.stfFrProv = $scope.selectedPro.key;
            $scope.goBack1();
          };

          /**
           * 职位等级
           */
          // 显示职位等级选择页面
          $scope.positionSelect = function() {
        	$scope.entryInfo.stfPos = $scope.selectedPos.stfNum;
            $scope.posLvlListShow = false;

            $scope.entFormShow = false;
            $scope.sexSelectShow = false;
            $scope.locationSelectShow = false;
            $scope.positionSelectShow = true;
            $scope.supvrStfSelectShow = false;
            $scope.subStoreSelectShow = false;
          };

          // 选定职位
          $scope.clickPosition = function(pos) {
            positionDis = pos.posNm;
            $scope.positionLvlList = [];
            $scope.posLvlListShow = true;
            for (var i = 0; i < $scope.posAndPosLevelList.length; i++) {
              if ($scope.posAndPosLevelList[i].posNum == pos.posNum) {
                $scope.positionLvlList = angular.copy($scope.posAndPosLevelList[i].posLvls);
                break;
              }
            }

            if ($scope.positionLvlList.length > 0) {
              // 保存选定的职位信息
              selectedPos = pos;
            } else {
              //职位没有等级时
              $scope.entryInfo.stfPos = pos.posNum;
              $scope.selectedPos.stfNum = pos.posNum;
              $scope.entryInfo.positionDis = positionDis;
              $scope.goBack();
            }
          };

          // 选定职位等级
          $scope.clickPositionLvl = function(posLvl) {
        	  $scope.entryInfo.stfPos = selectedPos.posNum;
        	  $scope.selectedPos.stfNum = selectedPos.posNum;
        	  $scope.entryInfo.posGrdNum = posLvl.posGrdNum;
            $scope.entryInfo.positionDis = positionDis + " "
                + posLvl.posGrdNm;
            $scope.goBack4();
          };

          /**
           * 直属主管
           */
          // 显示直属主管选择页面
          $scope.supvrStfSelect = function() {
            $scope.entFormShow = false;
            $scope.sexSelectShow = false;
            $scope.locationSelectShow = false;
            $scope.positionSelectShow = false;
            $scope.supvrStfSelectShow = true;
            $scope.subStoreSelectShow = false;
          };
          // 选定直属主管
          $scope.clickSupvrStf = function(undStf) {
            $scope.entryInfo.supvrStfDis = undStf.text;
            comApi.post("entryAppl/getCtrlMstInfoM", {supvrStfNum:undStf.key},
                    function(data) {
                //$scope.positionList = data.posList;
                $scope.chnlList = data.chnlList;
                var chnlWidth = 100 / Number($scope.chnlList.length);
                $scope.chnlWidth = chnlWidth + "%";
                if ($scope.chnlList.length > 0) {
                  $scope.selectedChnl = $scope.chnlList[0].chnlNum;
                }
              });
            $scope.goBack();
          };

          /**
           * 所属门店
           */
          // 显示所属门店选择页面
          $scope.subStoreSelect = function() {
            $scope.entFormShow = false;
            $scope.sexSelectShow = false;
            $scope.locationSelectShow = false;
            $scope.positionSelectShow = false;
            $scope.supvrStfSelectShow = false;
            $scope.subStoreSelectShow = true;

            $scope.infoShow = true;

            $timeout(function() {
              $scope.infoShow = false;
            }, 3000);
          };
          // 选定渠道
          $scope.clickChnl = function(chnlNum) {
            $scope.selectedChnl = chnlNum;
          };
          // 选定门店
          $scope.clickSubStore = function(subStore) {
            var strs = [];
            var strNms = [];
            for (var i = 0; i < $scope.chnlList.length; i++) {
              var storeDataList = $scope.chnlList[i].subStoreList;
              for (var j = 0; j < storeDataList.length; j++) {
                if (storeDataList[j].isCheck) {
                  strs.push(storeDataList[j].subStrNum);
                  strNms.push(storeDataList[j].strNm);
                }
              }
            }
            $scope.entryInfo.subStore = strs.join(",");
            $scope.entryInfo.subStoreNm = strNms.join(",");
            if (strNms.length > 0) {
              $scope.entryInfo.subStoreDisplay = strNms[0];
              if (strNms.length > 1) {
                $scope.entryInfo.subStoreDisplay = strNms[0] + "...";
              }
            } else {
              $scope.entryInfo.subStoreDisplay = "";
            }
          };

          // 选择日期
          $scope.openDatePicker = function() {
            ionicDatePicker.openDatePicker({
              callback : function(val) {
                $scope.selectedDate = new Date(val);
                var date = $filter("date")(val, 'yyyy-MM-dd');
                $scope.entryInfo.stfEntDt = date;
              },
              inputDate : $scope.selectedDate
            });
          };

          // 返回前页面
          $scope.goFrontPage = function() {
            var confirmPopup = $ionicPopup.confirm({
              title : '提示',
              template : '确定要放弃此次编辑？',
              okText : '确定',
              cancelText : '取消'

            });
            confirmPopup.then(function(res) {
              if (res) {
                $state.go("entryApplInfo", {
                  applNum : $stateParams.entApplNum
                });
              }
            });
          };

          // 保存操作
          $scope.saveEntryAppl = function() {
            $scope.entryInfo.idCardPosPic = document
                .getElementById("idCardPosPic").value;
            $scope.entryInfo.idCardOppPic = document
                .getElementById("idCardOppPic").value;
            // 表单验证
            if (!$scope.checkForm()) {
              return;
            }
            comApi.post("entryAppl/saveEntryApplUpdate", $scope.entryInfo,
                function(data) {
                  // 弹出提示消息
                  comApi.showMessage("success", "msg.common.10001", 3000);
                  // 3秒后跳转
                  $timeout(function() {
                    // 跳转到入职流程详情页面
                    $state.go("entryApplInfo", {
                      applNum : $stateParams.entApplNum
                    });
                  }, 3000);
                },true);
          };

          // 提交操作
          $scope.submitEntryAppl = function() {
            $scope.entryInfo.idCardPosPic = document
                .getElementById("idCardPosPic").value;
            $scope.entryInfo.idCardOppPic = document
                .getElementById("idCardOppPic").value;
            // 表单验证
            if (!$scope.checkForm()) {
              return;
            }
            comApi.post("entryAppl/submitEntryApplUpdate", $scope.entryInfo,
                function(data) {
                  // 弹出提示消息
                  comApi.showMessage("success", "msg.common.10001", 3000);
                  // 3秒后跳转
                  $timeout(function() {
                    // 跳转到入职流程详情页面
                    $state.go("entryApplInfo", {
                      applNum : $stateParams.entApplNum
                    });
                  }, 3000);
                },true);
          };

          // 表单验证
          $scope.checkForm = function() {
            // 姓名
            if ($scope.isEmpty($scope.entryInfo.stfNm)) {
              comApi.showMessage([ "error", "姓名" ], "msg.common.10002", 3000);
              return false;
            }
            // 性别
            if ($scope.isEmpty($scope.entryInfo.sex)) {
              comApi.showMessage([ "error", "性别" ], "msg.common.10002", 3000);
              return false;
            }
            // 联系电话
            if ($scope.isEmpty($scope.entryInfo.stfMobPhNum)) {
              comApi.showMessage([ "error", "联系电话" ], "msg.common.10002", 3000);
              return false;
            }
            var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            if (!reg.exec($scope.entryInfo.stfMobPhNum)) {
              comApi.showMessage([ "error", "联系电话" ], "msg.common.10004", 3000);
              return false;
            }
            // 身份证号码
            if ($scope.isEmpty($scope.entryInfo.stfIdNum)) {
              comApi
                  .showMessage([ "error", "身份证号码" ], "msg.common.10002", 3000);
              return false;
            }
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if (!reg.exec($scope.entryInfo.stfIdNum)) {
              comApi
                  .showMessage([ "error", "身份证号码" ], "msg.common.10004", 3000);
              return false;
            }
            // 身份证正面图片
            if ($scope.isEmpty($scope.entryInfo.idCardPosPic)) {
              comApi.showMessage([ "error", "身份证正面图片" ], "msg.common.10002",
                  3000);
              return false;
            }
            // 身份证反面图片
            if ($scope.isEmpty($scope.entryInfo.idCardOppPic)) {
              comApi.showMessage([ "error", "身份证反面图片" ], "msg.common.10002",
                  3000);
              return false;
            }
            // 所在城市
            if ($scope.isEmpty($scope.entryInfo.stfFrProv)) {
              comApi.showMessage([ "error", "所在城市" ], "msg.common.10002", 3000);
              return false;
            }
            if ($scope.isEmpty($scope.entryInfo.stfFrCity)) {
              comApi.showMessage([ "error", "所在城市" ], "msg.common.10002", 3000);
              return false;
            }
            // 入职时间
            if ($scope.isEmpty($scope.entryInfo.stfEntDt)) {
              comApi.showMessage([ "error", "入职时间" ], "msg.common.10002", 3000);
              return false;
            }
         // 职位等级
            if ($scope.isEmpty($scope.entryInfo.stfPos)) {
              comApi.showMessage([ "error", "职位" ], "msg.common.10002", 3000);
              return false;
            }
            if ($scope.isEmpty($scope.entryInfo.posGrdNum)) {
                comApi.showMessage([ "error", "职位等级" ], "msg.common.10002", 3000);
                return false;
              }
            // 直属主管
            if ($scope.isEmpty($scope.entryInfo.supvrStfNum)) {
              comApi.showMessage([ "error", "直属主管" ], "msg.common.10002", 3000);
              return false;
            }
            // 所属门店
            if ($scope.isEmpty($scope.entryInfo.subStore)) {
              comApi.showMessage([ "error", "所属门店" ], "msg.common.10002", 3000);
              return false;
            }
            return true;
          };
          // 判断是否为空
          $scope.isEmpty = function(str) {
            if (str == "" || str == null || str == undefined) {
              return true;
            } else {
              return false;
            }
          };

          // 上传图片
          $scope.uploadPicture = function(index) {
            var data = '{"token" : "' + $sessionStorage.ustu + '", "index" : "'
                + index + '", "type" : "idcardpospic"}';
            window.bdk.uploadPicture(data);
          }

            // 上传图片完成
            $window.uploadComplete = function(data) {
                var dataJson = JSON.parse(data);
                if (dataJson.success) {
                    if (dataJson.result.index == "1") {
                        document.getElementById("idCardPosPic").value = dataJson.result.filePath;
                        document.getElementById("idCardPosPicSrc").src = fileServerPath + dataJson.result.filePath;
                    } else {
                        document.getElementById("idCardOppPic").value = dataJson.result.filePath;
                        document.getElementById("idCardOppPicSrc").src = fileServerPath + dataJson.result.filePath;
                    }
                } else {
              	    comApi.appCallBackFaultHandle(dataJson, 1);
                }
            }

            // 定位完成
            $window.locationComplete = function(data) {
                var dataJson = JSON.parse(data);
                if (dataJson.success) {
                    document.getElementById("locationSuccess").value = dataJson.success;
                    document.getElementById("locationPlace").innerHTML = dataJson.result.province
                        + " " + dataJson.result.city;
                    document.getElementById("locationProvince").value = dataJson.result.province;
                    document.getElementById("locationCity").value = dataJson.result.city;
                } else {
//                	var errMsg = comApi.appCallBackFaultHandle(dataJson, 3);
                    document.getElementById("locationPlace").innerHTML = "定位失败";
                }
            }
        });