app.controller('urbanDistrictInformationSelectController', ['toaster', 'comApi', '$scope', 'NgTableParams', '$stateParams', '$state', '$sessionStorage', function (toaster, comApi, $scope, NgTableParams, $stateParams, $state, $sessionStorage) {

    $scope.status = {open: true};

    var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];
    var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);
    $scope.gydst = 0;

    //定义搜索城市分区的参数
    $scope.urbanDistrict =
    {
        "pageNum": 1,
        "pageSize": "",
        "params": {
            "subChnl": "",
            "majRgnNum": "",
            "rgnNum": "",
            "city": "",
            "partiNum": "",
            "partiNm": ""
        }
    };

//当前页数(初始为第一页)
    var pageIndex = $stateParams.pageIndex;
    if (pageIndex == null || pageIndex == "" || pageIndex == undefined) {
        pageIndex = 1;
    }
//当前页数据条数（当当前页数据条数为1时，做删除操作后更新数据前pageIndex需减1）
    var count = $stateParams.count;
//当城市分区信息在最后一页并且该页数据条数为1时，pageIndex需减1
    if (count == 1) {
        pageIndex = pageIndex - 1;
    }
//每页显示数据条数
    var pageCount = $stateParams.pageCount;
    if (pageCount == null || pageCount == "" || pageCount == undefined) {
        pageCount = 20;//每页显示数据条数，可修改
    }

    $scope.ChnlInfoList = comApi.getChnlList("PGSTFW0240002", 2);
    $scope.urbanDistrict.params.subChnl = $scope.ChnlInfoList[0].key;

    $scope.MajRegInfoList = comApi.getMajRgnList($scope.urbanDistrict.params.subChnl, 2);
    $scope.urbanDistrict.params.majRgnNum = $scope.MajRegInfoList[0].key;

    $scope.proVinceInfoList = comApi.getProList($scope.urbanDistrict.params.subChnl, $scope.urbanDistrict.params.majRgnNum, 2);
    $scope.urbanDistrict.params.rgnNum = $scope.proVinceInfoList[0].key;

    $scope.cityInfoList = comApi.getCityList($scope.urbanDistrict.params.subChnl, $scope.urbanDistrict.params.majRgnNum, $scope.urbanDistrict.params.rgnNum, 2);
    $scope.urbanDistrict.params.city = $scope.cityInfoList[0].key;


    // 联动大区/*lg*/
    $scope.changeMajRegInfo = function (subChnl) {

        // 加载大区信息
        $scope.MajRegInfoList = comApi.getMajRgnList(subChnl, 2);
        $scope.urbanDistrict.params.majRgnNum = $scope.MajRegInfoList[0].key;
        $scope.changeproVinceInfo(subChnl, $scope.urbanDistrict.params.majRgnNum);
    };

    // 联动省份
    $scope.changeproVinceInfo = function (subChnl, majRgnNum) {
        $scope.proVinceInfoList = comApi.getProList(subChnl, majRgnNum, 2);
        $scope.urbanDistrict.params.rgnNum = $scope.proVinceInfoList[0].key;
        $scope.changecityInfo(subChnl, majRgnNum, $scope.urbanDistrict.params.rgnNum);

    };

    // 联动城市
    $scope.changecityInfo = function (subChnl, majRgnNum, proRgnNum) {

        // 给城市下拉框赋值
        $scope.cityInfoList = comApi.getCityList(subChnl, majRgnNum, proRgnNum, 2);
        $scope.urbanDistrict.params.city = $scope.cityInfoList[0].key;
    };

//加载列表信息
   /* selectList(pageIndex, pageCount);
    function selectList(page, counts) {
        comApi.get('UrbanDistrictInformation/selectAll', function (data) {
            $scope.tableParams = new NgTableParams({
                page: page, // show first page
                count: counts // count per page
            }, {
                dataset: data,
                counts: [20, 50, 100, 200],
                getData: function ($defer, params) {
                    $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    //当前所在页
                    pageIndex = params.page();
                    //每页显示条数
                    pageCount = params.count();
                    //当前页数据条数
                    count = data.slice((params.page() - 1) * params.count(), params.page() * params.count()).length;
                }
            });
            if (data == null) {
                $scope.gydst = 0;
            } else {
                $scope.gydst = data.length;
            }
        });
    }*/

    //搜索城市分区 /*lg*/
    $scope.searchUrbanDistrict = function(){
        /*comApi.post('UrbanDistrictInformation/search', $scope.urbanDistrict, function (data) {
            $scope.urbanDistrictList = data.data;
            $scope.gydst = data.data.length;
            $scope.tableParams = getTableParams(pageNum, pageSize, data.data, counts);
        });
*/
        pageSize = $sessionStorage.urbanDistrictPageSizeCopy > 0 ? angular.copy($sessionStorage.urbanDistrictPageSizeCopy) : pageSize;
        if(isBack == true){
            $scope.urbanDistrictList= angular.copy($sessionStorage.urbanDistrict);
            $scope.gydst = angular.copy($sessionStorage.urbanDistrictDataLengthCopy);

            if (comApi.isNotEmptyObject($sessionStorage.urbanDistrict)) {
                $scope.urbanDistrict = angular.copy($sessionStorage.urbanDistrictDataCopy);
                $scope.MajRegInfoList = comApi.getMajRgnList($scope.urbanDistrict.params.subChnl, 2);
                $scope.proVinceInfoList = comApi.getProList($scope.urbanDistrict.params.subChnl, $scope.urbanDistrict.params.majRgnNum, 2);
                $scope.cityInfoList = comApi.getCityList($scope.urbanDistrict.params.subChnl, $scope.urbanDistrict.params.majRgnNum, $scope.urbanDistrict.params.rgnNum, 2);
            }
            pageNum = $sessionStorage.urbanDistrictPageNumCopy > 0 ? angular.copy($sessionStorage.urbanDistrictPageNumCopy) : pageNum;
            $scope.tableParams = getTableParams(pageNum, pageSize, $scope.urbanDistrictList, counts);
            isBack = false;
        }else {
            pageNum = 1;
            comApi.post('UrbanDistrictInformation/search', $scope.urbanDistrict, function (data) {
                $scope.urbanDistrictList = data.data;
                $scope.gydst = data.data.length;
                $scope.tableParams = getTableParams(pageNum, pageSize, data.data, counts);
                $sessionStorage.urbanDistrictDataLengthCopy = angular.copy($scope.gydst);
                $sessionStorage.urbanDistrict = angular.copy($scope.urbanDistrictList);
                $sessionStorage.urbanDistrictDataCopy = angular.copy($scope.urbanDistrict);
            });
        }
    };

    function getTableParams(pageNum, pageSize, data, counts){
        var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
           /* pageNum = pageIndex;
            pageSize = pageCount;*/

            pageNum = pageIndex;
            pageSize = pageCount;
            $sessionStorage.urbanDistrictPageNumCopy = angular.copy(pageIndex);
            $sessionStorage.urbanDistrictPageSizeCopy = angular.copy(pageCount);
        });
        var tableParams = new NgTableParams(arr[0], arr[1]);
        return tableParams;
    }

    if(isBack == true){
        var url = window.location.href;
        url = url.indexOf("?") == -1 ? url : url.substring(0, url.indexOf('?'));
        window.history.pushState({}, "", url);
        $scope.searchUrbanDistrict();
    }

    $scope.ll = function () {
        comApi.post('staff/stores/ search', $scope.ol, function () {
            //{"pageNum":1,"pageSize":10,"params":{"subChnl":"渠道编号","majRgnNum":"大区编号","province":"省编号","city":"市编号","partiNum":"城市分区编号"}}
        })
    };


    //ui-serf方式:"app.staff.urbandistrictinformationUpdate({pageIndex:1,partiNum:csinfo.partiNum})"
    //$location.path("/app/staff/urbandistrictinformationSelect/3");
    //更新操作
    $scope.update = function (partiNum) {
        $state.go("app.staff.urbandistrictinformationUpdate", {
            pageIndex: pageIndex,
            count: count,
            pageCount: pageCount,
            partiNum: partiNum
        });
    };
    //删除城市分区信息
    $scope.del = function (partiNum) {
       	$scope.rccFlag = 1; //放入回收站标识
        comApi.openDelWindow(function () {
            comApi.post("UrbanDistrictInformation/delete", {partiNum: partiNum}, function (data) {
                comApi.successMessage("msg.staff.10003");
                $scope.searchUrbanDistrict();
                /*if (data == 1) {
                    //重新加载session
                    //1.城市分区信息
                    comApi.selectUrbDistricALL();
                    //删除前最后一页数据为1条时，删除后跳到前一页
                    if (count == 1) {
                        pageIndex = pageIndex - 1;
                    }
                    selectList(pageIndex, pageCount);
                }*/
            });
        }, $scope.rccFlag)
    }

}]);