app.controller('gdsInsertCtrl', ['$scope', 'comApi', '$state', '$sessionStorage', 'Upload','fileUploadApi', 'gdsInfoService', function ($scope, comApi, $state, $sessionStorage, Upload, fileUploadApi, gdsInfoService) {
    $scope.oneAtATime = true;
    $scope.status = {
        jbxxopen: true,
        spggopen: true,
        spsxopen: true,
        xxmsopen: true
    };
    //商品信息
    $scope.gdsDtl = {
        'ftyGdsNum': '',
        'gdsNm': '',
        'gdsClsId': '',
        'brdId': '',
        'gdsSpecDtlVoList': [{
            'gdsSpecDtlNum': '',
            'gdsSpecDtlNm': '',
            'gdsSpec': '',
            'gdsSpecUnitNum': '',
            'curPc': 0,
            'gdsSpecBarcode': '',
            gdsThum:fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.GDS_THUM),
            gdsPicArr:fileUploadApi.newMultiFileUpload(fileUploadApi.fileType.GDS_THUM),
            'gdsSpecDtlChnlVoList': [{
                'chnlNum': '',
                'chnlGdsSpecDtlNum': '',
                'sellFlg': ''
            }]
        }],
        'gdsPropGrpId': '',
        'gdsDesc': '',
        'gdsPropAndVal': {}
    };
    gdsInfoService.selectGdsBrd(function(){
        $scope.gdsBrds = gdsInfoService.getGdsBrd(0);
        if($scope.gdsBrds && $scope.gdsBrds.length>0){
            $scope.gdsDtl.brdId = $scope.gdsBrds[0].key;
        }
    });

    $scope.gdsDescInsertEditor = null;
    //所有属性组
    gdsInfoService.selectGdsPropGrps(function(data){
        if(data && data.length > 0){
            //属性组
            $scope.gdsPropAll = data;
            //设置属性组的默认值
            $scope.gdsInsertPropList = angular.copy($scope.gdsPropAll[0]);
            $scope.gdsPropOid = angular.copy($scope.gdsPropAll[0].oId);
            $scope.gdsDtl.gdsPropGrpId = angular.copy($scope.gdsPropAll[0].oId);
            initGdsPropValBySelect();
        }

        //初始化属性组时创建富文本框编辑器
        $scope.gdsDescInsertEditor = MyEditor.createEditor("gdsDescInsert", {"height":"340px"});
    });


    //多图片上传最多张数
    $scope.maxPicCount = 8;

    //获取所有容量
    $scope.gdsSpecUnitNums = comApi.getSelectBoxDic('C031', 0);
    //获取所有规格渠道
    $scope.chnlList = comApi.getChnlList('IFCOMW0210001', 0);
    //获取是否上架
    $scope.sellFlgs = comApi.getSelectBoxDic('C002', 0);
    //新增规格时调用
    $scope.addGdsSpecDtl = function (idx) {
        var obj = {
            gdsSpecDtlNm: '',
            gdsSpecDtlNum: '',
            gdsSpec: '',
            curPc: 0,
            listSelect: '1',
            gdsThum:fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.GDS_THUM),
            gdsPicArr:fileUploadApi.newMultiFileUpload(fileUploadApi.fileType.GDS_THUM),
            gdsSpecDtlChnlVoList: [{chnlNum: '', chnlGdsSpecDtlNum: '', sellFlg: ''}]
        };
        $scope.gdsDtl.gdsSpecDtlVoList.push(obj);
        //初始化
        $scope.gdsDtl.gdsSpecDtlVoList[idx].gdsSpecUnitNum = $scope.gdsSpecUnitNums[0].key;
        $scope.gdsDtl.gdsSpecDtlVoList[idx].gdsSpecDtlChnlVoList[0].chnlNum = $scope.chnlList[0].key;
        $scope.gdsDtl.gdsSpecDtlVoList[idx].gdsSpecDtlChnlVoList[0].sellFlg = $scope.sellFlgs[0].key;
    };
    //删除规格渠道时调用
    $scope.delGdsSpecDtl = function (idx) {
        if ($scope.gdsDtl.gdsSpecDtlVoList.length == 1) {
            comApi.errorMessage('msg.goods.10001');
        } else {
            $scope.gdsDtl.gdsSpecDtlVoList.splice(idx, 1);
        }
    };
    //添加销售渠道时调用
    $scope.addGdsSpecDtlChnl = function (gdsSpecDtlChnlVoList) {
        var idx = gdsSpecDtlChnlVoList.length;
        var obj = {chnlNum: '', chnlGdsSpecDtlNum: '', sellFlg: ''};
        gdsSpecDtlChnlVoList.push(obj);
        gdsSpecDtlChnlVoList[idx].chnlNum = $scope.chnlList[0].key;
        gdsSpecDtlChnlVoList[idx].sellFlg = $scope.sellFlgs[0].key;
    };
    //删除销售渠道时调用
    $scope.delGdsSpecDtlChnl = function (gdsSpecDtlChnlVoList, idx) {
        gdsSpecDtlChnlVoList.splice(idx, 1);
    };
    //初始化
    $scope.gdsDtl.gdsSpecDtlVoList[0].listSelect = '1';
    $scope.gdsDtl.gdsSpecDtlVoList[0].gdsSpecUnitNum = $scope.gdsSpecUnitNums[0].key;
    $scope.gdsDtl.gdsSpecDtlVoList[0].gdsSpecDtlChnlVoList[0].chnlNum = $scope.chnlList[0].key;
    $scope.gdsDtl.gdsSpecDtlVoList[0].gdsSpecDtlChnlVoList[0].sellFlg = $scope.sellFlgs[0].key;

    //定义数据对象
    $scope.gdsClsInsert = {
        "cateNm": '',
        "cateDesc": '',
        "seqNum": '',
        "cateLevel": '1',
        "cateThum": '',
        "supeClsId": ''
    };

    //当前选中的商品分类级数
    $scope.selectedGdsClsLevel = 1;
    //当前选中的商品分类
    $scope.selectedGdsCls = [];
    $scope.gdsClsList = [];

    comApi.selectAllGdsCls();

    $scope.getGdsClsText = function (cateLevel) {

        var input = cateLevel;
        if (input == 1)
            return "设为一级分类";
        else if (input == 2)
            return "设为二级分类";
        else if (input == 3)
            return "设为三级分类";
        else if (input == 4)
            return "设为四级分类";
        else if (input == 5)
            return "设为五级分类";
        else if (input == 6)
            return "设为六级分类";
        else if (input == 7)
            return "设为七级分类";
        else if (input == 8)
            return "设为八级分类";
        else if (input == 9)
            return "设为九级分类";
    };

    $scope.gdsClsList[0] = comApi.GetGdsClsList("", $scope.getGdsClsText(1), "0");
    if($scope.gdsClsList[0] && $scope.gdsClsList[0].length > 0){
        $scope.selectedGdsCls[0] = $scope.gdsClsList[0][0].key;
        $scope.gdsClsInsert.supeClsId = $scope.selectedGdsCls[0];
    }

    //是否存在下级分类
    var initList = comApi.GetGdsClsList($scope.gdsClsInsert.supeClsId, $scope.getGdsClsText(2), "0");
    if(initList && initList.length > 0) {
        $scope.gdsClsList[1] = comApi.GetGdsClsList($scope.gdsClsInsert.supeClsId, $scope.getGdsClsText(2), "1");
        $scope.selectedGdsCls[1] = $scope.gdsClsList[1][0].key;
        $scope.selectedGdsClsLevel = 2;
    }

    //商品分类
    $scope.changeSuperGdsCls = function (index) {
        if ($scope.selectedGdsCls[index] == "0000") {//设为该级别
            $scope.selectedGdsClsLevel = index + 1;
            $scope.gdsClsInsert.cateLevel = $scope.selectedGdsClsLevel;
            if (index == 0) {//设为一级分类，则上级商品分类ID为空
                $scope.gdsClsInsert.supeClsId = "";
            } else {//设为其它级分类，则获取上级商品分类ID
                $scope.gdsClsInsert.supeClsId = $scope.selectedGdsCls[index - 1];
            }
        } else {//选中其它选项
            $scope.gdsClsInsert.supeClsId = $scope.selectedGdsCls[index];
            //加载下级分类
            if(index < 4) {//限制分类级别最多为五级，上级为1-3级分类时可加载下一级（2-4）分类列表
                var list = comApi.GetGdsClsList($scope.gdsClsInsert.supeClsId, $scope.getGdsClsText(index+2), "0");
                if(list && list.length > 0) {
                    $scope.gdsClsList[index + 1] = comApi.GetGdsClsList($scope.gdsClsInsert.supeClsId, $scope.getGdsClsText(index + 2), "1");
                    $scope.selectedGdsCls[index + 1] = $scope.gdsClsList[index+1][0].key;
                    $scope.selectedGdsClsLevel = index + 2;
                }else{
                    $scope.selectedGdsClsLevel = index + 1;
                }
            }else{
                $scope.selectedGdsClsLevel = index + 1;
            }
        }


    }

    $scope.showValue = [];  //属性id


    //属性组切换
    $scope.changeGdsPropVal = function (oId) {
        $scope.showValue = [];
        //根据oId查对应的详情列表
        $scope.gdsInsertPropList = gdsInfoService.findPropArrByOid(angular.copy(oId));
        //属性组名称
        $scope.gdsDtl.gdsPropGrpId = angular.copy(oId);
        initGdsPropValBySelect();
    };
    //属性组更改时初始化
    function initGdsPropValBySelect(){
        for(var p=0; p<$scope.gdsInsertPropList.gdsPropList.length; p++){
            if( $scope.gdsInsertPropList.gdsPropList[p].valFlg == "1") {
                if( $scope.gdsInsertPropList.gdsPropList[p].mustFlg == "1"){
                    var num = gdsInfoService.findIndexByOid($scope.gdsInsertPropList, $scope.gdsInsertPropList.gdsPropList[p].oId);
                    $scope.showValue[num] =  $scope.gdsInsertPropList.gdsPropList[p].gdsPropValList[0].oId;
                }else{
                    $scope.gdsInsertPropList.gdsPropList[p].gdsPropValList.unshift("");
                }
            }
        }
    }

    $scope.gdsInsertSub = function () {
        //详情备份
        $scope.gdsInsertPropListCopy = angular.copy($scope.gdsInsertPropList);
        $scope.gdsPropGidOidList = comApi.gdsPropKeyVal($scope.showValue, $scope.gdsInsertPropListCopy.gdsPropList);
        angular.extend($scope.gdsDtl.gdsPropAndVal,$scope.gdsPropGidOidList);

        $scope.gdsDtlCopy = angular.copy($scope.gdsDtl);

        //商品缩略图(单个图片)
        for(var i = 0; i < $scope.gdsDtlCopy.gdsSpecDtlVoList.length; i++) {
            $scope.gdsDtlCopy.gdsSpecDtlVoList[i].gdsThum =
                fileUploadApi.getUploadSuccFileUrl($scope.gdsDtlCopy.gdsSpecDtlVoList[i].gdsThum);
        }

        //商品展示图(多个图片)
        for(var i = 0; i < $scope.gdsDtlCopy.gdsSpecDtlVoList.length; i++) {
            $scope.gdsDtlCopy.gdsSpecDtlVoList[i].gdsPicArr =
                fileUploadApi.getUploadSuccFileUrlList($scope.gdsDtlCopy.gdsSpecDtlVoList[i].gdsPicArr);
        }

        $scope.gdsDtlCopy.gdsClsId = $scope.gdsClsInsert.supeClsId;

        for(var  k=0; k<$scope.gdsDtlCopy.gdsSpecDtlVoList.length; k++) {
            if ($scope.gdsDtlCopy.gdsSpecDtlVoList[k].listSelect == 0) {
                $scope.gdsDtlCopy.gdsSpecDtlVoList[k].gdsSpecUnitNum = '';
            }
        }
        //获取数据详细描述的数据
        //$scope.gdsDtlCopy.gdsDesc = $("#gdsInsertDescInfo").html();
        $scope.gdsDtlCopy.gdsDesc = MyEditor.getHtmlVal($scope.gdsDescInsertEditor);

        comApi.post('gdsInfo/insertGdsInfo',$scope.gdsDtlCopy, function(data){
            comApi.successMessage('msg.goods.10008');
            setTimeout(function() {
                $state.go('app.goods.gdsInsertSucc');
            },1000);
        })
    };



    //上传文件标志
    $scope.uploadFlag = fileUploadApi.uploadFlag;

    //选择图片
    $scope.selectImg = function(evt, imgData){
        fileUploadApi.selectFile(evt, imgData, fileUploadApi.checkImgFileFormat, fileUploadApi, $scope, comApi);
    };

    //删除图片
    $scope.delImgItem = function(imgData, imgItem){
        fileUploadApi.delFileItem(imgData, imgItem, $scope);
    };

    //上传图片
    $scope.uploadImg = function(imgData){
        fileUploadApi.uploadFile(imgData, fileUploadApi);
    };


}]);