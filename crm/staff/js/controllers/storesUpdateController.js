/**
 * 
 * 更新销售门店信息 Created by helt on 2016-3-24.
 */

app
    .controller(
        "storesUpdate",
        function($scope, $http,$filter, NgTableParams, $location, $stateParams,
            toaster, comApi, $localStorage) {

          // 用于显示错误信息
          $scope.show = {
            strNum : false,
            strNm : false,
            subPartiNum : false,
            majRgnNum : false,
            rgnNum_sheng : false,
            rgnNum_shi : false,
            partiNum : false,
            strAddrDtl : false
          };
          // 初始化销售门店信息对象
          $scope.xsmdxx = {};
          // 设置了一个用于存放个人创建变量用的对象
          $scope.myPara = {
            // 存放page相关参数
            page : {
              // 存放url上参数信息
              url : {
                // 所属销售渠道
                strType : $stateParams.strType,
                // 页码数
                //pageNum : $stateParams.pageNum,
                // 每页最大行数
                //pageSize : $stateParams.pageSize,
                // 主键
                strNum : $stateParams.strNum
              }
            }
          };

          // 初始化用于保存报错信息的对象
          $scope.inputEmptyInfo = {};
          // 定义了一个自用的对象
          var myStoreObj = {
            // 存放 与 check 相关
            check : {},
            // 存放与 select 相关
            select : {},
            // 存放code数据
            code : {}
          };
          // 设置code键值对
          myStoreObj.code = {
            selectType : {
              // 0：返回取得结果（用于必须输入项目）
              selectType_0 : 0,
              // 1：在取得结果的第一行追加一条空白（用于登录，编辑画面的非必须输入项目）
              selectType_1 : 1,
              // 2：在取得结果的第一行追加一条全部（用于选择画面的选择条件的非必须输入项目）
              selectType_2 : 2
            },
            pageKey : {
              // PGSTFW0250003
              storeSelect : "PGREPW0130001"
            },
            dicCode : {
              strType : ""
            }
          }

          // 将select 相关的方法放到一个对象中
          myStoreObj.select = {
            setDefaultChoose : {
              // 联动相关的select begin
              // 获取销售渠道字段数据 获取到返回true 否则返回 false
              getChnlList : function(pageKey, selectType) {
                $scope.chnlList = comApi.getChnlList(pageKey, selectType);
                // 返回数组大于0 说明存在数据
                if ($scope.chnlList.length > 0) {
                  // 必选项 默认选中第一条数据
                  $scope.xsmdxx.subPartiNum = $scope.chnlList[0].key;
                  // 存在查询结果
                  return true;
                }
                // 不存在查询结果
                return false;
              },
              // 获取销售大区分区字段数据 获取到返回 true 否则 返回 false
              getMajRgnList : function(subPartiNum, selectType) {
                // 销售大区字段
                $scope.majRgnList = comApi.getMajRgnList(subPartiNum,
                    selectType);
                // 返回数组大于0 说明存在数据
                if ($scope.majRgnList.length > 0) {
                  // 必选项 默认选中第一条数据
                  $scope.xsmdxx.majRgnNum = $scope.majRgnList[0].key;
                  // 存在查询结果
                  return true;
                }
                // 不存在查询结果
                return false;
              },
              // 获取省份字段分区数据 获取到返回true 否则返回false
              getProList : function(subPartiNum, xsdq, selectType) {
                // 省份字段
                $scope.proList = comApi.getProList(subPartiNum, xsdq,
                    selectType);
                // 返回数组大于0 说明存在数据
                if ($scope.proList.length > 0) {
                  // 必选项 默认选中第一条数据
                  $scope.xsmdxx.rgnNum_sheng = $scope.proList[0].key;
                  // 存在查询结果
                  return true;
                }
                // 不存在查询结果
                return false;
              },
              // 获取城市字段数据 获取到返回true 否则返回false
              getCityList : function(subPartiNum, xsdq, sf, selectType) {
                // 城市字段
                $scope.cityList = comApi.getCityList(subPartiNum, xsdq, sf,
                    selectType);
                // 返回数组大于0 说明存在数据
                if ($scope.cityList.length > 0) {
                  // 必选项 默认选中第一条数据
                  $scope.xsmdxx.rgnNum_shi = $scope.cityList[0].key;
                  // 存在查询结果
                  return true;
                }
                // 不存在查询结果
                return false;
              },
              // 获取城市分区字段数据 获取到返回true 否则返回false
              getPartiList : function(subPartiNum, cs, selectType) {
                // 城市分区
                $scope.myPartList = comApi.getPartiList(subPartiNum, cs,
                    selectType);
                // 返回数组大于0 说明存在数据
                if ($scope.myPartList.length > 0) {
                  // 必选项 默认选中第一条数据
                  $scope.xsmdxx.partiNum = $scope.myPartList[0].key;
                  // 存在查询结果
                  return true;
                }
                // 不存在查询结果
                return false;
              },
              // 联动相关的select end

              // 获取店铺类型字段数据
              getStrType : function(dicCateNum, selectType) {
                $scope.strTypeList = comApi.getSelectBoxDic(dicCateNum,
                    selectType);
                // 返回数组大于0 说明存在数据
                if ($scope.strTypeList.length > 0) {
                  // 必选项 默认选中第一条数据
                  $scope.xsmdxx.strType = $scope.strTypeList[0].key;
                  // 存在查询结果
                  return true;
                }
                // 不存在查询结果
                return false;
              }
            },
            // 用于update时显示select
            // 获取下拉列表数据，不设置默认选中
            unSetDefaultChoose : {
              // 联动相关的select begin
              // 获取销售渠道字段数据 获取到返回true 否则返回 false
              getChnlList : function(pageKey, selectType) {
                $scope.chnlList = comApi.getChnlList(pageKey, selectType);
                // 返回数组大于0 说明存在数据
                if ($scope.chnlList.length > 0) {
                  // 存在查询结果
                  return true;
                }
                // 不存在查询结果
                return false;
              },
              // 获取销售大区分区字段数据 获取到返回 true 否则 返回 false
              getMajRgnList : function(subPartiNum, selectType) {
                // 销售大区字段
                $scope.majRgnList = comApi.getMajRgnList(subPartiNum,
                    selectType);
                // 返回数组大于0 说明存在数据
                if ($scope.majRgnList.length > 0) {
                  // 存在查询结果
                  return true;
                }
                // 不存在查询结果
                return false;
              },
              // 获取省份字段分区数据 获取到返回true 否则返回false
              getProList : function(subPartiNum, xsdq, selectType) {
                // 省份字段
                $scope.proList = comApi.getProList(subPartiNum, xsdq,
                    selectType);
                // 返回数组大于0 说明存在数据
                if ($scope.proList.length > 0) {
                  // 存在查询结果
                  return true;
                }
                // 不存在查询结果
                return false;
              },
              // 获取城市字段数据 获取到返回true 否则返回false
              getCityList : function(subPartiNum, xsdq, sf, selectType) {
                // 城市字段
                $scope.cityList = comApi.getCityList(subPartiNum, xsdq, sf,
                    selectType);
                // 返回数组大于0 说明存在数据
                if ($scope.cityList.length > 0) {
                  // 存在查询结果
                  return true;
                }
                // 不存在查询结果
                return false;
              },
              // 获取城市分区字段数据 获取到返回true 否则返回false
              getPartiList : function(subPartiNum, cs, selectType) {
                // 城市分区
                $scope.myPartList = comApi.getPartiList(subPartiNum, cs,
                    selectType);
                // 返回数组大于0 说明存在数据
                if ($scope.myPartList.length > 0) {
                  // 存在查询结果
                  return true;
                }
                // 不存在查询结果
                return false;
              }
            // 联动相关的select end
            }
          }

          // 调用店铺类型
          myStoreObj.select.setDefaultChoose.getStrType("C032", "1");

          // 将select下拉列表置空
          myStoreObj.emptySelect = {
            // 将销售渠道下拉列表置null
            setChnlListEmpty : function() {
              // 将下拉列表选中值置null
              $scope.xsmdxx.subPartiNum = null;
              // 将下拉列表置null
              $scope.chnlList = null;
            },
            // 将销售大区下拉列表置null
            setMajRgnListEmpty : function() {
              // 将下拉列表选中值置null
              $scope.xsmdxx.majRgnNum = null;
              // 将下拉列表置null
              $scope.majRgnList = null;
            },
            // 将省份下拉列表置null
            setProListEmpty : function() {
              // 将下拉列表选中值置null
              $scope.xsmdxx.rgnNum_sheng = null;
              // 将下拉列表置null
              $scope.proList = null;
            },
            // 将城市下拉列表置null
            setCityListEmpty : function() {
              // 将下拉列表选中值置null
              $scope.xsmdxx.rgnNum_shi = null;
              // 将下拉列表置null
              $scope.cityList = null;
            },
            // 将城市分区下拉列表置null
            setPartiListEmpty : function() {
              // 将下拉列表选中值置null
              $scope.xsmdxx.partiNum = null;
              // 将下拉列表置null
              $scope.myPartList = null;
            }
          }

          // 自动调用select方法
          var selectInit = function(getChnlList) {
            var listGetStep = getChnlList;
            selectSwitch();
            function selectSwitch() {
              switch (listGetStep) {
              case "getChnlList":
                // 如果获取到数据 调用联动查询 否则调用联动清空
                if (myStoreObj.select.setDefaultChoose.getChnlList(
                    myStoreObj.code.pageKey.storeSelect,
                    myStoreObj.code.selectType.selectType_0)) {
                  listGetStep = "getMajRgnList";
                  selectSwitch();
                } else {
                  // 调用联动清空
                  emptySelectSwitch();
                }
                break;
              case "getMajRgnList":
                if (myStoreObj.select.setDefaultChoose.getMajRgnList(
                    $scope.xsmdxx.subPartiNum,
                    myStoreObj.code.selectType.selectType_0)) {
                  listGetStep = "getProList";
                  selectSwitch();
                } else {
                  // 调用联动清空
                  emptySelectSwitch();
                }
                break;
              case "getProList":
                if (myStoreObj.select.setDefaultChoose.getProList(
                    $scope.xsmdxx.subPartiNum, $scope.xsmdxx.majRgnNum,
                    myStoreObj.code.selectType.selectType_0)) {
                  listGetStep = "getCityList";
                  selectSwitch();
                } else {
                  // 调用联动清空
                  emptySelectSwitch();
                }
                break;
              case "getCityList":
                if (myStoreObj.select.setDefaultChoose.getCityList(
                    $scope.xsmdxx.subPartiNum, $scope.xsmdxx.majRgnNum,
                    $scope.xsmdxx.rgnNum_sheng,
                    myStoreObj.code.selectType.selectType_0)) {
                  listGetStep = "getPartiList";
                  selectSwitch();
                } else {
                  // 调用联动清空
                  emptySelectSwitch();
                }
                break;
              case "getPartiList":
                if (myStoreObj.select.setDefaultChoose.getPartiList(
                    $scope.xsmdxx.subPartiNum, $scope.xsmdxx.rgnNum_shi,
                    myStoreObj.code.selectType.selectType_0)) {
                } else {
                  // 调用联动清空
                  emptySelectSwitch();
                }
                break;
              }
            }

            function emptySelectSwitch() {
              switch (listGetStep) {
              case "getChnlList":
                // 调用置null销售渠道下拉列表
                myStoreObj.emptySelect.setMajRgnListEmpty();
                // 将标志位置为销售大区
                listGetStep = "getMajRgnList";
                $scope.xsmdxx.subPartiNum = null;
                // 调用根据标志位清空select方法
                emptySelectSwitch();
                break;
              case "getMajRgnList":
                // 调用置null销售大区下拉列表
                myStoreObj.emptySelect.setMajRgnListEmpty();
                // 将标志位置为省份
                listGetStep = "getProList";
                $scope.xsmdxx.majRgnNum = null;
                // 调用根据标志位清空select方法
                emptySelectSwitch();
                break;
              case "getProList":
                // 调用置null省份下拉列表
                myStoreObj.emptySelect.setProListEmpty();
                // 将标志位置为城市
                listGetStep = "getCityList";
                $scope.xsmdxx.rgnNum_sheng = null;
                // 调用根据标志位清空select方法
                emptySelectSwitch();
                break;
              case "getCityList":
                // 调用置null城市下拉列表
                myStoreObj.emptySelect.setCityListEmpty();
                // 将标志位置为城市分区
                listGetStep = "getPartiList";
                $scope.xsmdxx.rgnNum_shi = null;
                // 调用根据标志位清空select方法
                emptySelectSwitch();
                break;
              case "getPartiList":
                // 调用置null城市分区下拉列表
                myStoreObj.emptySelect.setPartiListEmpty();
                $scope.xsmdxx.partiNum = null;
                break;
              }
            }
          }

          var updateInit = function() {
            var listGetStep = "getChnlList";
            selectSwitch();
            function selectSwitch() {
              switch (listGetStep) {
              case "getChnlList":
                // 如果获取到数据 调用联动查询 否则调用联动清空
                if (myStoreObj.select.unSetDefaultChoose.getChnlList(
                    myStoreObj.code.pageKey.storeSelect,
                    myStoreObj.code.selectType.selectType_0)) {
                  listGetStep = "getMajRgnList";

                  selectSwitch();
                } else {
                  // 调用联动清空
                  emptySelectSwitch();
                }
                break;
              case "getMajRgnList":
                if (myStoreObj.select.unSetDefaultChoose.getMajRgnList(
                    $scope.xsmdxx.subPartiNum,
                    myStoreObj.code.selectType.selectType_0)) {
                  listGetStep = "getProList";
                  selectSwitch();
                } else {
                  // 调用联动清空
                  emptySelectSwitch();
                }
                break;
              case "getProList":
                if (myStoreObj.select.unSetDefaultChoose.getProList(
                    $scope.xsmdxx.subPartiNum, $scope.xsmdxx.xsdq,
                    myStoreObj.code.selectType.selectType_0)) {
                  listGetStep = "getCityList";
                  selectSwitch();
                } else {
                  // 调用联动清空
                  emptySelectSwitch();
                }
                break;
              case "getCityList":
                if (myStoreObj.select.unSetDefaultChoose.getCityList(
                    $scope.xsmdxx.subPartiNum, $scope.xsmdxx.xsdq,
                    $scope.xsmdxx.sf, myStoreObj.code.selectType.selectType_0)) {
                  listGetStep = "getPartiList";
                  selectSwitch();
                } else {
                  // 调用联动清空
                  emptySelectSwitch();
                }
                break;
              case "getPartiList":
                if (myStoreObj.select.unSetDefaultChoose.getPartiList(
                    $scope.xsmdxx.subPartiNum, $scope.xsmdxx.rgnNum_shi,
                    myStoreObj.code.selectType.selectType_0)) {
                }
                break;
              }
            }
          }

          // 联动 onchange 时调用的
          // 销售渠道字段
          $scope.changeChnl = function(subPartiNum) {
            // 获取销售大区
            selectInit("getMajRgnList");
          };
          // 销售大区字段
          $scope.changeMajRgn = function(subPartiNum, xsdq) {
            // 获取省份
            selectInit("getProList");
          };
          // 省份字段
          $scope.changePro = function(subPartiNum, xsdq, sf) {
            // 获取城市
            selectInit("getCityList");
          };
          // 城市字段
          $scope.changeCity = function(subPartiNum, cs) {
            // 获取城市分区
            selectInit("getPartiList");
          };

          // 在controller 初始化的时候会执行的查询    ----    用于初始化update信息
          comApi.get(
              "staff/stores/storesSelectByStrNum/" + comApi.myEncodeURIComponent($stateParams.strNum),
              function(data) {
                $scope.xsmdxx = data;
                if(data.strStartDt!="" && data.strStartDt!=null){
                  $scope.xsmdxx.strStartDt = formatDate(new Date(data.strStartDt));
                }
                if(data.strEndDt!="" && data.strEndDt!=null){
                  $scope.xsmdxx.strEndDt = formatDate(new Date(data.strEndDt));
                }
                $scope.inputEmptyInfo = data;

                $scope.chnlList = comApi.getChnlList("PGREPW0130001", 0);
                // 销售渠道字段
                // 获取销售大区
                //		$scope.majRgnList = comApi.getMajRgnList($scope.xsmdxx.subPartiNum, 0);
                $scope.majRgnList = comApi.getMajRgnList(
                    $scope.xsmdxx.subPartiNum, 0);

                // 销售大区字段
                // 获取省份
                //		$scope.proList = comApi.getProList($scope.xsmdxx.subPartiNum, $scope.xsmdxx.majRgnNm, 0);
                $scope.proList = comApi.getProList($scope.xsmdxx.subPartiNum,
                    $scope.xsmdxx.majRgnNum, 0);

                // 省份字段
                // 获取城市
                //		$scope.cityList = comApi.getCityList($scope.xsmdxx.subPartiNum, $scope.xsmdxx.majRgnNm, $scope.xsmdxx.rgnNm_sheng, 0);
                $scope.cityList = comApi.getCityList($scope.xsmdxx.subPartiNum,
                    $scope.xsmdxx.majRgnNum, $scope.xsmdxx.rgnNum_sheng, 0);

                // 城市字段
                // 获取城市分区
                //		$scope.partList = comApi.getPartiList($scope.xsmdxx.subPartiNum, $scope.xsmdxx.rgnNm_shi, 0);
                $scope.myPartList = comApi.getPartiList(
                    $scope.xsmdxx.subPartiNum, $scope.xsmdxx.rgnNum_shi, 0);

              });

          // 取得页面所有信息，传入更新接口
          $scope.addBook = function(valid) {
            //提交时进行信息验证
            $scope.isSubmitted = true;
            
            if (valid) {
              if($scope.xsmdxx.partiNum==null||$scope.xsmdxx.partiNum==""){
                comApi.HintMessage(["error","所属城市分区"],"","msg.common.00014",0,"");
                return;
              }
              // 当起始时间和结束时间都被选择的时候，判断是否有起始时间大于结束时间的情况。
              if (($scope.xsmdxx.strStartDt!=""&&$scope.xsmdxx.strStartDt!=null)&& ($scope.xsmdxx.strEndDt!=""&&$scope.xsmdxx.strEndDt!=null)) {
                var strStartDt = new Date($scope.xsmdxx.strStartDt);
                var strEndDt = new Date($scope.xsmdxx.strEndDt);
                if (strStartDt > strEndDt) {
                  comApi.HintMessage(["error","店铺"],"","msg.common.00012",0,"");
                  return;
                }
              }
              
              comApi.post("staff/stores/storesUpdate", $scope.xsmdxx, function(
                  data) {
                comApi.HintMessage([ "success", "销售门店信息" ], "", "msg.common.00023",
                    3000, function() {
                    });
                $location.path("/app/staff/storesSelect/0/0/0");
              });
            }
          }
          
        });
        function  formatDate(date)   {     
          var year=date.getFullYear();     
          var month=date.getMonth()+1;     
          var day=date.getDate();    
          return  year+"-"+ formatTen(month)+"-"+ formatTen(day);     
       } 
        
        function formatTen(num) { 
          return num > 9 ? (num + "") : ("0" + num); 
        } 