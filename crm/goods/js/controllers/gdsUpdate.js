app.controller('gdsUpdateCtrl', ['$scope', 'comApi', '$stateParams', '$sessionStorage','$state','Upload','fileUploadApi', 'gdsInfoService', function($scope,comApi,$stateParams,$sessionStorage,$state,Upload,fileUploadApi,gdsInfoService) {

    $scope.oneAtATime = true;
    $scope.status = {
        jbxxopen: true,
        spggopen:true,
        spsxopen:true,
        xxmsopen:true
    };

    //商品属性列表
    $scope.gdsPropList = [];
    //当前选中的商品属性
    $scope.selectedGdsProp = [];

    $scope.addGdsSpecDtl = function(idx){  //gdsSpecDtlVoList
        var obj={
            curPc: 0,
            listSelect: '1',
            gdsId: "",
            gdsSpec: "",
            gdsSpecBarcode: "",
            gdsThum:fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.GDS_THUM),
            gdsPicArr:fileUploadApi.newMultiFileUpload(fileUploadApi.fileType.GDS_THUM),
            gdsSpecDtlChnlVoList: [
                {
                    chnlGdsSpecDtlNum: "",
                    chnlNum: "",
                   // gdsSpecDtlNum: "",
                   // oId: "",
                    sellFlg: ""
                   // updtTm: ""
                }
            ],
            gdsSpecDtlNm: "",
            gdsSpecDtlNum: "",
            gdsSpecUnitNum: "",
            isAddFlg: "1"
        };

        $scope.gdsUpdateInfos.gdsSpecDtlVoList.push(obj);

        $scope.gdsUpdateInfos.gdsSpecDtlVoList[idx].gdsSpecUnitNum = $scope.gdsSpecUnits[0].key;
        $scope.gdsUpdateInfos.gdsSpecDtlVoList[idx].gdsSpecDtlChnlVoList[0].chnlNum = $scope.chnlList[0].key;
        $scope.gdsUpdateInfos.gdsSpecDtlVoList[idx].gdsSpecDtlChnlVoList[0].sellFlg = $scope.sellFlgs[0].key;
    };

    $scope.delGdsSpecDtl=function(idx){
        if($scope.gdsUpdateInfos.gdsSpecDtlVoList.length == 1){
        	comApi.errorMessage('msg.goods.10012');
        }else {
            $scope.gdsUpdateInfos.gdsSpecDtlVoList.splice(idx, 1);
        }
    };

    $scope.addGdsSpecDtlChnl = function(rowlist){
        var obj={
            "chnlGdsSpecDtlNum": "",
            "chnlNum": $scope.chnlList[0].key,
            "gdsSpecDtlNum": "",
            "oId": "",
            "sellFlg": $scope.sellFlgs[0].key,
            "updtTm": ""
        };
        rowlist.push(obj);
    };

    $scope.delGdsSpecDtlChnl = function(rowlist, idx){
        rowlist.splice(idx,1);
    };

    //获取所有商品规格
    $scope.gdsSpecUnits = comApi.getSelectBoxDic('C031', 0);
    //规格渠道
    $scope.chnlList = comApi.getChnlList('IFGDSW0110003',0);
    //是否上架
    $scope.sellFlgs = comApi.getSelectBoxDic('C002',0);
    //定义选中规格  手动输入的标志
    $scope.selectSpecFlg = 1;

    gdsInfoService.selectGdsBrd(function(){
        $scope.gdsBrds = gdsInfoService.getGdsBrd(0);
    });

    //分类
    $scope.gdsClsUpd = {};
    $scope.superCate = {};

    //$scope.showValue = '';


    //编辑商品分类
    //当前选中的商品分类级数
    $scope.selectedGdsClsLevel = 1;
    //当前选中的商品分类
    $scope.selectedGdsCls = [];
    $scope.gdsClsList = [];
    comApi.selectAllGdsCls();

    $scope.gdsClsList[0] = comApi.GetGdsClsList("", "", "0");
    $scope.selectedGdsCls[0] = $scope.gdsClsList[0][0].key;

    $scope.gdsDescUpdEditor = null;
    //获取gdsId
    var gdsId = $stateParams.gdsId;
    comApi.get('gdsInfo/selectGdsInfoById/'+gdsId, function(data){
        var gdsDesc = "";
        $scope.gdsDescUpdEditor = MyEditor.createEditor("gdsDescUpd", {"height":"340px"});
        $scope.gdsUpdateInfos = data;
        gdsDesc = data.gdsDesc;
        MyEditor.setData($scope.gdsDescUpdEditor, gdsDesc);

        //多图片初始化数据保存
        $scope.imgMoreInit = angular.copy($scope.gdsUpdateInfos.gdsSpecDtlVoList);
        //单图片代码
        for (var i=0; i<$scope.gdsUpdateInfos.gdsSpecDtlVoList.length;i++) {
            var singleImgUpload = fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.GDS_THUM);
            if($scope.gdsUpdateInfos.gdsSpecDtlVoList[i].gdsThum != null && $scope.gdsUpdateInfos.gdsSpecDtlVoList[i].gdsThum !='') {
                fileUploadApi.insertUploadSuccFile(singleImgUpload, $scope.gdsUpdateInfos.gdsSpecDtlVoList[i].gdsThum);
            }
            $scope.gdsUpdateInfos.gdsSpecDtlVoList[i].gdsThum = singleImgUpload;
        }

        for(var  z=0; z<$scope.gdsUpdateInfos.gdsSpecDtlVoList.length; z++) {
            if ($scope.gdsUpdateInfos.gdsSpecDtlVoList[z].gdsSpecUnitNum == '') {
                $scope.gdsUpdateInfos.gdsSpecDtlVoList[z].listSelect = '0';
            } else {
                $scope.gdsUpdateInfos.gdsSpecDtlVoList[z].listSelect = '1';
            }
        }

        //初始化(规格选择)
       // $scope.gdsUpdateInfos.gdsSpecDtlVoList[0].listSelect = '1';

        //属性值属性组
        $scope.propArr = data.gdsPropAndVal;

        for (var j=0; j<$scope.gdsUpdateInfos.gdsSpecDtlVoList.length; j++) {
            var multiImgUpload = fileUploadApi.newMultiFileUpload(fileUploadApi.fileType.GDS_THUM);
            if ($scope.gdsUpdateInfos.gdsSpecDtlVoList[j].gdsPicArr == null) {
                $scope.gdsUpdateInfos.gdsSpecDtlVoList[j].gdsPicArr = multiImgUpload;
            } else {
                for (var k=0; k<$scope.gdsUpdateInfos.gdsSpecDtlVoList[j].gdsPicArr.length; k++){


                    if ($scope.gdsUpdateInfos.gdsSpecDtlVoList[j].gdsPicArr[k] != undefined && $scope.gdsUpdateInfos.gdsSpecDtlVoList[j].gdsPicArr[k] != null && $scope.gdsUpdateInfos.gdsSpecDtlVoList[j].gdsPicArr[k] != '') {
                        fileUploadApi.insertUploadSuccFile(multiImgUpload, $scope.gdsUpdateInfos.gdsSpecDtlVoList[j].gdsPicArr[k]);

                    }else{
                        fileUploadApi.insertNewFile();
                    }
                }
                $scope.gdsUpdateInfos.gdsSpecDtlVoList[j].gdsPicArr = multiImgUpload;
            }

        }
        gdsInfoService.selectGdsPropGrps(function(propData){
            //属性组
            $scope.gdsPropAll = propData;
            //设置属性组的默认值
            $scope.gdsPropOid = angular.copy($scope.gdsPropAll[0].oId);
            $scope.gdsUpdPropList = angular.copy($scope.gdsPropAll[0]);

            if (!data.gdsPropGrpId || data.gdsPropGrpId == null || data.gdsPropGrpId == '') {
                $scope.gdsUpdateInfos.gdsPropGrpId = angular.copy($scope.gdsPropOid);
                //属性及属性值初始化
                initGdsPropValBySelect();
            } else {
                $scope.gdsUpdPropList = gdsInfoService.findPropArrByOid(data.gdsPropGrpId);
                //设置属性的默认值
                for(var key in $scope.propArr) {
                    var num = gdsInfoService.findIndexByOid($scope.gdsUpdPropList, key);
                    $scope.showValue[num] =  angular.copy($scope.propArr[key]);
                }
                //属性及属性值初始化
                initGdsPropVal();
            }
        });



        //商品分类
        $scope.gdsClsUpd.supeClsId = data.gdsClsId;
        comApi.get("gdsCls/selectSupeCate/"+data.gdsClsId, function(data){
            $scope.superCate = data;

            //数据排序
            $scope.superCate = dataSort(data);
            function dataSort(sort) {
                var sortNew = [];
                for (var i=1; i<=sort.length; i++) {
                    for (var j=0; j<sort.length; j++) {
                        if (sort[j].cateLevel == i) {
                            sortNew.push(sort[j]);
                            break;
                        }
                    }
                }
                return sortNew;
            }

            //加载各级商品分类，并初始化应选中的分类
            for (var i=0; i<$scope.superCate.length; i++) {
                $scope.selectedGdsCls[i] = $scope.superCate[i].oId;
                var list = comApi.GetGdsClsList($scope.superCate[i].oId, "", "1");
                if(list && list.length > 1) {//存在下级分类则加载下级分类列表
                    $scope.gdsClsList[i + 1] = list;
                    $scope.selectedGdsCls[i+1] = '0000';
                }else{//不存在下级分类时，不再加载
                    break;
                }
            }
            $scope.selectedGdsClsLevel = i+1;

        })
    });

    //属性组切换
    $scope.changeGdsPropVal = function(){
        $scope.showValue = [];
        //根据oId查对应的详情列表
        $scope.gdsUpdPropList = gdsInfoService.findPropArrByOid(angular.copy($scope.gdsUpdPropList.oId));
        $scope.gdsUpdateInfos.gdsPropGrpId = angular.copy($scope.gdsUpdPropList.oId);
        //属性组更改时初始化
        initGdsPropValBySelect();
    };

   //属性及属性值初始化
    function initGdsPropVal(){
        for(var p=0; p<$scope.gdsUpdPropList.gdsPropList.length; p++){
            if($scope.gdsUpdPropList.gdsPropList[p].valFlg == "1" && $scope.gdsUpdPropList.gdsPropList[p].mustFlg == "0") {
                $scope.gdsUpdPropList.gdsPropList[p].gdsPropValList.unshift("");
            }
        }
    }
    //属性组更改时初始化
    function initGdsPropValBySelect(){
        for(var p=0; p<$scope.gdsUpdPropList.gdsPropList.length; p++){
            if( $scope.gdsUpdPropList.gdsPropList[p].valFlg == "1") {
                if( $scope.gdsUpdPropList.gdsPropList[p].mustFlg == "1"){
                    var num = gdsInfoService.findIndexByOid($scope.gdsUpdPropList, $scope.gdsUpdPropList.gdsPropList[p].oId);
                    $scope.showValue[num] =  $scope.gdsUpdPropList.gdsPropList[p].gdsPropValList[0].oId;
                }else{
                    $scope.gdsUpdPropList.gdsPropList[p].gdsPropValList.unshift("");
                }
            }
        }
    }

    //================================类别
    $scope.changeSuperGdsCls = function(index){
        if($scope.selectedGdsCls[index] == "0000"){//设为该级别
            $scope.selectedGdsClsLevel = index+1;
            $scope.gdsClsUpd.cateLevel = $scope.selectedGdsClsLevel;
            if(index == 0) {//设为一级分类，则上级商品分类ID为空
                $scope.gdsClsUpd.supeClsId = "";
            }else{//设为其它级分类，则获取上级商品分类ID
                $scope.gdsClsUpd.supeClsId = $scope.selectedGdsCls[index-1];
            }
        }else{//选中其它选项
            $scope.gdsClsUpd.supeClsId =  $scope.selectedGdsCls[index];
            //加载下级分类
            if(index < 4) {//限制分类级别最多为五级，上级为1-3级分类时可加载下一级（2-4）分类列表
                var list = comApi.GetGdsClsList($scope.gdsClsUpd.supeClsId, "", "1");
                if(list && list.length > 1) {
                    $scope.gdsClsList[index + 1] = list;
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
    $scope.gdsUpdateSub = function() {

        //获取数据详细描述的数据
        //$scope.gdsUpdateInfos.gdsDesc = $("#gdsDescInfo").html();
        $scope.gdsUpdateInfos.gdsDesc = MyEditor.getHtmlVal($scope.gdsDescUpdEditor);

        //==============
        //详情备份
        $scope.gdsInsertPropListCopy = angular.copy($scope.gdsUpdPropList);
        $scope.gdsPropGidOidList = comApi.gdsPropKeyVal($scope.showValue, $scope.gdsInsertPropListCopy.gdsPropList);
        //angular.extend($scope.gdsUpdateInfos.gdsPropAndVal,$scope.gdsPropGidOidList);
        $scope.gdsUpdateInfos.gdsPropAndVal = $scope.gdsPropGidOidList;
        //======

        //提交的数据
        $scope.gdsUpdateInfosCopy2 = angular.copy($scope.gdsUpdateInfos);

        //商品缩略图(单个图片)
        for(var i = 0; i < $scope.gdsUpdateInfosCopy2.gdsSpecDtlVoList.length; i++) {
            $scope.gdsUpdateInfosCopy2.gdsSpecDtlVoList[i].gdsThum =
                fileUploadApi.getUploadSuccFileUrl($scope.gdsUpdateInfos.gdsSpecDtlVoList[i].gdsThum);
        }

        //商品展示图(多个图片)
        for(var i = 0; i < $scope.gdsUpdateInfosCopy2.gdsSpecDtlVoList.length; i++) {
            $scope.gdsUpdateInfosCopy2.gdsSpecDtlVoList[i].gdsPicArr =
                fileUploadApi.getUploadSuccFileUrlList($scope.gdsUpdateInfos.gdsSpecDtlVoList[i].gdsPicArr);
        }

        //商品分类
        $scope.gdsUpdateInfosCopy2.gdsClsId = $scope.gdsClsUpd.supeClsId;

        for(var  k=0; k<$scope.gdsUpdateInfosCopy2.gdsSpecDtlVoList.length; k++) {
            if ($scope.gdsUpdateInfosCopy2.gdsSpecDtlVoList[k].listSelect == 0) {
                $scope.gdsUpdateInfosCopy2.gdsSpecDtlVoList[k].gdsSpecUnitNum = '';
            }
        }

        //接口
        comApi.post('gdsInfo/updateGdsInfo',$scope.gdsUpdateInfosCopy2, function(data){
        	comApi.successMessage('msg.goods.10013');
            setTimeout(function() {
                $state.go('app.goods.gdsBas');
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