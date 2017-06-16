/**
 * Created by lenovo on 2016/5/5.
 */
app.service('gdsInfoService', ['$http','comApi','$sessionStorage',function($http, comApi,  $sessionStorage){
    var keyAll = "0000";
    //获取商品属性组
    this.selectGdsPropGrps = function(func){
        comApi.get("gdsProp/selectAllGdsPropGrp",function(data){
            $sessionStorage.gdsProp = data;
            if(func && func != null && typeof func == 'function'){
                func(data);
            }
        })
    };

    this.getGdsPropGrp = function() {
        var gdsPropGrpList = [];
        for (var i = 0; i < $sessionStorage.gdsProp.length; i++) {
            if ($sessionStorage.gdsProp[i].gdsPropGrpNm != null && $sessionStorage.gdsProp[i].gdsPropGrpNm != undefined && $sessionStorage.gdsProp[i].gdsPropGrpNm != "") {
                var c = {
                    key : $sessionStorage.gdsProp[i].oId,
                    text : $sessionStorage.gdsProp[i].gdsPropGrpNm
                };
                gdsPropGrpList.push(c);
            }
        }
        return gdsPropGrpList;
    };


    //根据oId查找supid
    this.searchGropId  = function(oId) {
        //$sessionStorage.gdsPropGrp
        for (var i=0; i<$sessionStorage.gdsPropGrp.length; i++) {
            if ($sessionStorage.gdsPropGrp[i].gdsPropValList != '' && $sessionStorage.gdsPropGrp[i].gdsPropValList != null) {
                for (var j=0; j<$sessionStorage.gdsPropGrp[i].gdsPropValList.length; j++) {
                    if ($sessionStorage.gdsPropGrp[i].gdsPropValList[j].oId == oId) {
                        return $sessionStorage.gdsPropGrp[i].gdsPropValList[j].gdsPropId;
                    }
                }
            }
        }
    };

    //根据oId找对应的属性组
    this.findPropArrByOid = function(oId) {
        var sessGdsPropCopy = angular.copy($sessionStorage.gdsProp);
        for (var i=0; i<sessGdsPropCopy.length; i++) {
            if (sessGdsPropCopy[i].oId == oId) {
                return sessGdsPropCopy[i];
            }
        }
    };

    //根据属性组id找对应的组的标号
    this.findIndexByOid = function(thisAttrArr, oId) {
        //防止sessionStorage数据被更改
        var thisAttrArrCopy = angular.copy(thisAttrArr);
        for (var i=0; i<thisAttrArrCopy.gdsPropList.length; i++) {
            if (thisAttrArrCopy.gdsPropList[i].oId == oId) {
                //return thisAttrArrCopy[i];
                return i;
            }
        }
    };

    //==================商品属性
    //格式化商品属性信息
    this.formatGdsPropData = function() {
        var list = [];
        for (var i = 0; i < $sessionStorage.gdsProp.length; i++) {
            var c = {
                gdsPropGrpId: '',
                oId : $sessionStorage.gdsProp[i].oId,
                gdsPropGrpNm : $sessionStorage.gdsProp[i].gdsPropGrpNm
            };
            list.push(c);
            for (var j=0; j<$sessionStorage.gdsProp[i].gdsPropVoList.length; j++) {

                var d = {
                    gdsPropGrpId: $sessionStorage.gdsProp[i].gdsPropVoList[j].gdsPropGrpId,
                    oId : $sessionStorage.gdsProp[i].gdsPropVoList[j].oId,
                    gdsPropGrpNm : $sessionStorage.gdsProp[i].gdsPropVoList[j].gdsPropNm
                };
                list.push(d);
                for (var k=0; k < $sessionStorage.gdsProp[i].gdsPropVoList[j].gdsPropValList.length; k++) {

                    var e = {
                        gdsPropGrpId: $sessionStorage.gdsProp[i].gdsPropVoList[j].gdsPropValList[k].gdsPropId,
                        oId : $sessionStorage.gdsProp[i].gdsPropVoList[j].gdsPropValList[k].oId,
                        gdsPropGrpNm : $sessionStorage.gdsProp[i].gdsPropVoList[j].gdsPropValList[k].gdsPropValNm
                    };
                    list.push(e);
                }
            }
        }

        return list;
    };

    //读取属性分类列表
    this.GetGdsPropList = function(gdsPropGrpId,flg){
        var list = [];
        if (flg == 1) {
            list.push({
                key : keyAll,
                text : ""
            });
        } else if (flg == 2) {
            list.push({
                key : keyAll,
                text : "全部"
            });
        } else if (flg == 3){
            list.push({
                key : keyAll,
                text : "全部"
            });
        }

        for (var i = 0; i < $sessionStorage.gdsPropFmt.length; i++) {
            if (($sessionStorage.gdsPropFmt[i].gdsPropGrpId == null && gdsPropGrpId=="") || $sessionStorage.gdsPropFmt[i].gdsPropGrpId == gdsPropGrpId) {
                var c = {
                    key : $sessionStorage.gdsPropFmt[i].oId,
                    text : $sessionStorage.gdsPropFmt[i].gdsPropGrpNm
                };
                list.push(c);
            }
        }

        return list;
    };

    //根据oId找gdsPropId
    this.getPropId = function(oId) {
        for (var i = 0; i < $sessionStorage.gdsPropFmt.length; i++) {
            if ($sessionStorage.gdsPropFmt[i].oId == oId) {
                return $sessionStorage.gdsPropFmt[i].gdsPropGrpId;
            }
        }
    };

    //获取商品品牌
    this.selectGdsBrd = function(func){
        comApi.get("gdsBrd/selectAllGdsBrd", function(data){
            $sessionStorage.gdsBrd = data;
            if(func && func != null && typeof func == 'function'){
                func(data);
            }
        });
    };
    this.getGdsBrd = function(flg){
        var gdsBrdList = [];
        if (flg == 1) {
            gdsBrdList.push({
                key : keyAll,
                text : ""
            });
        } else if (flg == 2) {
            gdsBrdList.push({
                key : keyAll,
                text : "全部"
            });
        }
        for (var i = 0; i < $sessionStorage.gdsBrd.length; i++) {
            if ($sessionStorage.gdsBrd[i].brdNm != null && $sessionStorage.gdsBrd[i].brdNm != undefined && $sessionStorage.gdsBrd[i].brdNm != "") {
                var c = {
                    key : $sessionStorage.gdsBrd[i].oId,
                    text : $sessionStorage.gdsBrd[i].brdNm
                };
                gdsBrdList.push(c);
            }
        }
        return gdsBrdList;
    };
}]);