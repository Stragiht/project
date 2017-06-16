
    app.controller('gdsClsUpdateCtrl',['$scope','NgTableParams','comApi','$stateParams', '$state', '$sessionStorage', 'fileUploadApi',function($scope,NgTableParams,comApi,$stateParams,$state,$sessionStorage,fileUploadApi){
        $scope.gdsClsUpd = {};
        $scope.superCate = {};
        var oId = $stateParams.oId;
        var singleImgUpload = fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.GDS_THUM);
        $scope.gdsClsUpd.cateThum = singleImgUpload;

        comApi.get("gdsCls/selectGdsCls/"+oId, function(data){
            $scope.gdsClsUpd = data;
            //获取上级分类
            comApi.get("gdsCls/selectSupeCate/"+oId, function(data){
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

                for (var i=0; i<$scope.superCate.length; i++) {
                    if(i < 3) {//限制分类级别最多为五级，上级为1-3级分类时可加载下一级（2-4）分类列表
                        $scope.gdsClsList[i+1] = comApi.GetGdsClsList($scope.superCate[i].oId, $scope.getGdsClsText(i+2), "3");
                    }else{
                        $scope.gdsClsList[i+1] = comApi.GetGdsClsList($scope.superCate[i].oId, $scope.getGdsClsText(i+2), "5");
                    }

                }

                for (var j=0; j<$scope.superCate.length; j++) {
                    if ($scope.superCate[j].oId == oId) {
                        $scope.selectedGdsCls[j] = '0000';
                    } else {
                        $scope.selectedGdsCls[j] = $scope.superCate[j].oId;
                    }
                }
                $scope.selectedGdsClsLevel = $scope.superCate.length;
            });
            //单图片代码
            if($scope.gdsClsUpd.cateThum !='' && $scope.gdsClsUpd.cateThum != null) {
                fileUploadApi.insertUploadSuccFile(singleImgUpload, $scope.gdsClsUpd.cateThum);
            }
            $scope.gdsClsUpd.cateThum = singleImgUpload;
        });

        //编辑商品分类
        //当前选中的商品分类级数
        $scope.selectedGdsClsLevel = 1;
        //当前选中的商品分类
        $scope.selectedGdsCls = [];
        $scope.gdsClsList = [];

        comApi.selectAllGdsCls();

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

        $scope.gdsClsList[0] = comApi.GetGdsClsList("", $scope.getGdsClsText(1), "3");
        $scope.selectedGdsCls[0] = $scope.gdsClsList[0][0].key;

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
                if(index < 3) {//限制分类级别最多为五级，上级为1-3级分类时可加载下一级（2-4）分类列表
                    $scope.gdsClsList[index + 1] = comApi.GetGdsClsList($scope.gdsClsUpd.supeClsId, $scope.getGdsClsText(index+2), "3");
                    $scope.selectedGdsCls[index + 1] = $scope.gdsClsList[index][0].key;
                    $scope.selectedGdsClsLevel = index + 2;
                    $scope.gdsClsUpd.cateLevel = $scope.selectedGdsClsLevel;
                }else{//上级为4级时只能加载设为上级分类一项
                    $scope.gdsClsList[index + 1] = comApi.GetGdsClsList($scope.gdsClsUpd.supeClsId, $scope.getGdsClsText(index+2), "5");
                    $scope.selectedGdsCls[index + 1] = $scope.gdsClsList[index][0].key;
                    $scope.selectedGdsClsLevel = index + 2;
                    $scope.gdsClsUpd.cateLevel = $scope.selectedGdsClsLevel;
                }
            }
        }


        $scope.updateGdsCls = function(){
            //数据备份
            $scope.gdsClsUpdCopy =  angular.copy($scope.gdsClsUpd);
            delete $scope.gdsClsUpdCopy["category"];
            //商品分类缩略图(单个图片)
            $scope.gdsClsUpdCopy.cateThum = fileUploadApi.getUploadSuccFileUrl($scope.gdsClsUpdCopy.cateThum);
            comApi.post("gdsCls/updateGdsCls", $scope.gdsClsUpdCopy, function(data){
                //消息提示
                comApi.successMessage('msg.goods.10007');
                setTimeout(function() {
                    $state.go('app.goods.gdsCls');
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

    }]);
