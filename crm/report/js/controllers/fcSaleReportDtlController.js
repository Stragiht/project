/*
 *财务导入销售报表明细頁面的Controller 
 *--王健  2016-4-5 
 *引入的  $scope NgTableParams comApi $timeout $modal $filter
 */
app.controller('fcSaleReportDtlController', function($scope, NgTableParams,
    comApi, $timeout, $modal, $filter) {
  var self = this;
  var keyAll = "0000";
  var all = {
    key : keyAll,
    text : "全部"
  };
  $scope.cond = {};
  $scope.oneAtATime = true;
  $scope.status = {
    open : true
  };
  // 初始化检索结果相关项目
  init();
  // 设定销售渠道的下拉框
  $scope.chnlList = comApi.getChnlList("PGREPW0140001", 2);
  // 设定销售渠道的默认值
  $scope.cond.chnlNum = $scope.chnlList[0].key;
  // 设定销售大区的下拉框
  $scope.majRgnList = [ all ];
  // 设定销售大区的默认值
  $scope.cond.majRgnNum = $scope.majRgnList[0].key;
  // 设定省份的下拉框
  $scope.proList = [ all ];
  // 设定省份的默认值
  $scope.cond.proNum = $scope.proList[0].key;
  // 设定城市的下拉框
  $scope.cityList = [ all ];
  // 设定城市的默认值
  $scope.cond.cityNum = $scope.cityList[0].key;
  // 设定城市分区的下拉框
  $scope.partiList = [ all ];
  // 设定城市分区的默认值
  $scope.cond.partiNum = $scope.partiList[0].key;
  // 设定门店的下拉框
  $scope.strList = [ all ];
  // 设定门店的默认值
  $scope.cond.strNum = $scope.strList[0].key;
  // 非模态弹出【选择商品】画面
  $scope.openSelect = function(size) {
      // 调用【选择商品（单选）】画面
      comApi.openGdsRadioSelect(size, 1, function(selectedItem) {
          // 获取选中的商品
          if (selectedItem && selectedItem.length > 0) {
            $scope.cond.gdsSpecDtlNm = selectedItem[0].gdsSpecDtlNm;
          }
      });
  };

  // 改变销售渠道选中值的方法
  $scope.changeChnl = function(chnlNum) {
    // 销售渠道选择【全部】的时候，清空销售大区的下拉框
    if (chnlNum == keyAll) {
      // 设定销售大区的下拉框
      $scope.majRgnList = [ all ];
    } else {
      // 检索选中销售渠道下的销售大区
      $scope.majRgnList = comApi.getMajRgnList(chnlNum, 2);
    }
    // 设定销售大区的默认值
    $scope.cond.majRgnNum = $scope.majRgnList[0].key;
    // 设定省份的下拉框
    $scope.proList = [ all ];
    // 设定省份的默认值
    $scope.cond.proNum = $scope.proList[0].key;
    // 设定城市的下拉框
    $scope.cityList = [ all ];
    // 设定城市的默认值
    $scope.cond.cityNum = $scope.cityList[0].key;
    // 设定城市分区的下拉框
    $scope.partiList = [ all ];
    // 设定城市分区的默认值
    $scope.cond.partiNum = $scope.partiList[0].key;
    // 设定门店的下拉框
    $scope.strList = [ all ];
    // 设定门店的默认值
    $scope.cond.strNum = $scope.strList[0].key;
  }
  // 改变销售大区选中值的方法
  $scope.changeMajRgn = function(chnlNum, majRgnNum) {
    // 销售大区选择【全部】的时候，清空省份的下拉框
    if (majRgnNum == keyAll) {
      // 设定省份的下拉框
      $scope.proList = [ all ];
    } else {
      // 设定省份的下拉框
      $scope.proList = comApi.getProList(chnlNum, majRgnNum, 2);
    }
    // 设定省份的默认值
    $scope.cond.proNum = $scope.proList[0].key;
    // 设定城市的下拉框
    $scope.cityList = [ all ];
    // 设定城市的默认值
    $scope.cond.cityNum = $scope.cityList[0].key;
    // 设定城市分区的下拉框
    $scope.partiList = [ all ];
    // 设定城市分区的默认值
    $scope.cond.partiNum = $scope.partiList[0].key;
    // 设定门店的下拉框
    $scope.strList = [ all ];
    // 设定门店的默认值
    $scope.cond.strNum = $scope.strList[0].key;
  }
  // 改变省份选中值的方法
  $scope.changePro = function(chnlNum, majRgnNum, proNum) {
    // 省份选择【全部】的时候，清空城市的下拉框
    if (proNum == keyAll) {
      // 设定城市的下拉框
      $scope.cityList = [ all ];
    } else {
      // 设定城市的下拉框
      $scope.cityList = comApi.getCityList(chnlNum, majRgnNum, proNum, 2);
    }
    // 设定城市的默认值
    $scope.cond.cityNum = $scope.cityList[0].key;
    // 设定城市分区的下拉框
    $scope.partiList = [ all ];
    // 设定城市分区的默认值
    $scope.cond.partiNum = $scope.partiList[0].key;
    // 设定门店的下拉框
    $scope.strList = [ all ];
    // 设定门店的默认值
    $scope.cond.strNum = $scope.strList[0].key;
  }
  // 改变城市选中值的方法
  $scope.changeCity = function(chnlNum, cityNum) {
    // 城市选择【全部】的时候，清空城市分区的下拉框
    if (cityNum == keyAll) {
      // 设定城市分区的下拉框
      $scope.partiList = [ all ];
    } else {
      // 设定城市分区的下拉框
      $scope.partiList = comApi.getPartiList(chnlNum, cityNum, 2);
    }
    // 设定城市分区的默认值
    $scope.cond.partiNum = $scope.partiList[0].key;
    // 设定门店的下拉框
    $scope.strList = [ all ];
    // 设定门店的默认值
    $scope.cond.strNum = $scope.strList[0].key;
  }
  // 改变城市分区选中值的方法
  $scope.changeParti = function(partiNum) {
    // 城市分区选择【全部】的时候，清空门店的下拉框
    if (partiNum == keyAll) {
      // 设定门店的下拉框
      $scope.strList = [ all ];
    } else {
      // 设定门店的下拉框
      $scope.strList = comApi.getStoresList(partiNum, 2);
    }
    // 设定门店的默认值
    $scope.cond.strNum = $scope.strList[0].key;
  }
  /* 初始化 列表不显示数据，点击搜索的时候检索数据 */
  // 点击 搜索的方法
  $scope.selectFcSaleReportDtl = function() {
    // 比较销售日期开始和结束的大小关系
    if ($scope.cond.saleStartDate > $scope.cond.saleEndDate) {
      comApi.HintMessage(["error", "销售日期"], "错误", "msg.common.00012", 0, function() {
      });
      return false;
    }
    // 初始化检索结果相关项目
    init();
    // 检索财务导入销售报表
    comApi.post("saleData/selectFcSaleReportDtl", $scope.cond,
        function(data) {
            // 设置检索结果
            setResult(data.avgAmt, data.maxAmt, data.minAmt, data.totalAmt,
                data.fcSaleReportDtlList.length, data.fcSaleReportDtlList);
            if (data.maxCount == data.fcSaleReportDtlList.length) {
                comApi.HintMessage([ "success", data.maxCount ], "", "msg.common.00021", 3000, "");
            }
        });
  }
  // 点击 批量导出的方法
  $scope.exportCsv = function() {
    // 初始化选中OID列表
    $scope.cond.checked = "";
    // angular 循环的方法
    angular.forEach($scope.list, function(item) {
      // 如果数据是选中状态的时候
      if (self.checkboxes.items[item.oId]) {
        if ($scope.cond.checked == "") {
          $scope.cond.checked = item.oId;
        } else {
          $scope.cond.checked = $scope.cond.checked + "," + item.oId;
        }
      }
    });
    // 如果没有选择要导出的数据，提示错误信息，返回。
    if ($scope.cond.checked == "") {
      comApi.HintMessage(["error", "导出"], "错误", "msg.common.00020", 0, function() {
      });
      return false;
    }
    // 取得要导出的数据
    comApi.post("saleData/exportFcSaleReportDtl", $scope.cond,
        function(data) {
          $scope.getArray = data;
          // 设定导出文件名
          $scope.exportFileNm = "财务导入销售报表明细_"
              + $filter("date")(new Date(), 'yyyyMMdd') + ".csv";
          $timeout(function() {
            angular.element(document.querySelector('#export')).triggerHandler(
                'click');
          }, 0);
        });
  }

  // 点击全选 的事件
  $scope.checkAll = function() {
    // angular 循环的方法
    angular.forEach($scope.list, function(item) {
      // oId是
      // $scope.list的一个key值注意這個value值是唯一的
      self.checkboxes.items[item.oId] = self.checkboxes.checked;
    });
  };
  // 單選 的事件
  $scope.checkItem = function() {
    var checked = 0, unchecked = 0, total = $scope.gydst;
    angular.forEach($scope.list, function(item) {
      checked += (self.checkboxes.items[item.oId]) || 0;
      unchecked += (!self.checkboxes.items[item.oId]) || 0;
    });
    if ((unchecked == 0) || (checked == 0)) {
      self.checkboxes.checked = (checked == total);
    }
    angular.element(".select-all").prop("indeterminate",
        (checked != 0 && unchecked != 0));
  };

  // 画面初期状态
  function init() {
    // 初始化ng-table的checkboxes
    self.checkboxes = {
      checked : false,
      items : {}
    };
    // 初始化检索结果项目
    setResult(null, null, null, null, 0, null);
    // 初始化全选checkBox的样式
    angular.element(".select-all").prop("indeterminate", false);
  }

  // 设置画面上的检索结果
  function setResult(avgAmt, maxAmt, minAmt, totalAmt, length, data) {
    // 每日平均
    $scope.avgAmt = avgAmt;
    // 单日最大值
    $scope.maxAmt = maxAmt;
    // 单日最小值
    $scope.minAmt = minAmt;
    // 总金额
    $scope.totalAmt = totalAmt;
    // 数据条数
    $scope.recordCount = length;
    // 綁定變量返回的 map數據的長度
    $scope.gydst = length;
    // 綁定一個數據集方便下面全選的 調用
    $scope.list = data;
    // ng-table的实现绑定
    self.tableParams = new NgTableParams({
      // 显示的第几页
      page : 1,
      // 一页显示多少条
      count : 20
    }, {
      // 把data数据集绑定前台
      dataset : data,
      // 可以点击的显示自己想要一页显示多少条
      counts : [ 20, 50, 100, 200 ]
    });
  }
});