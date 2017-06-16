/**
 * Created by lenovo on 2016/4/14.
 */
app.controller('gdsClsInsertCtrl', ['$scope', 'comApi', '$state', 'fileUploadApi', function($scope,comApi,$state,fileUploadApi){

    //定义数据对象
    $scope.gdsClsInsert = {"cateNm":'', "cateDesc":'', "seqNum":'0', "cateLevel":'1', "cateThum":fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.GDS_THUM), "supeClsId":''};


    //当前选中的商品分类级数
    $scope.selectedGdsClsLevel = 1;
    //当前选中的商品分类
    $scope.selectedGdsCls = [];
    $scope.gdsClsList = [];

    comApi.selectAllGdsCls();

    //商品分类
    $scope.getGdsClsText = function(cateLevel){

            var input=cateLevel;
            if(input==1)
                return "设为一级分类";
            else if(input==2)
                return "设为二级分类";
            else if(input==3)
                return "设为三级分类";
            else if(input==4)
                return "设为四级分类";
            else if(input==5)
                return "设为五级分类";
            else if(input==6)
                return "设为六级分类";
            else if(input==7)
                return "设为七级分类";
            else if(input==8)
                return "设为八级分类";
            else if(input==9)
                return "设为九级分类";
    }

    //$scope.gdsClsList[0].push(comApi.GetGdsClsList("", "设为一级分类", "3"));  //key text
    $scope.gdsClsList[0] = comApi.GetGdsClsList("", $scope.getGdsClsText(1), "3");
    $scope.selectedGdsCls[0] = $scope.gdsClsList[0][0].key;

    $scope.changeSuperGdsCls = function(index){
        if($scope.selectedGdsCls[index] == "0000"){//设为该级别
            $scope.selectedGdsClsLevel = index+1;
            $scope.gdsClsInsert.cateLevel = $scope.selectedGdsClsLevel;
            if(index == 0) {//设为一级分类，则上级商品分类ID为空
                $scope.gdsClsInsert.supeClsId = "";
            }else{//设为其它级分类，则获取上级商品分类ID
                $scope.gdsClsInsert.supeClsId = $scope.selectedGdsCls[index-1];
            }
        }else{//选中其它选项
            $scope.gdsClsInsert.supeClsId =  $scope.selectedGdsCls[index];
            //加载下级分类
            if(index < 3) {//限制分类级别最多为五级，上级为1-3级分类时可加载下一级（2-4）分类列表
                $scope.gdsClsList[index + 1] = comApi.GetGdsClsList($scope.gdsClsInsert.supeClsId, $scope.getGdsClsText(index+2), "3");
                $scope.selectedGdsCls[index + 1] = $scope.gdsClsList[index][0].key;
                $scope.selectedGdsClsLevel = index + 2;
                $scope.gdsClsInsert.cateLevel = $scope.selectedGdsClsLevel;
            }else{//上级为4级时只能加载设为上级分类一项
                $scope.gdsClsList[index + 1] = comApi.GetGdsClsList($scope.gdsClsInsert.supeClsId, $scope.getGdsClsText(index+2), "5");
                $scope.selectedGdsCls[index + 1] = $scope.gdsClsList[index][0].key;
                $scope.selectedGdsClsLevel = index + 2;
                $scope.gdsClsInsert.cateLevel = $scope.selectedGdsClsLevel;
            }
        }


    }


    //提交新增
    $scope.insertGdsCls  = function() {
        $scope.gdsClsInsertCopy =  angular.copy($scope.gdsClsInsert);
        $scope.gdsClsInsertCopy.cateThum = fileUploadApi.getUploadSuccFileUrl($scope.gdsClsInsertCopy.cateThum);
        comApi.post("gdsCls/insertGdsCls", $scope.gdsClsInsertCopy, function(data){
            //消息提示
            comApi.successMessage('msg.goods.10006');
            setTimeout(function() {
                $state.go('app.goods.gdsCls')
            },1000);
        })
    }
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
}])

