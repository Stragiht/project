/*
 *人员销售业绩汇总頁面的Controller 
 *--王健  2016-4-6 
 *引入的  $scope NgTableParams comApi $timeout $sessionStorage $filter $state
 */
app.controller('stfSaleAmountSumController', function($scope, NgTableParams,
    comApi, $timeout, $sessionStorage, $filter, $state) {
  var self = this;
  $scope.cond = {};
  $scope.oneAtATime = true;
  $scope.status = {
    open : true
  };
  // 初始化检索结果相关项目
  init();
  // 设定职位的下拉框
  $scope.posList = comApi.getSelectBoxJob(0);
  // 设定职位的默认值
  $scope.cond.posNum = $scope.posList[0].key;
  // 如果是从查看画面返回的时候，设定跳转前的检索条件和ng-table参数
  if ($sessionStorage.PGREPW0120001 != undefined) {
    if ($sessionStorage.PGREPW0120001.returnFlg == "1") {
      // 设定跳转前的检索条件
      $scope.cond = JSON.parse($sessionStorage.PGREPW0120001.condBak);
      $scope.cond.saleStartDate = $filter("date")($scope.cond.saleStartDate, 'yyyy-MM-dd');
      $scope.cond.saleEndDate = $filter("date")($scope.cond.saleEndDate, 'yyyy-MM-dd');
      var page = $sessionStorage.PGREPW0120001.page;
      var count = $sessionStorage.PGREPW0120001.count;
      var checkboxesTmp =  $sessionStorage.PGREPW0120001.checkboxes;
      // 检索BA提交销售报表概况
      comApi.post("saleData/selectStfSaleAmountSum", $scope.cond,
          function(data) {
              // 设置检索结果
              setResult($scope.cond.saleStartDate, $scope.cond.saleEndDate,
                  data.stfSaleAmountSum.length, data.stfSaleAmountSum, page, count);
              // angular 循环的方法
              angular.forEach($scope.list, function(item) {
                  // 如果数据是选中状态的时候
                  self.checkboxes.items[item.stfNum] = checkboxesTmp.items[item.stfNum];
              });
              // 设定checkbox的选中状态
              checkItem();
          });
    }
  } else {
    // 初始化保存的检索条件和页面数据
    $sessionStorage.PGREPW0120001 = {};
  }
  $sessionStorage.PGREPW0120001.returnFlg = "0";
  /* 初始化 列表不显示数据，点击搜索的时候检索数据 */
  // 点击 搜索的方法
  $scope.selectBaSaleReportDtl = function() {
    // 比较销售日期开始和结束的大小关系
    if ($scope.cond.saleStartDate > $scope.cond.saleEndDate) {
      comApi.HintMessage(["error", "销售日期"], "错误", "msg.common.00012", 0, function() {
      });
      return false;
    }
    // 初始化检索结果相关项目
    init();

    // 检索BA提交销售报表概况
    comApi.post("saleData/selectStfSaleAmountSum", $scope.cond,
        function(data) {
            // 设置检索结果
            setResult($scope.cond.saleStartDate, $scope.cond.saleEndDate,
                data.stfSaleAmountSum.length, data.stfSaleAmountSum, 1, 20);
            // 保存跳转前本页面的检索条件
            $sessionStorage.PGREPW0120001.condBak =  JSON.stringify($scope.cond);
            if (data.maxCount == data.stfSaleAmountSum.length) {
                comApi.HintMessage([ "success", data.maxCount ], "", "msg.common.00021", 3000, "");
            }
        });
  }
  // 点击 批量导出的方法
  $scope.exportCsv = function() {
    var exportData = [ {
      stfNum : "人员编号",
      stfNm : "姓名",
      posNm : "职位",
      supvrStfNm : "直属主管",
      cityNm : "所在城市",
      saleStartDate : "销售开始时间",
      saleEndDate : "销售结束时间",
      saleAmt : "实际销售额",
      ranking : "排名",
      stfUnderQty : "其下人数",
      avgAmt : "人均单产"
    } ];
    // angular 循环的方法
    angular.forEach($scope.list, function(item) {
      // 如果数据是选中状态的时候
      if (self.checkboxes.items[item.stfNum]) {
        var c = {
            stfNum : item.stfNum,
            stfNm : item.stfNm,
            posNm : $filter("stfBasPosNum")(item.posNum),
            supvrStfNm : item.supvrStfNm,
            cityNm : $filter("stfBasPCV")(item.cityNum),
            saleStartDate : $filter("date")(item.saleStartDate, 'yyyy-MM-dd'),
            saleEndDate : $filter("date")(item.saleEndDate, 'yyyy-MM-dd'),
            saleAmt : item.saleAmt,
            ranking : item.ranking,
            stfUnderQty : item.stfUnderQty,
            avgAmt : item.avgAmt
        };
        // 保存该条数据
        exportData.push(c);
      }
    });
    // 如果没有选择要导出的数据，提示错误信息，返回。
    if (exportData.length == 1) {
      comApi.HintMessage(["error", "导出"], "错误", "msg.common.00020", 0, function() {
      });
      return false;
    }
    // 要导出的数据
    $scope.getArray = exportData;
    // 设定导出文件名
    $scope.exportFileNm = "人员销售业绩汇总_" + $filter("date")(new Date(), 'yyyyMMdd')
        + ".csv";
    $timeout(function() {
      angular.element(document.querySelector('#export'))
          .triggerHandler('click');
    }, 0);
  }
  // 点击 查看的方法
  $scope.view = function(data) {
    // 设定传给查看页面的参数
    $sessionStorage.PGREPW0120001.saleReportDtl = data;
    // 保存跳转前本页面的ng-table参数
    $sessionStorage.PGREPW0120001.page = self.tableParams.page();
    $sessionStorage.PGREPW0120001.count = self.tableParams.count();
    // 保存checkbox的选中状态
    $sessionStorage.PGREPW0120001.checkboxes = self.checkboxes;
    // 跳转到查看页面
    $state.go("app.report.stfSaleAmountSumView");
  }
  // 点击全选 的事件
  $scope.checkAll = function() {
    // angular 循环的方法
    angular.forEach($scope.list, function(item) {
      // stfNum是
      // $scope.list的一个key值注意這個value值是唯一的
      self.checkboxes.items[item.stfNum] = self.checkboxes.checked;
    });
  };
  // 设定checkbox的选中状态
  function checkItem() {
    var checked = 0, unchecked = 0, total = $scope.gydst;
    angular.forEach($scope.list, function(item) {
      checked += (self.checkboxes.items[item.stfNum]) || 0;
      unchecked += (!self.checkboxes.items[item.stfNum]) || 0;
    });
    if ((unchecked == 0) || (checked == 0)) {
      self.checkboxes.checked = (checked == total);
    }
    angular.element(".select-all").prop("indeterminate",
        (checked != 0 && unchecked != 0));
  };
  // 單選 的事件
  $scope.checkItem = function() {
    checkItem();
  }

  // 画面初期状态
  function init() {
    // 初始化选中OID列表
    $scope.stfNums = [];
    // 初始化ng-table的checkboxes
    self.checkboxes = {
      checked : false,
      items : {}
    };
    // 初始化检索结果项目
    setResult("", "", 0, null, 1, 20);
    // 初始化全选checkBox的样式
    angular.element(".select-all").prop("indeterminate", false);
  }

  // 设置画面上的检索结果
  function setResult(startDate, endDate, length, data, page, count) {
    // 销售日期
    if (startDate != "" && endDate != "") {
      $scope.saleDate = $filter("date")(startDate, 'yyyy-MM-dd') + " ~ "
          + $filter("date")(endDate, 'yyyy-MM-dd');
    } else {
      $scope.saleDate = "";
    }
    // 数据条数
    $scope.recordCount = length;
    // 綁定變量返回的 map數據的長度
    $scope.gydst = length;
    // 綁定一個數據集方便下面全選的 調用
    $scope.list = data;
    // ng-table的实现绑定
    self.tableParams = new NgTableParams({
      // 显示的第几页
      page : page,
      // 一页显示多少条
      count : count
    }, {
      // 把data数据集绑定前台
      dataset : data,
      // 可以点击的显示自己想要一页显示多少条
      counts : [ 20, 50, 100, 200 ]
    });
  }
});