/**
 * 新增入职流程
 */
app.controller('entryApplInsertController', function ($scope, $state, $modal,
                                                      comApi, fileUploadApi) {

    $scope.oneAtATime = true;
    $scope.status = {
        entBaseInfoOpen: true,
        entInfoOpen: true,
        supvrStfInfoDisabled: false
    };
    $scope.entryInfo = {
        idCardPosPic: fileUploadApi
            .newSingleFileUpload(fileUploadApi.fileType.IDC_THUM),
        idCardOppPic: fileUploadApi
            .newSingleFileUpload(fileUploadApi.fileType.IDC_THUM)
    };
    $scope.storeList = [];

    // 上传文件标志
    $scope.uploadFlag = fileUploadApi.uploadFlag;

    // 初始化
    $scope.initEntryApplInsert = function () {
        comApi.get("entryAppl/getCtrlMstInfo", function (data) {
            var depCtrlMstList = data.depCtrlMstList;
            //var posCtrlMstList = data.posCtrlMstList;
            // 部门列表
            var depDataList = comApi.getSelectBoxDepartment("0");
            var newDepDataList = [];
            for (var i = 0; i < depCtrlMstList.length; i++) {
                var depNum = depCtrlMstList[i];
                for (var j = 0; j < depDataList.length; j++) {
                    if (depDataList[j].key == depNum) {
                        newDepDataList.push(depDataList[j]);
                        break;
                    }
                }
            }
            $scope.departmentList = newDepDataList;
            if (newDepDataList.length > 0) {
                $scope.entryInfo.entDep = newDepDataList[0].key;
            }

        });


        /*
         * lg查询职位以及等级
         * */
        comApi.get("entryAppl/selectJobPosAndLevel4App", function (data) {
            $scope.posAndPosLevelList = data;
            $scope.positionList = [];
            for (var i = 0; i < $scope.posAndPosLevelList.length; i++) {
                $scope.positionList.push({
                    "key": $scope.posAndPosLevelList[i].posNum,
                    "text": $scope.posAndPosLevelList[i].posNm
                })
            }

            if ($scope.positionList.length > 0) {
                $scope.entryInfo.stfPos = $scope.positionList[0].key;
            }

            $scope.positionLevelList = [];
            //给定初始默认等级
            if (comApi.isNotEmptyObject($scope.posAndPosLevelList[0].posLvls)) {
                $scope.positionLevelList = $scope.posAndPosLevelList[0].posLvls;
            }

            if ($scope.positionLevelList.length > 0) {
                $scope.entryInfo.posGrdNum = $scope.positionLevelList[0].posGrdNum;
            }
        });


        //省份、城市
        // 省
        var provinceDataList = comApi.getSelectBoxPCV("1", "0");
        $scope.provinceList = provinceDataList;
        if (provinceDataList.length > 0) {
            $scope.entryInfo.stfFrProv = provinceDataList[0].key;
        }
        // 城市
        var cityDataList = [];
        if (provinceDataList.length > 0) {
            cityDataList = comApi.getSelectBoxPCV(provinceDataList[0].key, "0");
        }
        $scope.cityList = cityDataList;
        if (cityDataList.length > 0) {
            $scope.entryInfo.stfFrCity = cityDataList[0].key;
        }

    };

    // 执行初始化
    $scope.initEntryApplInsert();

    // 职位变更重新取得职位等级列表
    $scope.changePosition = function (position) {

        if (comApi.isNotEmptyObject($scope.posAndPosLevelList)) {
            for (var i = 0; i < $scope.posAndPosLevelList.length; i++) {
                if ($scope.posAndPosLevelList[i].posNum == position) {
                    $scope.positionLevelList = angular.copy($scope.posAndPosLevelList[i].posLvls);
                    break;
                }
            }
        }

        if ($scope.positionLevelList.length > 0) {
            $scope.entryInfo.posGrdNum = $scope.positionLevelList[0].posGrdNum;
        } else {
            $scope.entryInfo.posGrdNum = "";
        }

    };

    // 省变更重新获取市列表
    $scope.changeProvince = function (province) {
        var cityDataList = comApi.getSelectBoxPCV(province, "0");
        $scope.cityList = cityDataList;
        if (cityDataList.length > 0) {
            $scope.entryInfo.stfFrCity = cityDataList[0].key;
        } else {
            $scope.entryInfo.stfFrCity = "";
        }
    };

    // 变更直属主管重新获取指数主管相关信息
    function changeSupvrStfInfo(supvrStfNum) {
        comApi.get("entryAppl/getSupvrStfInfo/" + supvrStfNum, function (data) {
            if (data.supvrStfPosNum != "") {
                $scope.status.supvrStfInfoDisabled = true;
                $scope.entryInfo.supvrStfPosNum = data.supvrStfPosNum;
                $scope.supvrStfList = data.supvrStfList;
            } else {
                $scope.status.supvrStfInfoDisabled = false;
                $scope.entryInfo.supvrStfPosNum = "";
                $scope.supvrStfList = {};
            }
        });
    }

    // 直属主管浏览
    $scope.openStf = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'radiostaff.html',
            controller: 'radioStaffController',
            size: size,
            resolve: {
                // 传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
                flag: function () {
                    return 1;
                },
                // 配置需要注入JS
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(['common/js/controllers/radiostaff.js']);
                }]
            }
        });
        // 父子传递参数
        modalInstance.result.then(function (selectedItem) {
            if (selectedItem.length > 0) {
                var stfNum = selectedItem[0].stfNum;
                var stfNm = selectedItem[0].stfNm;
                $scope.entryInfo.supvrStfNum = stfNum;
                $scope.supvrStfNumDisplay = stfNum + "." + stfNm;
                changeSupvrStfInfo(stfNum);
            } else {
                $scope.entryInfo.supvrStfNum = "";
                $scope.supvrStfNumDisplay = "";
                $scope.status.supvrStfInfoDisabled = false;
            }
        });
    };

    // 所属门店浏览
    $scope.openDep = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'multiselectstore.html',
            controller: 'multiSelectStoreController',
            size: size,
            resolve: {
                // 传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
                flag: function () {
                    return 1;
                },
                // 配置需要注入JS
                deps: [
                    '$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(['common/js/controllers/multiselectstore.js']);
                    }]
            }
        });
        // 父子传递参数
        modalInstance.result.then(function (selectedItem) {
            for (var i = 0; i < selectedItem.length; i++) {
                var strNum = selectedItem[i].strNum;
                var exist = false;
                for (var j = 0; j < $scope.storeList.length; j++) {
                    if (strNum == $scope.storeList[j].strNum) {
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    $scope.storeList.push(selectedItem[i]);
                }
            }
            var subStoreStr = "";
            var subStoreNmStr = "";
            for (var i = 0; i < $scope.storeList.length; i++) {
                if (i == 0) {
                    subStoreStr = $scope.storeList[i].strNum;
                    subStoreNmStr = $scope.storeList[i].strNm;
                } else {
                    subStoreStr = subStoreStr + "," + $scope.storeList[i].strNum;
                    subStoreNmStr = subStoreNmStr + "," + $scope.storeList[i].strNm;
                }
            }
            $scope.entryInfo.subStore = subStoreStr;
            $scope.entryInfo.subStoreNm = subStoreNmStr;
        });
    };
    // 所属门店删除
    $scope.delStore = function (index) {
        $scope.storeList.splice(index, 1);
        var subStoreStr = "";
        var subStoreNmStr = "";
        for (var i = 0; i < $scope.storeList.length; i++) {
            if (i == 0) {
                subStoreStr = $scope.storeList[i].strNum;
                subStoreNmStr = $scope.storeList[i].strNm;
            } else {
                subStoreStr = subStoreStr + "," + $scope.storeList[i].strNum;
                subStoreNmStr = subStoreNmStr + "," + $scope.storeList[i].strNm;
            }
        }
        $scope.entryInfo.subStore = subStoreStr;
        $scope.entryInfo.subStoreNm = subStoreNmStr;
    };

    // 保存操作
    $scope.saveEntryAppl = function () {
        $scope.entryInfoCopy = angular.copy($scope.entryInfo);
        $scope.entryInfoCopy.idCardPosPic = fileUploadApi
            .getUploadSuccFileUrl($scope.entryInfoCopy.idCardPosPic);
        $scope.entryInfoCopy.idCardOppPic = fileUploadApi
            .getUploadSuccFileUrl($scope.entryInfoCopy.idCardOppPic);
        comApi.post("entryAppl/saveEntryApplInsert", $scope.entryInfoCopy, function (data) {
            comApi.HintMessage(["success", "入职流程信息"], "", "msg.common.00023", 3000,
                "");
            // 跳转到入职流程页面
            $state.go("app.staff.entryAppl");
        });
    };

    // 提交操作
    $scope.submitEntryAppl = function () {
        $scope.entryInfoCopy = angular.copy($scope.entryInfo);
        $scope.entryInfoCopy.idCardPosPic = fileUploadApi
            .getUploadSuccFileUrl($scope.entryInfoCopy.idCardPosPic);
        $scope.entryInfoCopy.idCardOppPic = fileUploadApi
            .getUploadSuccFileUrl($scope.entryInfoCopy.idCardOppPic);
        comApi.post("entryAppl/submitEntryApplInsert", $scope.entryInfoCopy, function (data) {

            comApi.searchUnReadMessage($scope);

            comApi.HintMessage(["success", "入职流程信息"], "", "msg.common.00024", 3000,
                "");
            // 跳转到入职流程页面
            $state.go("app.staff.entryAppl");
        });
    };

    // 选择图片
    $scope.selectImg = function (evt, imgData) {
        fileUploadApi.selectFile(evt, imgData, fileUploadApi.checkImgFileFormat,
            fileUploadApi, $scope, comApi);
    };

    // 删除图片
    $scope.delImgItem = function (imgData, imgItem) {
        fileUploadApi.delFileItem(imgData, imgItem, $scope);
    };

    // 上传图片
    $scope.uploadImg = function (imgData) {
        fileUploadApi.uploadFile(imgData, fileUploadApi);
    };
});