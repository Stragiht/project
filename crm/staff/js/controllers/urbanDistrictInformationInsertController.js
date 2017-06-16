//添加记录
app.controller('urbanDistrictInformationInsertController', [
    '$scope',
    '$state',
    'comApi',
    'toaster',
    function($scope, $state, comApi, toaster) {
      // PGSTFW0240002新增画面ID
      // PGSTFW0240003编辑画面ID
      // 对模型初始化,否则会报undefind异常
      $scope.add = {};
      // 利用flag判断初始化加载还是点击联动产生的事件
      // 加载渠道信息
      // 清空刷新渠道列表下拉表;
      $scope.ChnlInfoList = "";
      $scope.ChnlInfoList = comApi.getChnlList("PGSTFW0240002", 0);
      // 默认第一项被选中
      $scope.add.subChnl = $scope.ChnlInfoList[0].key;
      // 联动城市
      $scope.changecityInfo = function(subChnl, majRgnNum, proRgnNum, flag) {
        if (subChnl == "" || subChnl == null || subChnl == undefined) {
          subChnl = $scope.add.subChnl;
        }

        if (majRgnNum == "" || majRgnNum == null || majRgnNum == undefined) {
          majRgnNum = $scope.add.majRgnNum;
        }
        if (proRgnNum == "" || proRgnNum == null || proRgnNum == undefined) {
          proRgnNum = $scope.add.rgnNum;
        }
        // 加载城市信息
        // 清空刷新下拉框
        $scope.cityInfoList = "";
        // 给城市下拉框赋值
        var data = comApi.getCityList(subChnl, majRgnNum, proRgnNum, 0);
        $scope.cityInfoList = data;
        if (data.length > 0) {
          // 默认第一项被选中
          $scope.add.city = data[0].key;
        }
      }
      // 联动省份
      $scope.changeproVinceInfo = function(subChnl, majRgnNum, flag) {
        // console.log("接收参数:"+$scope.add.majRgnNum);
        if (subChnl == "" || subChnl == null || subChnl == undefined) {
          subChnl = $scope.add.subChnl;
        }
        if (majRgnNum == "" || majRgnNum == null || majRgnNum == undefined) {
          majRgnNum = $scope.add.majRgnNum;
        }
        // 加载省份信息
        // 清空刷新下拉表
        $scope.proVinceInfoList = "";
        $scope.cityInfoList = "";
        // 给省份下拉框赋值
        var data = comApi.getProList(subChnl, majRgnNum, 0);
        $scope.proVinceInfoList = data;

        if (data.length > 0) {
          // 默认第一项被选中
          $scope.add.rgnNum = data[0].key;
        }

        if (flag == null || flag == undefined || flag == "") {
          // 自动加载城市信息
          $scope.changecityInfo(subChnl, majRgnNum, $scope.add.rgnNum);
        } else {
          // 自动加载城市信息
          $scope.changecityInfo(subChnl, majRgnNum, $scope.add.rgnNum, 1);
        }
      }
      // 联动大区
      $scope.changeMajRegInfo = function(subChnl, flag) {
        if (subChnl == "" || subChnl == null || subChnl == undefined) {
          subChnl = $scope.add.subChnl;
        }
        // 加载大区信息
        var data = comApi.getMajRgnList(subChnl, 0);
        // 清空刷新大区省城市下拉表
        $scope.MajRegInfoList = "";
        $scope.proVinceInfoList = "";
        $scope.cityInfoList = "";
        // 给大区下拉框赋值
        $scope.MajRegInfoList = data;

        if (data.length > 0) {
          // 默认第一项被选中
          $scope.add.majRgnNum = data[0].key;
        }

        if (flag == null || flag == undefined || flag == "") {
          // 自动加载省份信息
          $scope.changeproVinceInfo(subChnl, $scope.add.majRgnNum);
        } else {
          // 自动加载省份信息
          $scope.changeproVinceInfo(subChnl, $scope.add.majRgnNum, 1);
        }
      }
      // 自动加载大区信息
      $scope.changeMajRegInfo($scope.add.subChnl);
      // 点击返回
      $scope.fanhui = function() {
        $state.go("app.staff.urbandistrictinformationSelect", {
          pageIndex : null,
          isBack:true
        });
        // $location.path("/app/staff/urbandistrictinformationSelect/");
      }

      // 点击确定添加数据
      $scope.submit = function(isValid) {
        // 提交表单时进行验证
        $scope.isSubmitted = true;
        if (isValid) {
          // 不存在就添加数据
          comApi.post("UrbanDistrictInformation/insert", $scope.add, function(
              data) {
//            if (data == 1) {
              // 操作提示
        	  comApi.successMessage('msg.staff.10001');
//              comApi.HintMessage([ "success", "城市分区数据" ], "提示",
//                  "msg.common.00023", 3000, "");
              // 重新加载session
              // 1.城市分区信息
              comApi.selectUrbDistricALL();
              $state.go("app.staff.urbandistrictinformationSelect", {
                pageIndex : null
              });
//            } 
//            else {
//              // 操作提示
//              comApi.HintMessage([ "error", "该城市分区数据" ], "错误",
//                  "msg.common.00016", 0, "");
//              return;
//            }
          });
        }
      }
    } ]);