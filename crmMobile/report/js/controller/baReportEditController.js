/**
 * Created by 王健 on 2016-5-5.
 * 编辑报表画面
 */
app.controller('baReportEditController', function ($scope, comApi, $ionicPopup, $stateParams, $state, $timeout, $ionicScrollDelegate, $filter) {
  
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	// 检索画面上的初始数据
    $scope.initData = function(cond){
        // 取得用户提交的报表数据
        comApi.post("saleData/initMobileBaReportEdit", cond, function(data) {
            $scope.submitInfo = data;
            $scope.editShow = data.editShow;
            // 上拉加载是否可用
            $scope.moredata = {
                gdsSpecDtl : true,
                memb : false,
                search : false
            };
        });
    }
    
    // 初始化方法
	$scope.init = function(){
        // 设定初期数据
        $scope.editShow = false;
        $scope.buyerDelete = false;
        // 设定【提交报表】画面显示
        $scope.pageShow = {
            submit : true,
            buyer : false,
            member : false,
            search : false
        }
        $scope.cond = {
            stfNum : $stateParams.stfNum,
            saleDate : $stateParams.saleDate,
            strNum : $stateParams.strNum
        }
        // 检索画面上的初始数据
        $scope.initData($scope.cond);
        // 当前页数
        $scope.pageNum = {
            gdsSpecDtl : 0,
            memb : 0,
            search : 0
        };
        // 每页显示的数据件数
        $scope.pageSize = 15;
	}
	
	// 调用页面初始化
	$scope.init();
    
    // 点击商品明细的方法
    $scope.gdsSpecSelect = function(index){
        $scope.gdsSpecIndex = index;
        $scope.buyerDelete = false;
        // 设定【销售日期】画面显示
        $scope.pageShow = {
            submit : false,
            buyer : true,
            member : false,
            search : false
        }
        // 取得指定商品的购买者信息
        if ($scope.submitInfo.gdsSpecList[index].buyerInfoList.length == 0) {
            $scope.submitInfo.gdsSpecList[index].buyerInfoList = [{
                oId : "",
                membNum : "",
                membNm : "",
                buyQty : 0,
                buyAmt : 0.00
            }];
        }
    }
    
    // 点击【商品购买者】画面的【新增】按钮的方法
    $scope.addBuyerInfo = function(){
        var index = $scope.gdsSpecIndex;
        // 新增一条购买者信息
        var info = {
            oId : "",
            membNum : "",
            membNm : "",
            buyQty : 0,
            buyAmt : 0.00
        };
        $scope.submitInfo.gdsSpecList[index].buyerInfoList.push(info);
    }
    
    // 点击【商品购买者】画面的【删除】按钮的方法
    $scope.deleteBuyerInfo = function(buyerIndex){
        // 取得商品明细的索引
        var index = $scope.gdsSpecIndex;
        if ($scope.submitInfo.gdsSpecList[index].buyerInfoList.length == 1) {
            // 弹出错误消息
            comApi.showMessage("error", "msg.common.10006", 3000);
            return;
        }
        if ($scope.submitInfo.delLines == undefined) {
            $scope.submitInfo.delLines = [];
        }
        // 保存删除数据的OID
        var oId = $scope.submitInfo.gdsSpecList[index].buyerInfoList[buyerIndex].oId;
        if (!$scope.isEmpty(oId)) {
            var line = {
                oId : oId,
                updtTm : $scope.submitInfo.gdsSpecList[index].buyerInfoList[buyerIndex].updtTm
            };
            $scope.submitInfo.delLines.push(line);
        }
        // 删除选中数据
        $scope.submitInfo.gdsSpecList[index].buyerInfoList.splice(buyerIndex, 1);
    }
    
    // 点击【商品购买者】画面的【选择会员】的方法
    $scope.gotoMembSelect = function(index){
        // 保存购买者信息的索引
        $scope.buyerListIndex = index;
        // 设定【会员选择】画面显示
        $scope.pageShow = {
            submit : false,
            buyer : false,
            member : true,
            search : false
        }
        // 取得已经购买该商品的会员
        var buyerInfoList = $scope.submitInfo.gdsSpecList[$scope.gdsSpecIndex].buyerInfoList;
        $scope.selectedMembNums = "";
        for (var i = 0; i < buyerInfoList.length; i++) {
            var membNum = buyerInfoList[i].membNum;
            if (!$scope.isEmpty(membNum)) {
                if (i == 0) {
                    $scope.selectedMembNums = membNum;
                } else {
                    $scope.selectedMembNums = $scope.selectedMembNums + "," + membNum;
                }
            }
        }
        $scope.pageNum.memb = 0;
        // 上拉加载是否可用
        $scope.moredata.memb = true;
        $scope.membList = [];
        // 回到顶部
        $ionicScrollDelegate.$getByHandle('contentScrollMemb').scrollTop();
    }
    
    // 在【搜索】画面的【搜索栏】输入联系电话的处理
    $scope.searchMembByPhone = function(searchPhone){
        $scope.pageNum.search = 0;
        $scope.moredata.search = true;
        $scope.searchMembList = [];
        // 回到顶部
        $ionicScrollDelegate.$getByHandle('contentScrollSearch').scrollTop();
    }
    
    // 点击【选择会员】画面的【搜索栏】的处理
    $scope.searchShow = function(){
        // 设定初期值
        $scope.searchPhone = "";
        // 设定【会员选择】画面显示
        $scope.pageShow = {
            submit : false,
            buyer : false,
            member : false,
            search : true
        }
        // 上拉加载是否可用
        $scope.pageNum.search = 0;
        $scope.moredata.search = true;
        $scope.searchMembList = [];
        // 回到顶部
        $ionicScrollDelegate.$getByHandle('contentScrollSearch').scrollTop();
    }
    
    // 【选择会员】画面和【搜索】画面选中会员的处理
    $scope.membSelected = function(membNum, membNm){
        // 取得商品明细的索引
        var index = $scope.gdsSpecIndex;
        // 取得购买者信息的索引
        var buyerIndex = $scope.buyerListIndex;
        // 设置选中的会员信息
        $scope.submitInfo.gdsSpecList[index].buyerInfoList[buyerIndex].membNum = membNum;
        $scope.submitInfo.gdsSpecList[index].buyerInfoList[buyerIndex].membNm = membNm;
        
        // 设定【会员选择】画面显示
        $scope.pageShow = {
            submit : false,
            buyer : true,
            member : false,
            search : false
        }
        // 上拉加载是否可用
        $scope.moredata.memb = false;
        $scope.moredata.search = false;
    }

    // 返回到【提交报表】画面
    $scope.backToSubmit = function(){
        // 设定【提交报表】画面显示
        $scope.pageShow = {
            submit : true,
            buyer : false,
            member : false,
            search : false
        }
    }
    
    // 从【商品购买者】画面返回到【提交报表】画面
    $scope.buyerBackToSubmit = function(){
        // 取得商品明细的索引
        var i = $scope.gdsSpecIndex;
        // 重新计算商品销售数量的合计
        var buyerInfoList = $scope.submitInfo.gdsSpecList[i].buyerInfoList;
        var qty = 0;
        for (var j = 0; j < buyerInfoList.length; j++) {
            // 验证输入的购买金额是否有效
            if (!$scope.isEmpty(buyerInfoList[j].buyAmt)) {
                var reg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
                if (!reg.exec(buyerInfoList[j].buyAmt)) {
                  comApi.showMessage([ "error", j + 1, "金额" ], "msg.common.10009", 3000);
                  return false;
                }
            }
            // 验证输入的购买数量是否有效
            if (!$scope.isEmpty(buyerInfoList[j].buyQty)) {
                var reg = /^[0-9]*$/;
                if (!reg.exec(buyerInfoList[j].buyQty)) {
                  comApi.showMessage([ "error", j + 1, "数量" ], "msg.common.10009", 3000);
                  return false;
                }
            }
            // 购买金额大于0的时候，该条明细的购买数量必须大于0。
            if ($scope.isEmpty(buyerInfoList[j].buyQty) && buyerInfoList[j].buyAmt > 0) {
                // 弹出提示消息
                comApi.showMessage(["error", "金额>0", "数量"], "msg.common.10008", 3000);
                return;
            }
            // 选择会员不为空的时候，该条明细的购买数量必须大于0。
            if ($scope.isEmpty(buyerInfoList[j].buyQty) && !$scope.isEmpty(buyerInfoList[j].membNum)) {
                // 弹出提示消息
                comApi.showMessage(["error", "会员不为空", "数量"], "msg.common.10008", 3000);
                return;
            }
            qty = Number(qty) + Number(buyerInfoList[j].buyQty);
        }
        $scope.submitInfo.gdsSpecList[i].gdsQty = qty;
        // 设定【提交报表】画面显示
        $scope.pageShow = {
            submit : true,
            buyer : false,
            member : false,
            search : false
        }
    }
    
    // 返回到【商品购买者】画面
    $scope.backToBuyer = function(){
        // 设定【提交报表】画面显示
        $scope.pageShow = {
            submit : false,
            buyer : true,
            member : false,
            search : false
        }
        // 上拉加载是否可用
        $scope.moredata.memb = false;
    }
    
    // 从【搜索】画面返回到【选择会员】画面
    $scope.backToMember = function(){
        // 设定【选择会员】画面显示
        $scope.pageShow = {
            submit : false,
            buyer : false,
            member : true,
            search : false
        }
        // 上拉加载是否可用
        $scope.moredata.search = false;
    }
    
    // 改变【会员购买者】画面的删除和取消的状态
    $scope.changeDeleteCancel = function(flg){
        $scope.buyerDelete = flg;
    }
    
    // 【存为草稿】和【提交】的处理
    $scope.submitReport = function(state) {
        $scope.submitInfo.state = state;
        // 对输入数据进行验证
        // 销售金额没有输入的时候，提示错误销售
        if ($scope.submitInfo.saleAmt == undefined || $scope.submitInfo.saleAmt == null) {
            // 弹出提示消息
            comApi.showMessage(["error", "销售金额"], "msg.common.10002", 3000);
            return;
        } else {
            var reg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
            if (!reg.exec($scope.submitInfo.saleAmt)) {
              comApi.showMessage([ "error", "销售金额" ], "msg.common.10004", 3000);
              return false;
            }
        }
        // 销售金额大于0，成交单数为空或者0的时候，提示错误销售
        if ($scope.submitInfo.saleAmt > 0 && $scope.isEmpty($scope.submitInfo.dealQty)) {
            // 弹出提示消息
            comApi.showMessage(["error", "金额>0", "单数"], "msg.common.10008", 3000);
            return;
        }
        // 验证输入的成交单数是否有效
        if (!$scope.isEmpty($scope.submitInfo.dealQty)) {
            var reg = /^[0-9]*$/;
            if (!reg.exec($scope.submitInfo.dealQty)) {
              comApi.showMessage([ "error", "成交单数" ], "msg.common.10004", 3000);
              return false;
            }
        }
        // 判断商品购买者页面输入的总金额是否大于销售金额
        var gdsSpecList = $scope.submitInfo.gdsSpecList;
        var sumSaleAmt = 0;
        var sumQty = 0;
        for (var i = 0; i < gdsSpecList.length; i++) {
            var buyerInfoList = gdsSpecList[i].buyerInfoList;
            sumQty = Number(sumQty) + Number(gdsSpecList[i].gdsQty);
            for (var j = 0; j < buyerInfoList.length; j++) {
                sumSaleAmt = Number(sumSaleAmt) + Number(buyerInfoList[j].buyAmt);
            }
        }
        // 销售金额大于0的时候，商品数量的总和不能为0！
        if ($scope.submitInfo.saleAmt > 0 && sumQty == 0) {
            // 弹出提示消息
            comApi.showMessage(["error", "金额>0", "总数量"], "msg.common.10008", 3000);
            return;
        }
        // 商品购买者页面输入的总金额是否大于销售金额，提示错误销售
        if (Number(sumSaleAmt) > Number($scope.submitInfo.saleAmt)) {
            // 弹出提示消息
            comApi.showMessage(["error", "购买总额", "销售额"], "msg.common.10007", 3000);
            return;
        }
        
        // 修改报表数据
        comApi.post("saleData/updateMobileBaReport", $scope.submitInfo, function(data) {
            // 弹出提示消息
            comApi.showMessage("success", "msg.common.10001", 3000);
            // 3秒后跳转回【提交报表列表】页面
            $timeout(function () {
                // 跳转回【提交报表列表】页面
                $state.go("baReportList");
            }, 3000);
        },true);
    }
    
    // 【编辑报表】画面的返回处理
    $scope.gotoFtontPage = function() {
        var confirmPopup = $ionicPopup.confirm({
            title : '提示',
            template : '确定要放弃此次编辑？',
            okText : '确定',
            cancelText : '取消'
        });
        confirmPopup.then(function(res) {
            if (res) {
                $state.go("baReportDetail", {stfNum:$scope.cond.stfNum, saleDate:$scope.cond.saleDate, strNum:$scope.cond.strNum, pageFlg:'0'});
            }
        });
    };
    
    // 选择会员画面的下拉刷新
    $scope.doRefreshMemb = function() {
        $scope.pageNum.memb = 0;
        $scope.moredata.memb = true;
        var cond = {phone : "", selectedMembNums : $scope.selectedMembNums};
        searchMembers(cond, $scope.pageNum.memb, true, true);
    }
    
    // 搜索画面的下拉刷新
    $scope.doRefreshSearch = function() {
        $scope.pageNum.search = 0;
        $scope.moredata.search = true;
        var cond = {phone : $scope.searchPhone, selectedMembNums : $scope.selectedMembNums};
        searchMembers(cond, $scope.pageNum.search, false, true);
    }
    
    // 商品明细的上拉加载
    $scope.loadMore = function() {
      searchGdsSpecDtl();
    };
    
    // 选择会员画面的上拉加载
    $scope.loadMoreMemb = function() {
        var cond = {phone : "", selectedMembNums : $scope.selectedMembNums};
        searchMembers(cond, $scope.pageNum.memb, true, false);
    };
    
    // 搜索画面的上拉加载
    $scope.loadMoreSearch = function() {
        var cond = {phone : $scope.searchPhone, selectedMembNums : $scope.selectedMembNums};
        searchMembers(cond, $scope.pageNum.search, false, false);
    };
    
    // 检索商品详细规格 信息
    function searchGdsSpecDtl() {
        // 取得商品详细规格 信息
        comApi.post('saleData/selectMobileGdsSpecDtl', {
            pageSize : $scope.pageSize,
            pageNum : $scope.pageNum.gdsSpecDtl + 1,
            params : {stfNum : $stateParams.stfNum,
                      saleDate : $filter("date")($stateParams.saleDate, 'yyyy-MM-dd'),
                      strNum : $stateParams.strNum,
                      kbn : "edit"}
        }, function(data) {
            $scope.moredata.gdsSpecDtl = data.hasNextPage;
            $scope.pageNum.gdsSpecDtl = data.pageNum;
            Array.prototype.push.apply($scope.submitInfo.gdsSpecList, data.list);
            $scope.$broadcast("scroll.infiniteScrollComplete");
        });
    }
    
    // 检索会员信息
    function searchMembers(cond, pageNum, isMemb, isFirstFlg) {
        // 取得会员信息
        comApi.post('saleData/selectMobileMemberList', {
            pageSize : $scope.pageSize,
            pageNum : pageNum + 1,
            params : cond
        }, function(data) {
            if (isMemb) {
                $scope.moredata.memb = data.hasNextPage;
                $scope.pageNum.memb = data.pageNum;
                if (isFirstFlg) {
                    $scope.membList = data.list;
                    $scope.$broadcast("scroll.refreshComplete");
                } else {
                    Array.prototype.push.apply($scope.membList, data.list);
                    $scope.$broadcast("scroll.infiniteScrollComplete");
                }
            } else {
                $scope.moredata.search = data.hasNextPage;
                $scope.pageNum.search = data.pageNum;
                if (isFirstFlg) {
                    $scope.searchMembList = data.list;
                    $scope.$broadcast("scroll.refreshComplete");
                } else {
                    Array.prototype.push.apply($scope.searchMembList, data.list);
                    $scope.$broadcast("scroll.infiniteScrollComplete");
                }
            }
        });
    }
    // 判断是否为空
    $scope.isEmpty = function(str) {
        if (str == "" || str == null || str == undefined) {
            return true;
        } else {
            return false;
        }
    };
    // 清除搜索栏里输入的检索
    $scope.deleteSearchPhone = function() {
        $scope.searchPhone = "";
        $scope.pageNum.search = 0;
        $scope.moredata.search = true;
        $scope.searchMembList = [];
        // 回到顶部
        $ionicScrollDelegate.$getByHandle('contentScrollSearch').scrollTop();
    };
});