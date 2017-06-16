/**
 * Created by 张玉良 on 2016-3-3.
 */
//这里写对应页面要用的js
app.controller('homeController', ['$scope','comApi', function($scope,comApi) {
    $scope.oneAtATime = true;
    $scope.status = {
        openBA : true,
        openFC : true,
        openUD : true
    };

    //获取会员列表信息
    comApi.selectMemGrp();

    // 取得销售渠道
    $scope.chnlList = comApi.getChnlList("PGYSYW0210001", 2);
    // 销售概况初始化
    comApi.get("saleData/selectSaleSummary", function(data) {
        // 设定返回的销售概况
        $scope.data = data;
    });
    // 点击BA提交销售报表概况的Tab的处理
    $scope.baTabClick = function(chnlNum) {
        $scope.selectedChnl = {
            chnlNum : chnlNum
        };
        // 检索BA提交销售报表概况
        comApi.post("saleData/selectSaleSummaryBA",
            $scope.selectedChnl, function(data) {
                // 设定返回的BA提交销售报表概况
                $scope.data.saleSummaryBAVo = data;
            });
    }

    // 点击财务导入销售报表概况的Tab的处理
    $scope.fcTabClick = function(chnlNum) {
        $scope.selectedChnl = {
            chnlNum : chnlNum
        };
        // 检索财务导入销售报表概况
        comApi.post("saleData/selectSaleSummaryFC",
            $scope.selectedChnl, function(data) {
                // 设定返回的财务导入销售报表概况
                $scope.data.saleSummaryFCVo = data;
            });
    };

    comApi.get("HomeController/selectNewMEMBCount",function(data){
       $scope.KENOCOUNT = data.KENOCOUNT;
       $scope.MAXCOUNT = data.MAXCOUNT;
       $scope.QCSCOUNT = data.QCSCOUNT;
       $scope.CSCOUNT = data.CSCOUNT;
    });
}]);