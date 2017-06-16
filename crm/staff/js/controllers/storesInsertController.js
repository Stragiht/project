/**
 * 
 * 新增销售门店信息 Created by helt on 2016-3-24.
 */

app.controller("storesInsert", function($scope, $http, $location, comApi,
    toaster, $stateParams) {

  // 用于输入校验错误提示信息显示
  $scope.show = {
    strNum : false,
    strNm : false,
    xsqd : false,
    xsdq : false,
    sf : false,
    cs : false,
    subPartiNum : false,
    strAddrDtl : false,
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
        pageNum : $stateParams.pageNum,
        // 每页最大行数
        pageSize : $stateParams.pageSize,
        // 主键
        strNum : $stateParams.strNum
      }
    }
  }

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
      storeSelect : "PGREPW0130001"
    },
    dicCode : {
      strType : ""
    }
  }

  // // 获取店铺类型
  // comApi.post("staff/stores/storeTypeSelect", "", function(data){
  // alert("获取店铺类型："+data.length);
  // $scope.storeTypeList = data;
  // });

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
          $scope.xsmdxx.xsqd = $scope.chnlList[0].key;
          // 存在查询结果
          return true;
        }
        // 不存在查询结果
        return false;
      },
      // 获取销售大区分区字段数据 获取到返回 true 否则 返回 false
      getMajRgnList : function(xsqd, selectType) {
        // 销售大区字段
        $scope.majRgnList = comApi.getMajRgnList(xsqd, selectType);
        // 返回数组大于0 说明存在数据
        if ($scope.majRgnList.length > 0) {
          // 必选项 默认选中第一条数据
          $scope.xsmdxx.xsdq = $scope.majRgnList[0].key;
          // 存在查询结果
          return true;
        }
        // 不存在查询结果
        return false;
      },
      // 获取省份字段分区数据 获取到返回true 否则返回false
      getProList : function(xsqd, xsdq, selectType) {
        // 省份字段
        $scope.proList = comApi.getProList(xsqd, xsdq, selectType);
        // 返回数组大于0 说明存在数据
        if ($scope.proList.length > 0) {
          // 必选项 默认选中第一条数据
          $scope.xsmdxx.sf = $scope.proList[0].key;
          // 存在查询结果
          return true;
        }
        // 不存在查询结果
        return false;
      },
      // 获取城市字段数据 获取到返回true 否则返回false
      getCityList : function(xsqd, xsdq, sf, selectType) {
        // 城市字段
        $scope.cityList = comApi.getCityList(xsqd, xsdq, sf, selectType);
        // 返回数组大于0 说明存在数据
        if ($scope.cityList.length > 0) {
          // 必选项 默认选中第一条数据
          $scope.xsmdxx.cs = $scope.cityList[0].key;
          // 存在查询结果
          return true;
        }
        // 不存在查询结果
        return false;
      },
      // 获取城市分区字段数据 获取到返回true 否则返回false
      getPartiList : function(xsqd, cs, selectType) {
        $scope.xsmdxx.subPartiNum = "";
        // 城市分区
        $scope.partList = comApi.getPartiList(xsqd, cs, selectType);
        // 返回数组大于0 说明存在数据
        if ($scope.partList.length > 0) {
          // 必选项 默认选中第一条数据
          $scope.xsmdxx.subPartiNum = $scope.partList[0].key;
          // 存在查询结果
          return true;
        }
        // 不存在查询结果
        return false;
      },
      // 联动相关的select end

      // 获取店铺类型字段数据
      getStrType : function(dicCateNum, selectType) {
        $scope.strTypeList = comApi.getSelectBoxDic(dicCateNum, selectType);
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
    }
  }

  // 调用店铺类型
  myStoreObj.select.setDefaultChoose.getStrType("C032", "1");

  // 将select下拉列表置空
  myStoreObj.emptySelect = {
    // 将销售渠道下拉列表置null
    setChnlListEmpty : function() {
      // 将下拉列表选中值置null
      $scope.xsmdxx.xsqd = "";
      // 将下拉列表置null
      $scope.chnlList = null;
    },
    // 将销售大区下拉列表置null
    setMajRgnListEmpty : function() {
      // 将下拉列表选中值置null
      $scope.xsmdxx.xsdq = "";
      // 将下拉列表置null
      $scope.majRgnList = null;
    },
    // 将省份下拉列表置null
    setProListEmpty : function() {
      // 将下拉列表选中值置null
      $scope.xsmdxx.sf = null;
      // 将下拉列表置null
      $scope.proList = null;
    },
    // 将城市下拉列表置null
    setCityListEmpty : function() {
      // 将下拉列表选中值置null
      $scope.xsmdxx.cs = "";
      // 将下拉列表置null
      $scope.cityList = null;
    },
    // 将城市分区下拉列表置null
    setPartiListEmpty : function() {
      // 将下拉列表选中值置null
      $scope.xsmdxx.subPartiNum = "";
      // 将下拉列表置null
      $scope.partList = null;
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
            $scope.xsmdxx.xsqd, myStoreObj.code.selectType.selectType_0)) {
          listGetStep = "getProList";
          selectSwitch();
        } else {
          // 调用联动清空
          emptySelectSwitch();
        }
        break;
      case "getProList":
        if (myStoreObj.select.setDefaultChoose.getProList($scope.xsmdxx.xsqd,
            $scope.xsmdxx.xsdq, myStoreObj.code.selectType.selectType_0)) {
          listGetStep = "getCityList";
          selectSwitch();
        } else {
          // 调用联动清空
          emptySelectSwitch();
        }
        break;
      case "getCityList":
        if (myStoreObj.select.setDefaultChoose.getCityList($scope.xsmdxx.xsqd,
            $scope.xsmdxx.xsdq, $scope.xsmdxx.sf,
            myStoreObj.code.selectType.selectType_0)) {
          listGetStep = "getPartiList";
          selectSwitch();
        } else {
          // 调用联动清空
          emptySelectSwitch();
        }
        break;
      case "getPartiList":
        if (myStoreObj.select.setDefaultChoose.getPartiList($scope.xsmdxx.xsqd,
            $scope.xsmdxx.cs, myStoreObj.code.selectType.selectType_0)) {
        } else {
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
        // 调用根据标志位清空select方法
        emptySelectSwitch();
        break;
      case "getMajRgnList":
        // 调用置null销售大区下拉列表
        myStoreObj.emptySelect.setMajRgnListEmpty();
        // 将标志位置为省份
        listGetStep = "getProList";
        // 调用根据标志位清空select方法
        emptySelectSwitch();
        break;
      case "getProList":
        // 调用置null省份下拉列表
        myStoreObj.emptySelect.setProListEmpty();
        // 将标志位置为城市
        listGetStep = "getCityList";
        // 调用根据标志位清空select方法
        emptySelectSwitch();
        break;
      case "getCityList":
        // 调用置null城市下拉列表
        myStoreObj.emptySelect.setCityListEmpty();
        // 将标志位置为城市分区
        listGetStep = "getPartiList";
        // 调用根据标志位清空select方法
        emptySelectSwitch();
        break;
      case "getPartiList":
        // 调用置null城市分区下拉列表
        myStoreObj.emptySelect.setPartiListEmpty();
        break;
      }
    }
  }

  // 执行联动select初始化
  selectInit("getChnlList");

  // 店铺类型select初始化
  // $scope.strTypeList = function(){
  // myStoreObj.select.setDefaultChoose.getPartiList(myStoreObj.code.dicCode.strType,
  // myStoreObj.code.selectType.selectType_1);
  // }

  // 联动 onchange 时调用的
  // 销售渠道字段
  $scope.changeChnl = function(xsqd) {
    // 获取销售大区
    selectInit("getMajRgnList");
  };
  // 销售大区字段
  $scope.changeMajRgn = function(xsqd, xsdq) {
    // 获取省份
    selectInit("getProList");
  };
  // 省份字段
  $scope.changePro = function(xsqd, xsdq, sf) {
    // 获取城市
    selectInit("getCityList");
  };
  // 城市字段
  $scope.changeCity = function(xsqd, cs) {
    // 获取城市分区
    selectInit("getPartiList");
  };

  // 提交
  $scope.addBook = function(valid) {
    //提交时进行信息验证
    $scope.isSubmitted = true;
    
    // 判断数据是否全部合法
    if (valid) {
      if($scope.xsmdxx.subPartiNum==null||$scope.xsmdxx.subPartiNum==""){
        comApi.HintMessage(["error","所属城市分区"],"","msg.common.00014",0,"");
        return;
      }
      // 当起始时间和结束时间都被选择的时候，判断是否有起始时间大于结束时间的情况。
      if (($scope.xsmdxx.strStartDt!=""&&$scope.xsmdxx.strStartDt!=null)&& ($scope.xsmdxx.strEndDt!=""&&$scope.xsmdxx.strEndDt!=null)) {
        if ($scope.xsmdxx.strStartDt > $scope.xsmdxx.strEndDt) {
          comApi.HintMessage(["error","店铺"],"","msg.common.00012",0,"");
          return;
        }
      }

      // 一个好用的错误提示信息
      // 右上提示的弹出菜单
      // toaster.pop('error', '错误', "错误测试信息", 0, 'trustedHtml', function() {});

      // 当数据符合要求时向后台提交
      comApi.post("staff/stores/storesInsert", $scope.xsmdxx, function(data) {
        // 提交成功提示信息
        comApi.HintMessage([ "success", "销售门店信息" ], "", "msg.common.00023",
            3000, function() {
            });
        // 提交成功则返回一览画面
        $location.path("/app/staff/storesSelect/0/0/0");
      });
    }
  };

});
