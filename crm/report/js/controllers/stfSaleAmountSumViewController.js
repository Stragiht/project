/*
 *查看人员销售业绩汇总頁面的Controller 
 *--王健  2016-4-8
 *引入的  $scope NgTableParams comApi $filter $sessionStorage $state
 */
app.controller('stfSaleAmountSumViewController', function($scope,
    NgTableParams, comApi, $filter, $sessionStorage, $state) {
  var self = this;
  $scope.cond = {};
  // 所属渠道
  $scope.param = $sessionStorage.PGREPW0120001.saleReportDtl;
  $scope.param.saleDate = $filter("date")($scope.param.saleStartDate,
      'yyyy-MM-dd')
      + " ~ " + $filter("date")($scope.param.saleEndDate, 'yyyy-MM-dd');
  $scope.oneAtATime = true;
  $scope.status = {
    baseInfoOpen : true,
    summaryOpen : true,
    detailOpen : true
  };

  /* 初始化检索销售明细列表的数据 */
  comApi.post("saleData/selectSaleDtl", $scope.param,
      function(data) {
        // 每日平均
        $scope.avgAmt = data.avgAmt;
        // 单日最大值
        $scope.maxAmt = data.maxAmt;
        // 单日最小值
        $scope.minAmt = data.minAmt;
        // 总金额
        $scope.totalAmt = data.totalAmt;
        // 人均单产
        if ($scope.param.stfUnderQty == 0) {
          $scope.personAvgAmt = data.totalAmt;
        } else {
          $scope.personAvgAmt = data.totalAmt / $scope.param.stfUnderQty;
        }
        // 销售明细
        $scope.saleReportDtlList = data.saleReportDtlList;
      });
  // 返回【人员销售业绩汇总】页面
  $scope.back = function() {
    $sessionStorage.PGREPW0120001.returnFlg = "1";
    $state.go("app.report.stfSaleAmountSum");
  };
});