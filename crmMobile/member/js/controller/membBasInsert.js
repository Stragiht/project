
//app.controller('membBasInsertCtrl', ['$scope', 'comApi', '$location','$ionicPopup','$state','$stateParams','$sessionStorage', '$rootScope', function ($scope, comApi, $location, $ionicPopup, $state, $stateParams, $sessionStorage, $rootScope) {
app.controller("membBasInsertCtrl", function ($scope, comApi, $ionicPopup, $state, $stateParams, $sessionStorage, $rootScope, ionicDatePicker, $filter, $timeout, $window) {

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit("navMenu.type", navMenu);

    $scope.pageShow = {
        membBasShow: true,
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

    //选中的状态标志
    for (var i=0; i<$scope.skinProbs.length; i++) {
        $scope.skinProbs[i].checked = false;
    }


    //护肤品喜好
    $scope.skinDemands  = comApi.getSelectSkin("C027",0);
    //选中的状态标志
    for (var i=0; i<$scope.skinDemands.length; i++) {
        $scope.skinDemands[i].checked = false;
    }

    //护肤护理需求
    $scope.skinDailyDemands = comApi.getSelectSkin("C028",0);
    //选中的状态标志
    for (var i=0; i<$scope.skinDailyDemands.length; i++) {
        $scope.skinDailyDemands[i].checked = false;
    }

    //是否放弃本次操作
    $scope.goFrontPageExit = function() {
        var confirmPopup = $ionicPopup.confirm({
            title : "提示",
            template : "确定要放弃此次操作？",
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
                if ($rootScope.ADDMEMB_FLG) {
                    $state.go("home", {
                    });
                } else {
                    $state.go("membOperateMenu", {
                    });
                }

            }
        });
    };

    //定义新增会员的参数
    $scope.insertMemBas  = {
        "addrDtl": "",
        "bindWctAcct": "",
        "birtyday": '',
        "email": "",
        "grpId": "",
        "locCity": "",
        "locPref": "",
        "locProv": "",
        "membNm": "",
        "membSkinCareNeed": {
            "C025": "",
            "C026": "",
            "C027": "",
            "C028": ""
        },
        "phone": "",
        "provChnl": "",
        "registTm": '',
        "remark": "",
        "sex": "2"
    };

    //获取省份城市编号
    $scope.getCityCode = function(prov,city, pref) {
        comApi.post("commonDataController/selectLocationInfo", {
            proRgnNm : prov,
            cityRgnNm : city,
            prefRgnNm : pref
        }, function(data) {
            comApi.myConsoleLog("获取省份城市编号===", data, "===");
            comApi.consoleLog(prov+"==="+city+"==="+pref);
            $scope.curProv = data.proRgnNum;
            $scope.curCity = data.cityRgnNum;
            $scope.insertMemBas.locProv = angular.copy($scope.curProv);
            $scope.insertMemBas.locCity = angular.copy($scope.curCity);
            $scope.insertMemBas.locProvNm = data.proRgnNm;
            $scope.insertMemBas.locCityNm = data.cityRgnNm;
            if (comApi.isNotNullAndUndefined(data.prefRgnNum)) {
                $scope.curPref = data.prefRgnNum;
                $scope.insertMemBas.locPrefNm = data.prefRgnNm;
                $scope.insertMemBas.locPref = angular.copy($scope.curPref);
            } else {
                $scope.curPref = "";
                $scope.insertMemBas.locPrefNm = "";
                $scope.insertMemBas.locPref = "";
            }
        });
    };

    //电话号码，手机号码验证的正则表达式
    //var phoneCheck = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var phoneCheck = /^0\d{2,3}-?\d{7,8}$|^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;

    //邮箱验证
    var emailCheck = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    //保存编辑后的数据
    $scope.saveMembInfoInsert = function() {

        //前端校验后再提交
        if (!comApi.isNotNullAndUndefined($scope.insertMemBas.membNm)) {
            comApi.showErrorMessage("msg.member.10006");
            return;
        } else if (!comApi.isNotNullAndUndefined($scope.insertMemBas.phone)) {
            comApi.showErrorMessage("msg.member.10007");
            return;
        } else if (!phoneCheck.test($scope.insertMemBas.phone)) {
            comApi.showErrorMessage("msg.member.10008");
            return;
        } else if(!comApi.isNotNullAndUndefined($scope.insertMemBas.provChnl)){
            comApi.showErrorMessage("msg.member.10009");
            return;
        } else if(!comApi.isNotNullAndUndefined($scope.insertMemBas.registTm)){
            comApi.showErrorMessage("msg.member.10010");
            return;
        } else if(comApi.isNotNullAndUndefined($scope.insertMemBas.email) && !emailCheck.test($scope.insertMemBas.email)){ //
            comApi.showErrorMessage("msg.member.10011");
            return;
        } else if(!comApi.isNotNullAndUndefined($scope.insertMemBas.locProv)) {
            comApi.showErrorMessage("msg.member.10021");
            return;
        } else if(!comApi.isNotNullAndUndefined($scope.insertMemBas.locCity)) {
            comApi.showErrorMessage("msg.member.10022");
            return;
        } else if ($scope.insertMemBas.registTm > new Date().getTime()) {
            comApi.showErrorMessage("msg.member.10024");
            return;
        } else {
            //提交数据的备份，防止更改数据
            $scope.insertMemBasCopy = angular.copy($scope.insertMemBas);

            if (comApi.isNotNullAndUndefined($scope.insertMemBas.membSkinCareNeed.C026)) {

                $scope.insertMemBasCopy.membSkinCareNeed.C026 = angular.copy($scope.insertMemBas.membSkinCareNeed.C026.join(","));
            } else {
                $scope.insertMemBasCopy.membSkinCareNeed.C026 = "";
            }
            if (comApi.isNotNullAndUndefined($scope.insertMemBas.membSkinCareNeed.C027)) {

                $scope.insertMemBasCopy.membSkinCareNeed.C027 = angular.copy($scope.insertMemBas.membSkinCareNeed.C027.join(","));
            } else {
                $scope.insertMemBasCopy.membSkinCareNeed.C027 = "";
            }
            if (comApi.isNotNullAndUndefined($scope.insertMemBas.membSkinCareNeed.C028)) {

                $scope.insertMemBasCopy.membSkinCareNeed.C028 = angular.copy($scope.insertMemBas.membSkinCareNeed.C028.join(","));
            } else {
                $scope.insertMemBasCopy.membSkinCareNeed.C028 = "";
            }

            //时间转换
            $scope.insertMemBasCopy.registTm = comApi.dateTimeTotamp($scope.insertMemBasCopy.registTm);
            $scope.insertMemBasCopy.birtyday = comApi.dateTimeTotamp($scope.insertMemBasCopy.birtyday);

            //提交的数据
            // $scope.insertMemBasCopy = angular.copy($scope.insertMemBas);
            comApi.post('membBas/insertMembBas4App', $scope.insertMemBasCopy, function(data){
                //comApi.myConsoleLog('编辑会员信息的数据===', $sessionStorage.memInfoDetailEdit, "===");

                comApi.showSuccessMessage("msg.member.10001");

                $timeout(function() {
                    if ($rootScope.ADDMEMB_FLG) {
                        $state.go("home");
                    } else {
                        $state.go("membOperateMenu");
                    }
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
                    $scope.insertMemBas.registTm = val;
                } else if(flg == 2) {
                    $scope.insertMemBas.birtyday = val;
                }
                $event.stopPropagation();
                comApi.myConsoleLog("==设施编辑的数据===", $scope.insertMemBas, "====");
            },
            inputDate:$scope.curDate
        });
    };

    //单页面显示
    $scope.singlePageShow = function(membBasShow, chnlShow, sexShow, areaShow, skinTypeShow, skinStatusShow, skinCareShow, skinCareDmndShow) {

        $scope.pageShow = {
            membBasShow: membBasShow,
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
        $scope.insertMemBas.provChnl = chnkKey;
        $scope.singlePageShow(true, false, false, false, false, false, false, false);
    };

    //性别
    $scope.sexSelect = function(sexValue) {
        $scope.insertMemBas.sex = sexValue;
        $scope.singlePageShow(true, false, false, false, false, false, false, false);
    };

    //肌肤类型
    $scope.skinTypeSelect = function(skinTypeKey) {
        $scope.insertMemBas.membSkinCareNeed.C025 = skinTypeKey;
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
        $scope.insertMemBas.membSkinCareNeed.C026 = comApi.arrToStr($scope.skinProbs, 2);
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
        $scope.insertMemBas.membSkinCareNeed.C027 = comApi.arrToStr($scope.skinDemands, 2);
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
        $scope.insertMemBas.membSkinCareNeed.C028 = comApi.arrToStr($scope.skinDailyDemands, 2);
        $scope.singlePageShow(true, false, false, false, false, false, false, false);
    };



    //控制所在地区=======================================

    $scope.proCityPreShow = {
        "localAreaShow": true,
        "provShow": false,
        "cityShow": false,
        "prefShow": false
    };


    //进入所在地区单页面skinCareDmndSingle
    $scope.areaSingle = function() {

        $scope.singlePageShow(false, false, false, true, false, false, false, false);

        //开始定位
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

        /*$scope.localInfo = {
            detailAddr: ''
        };*/

        //初始化地址
        $scope.locationAddr = "定位中...";
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
            comApi.myConsoleLog("选择区域====", data, "====");

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


    // 定位完成(因为原生定位是异步的，所以这个方法是提供给原生计算完以后回调的方法)
    $window.locationComplete = function(data){
        var addressJson =  JSON.parse(data);
        if (addressJson.success) {
            $scope.locationAddr = addressJson.result.province + " " + addressJson.result.city + " " + addressJson.result.district;

            // $scope.curAddrFormat = $filter('provCityFormat')(addressJson.result.province) + " " +$filter('provCityFormat')(addressJson.result.city)+ " " +addressJson.result.district;

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

    $scope.locationBegin = function() {
        // 调用原生定位 TODO
        window.bdk.getCurrentCity();
    };

    $scope.goFrontPage = function() {


        if (comApi.isNotNullAndUndefined($scope.selectPrev)) {

            $scope.localArea = $scope.selectPrev + $scope.selectCtiy + $scope.selectPref;

            $scope.getCityCode($scope.selectPrev, $scope.selectCtiy, $scope.selectPref);
        }

        $scope.singlePageShow(true, false, false, false, false, false, false, false);
    };

});