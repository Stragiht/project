
//app.controller('memInfoEditCtrl', ['$scope', 'comApi', '$location','$ionicPopup','$state','$stateParams','$sessionStorage',function ($scope, comApi, $location,$ionicPopup,$state,$stateParams,$sessionStorage) {
app.controller('membInfoUpdateCtrl', function ($scope, comApi, $location, $ionicPopup, $state, $stateParams, $sessionStorage, ionicDatePicker, $filter, $timeout, $window) {

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit("navMenu.type", navMenu);

    //定义单页面显示的标志
    $scope.pageShow = {
        membInfoUpdShow: true,
        chnlShow:false,
        sexShow: false,
        areaShow: false,
        skinTypeShow: false,
        skinStatusShow: false,
        skinCareShow: false,
        skinCareDmndShow: false
    };

    //来源渠道
    $scope.allChannel = comApi.getAllChnList(0);

    //性别
    $scope.sexList = [
        { text: "女", value: "2" },
        { text: "男", value: "1" }
    ];

    ////肌肤类型
    $scope.skinTypes = comApi.getSelectSkin("C025",0);

    //肌肤现状
    $scope.skinProbs = comApi.getSelectSkin("C026",0);

    //护肤品喜好
    $scope.skinDemands  = comApi.getSelectSkin("C027",0);

    //护肤护理需求
    $scope.skinDailyDemands = comApi.getSelectSkin("C028",0);

    $scope.goFrontPageEdit = function() {
        var confirmPopup = $ionicPopup.confirm({
            title : "提示",
            template : "确定要放弃此次编辑？",
            okText : "确定",
            cancelText : "取消"

        });
        /*
         * $state.go("entryApplInfo", {
         entApplNum : $stateParams.entApplNum
         });
         * */
        confirmPopup.then(function(res) {
            if (res) {
                $state.go("membDetailInfo", {
                    membNum : $stateParams.membNum
                });
            }
        });
    };


    //会员的数据编号
    $scope.curMembNum  = $stateParams.membNum;

    //页面数据初始化
    $scope.membInfoUpdInit = function() {

        //根据会员编号查询会员信息
        comApi.get("membBas/selectByMembNum/"+$scope.curMembNum, function(data){
            $scope.memInfo = data;

            comApi.myConsoleLog("===会员信息===", data, "===");

            if (comApi.isNotEmptyObject($scope.memInfo.membSkinCareNeed)){
                if (comApi.isNotNullAndUndefined($scope.memInfo.membSkinCareNeed.C026)){

                    $scope.memInfo.membSkinCareNeed.C026 = $scope.memInfo.membSkinCareNeed.C026.split(",");
                    //选中的状态标志
                    for (var i=0; i<$scope.skinProbs.length; i++) {
                        $scope.skinProbs[i].checked = false;
                        for (var j=0; j<$scope.memInfo.membSkinCareNeed.C026.length; j++) {
                            if ($scope.skinProbs[i].key == $scope.memInfo.membSkinCareNeed.C026[j]) {
                                $scope.skinProbs[i].checked = true;
                                break;
                            }
                        }
                    }
                }

                if (comApi.isNotEmptyObject($scope.memInfo.membSkinCareNeed.C027)) {

                    $scope.memInfo.membSkinCareNeed.C027 = $scope.memInfo.membSkinCareNeed.C027.split(",");

                    //选中的状态标志
                    for (var i=0; i<$scope.skinDemands.length; i++) {
                        $scope.skinDemands[i].checked = false;
                        for (var j=0; j<$scope.memInfo.membSkinCareNeed.C027.length; j++) {
                            if ($scope.skinDemands[i].key == $scope.memInfo.membSkinCareNeed.C027[j]) {
                                $scope.skinDemands[i].checked = true;
                                break;
                            }
                        }
                    }
                }

                if (comApi.isNotEmptyObject($scope.memInfo.membSkinCareNeed.C028)) {

                    $scope.memInfo.membSkinCareNeed.C028 = $scope.memInfo.membSkinCareNeed.C028.split(",");

                    //选中的状态标志
                    for (var i=0; i<$scope.skinDailyDemands.length; i++) {
                        $scope.skinDailyDemands[i].checked = false;
                        for (var j=0; j<$scope.memInfo.membSkinCareNeed.C028.length; j++) {
                            if ($scope.skinDailyDemands[i].key == $scope.memInfo.membSkinCareNeed.C028[j]) {
                                $scope.skinDailyDemands[i].checked = true;
                                break;
                            }
                        }
                    }
                }
            }

            //所在地区
            if (comApi.isNotNullAndUndefined($scope.memInfo.locPref)) {
                if ($scope.memInfo.locProvNm == $scope.memInfo.locCityNm) {
                    $scope.localArea = $scope.memInfo.locCityNm + $scope.memInfo.locPrefNm;
                } else {
                    $scope.localArea = $scope.memInfo.locProvNm + $scope.memInfo.locCityNm + $scope.memInfo.locPrefNm;
                }
            } else  {
                if ($scope.memInfo.locProvNm == $scope.memInfo.locCityNm) {
                    $scope.localArea = $scope.memInfo.locCityNm;
                } else {
                    $scope.localArea = $scope.memInfo.locProvNm + $scope.memInfo.locCityNm;
                }
            }

        });
    };
    $scope.membInfoUpdInit();

    //获取省份城市编号
    $scope.getCityCode = function(prov,city, pref) {
        comApi.post("commonDataController/selectLocationInfo", {
            proRgnNm : prov,
            cityRgnNm : city,
            prefRgnNm : pref
        }, function(data) {
            comApi.myConsoleLog("===", data, "===");
            comApi.consoleLog(prov+"==11="+city+"==="+pref);
            $scope.curProv = data.proRgnNum;
            $scope.curCity = data.cityRgnNum;
            $scope.memInfo.locProv = angular.copy($scope.curProv);
            $scope.memInfo.locCity = angular.copy($scope.curCity);
            $scope.memInfo.locProvNm = data.proRgnNm;
            $scope.memInfo.locCityNm = data.cityRgnNm;
            if (comApi.isNotNullAndUndefined(data.prefRgnNum)) {
                $scope.curPref = data.prefRgnNum;
                $scope.memInfo.locPrefNm = data.prefRgnNm;
                $scope.memInfo.locPref = angular.copy($scope.curPref);
            } else {
                $scope.curPref = "";
                $scope.memInfo.locPrefNm = "";
                $scope.memInfo.locPref = "";
            }

        });
    };


    //电话号码，手机号码验证的正则表达式
    var phoneCheck = /^0\d{2,3}-?\d{7,8}$|^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;

    //邮箱验证
    var emailCheck = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;


    //保存编辑后的数据
    $scope.saveMembInfoUpdate = function() {

        //提交数据的备份，防止更改数据
        $scope.memInfoCopy = angular.copy($scope.memInfo);

        //前端校验后再提交
        if (!comApi.isNotNullAndUndefined($scope.memInfoCopy.membNm)) {
            comApi.showErrorMessage("msg.member.10006");
            return;
        } else if (!comApi.isNotNullAndUndefined($scope.memInfoCopy.phone)) {
            comApi.showErrorMessage("msg.member.10007");
            return;
        } else if (!phoneCheck.test($scope.memInfoCopy.phone)) {
            comApi.showErrorMessage("msg.member.10008");
            return;
        } else if(!comApi.isNotNullAndUndefined($scope.memInfoCopy.provChnl)){
            comApi.showErrorMessage("msg.member.10009");
            return;
        } else if(!comApi.isNotNullAndUndefined($scope.memInfoCopy.registTm)){
            comApi.showErrorMessage("msg.member.10010");
            return;
        } else if(comApi.isNotNullAndUndefined($scope.memInfoCopy.email) && !emailCheck.test($scope.memInfoCopy.email)){ //
            comApi.showErrorMessage("msg.member.10011");
            return;
        } else if(!comApi.isNotNullAndUndefined($scope.memInfoCopy.locProv)) {
            comApi.showErrorMessage("msg.member.10021");
            return;
        } else if(!comApi.isNotNullAndUndefined($scope.memInfoCopy.locCity)) {
            comApi.showErrorMessage("msg.member.10022");
            return;
        } else if ($scope.memInfoCopy.registTm > new Date().getTime()) {
            comApi.showErrorMessage("msg.member.10024");
            return;
        } else {

            //删除多余的数据
            //delete $scope.memInfoCopy["updtTm"];
            delete $scope.memInfoCopy["crtdStfNm"];
            delete $scope.memInfoCopy["crtdStfNum"];

            if (comApi.isNotNullAndUndefined($scope.memInfo.membSkinCareNeed.C026)) {

                $scope.memInfoCopy.membSkinCareNeed.C026 = angular.copy($scope.memInfo.membSkinCareNeed.C026.join(","));
            } else {
                $scope.memInfoCopy.membSkinCareNeed.C026 = "";
            }
            if (comApi.isNotNullAndUndefined($scope.memInfo.membSkinCareNeed.C027)) {

                $scope.memInfoCopy.membSkinCareNeed.C027 = angular.copy($scope.memInfo.membSkinCareNeed.C027.join(","));
            } else {
                $scope.memInfoCopy.membSkinCareNeed.C027 = "";
            }
            if (comApi.isNotNullAndUndefined($scope.memInfo.membSkinCareNeed.C028)) {

                $scope.memInfoCopy.membSkinCareNeed.C028 = angular.copy($scope.memInfo.membSkinCareNeed.C028.join(","));
            } else {
                $scope.memInfoCopy.membSkinCareNeed.C028 = "";
            }

            comApi.myConsoleLog("编辑会员提交的数据===",$scope.memInfoCopy, "===");
            comApi.post('membBas/updateMembBas4App', $scope.memInfoCopy, function(data){

                comApi.showSuccessMessage("msg.member.10002");

                $timeout(function() {
                    $state.go("membDetailInfo", {
                        membNum : $stateParams.membNum  //memInfo({memIndex:curMemIndex})
                    });
                },3000);

            }, true);

        }

    };

    $scope.curDate = new Date();

    //日期控件
    $scope.openDatePicker = function(flg, $event) {
        ionicDatePicker.openDatePicker({
            //val为一个时间戳
            callback : function(val) {
                $scope.curDate = new Date(val);
                if (flg == 1) {
                    $scope.memInfo.registTm = val;
                } else if(flg == 2) {
                    $scope.memInfo.birtyday = val;
                }
                $event.stopPropagation();
                comApi.myConsoleLog("==设施编辑的数据===", $scope.memInfo, "====");
            },
            inputDate:$scope.curDate
        });
    };


    //单页面显示
    $scope.singlePageShow = function(membInfoUpdShow, chnlShow, sexShow, areaShow, skinTypeShow, skinStatusShow, skinCareShow, skinCareDmndShow) {

        $scope.pageShow = {
            membInfoUpdShow: membInfoUpdShow,
            chnlShow: chnlShow,
            sexShow: sexShow,
            areaShow: areaShow,
            skinTypeShow: skinTypeShow,
            skinStatusShow: skinStatusShow,
            skinCareShow: skinCareShow,
            skinCareDmndShow: skinCareDmndShow
        };
    };

    //来源渠道
    $scope.chnlSelect = function(chnkKey) {
        $scope.memInfo.provChnl = chnkKey;
        $scope.singlePageShow(true, false, false, false, false, false, false, false);
    };

    //性别
    $scope.sexSelect = function(sexValue) {
        $scope.memInfo.sex = sexValue;
        $scope.singlePageShow(true, false, false, false, false, false, false, false);
    };

    //肌肤类型
    $scope.skinTypeSelect = function(skinTypeKey) {
        $scope.memInfo.membSkinCareNeed.C025 = skinTypeKey;
        $scope.singlePageShow(true, false, false, false, false, false, false, false);
    };

    //进入肌肤现状单页面
    $scope.skinStatusSingle = function() {

        $scope.skinStausInfoShow = true;

        $timeout(function() {
            $scope.skinStausInfoShow = false;
        }, 3000);

        $scope.singlePageShow(false, false, false, false, false, true, false, false);
    };

    //肌肤现状
    $scope.skinStatusSelect = function() {
        $scope.memInfo.membSkinCareNeed.C026 = comApi.arrToStr($scope.skinProbs, 2);
        $scope.singlePageShow(true, false, false, false, false, false, false, false);
    };

    //进入护肤品喜好单页面
    $scope.skinCareSingle = function() {

        $scope.skinCareInfoShow = true;

        $timeout(function() {
            $scope.skinCareInfoShow = false;
        }, 3000);

        $scope.singlePageShow(false, false, false, false, false, false, true, false);
    };

    //护肤品喜好
    $scope.skinCareSelect = function() {
        $scope.memInfo.membSkinCareNeed.C027 = comApi.arrToStr($scope.skinDemands, 2);
        $scope.singlePageShow(true, false, false, false, false, false, false, false);
    };

    //进入肌肤护理需求单页面
    $scope.skinCareDmndSingle = function() {

        $scope.skinCareDmndInfoShow = true;

        $timeout(function() {
            $scope.skinCareDmndInfoShow = false;
        }, 3000);

        $scope.singlePageShow(false, false, false, false, false, false, false, true);
    };

    //肌肤护理需求
    $scope.skinCareDmndSelect = function() {
        $scope.memInfo.membSkinCareNeed.C028 = comApi.arrToStr($scope.skinDailyDemands, 2);
        $scope.singlePageShow(true, false, false, false, false, false, false, false);
    };


    //==============================所在地区==================================

    $scope.proCityPreShow = {
        "localAreaShow": true,
        "provShow": false,
        "cityShow": false,
        "prefShow": false
    };

    //进入所在地区单页面skinCareDmndSingle
    $scope.areaSingle = function() {

        $scope.singlePageShow(false, false, false, true, false, false, false, false);

        window.bdk.getCurrentCity();

        $scope.provSortList = [];

        //选择的省、市、区
        $scope.selectPrevCityPref = {
            prev: "",
            city: "",
            pref: ""
        };

        //查询省份
        $scope.findPrev = [];
        //查询的城市
        $scope.findCity = [];
        //查询的区
        $scope.findPref = [];

        if (!comApi.isNotNullAndUndefined($scope.selectPrev)) {
            $scope.selectPrev = "";
            $scope.selectCtiy = "";
            $scope.selectPref = "";
        }

        //地址
        if (!comApi.isNotNullAndUndefined($scope.curAddress)) {
            $scope.curAddress = "";
        }

        //初始化地址
        $scope.locationAddr = "定位中...";

        var prov = $scope.memInfo.locProvNm;
        var city = $scope.memInfo.locCityNm;
        var pref = $scope.memInfo.locPrefNm;

        $scope.selectPrev = prov;
        $scope.selectCtiy = city;

        //当没有区的时候
        if (comApi.isNotNullAndUndefined(pref)) {
            $scope.selectPref = pref;

            $scope.curAddress = prov + city + pref;
        } else {
            $scope.selectPref = "";

            $scope.curAddress = prov + city;
        }

    };

    //省市区选择切换
    $scope.changeAreaShow = function(pageShow) {
        $scope.proCityPreShow = {
            localAreaShow: false,
            provShow: false,
            cityShow: false,
            prefShow: false
        };
        $scope.proCityPreShow[pageShow] = true;
    };

    var prvs = [];

    //查询省份
    $scope.searchPrev = function(pageShow) {

        //根据区号查询下级市、区
        comApi.get("commonDataController/selectAddressBySuperRgnNum/" + "1", function(data) {
            comApi.myConsoleLog("===",data, "===")
            //定义一个临时变量，字母
            var tempLetter = "";
            //var j = 0;
            for (var i=0; i<data.length; i++) {

                if (tempLetter != data[i].rgnNmPinyinFirstChar) {

                    tempLetter = data[i].rgnNmPinyinFirstChar;

                    prvs.push({
                        "rgnNmPinyinFirstChar" : tempLetter,
                        "rgnNum" : "999999",
                        "rgnNm" : tempLetter,
                        "superRgnNum":"00000000000000000"
                    });
                }
                prvs.push(data[i]);
            }
            $scope.findPrev = angular.copy(prvs);
            $scope.changeAreaShow(pageShow);

        });

    };


    //根据省份查询城市
    $scope.searchCity = function(pageShow, provNn, provNum) {
        $scope.selectPrevCityPref.prev = provNn;

        //清空上一次的记录
        $scope.findCity = [];

        //根据区号查询下级市、区
        comApi.get("commonDataController/selectAddressBySuperRgnNum/" + provNum, function(data) {
            $scope.findCity = angular.copy(data);
            comApi.myConsoleLog("==", data, "==");
            $scope.changeAreaShow(pageShow);
        });

    };

    //根据城市编码查询下面的区
    $scope.searchPref = function(pageShow, cityfNn, cityNum) {

        $scope.selectPrevCityPref.city = cityfNn;

        //清空上一次的记录
        $scope.findPref = [];

        //根据区号查询下级市、区
        comApi.get("commonDataController/selectAddressBySuperRgnNum/" + cityNum, function(data) {

            if (comApi.isNotEmptyObject(data)){
                $scope.findPref = angular.copy(data);
                $scope.changeAreaShow(pageShow);
            } else {
                $scope.curAddress = $scope.selectPrevCityPref.prev + $scope.selectPrevCityPref.city;

                $scope.selectPrev = angular.copy($scope.selectPrevCityPref.prev);
                $scope.selectCtiy = angular.copy($scope.selectPrevCityPref.city);
                $scope.selectPref = "";

                $scope.changeAreaShow("localAreaShow");

            }
        });

    };

    //选择区
    $scope.selectPrefFun = function(pageShow, prefNn, prefNum) {

        $scope.changeAreaShow(pageShow);
        $scope.selectPrevCityPref.pref = prefNn;

        $scope.curAddress = $scope.selectPrevCityPref.prev + $scope.selectPrevCityPref.city + $scope.selectPrevCityPref.pref;

        $scope.selectPrev = angular.copy($scope.selectPrevCityPref.prev);
        $scope.selectCtiy = angular.copy($scope.selectPrevCityPref.city);
        $scope.selectPref = angular.copy($scope.selectPrevCityPref.pref);

    };

    $scope.locationBegin = function() {
        // 调用原生定位 TODO
        window.bdk.getCurrentCity();
    };


    // 定位完成(因为原生定位是异步的，所以这个方法是提供给原生计算完以后回调的方法)
    $window.locationComplete = function(data){

        var addressJson =  JSON.parse(data);
        if (addressJson.success) {
            $scope.locationAddr = addressJson.result.province + " " + addressJson.result.city + " " + addressJson.result.district;

            // $scope.curAddrFormat = $filter('provCityFormat')(addressJson.result.province) + " "+$filter('provCityFormat')(addressJson.result.city)+ " "+addressJson.result.district;
        } else {
            $scope.locationAddr = "定位失败";
        }
        $scope.$apply();
    };

    $scope.addAddress = function() {

        if ($scope.locationAddr != "定位失败" && comApi.isNotNullAndUndefined($scope.locationAddr)) {

            if (comApi.isNotNullAndUndefined($scope.locationAddr.split(" ")[0])) {
                $scope.selectPrev = $scope.locationAddr.split(" ")[0];
            }

            if (comApi.isNotNullAndUndefined($scope.locationAddr.split(" ")[1])) {
                $scope.selectCtiy = $scope.locationAddr.split(" ")[1];
            }

            if (comApi.isNotNullAndUndefined($scope.locationAddr.split(" ")[2])) {
                $scope.selectPref = $scope.locationAddr.split(" ")[2];
            }

            $scope.curAddress = angular.copy($scope.selectPrev + $scope.selectCtiy + $scope.selectPref);

        }
    };

    $scope.goFrontPage = function() {


        if (comApi.isNotNullAndUndefined($scope.selectPrev)) {

            $scope.localArea = $scope.selectPrev + $scope.selectCtiy + $scope.selectPref;

            $scope.getCityCode($scope.selectPrev, $scope.selectCtiy, $scope.selectPref);

        }

        $scope.singlePageShow(true, false, false, false, false, false, false, false);
    };

});