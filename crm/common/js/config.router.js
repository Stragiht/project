'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]
    )
    .config(
        ['$stateProvider', '$urlRouterProvider','$locationProvider',
            function ($stateProvider, $urlRouterProvider, $locationProvider) {

                //$locationProvider.html5Mode(true);

                $urlRouterProvider
                    .otherwise('/system/signin');
                $stateProvider
                //app根目录
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: 'common/tpl/app.html'
                    })
                    //home 首页目录
                    .state('app.home', {
                        url: '/home',
                        templateUrl: 'system/tpl/home.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['system/js/controllers/homeController.js']);
                                }]
                        }
                    })
                    /**
                     * 商品管理开始
                     */
                    .state('app.goods', {
                        url: '/goods',
                        template: '<div ui-view></div>'
                    })
                    //商品管理-商品信息
                    .state('app.goods.gdsBas', {
                        url: '/gdsBas?isBack',
                        templateUrl: 'goods/tpl/gdsBas.html',
                        resolve: {
                            deps: ['$ocLazyLoad',

                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsBas.js']);
                                        });
                                }]
                        }
                    })
                    //商品管理-商品信息-商品信息修改
                    .state('app.goods.gdsUpdate', {
                        url: '/gdsUpdate?gdsId',
                        templateUrl: 'goods/tpl/gdsUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',

                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsUpdate.js','common/js/controllers/imgcrop.js']);
                                        });
                                }]
                        }
                    })
                    //商品管理-商品信息-发布类似商品
                    .state('app.goods.gdsAddSml', {
                        url: '/gdsAddSml?gdsId',
                        templateUrl: 'goods/tpl/gdsAddSml.html',
                        resolve: {
                            deps: ['$ocLazyLoad',

                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsAddSml.js','common/js/controllers/imgcrop.js']);
                                        });
                                }]
                        }
                    })
                    //商品管理-商品信息-新增商品
                    .state('app.goods.gdsInsert', {
                        url: '/gdsInsert?isBack',
                        templateUrl: 'goods/tpl/gdsInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',

                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsInsert.js','common/js/controllers/imgcrop.js']);
                                        });
                                }]
                        }
                    })
                    //商品管理-商品信息-新增商品-新增成功
                    .state('app.goods.gdsInsertSucc', {
                        url: '/gdsInsertSucc',
                        templateUrl: 'goods/tpl/gdsInsertSucc.html',
                        resolve: {
                            deps: ['$ocLazyLoad',

                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load([]);
                                        });
                                }]
                        }
                    })
                    //商品管理-商品批量导入
                    .state('app.goods.gdsBatImport', {
                        url: '/gdsBatImport',
                        templateUrl: 'goods/tpl/gdsBatImport.html',
                        resolve: {
                            deps: ['$ocLazyLoad',

                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsBatImport.js']);
                                        });
                                }]
                        }
                    })
                    //商品管理-商品批量修改
                    .state('app.goods.gdsBatUpdate', {
                        url: '/gdsBatUpdate?isBack',
                        templateUrl: 'goods/tpl/gdsBatUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',

                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsBatUpdate.js']);
                                        });
                                }]
                        }
                    })
                    //商品管理-商品批量修改-一个个编辑
                    .state('app.goods.gdsUpdateOneByOne', {
                        url: '/gdsUpdateOneByOne',
                        templateUrl: 'goods/tpl/gdsUpdateOneByOne.html',
                        resolve: {
                            deps: ['$ocLazyLoad',

                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable','ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsUpdateOneByOne.js','common/js/controllers/imgcrop.js']);
                                        });
                                }]
                        }
                    })
                    //商品管理-商品分类
                    .state('app.goods.gdsCls', {
                        url: '/gdsCls?isBack',
                        templateUrl: 'goods/tpl/gdsCls.html',
                        resolve: {
                            deps: ['$ocLazyLoad',

                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsCls.js']);
                                        });
                                }]
                        }
                    })

                    //商品管理-商品分类-新增商品分类
                    .state('app.goods.gdsClsInsert', {
                        url: '/gdsClsInsert',
                        templateUrl: 'goods/tpl/gdsClsInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {//common/js/controllers/imgcrop.js
                                    return $ocLazyLoad.load([ 'ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsClsInsert.js','goods/js/controllers/gdsImgcrop.js']);
                                        });
                                }]
                        }
                    })
                    //商品管理-商品分类-编辑商品分类
                    .state('app.goods.gdsClsUpdate', {
                        url: '/gdsClsUpdate?oId',
                        templateUrl: 'goods/tpl/gdsClsUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {

                                    return $ocLazyLoad.load(['ngTable', 'ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsClsUpdate.js','goods/js/controllers/gdsImgcrop.js']);
                                        });
                                }]
                        }
                    })
                    //商品管理-商品品牌
                    .state('app.goods.gdsBrd', {
                        url: '/gdsBrd?isBack',
                        templateUrl: 'goods/tpl/gdsBrd.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsBrd.js']);
                                        });
                                }]
                        }
                    })
                    //商品管理-商品品牌-新增商品品牌
                    .state('app.goods.gdsBrdIndsert', {
                        url: '/gdsBrdIndsert',
                        templateUrl: 'goods/tpl/gdsBrdIndsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {//goods/js/controllers/gdsImgcrop.js
                                    return $ocLazyLoad.load([ 'ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsBrdIndsert.js','common/js/controllers/imgcrop.js']);
                                        });
                                }]
                        }
                    })
                    //商品管理-商品品牌-编辑商品品牌
                    .state('app.goods.gdsBrdUpdate', {
                        url: '/gdsBrdUpdate?oId',
                        templateUrl: 'goods/tpl/gdsBrdUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([ 'ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsBrdUpdate.js','common/js/controllers/imgcrop.js']);
                                        });
                                }]
                        }
                    })
                    //商品管理-商品属性
                    .state('app.goods.gdsProp', {
                        url: '/gdsProp?isBack',
                        templateUrl: 'goods/tpl/gdsProp.html',
                        resolve: {
                            deps: ['$ocLazyLoad',

                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsProp.js']);
                                        });
                                }]
                        }
                    })
                    //商品管理-商品属性-新增商品属性
                    .state('app.goods.gdsPropInsert', {
                        url: '/gdsPropInsert',
                        templateUrl: 'goods/tpl/gdsPropInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsPropInsert.js']);
                                        });
                                }]
                        }
                    })
                    //商品管理-商品属性-编辑商品属性
                    .state('app.goods.gdsPropUpdate', {
                        url: '/gdsPropUpdate?oId',
                        templateUrl: 'goods/tpl/gdsPropUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(['goods/js/controllers/gdsPropUpdate.js']);
                                        });
                                }]
                        }
                    })
                    /**
                     * 商品管理结束
                     */


                    /**
                     * 会员管理开始
                     */
                    .state('app.member', {
                        url: '/member',
                        template: '<div ui-view></div>'
                    })
                    //会员管理-会员信息
                    .state('app.member.memBas', {
                        url: '/memBas?isBack',
                        templateUrl: 'member/tpl/memBas.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable','ngCsv']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memBas.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-会员信息-新增会员
                    .state('app.member.memInsert', {
                        url: '/memInsert',
                        templateUrl: 'member/tpl/memInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable', 'ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memInsert.js', 'common/js/controllers/imgcrop.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-会员信息-批量导入
                    .state('app.member.memBatImport', {
                        url: '/memBatImport',
                        templateUrl: 'member/tpl/memBatImport.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memBatImport.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-会员信息-编辑会员
                    .state('app.member.memUpdate', {
                        url: '/memUpdate?membNum',
                        templateUrl: 'member/tpl/memUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable','ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memUpdate.js', 'common/js/controllers/imgcrop.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-会员信息-查看会员
                    .state('app.member.memSelect', {
                        url: '/memSelect?membNum',
                        templateUrl: 'member/tpl/memSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable', 'ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memSelect.js', 'common/js/controllers/imgcrop.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-会员组别
                    .state('app.member.memGrp', {
                        url: '/memGrp',
                        templateUrl: 'member/tpl/memGrp.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memGrp.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-批量修改会员信息
                    .state('app.member.memBatUpdate', {
                        url: '/memBatUpdate?isBack',
                        templateUrl: 'member/tpl/memBatUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memBatUpdate.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-批量修改会员信息-统一编辑
                    .state('app.member.memBatUpdateAll', {
                        url: '/memBatUpdateAll',
                        templateUrl: 'member/tpl/memBatUpdateAll.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable','ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memBatUpdateAll.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-批量修改会员信息-一个个编辑
                    .state('app.member.memBatUpdateOneByOne', {
                        url: '/memBatUpdateOneByOne',
                        templateUrl: 'member/tpl/memBatUpdateOneByOne.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memBatUpdateOneByOne.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-补录会员购买记录
                    .state('app.member.memBuyRecSup', {
                        url: '/memBuyRecSup',
                        templateUrl: 'member/tpl/memBuyRecSup.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memBuyRecSup.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-补录会员购买记录-第二步-补录完成
                    .state('app.member.memBuyRecSupSucc', {
                        url: '/memBuyRecSupSucc',
                        templateUrl: 'member/tpl/memBuyRecSupSucc.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load([]);
                                        });
                                }]
                        }
                    })
                    //会员管理-补录会员回访记录
                    .state('app.member.memRevisitRecSup', {
                        url: '/memRevisitRecSup',
                        templateUrl: 'member/tpl/memRevisitRecSup.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memRevisitRecSup.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-补录会员回访记录-第二步-补录完成
                    .state('app.member.memRevisitRecSupSucc', {
                        url: '/memRevisitRecSupSucc',
                        templateUrl: 'member/tpl/memRevisitRecSupSucc.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load([]);
                                        });
                                }]
                        }
                    })
                    //会员管理-会员回访-ba回访任务
                    .state('app.member.memRevisitTsk', {
                        url: '/memRevisitTsk?isBack',
                        templateUrl: 'member/tpl/memRevisitTsk.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memRevisitTsk.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-会员回访-ba回访任务-查看
                    .state('app.member.memRevisitTskSelect', {
                        url: '/memRevisitTskSelect?stfNum & rtnTm & membNum',
                        templateUrl: 'member/tpl/memRevisitTskSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memRevisitTskSelect.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-会员回访-ba回访任务-指导
                    .state('app.member.memRevisitFbk', {
                        url: '/memRevisitFbk?stfNum & rtnTm & membNum',
                        templateUrl: 'member/tpl/memRevisitFbk.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memRevisitFbk.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-会员回访-ba回访记录
                    .state('app.member.memRevisitRec', {
                        url: '/memRevisitRec?isBack',
                        templateUrl: 'member/tpl/memRevisitRec.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memRevisitRec.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-会员回访-ba回访记录-查看
                    .state('app.member.memRevisitRecSelect', {
                       /* url: '/memRevisitRecSelect?stfNum & rtnTm & membNum',*/
                        url: '/memRevisitRecSelect?oId',
                        templateUrl: 'member/tpl/memRevisitRecSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memRevisitRecSelect.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-会员回访-ba回访记录-回复
                    .state('app.member.memRevisitRecReply', {
                        url: '/memRevisitRecReply?oId',
                        templateUrl: 'member/tpl/memRevisitRecReply.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memRevisitRecReply.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-会员回访-回访规则设置
                    .state('app.member.memRtnRule', {
                        url: '/memRtnRule?isBack',
                        templateUrl: 'member/tpl/memRtnRule.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memRtnRule.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-会员回访-回访规则设置-新增规则
                    .state('app.member.memRtnRuleInsert', {
                        url: '/memRtnRuleInsert',
                        templateUrl: 'member/tpl/memRtnRuleInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memRtnRuleInsert.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-会员回访-回访规则设置-编辑规则
                    .state('app.member.memRtnRuleUpdate', {
                        url: '/memRtnRuleUpdate?oId',
                        templateUrl: 'member/tpl/memRtnRuleUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memRtnRuleUpdate.js']);
                                        });
                                }]
                        }
                    })
                    //会员管理-会员回访-回访规则设置-回访事项设置
                    .state('app.member.memRtnItem', {
                        url: '/memRtnItem',
                        templateUrl: 'member/tpl/memRtnItem.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(['member/js/controllers/memRtnItem.js']);
                                        });
                                }]
                        }
                    })
                    /**
                     * 会员管理结束
                     */


                    /**
                     * 人员管理开始
                     */
                    .state('app.staff', {
                        url: '/staff',
                        template: '<div ui-view></div>'
                    })
                    //人员管理-人员信息
                    .state('app.staff.stfBas', {
                        url: '/stfBas?isBack',
                        templateUrl: 'staff/tpl/stfBas.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable','ngCsv', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfBas.js']);
                                        });
                                }]
                        }
                    })
                    //人员批量导入
                    .state('app.staff.stfBasImport', {
                        cache: false,// 禁用缓存
                        url: '/stfBasImport',
                        templateUrl: 'staff/tpl/stfBasImport.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfBasImport.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-编辑人员信息
                    .state('app.staff.stfBasUpdate', {
                        url: '/stfBasUpdate',
                        templateUrl: 'staff/tpl/stfBasUpdate.html',
                        params:{stfNum:null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable', 'ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfBasUpdate.js', 'common/js/controllers/imgcrop.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-新增人员
                    .state('app.staff.stfBasInsert', {
                        url: '/stfBasInsert',
                        templateUrl: 'staff/tpl/stfBasInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable', 'ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfBasInsert.js', 'common/js/controllers/imgcrop.js']);
                                        });
                                }]
                        }
                    })
                     //人员管理-人员查看
                    .state('app.staff.stfBasSelect', {
                        url: '/stfBasSelect',
                        templateUrl: 'staff/tpl/stfBasSelect.html',
                        params:{stfNum:null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable', 'ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfBasSelect.js', 'common/js/controllers/imgcrop.js']);
                                        });
                                }]
                        }
                    })
                    //人员批量编辑
                    .state('app.staff.stfBasAllUpdate', {
                        url: '/stfBasAllUpdate?isBack',
                        templateUrl: 'staff/tpl/stfBasAllUpdate.html',
                        params:{stfNum:null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfBasAllUpdate.js']);
                                        });
                                }]
                        }
                    })
                      //人员批量编辑-统一编辑
                    .state('app.staff.stfBasAllEditUpdate', {
                        url: '/stfBasAllEditUpdate',
                        templateUrl: 'staff/tpl/stfBasAllEditUpdate.html',
                        params:{stfNum:null,type:null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfBasAllEditUpdate.js']);
                                        });
                                }]
                        }
                    })
                        //人员批量编辑-一个个编辑
                    .state('app.staff.stfBasOneOneEditUpdate', {
                        url: '/stfBasOneOneEditUpdate',
                        templateUrl: 'staff/tpl/stfBasOneOneEditUpdate.html',
                        params:{stfNum:null,type:null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfBasOneOneEditUpdate.js']);
                                        });
                                }]
                        }
                    })
                    //城市分区信息开始
                    .state('app.staff.urbandistrictinformationSelect', {
                        url: '/urbandistrictinformationSelect?isBack',
                        params: {"pageIndex": null, "count": null, "pageCount": null},
                        templateUrl: 'staff/tpl/urbanDistrictInformationSelect.html',
                        cache: false,// 禁用缓存
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/urbanDistrictInformationSelectController.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.urbandistrictinformationUpdate', {
                        url: '/urbandistrictinformationUpdate',
                        params: {"pageIndex": null, "count": null, "pageCount": null, "partiNum": null},
                        templateUrl: 'staff/tpl/urbanDistrictInformationUpdate.html',
                        cache: false,// 禁用缓存
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/urbanDistrictInformationUpdateController.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.urbandistrictinformationInsert', {
                        url: '/urbandistrictinformationInsert',
                        templateUrl: 'staff/tpl/urbanDistrictInformationInsert.html',
                        cache: false,// 禁用缓存
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/urbanDistrictInformationInsertController.js']);
                                        });
                                }]
                        }
                    })
                    //城市分区信息结束
                    //职位管理开始
                    .state('app.staff.jobposSelect', {
                        url: '/jobposSelect?isBack',
                        cache: false,// 禁用缓存
                        templateUrl: 'staff/tpl/jobPosSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/jobPosSelectController.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.jobposInsert', {
                        url: '/jobposInsert',
                        cache: false,//禁用缓存
                        templateUrl: 'staff/tpl/jobPosInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/jobPosInsertController.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.jobposUpdate', {
                        url: '/jobposUpdate',
                        cache: false,//禁用缓存
                        templateUrl: 'staff/tpl/jobPosUpdate.html',
                        params: {posNum: null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/jobPosUpdateController.js']);
                                        });
                                }]
                        }
                    })

                    //职位管理结束
                    .state('app.staff.storesSelect', { // 销售门店信息 一览
                        url: '/storesSelect/:strType/:pageSize/:pageNum?isBack',
                        templateUrl: 'staff/tpl/storesSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/storesSelectController.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.storesInsert', { // 销售门店信息 新增
                        url: '/storesInsert/:strType/:pageSize/:pageNum',
                        templateUrl: 'staff/tpl/storesInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/storesInsertController.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.storesUpdate', { // 销售门店信息 更新
                        //url: '/storesUpdate/:strType/:pageSize/:pageNum/:strNum',
                        url: '/storesUpdate?strType & strNum ',
                        templateUrl: 'staff/tpl/storesUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/storesUpdateController.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.storesImport', { // 销售门店信息 更新
                        cache: false,// 禁用缓存
                        url: '/storesImport/:strType/:pageSize/:pageNum',
                        templateUrl: 'staff/tpl/storesImport.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/storesImportController.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-部门管理
                    .state('app.staff.depMngSelect', {
                        url: '/depMngSelect?isBack',
                        templateUrl: 'staff/tpl/depMngSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/depMngSelectController.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-部门管理-新增部门
                    .state('app.staff.depMngInsert', {
                        url: '/depMngInsert',
                        templateUrl: 'staff/tpl/depMngInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/depMngInsertController.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-部门管理-编辑部门
                    .state('app.staff.depMngUpdate', {
                        url: '/depMngUpdate',
                        templateUrl: 'staff/tpl/depMngUpdate.html',
                        params: {depNum: null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/depMngUpdateController.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.salesScheduleManage', {
                        cache: false,//禁用缓存
                        url: '/salesScheduleManage?isBack',
                        templateUrl: 'staff/tpl/salesScheduleManage.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/salesScheduleManageCol.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.salesScheduleInsert', {
                        cache: false,//禁用缓存
                        url: '/salesScheduleInsert',
                        templateUrl: 'staff/tpl/salesScheduleInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/salesScheduleInsert.js']);
                                        });
                                }]
                        }
                    }).state('app.staff.salesScheduleUpdate', {
                        cache: false,//禁用缓存
                        url: '/salesScheduleUpdate/:oid',
                        templateUrl: 'staff/tpl/salesScheduleUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/salesScheduleUpdate.js']);
                                        });
                                }]
                        }
                    })
                    //销售大区信息主页
                    .state('app.staff.majRgn', {
                        url: '/majRgn?isBack',
                        cache: false,//禁用缓存
                        templateUrl: 'staff/tpl/majRgn.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/majRgn.js']);
                                        });
                                }]
                        }
                    })
                    //新增销售大区
                    .state('app.staff.majRgnInsert', {
                        url: '/majRgnInsert',
                        cache: false,//禁用缓存
                        templateUrl: 'staff/tpl/majRgnInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/majRgnInsert.js']);
                                        });
                                }]
                        }
                    })
                    //编辑销售大区
                    .state('app.staff.majRgnUpdate', {
                        url: '/majRgnUpdate',
                        cache: false,//禁用缓存
                        params: {"subchnl": null, "majrgnnum": null},
                        templateUrl: 'staff/tpl/majRgnUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/majRgnUpdate.js']);
                                        });
                                }]
                        }
                    })

                    //考勤规则设置
                    .state('app.staff.attendRule', {
                        url: '/attendRule?isBack',
                        templateUrl: 'staff/tpl/attendrule.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/attendrule.js']);
                                        });
                                }]
                        }
                    })
                    //新增考勤规则
                    .state('app.staff.attendRuleInsert', {
                        url: '/attendRuleInsert',
                        templateUrl: 'staff/tpl/attendruleInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/attendruleInsert.js']);
                                        });
                                }]
                        }
                    })
                    //编辑考勤规则
                    .state('app.staff.attendRuleUpdate', {
                        url: '/attendRuleUpdate',
                        templateUrl: 'staff/tpl/attendruleUpdate.html',
                        params: {oId: null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/attendruleUpdate.js']);
                                        });
                                }]
                        }
                    })
                    // 入职流程
                    .state('app.staff.entryAppl', {
                        url: '/entryAppl?isBack',
                        templateUrl: 'staff/tpl/entryAppl.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/entryAppl.js']);
                                        });
                                }]
                        }
                    })
                    // 新增入职流程
                    .state('app.staff.entryApplInsert', {
                        url: '/entryApplInsert',
                        templateUrl: 'staff/tpl/entryApplInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable', 'ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/entryApplInsert.js', 'common/js/controllers/imgcrop.js']);
                                        });
                                }]
                        }
                    })
                    // 编辑入职流程
                    .state('app.staff.entryApplUpdate', {
                        url: '/entryApplUpdate',
                        templateUrl: 'staff/tpl/entryApplUpdate.html',
                        params: {entApplNum: null, updtTm: null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable', 'ngImgCrop', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/entryApplUpdate.js', 'common/js/controllers/imgcrop.js']);
                                        });
                                }]
                        }
                    })
                    // 查看入职流程
                    .state('app.staff.entryApplInfo', {
                        url: '/entryApplInfo',
                        templateUrl: 'staff/tpl/entryApplInfo.html',
                        params: {entApplNum: null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/entryApplInfo.js']);
                                        });
                                }]
                        }
                    })
                    // 审批入职流程
                    .state('app.staff.entryApplAppr', {
                        url: '/entryApplAppr',
                        templateUrl: 'staff/tpl/entryApplAppr.html',
                        params: {entApplNum: null, updtTm: null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/entryApplAppr.js']);
                                        });
                                }]
                        }
                    })

                    // 离职流程
                    .state('app.staff.dimiAppl', {
                        url: '/dimiAppl?isBack',
                        templateUrl: 'staff/tpl/dimiAppl.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/dimiAppl.js']);
                                        });
                                }]
                        }
                    })
                    // 新增离职流程
                    .state('app.staff.dimiApplInsert', {
                        url: '/dimiApplInsert',
                        templateUrl: 'staff/tpl/dimiApplInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/dimiApplInsert.js']);
                                        });
                                }]
                        }
                    })
                    // 编辑离职流程
                    .state('app.staff.dimiApplUpdate', {
                        url: '/dimiApplUpdate',
                        templateUrl: 'staff/tpl/dimiApplUpdate.html',
                        params: {dimiApplNum: null, updtTm: null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/dimiApplUpdate.js']);
                                        });
                                }]
                        }
                    })
                    // 查看入职流程
                    .state('app.staff.dimiApplInfo', {
                        url: '/dimiApplInfo',
                        templateUrl: 'staff/tpl/dimiApplInfo.html',
                        params: {dimiApplNum: null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/dimiApplInfo.js']);
                                        });
                                }]
                        }
                    })
                    // 审批离职流程
                    .state('app.staff.dimiApplAppr', {
                        url: '/dimiApplAppr',
                        templateUrl: 'staff/tpl/dimiApplAppr.html',
                        params: {dimiApplNum: null, updtTm: null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/dimiApplAppr.js']);
                                        });
                                }]
                        }
                    })


                    // BA晋升督导流程
                    .state('app.staff.baPromote', {
                        url: '/baPromote?isBack',
                        templateUrl: 'staff/tpl/baPromote.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/baPromoteController.js']);
                                        });
                                }]
                        }
                    })

                     // 新增人员晋升流程
                    .state('app.staff.baPromoteInsert', {
                        url: '/baPromoteInsert',
                        templateUrl: 'staff/tpl/baPromoteInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/baPromoteInsertController.js']);
                                        });
                                }]
                        }
                    })
                    
                    // 查看BA晋升督导流程
                    .state('app.staff.baPormoteinfo', {
                        url: '/baPormoteinfo',
                        templateUrl: 'staff/tpl/baPormoteinfo.html',
                        params: {applNum: null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/baPormoteinfoController.js']);
                                        });
                                }]
                        }
                    })
                    
                    // 审批 BA晋升督导流
                    .state('app.staff.baPormoteAppr', {
                        url: '/baPormoteAppr',
                        templateUrl: 'staff/tpl/baPormoteAppr.html',
                        params: {applNum: null,updtTm: null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/baPormoteApprController.js']);
                                        });
                                }]
                        }
                    })
                    
                    // 编辑 BA晋升督导流
                    .state('app.staff.baPromoteUpdate', {
                        url: '/baPromoteUpdate',
                        templateUrl: 'staff/tpl/baPromoteUpdate.html',
                        params: {applNum: null,updtTm: null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/baPromoteUpdateController.js']);
                                        });
                                }]
                        }
                    })
                    
                    //工资计算规则
                    .state('app.staff.wageCalculationRules', {
                        url: '/wageCalculationRules?isBack',
                        templateUrl: 'staff/tpl/wageCalculationRules.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/wageCalculationRules.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.wageCalculationRulesInsert', {
                        url: '/wageCalculationRulesInsert',
                        templateUrl: 'staff/tpl/wageCalculationRulesInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/wageCalculationRulesInsert.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.wageCalculationRulesUpdate', {
                        url: '/wageCalculationRulesUpdate/:oid',
                        templateUrl: 'staff/tpl/wageCalculationRulesUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/wageCalculationRulesUpdate.js']);
                                        });
                                }]
                        }
                    })
                    //城市底薪基数管理
                    .state('app.staff.cityBaseSalaryManagement', {
                        url: '/cityBaseSalaryManagement?isBack',
                        templateUrl: 'staff/tpl/cityBaseSalaryManagement.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/cityBaseSalaryManagement.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.cityBaseSalaryManagementInsert', {
                        url: '/cityBaseSalaryManagementInsert',
                        templateUrl: 'staff/tpl/cityBaseSalaryManagementInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/cityBaseSalaryManagementInsert.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.cityBaseSalaryManagementImport', {
                        url: '/cityBaseSalaryManagementImport',
                        templateUrl: 'staff/tpl/cityBaseSalaryManagementImport.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/cityBaseSalaryManagementImport.js']);
                                        });
                                }]
                        }
                    })
                    //职位补助标准管理
                    .state('app.staff.postSubsidyStandardManagement', {
                        url: '/postSubsidyStandardManagement?isBack',
                        templateUrl: 'staff/tpl/postSubsidyStandardManagement.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/postSubsidyStandardManagement.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.postSubsidyStandardManagementInsert', {
                        url: '/postSubsidyStandardManagementInsert',
                        templateUrl: 'staff/tpl/postSubsidyStandardManagementInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/postSubsidyStandardManagementInsert.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.postSubsidyStandardManagementUpdate', {
                        url: '/postSubsidyStandardManagementUpdate/:ruleNm',
                        templateUrl: 'staff/tpl/postSubsidyStandardManagementUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/postSubsidyStandardManagementUpdate.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-人员变动-人员借调流程
                    .state('app.staff.stfTempTransSelect', {
                        url: '/stfTempTransSelect?isBack',
                        templateUrl: 'staff/tpl/stfTempTransSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfTempTransSelectController.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.stfTempTransUpdate', {
                        cache: false,//禁用缓存
                        url: '/stfTempTransUpdate/:applNum',
                        templateUrl: 'staff/tpl/stfTempTransUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfTempTransUpdateController.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.stfTempTransInsert', {
                        url: '/stfTempTransInsert',
                        templateUrl: 'staff/tpl/stfTempTransInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfTempTransInsertController.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-人员变动-人员升降级规则
                    .state('app.staff.prmnDemnRuleManage', {
                        url: '/prmnDemnRuleManage?isBack',
                        templateUrl: 'staff/tpl/prmnDemnRuleManage.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/prmnDemnRuleManageController.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-人员变动-人员升降级规则新增
                    .state('app.staff.prmnDemnRuleInsert', {
                        url: '/prmnDemnRuleInsert',
                        templateUrl: 'staff/tpl/prmnDemnRuleInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/prmnDemnRuleInsertController.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-人员变动-人员升降级规则编辑
                    .state('app.staff.prmnDemnRuleUpdate', {
                        cache: false,//禁用缓存
                        url: '/prmnDemnRuleUpdate/:oId',
                        templateUrl: 'staff/tpl/prmnDemnRuleUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/prmnDemnRuleUpdateController.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-人员变动-人员升降级报表
                    .state('app.staff.prmnDemnMngSelect', {
                        url: '/prmnDemnMngSelect?isBack',
                        templateUrl: 'staff/tpl/prmnDemnMngSelect.html',
                        //params: {'oid': null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable', 'ngCsv']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/prmnDemnMngSelect.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-考勤管理-查看考勤报表
                    .state('app.staff.genAttendReport', {
                        url: '/genAttendReport?isBack',
                        templateUrl: 'staff/tpl/genAttendReport.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable','ngCsv']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/genAttendReport.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.genAttendReportSelect', {
                        url: '/genAttendReportSelect/:oid/:type',
                        templateUrl: 'staff/tpl/genAttendReportSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/genAttendReportSelect.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-考勤管理-审批考勤报表
                    .state('app.staff.appAttendReport', {
                        url: '/appAttendReport?isBack',
                        templateUrl: 'staff/tpl/appAttendReport.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/appAttendReport.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-考勤管理-审批考勤报表-查看
                    .state('app.staff.appAttendReportSelect', {
                        url: '/appAttendReportSelect/:oid',
                        templateUrl: 'staff/tpl/appAttendReportSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/appAttendReportSelect.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-考勤管理-审批考勤报表-编辑
                    .state('app.staff.appAttendReportEdit', {
                        url: '/appAttendReportEdit/:oid/:updtTm',
                        templateUrl: 'staff/tpl/appAttendReportEdit.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/appAttendReportEdit.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-考勤管理-审批考勤报表-审批
                    .state('app.staff.appAttendReportApp', {
                        url: '/appAttendReportApp/:oid/:updtTm',
                        templateUrl: 'staff/tpl/appAttendReportApp.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/appAttendReportApp.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-考勤管理-查看考勤报表历史
                    .state('app.staff.genAttendReportHistory', {
                        url: '/genAttendReportHistory?isBack',
                        templateUrl: 'staff/tpl/genAttendReportHistory.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable','ngCsv']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/genAttendReportHistory.js']);
                                        });
                                }]
                        }
                    })
                    
                    //人员管理-考勤管理-审批排班申请
                    .state('app.staff.baShiftMng', {
                        url: '/baShiftMng?isBack',
                        templateUrl: 'staff/tpl/baShiftMng.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/baShiftMngController.js']);
                                        });
                                }]
                        }
                    })
                    
                    //人员管理-考勤管理-查看审批排班申请
                    .state('app.staff.baShiftMngInfo', {
                        url: '/baShiftMngInfo',
                        templateUrl: 'staff/tpl/baShiftMngInfo.html',
                        params: {schNum: null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/baShiftMngInfoController.js']);
                                        });
                                }]
                        }
                    })
                    
                     //人员管理-考勤管理-审批审批排班申请
                    .state('app.staff.baShiftMngAppr', {
                        url: '/baShiftMngAppr',
                        templateUrl: 'staff/tpl/baShiftMngAppr.html',
                        params: {schNum: null,updtTm: null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/baShiftMngApprController.js']);
                                        });
                                }]
                        }
                    })
                    
                    .state('app.staff.stfSalary', {//人员管理-工资管理-生成工资报表
                        url: '/stfSalary?isBack',
                        templateUrl: 'staff/tpl/stfSalary.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable', 'ngCsv']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfSalary.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.salaryUpdate', { // 员工工资 更新
                        url: '/stfSalaryUpdateByKey/:oId',
                        templateUrl: 'staff/tpl/stfSalaryUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfSalaryUpdate.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.salarySelect', { // 员工工资 查看
                        url: '/stfSalarySelectByKey/:oId',
                        templateUrl: 'staff/tpl/stfSalarySelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfSalarySelect.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.stfSalaryHistory', { // 员工工资历史数据一览
                        url: '/stfSalaryHistory?isBack',
                        templateUrl: 'staff/tpl/stfSalaryHistory.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable', 'ngCsv']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfSalaryHistory.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.salaryHistorySelect', { // 员工工资历史数据查看
                        url: '/stfSalaryHistorySelectByKey/:oId/:applNum',
                        templateUrl: 'staff/tpl/stfSalaryHistorySelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfSalaryHistorySelect.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.stfSalaryAppl', { // 工资审批数据一览
                        url: '/stfSalaryApplInit/:status?isBack',
                        templateUrl: 'staff/tpl/stfSalaryAppl.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfSalaryAppl.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.stfSalaryApplSelect', { // 工资审批个人工资查看
                        url: '/stfSalaryApplSelect/:oId/:applNum',
                        templateUrl: 'staff/tpl/stfSalaryApplSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfSalaryApplSelect.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.stfSalaryApplAppr', { // 工资审批审批处理
                        url: '/stfSalaryApplAppr/:oIdappl/:applNumappl',
                        templateUrl: 'staff/tpl/stfSalaryApplAppr.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfSalaryApplAppr.js']);
                                        });
                                }]
                        }
                    })
                    .state('app.staff.stfSalaryApplUpdate', { // 工资审批工资编辑处理
                        url: '/stfSalaryApplUpdate/:oIdupdate/:applNumupdate',
                        templateUrl: 'staff/tpl/stfSalaryApplUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/stfSalaryApplUpdate.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-权限管理-配置用户权限
                    .state('app.staff.configRoleOfStaff', {
                        url: '/configRoleOfStaff?isBack',
                        templateUrl: 'staff/tpl/configRoleOfStaff.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/configRoleOfStaff.js']);
                                        });
                                }]
                        }
                    })
                    //权限管理___配置角色权限
                    .state('app.staff.configRolePermiss', {
                        url: '/configRolePermiss?isBack',
                        cache: false,// 禁用缓存
                        templateUrl: 'staff/tpl/configRolePermiss.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/configRolePermissController.js']);
                                        });
                                }]
                        }
                    })
                    //新增角色权限
                    .state('app.staff.roleInsert', {
                        url: '/roleInsert',
                        cache: false,// 禁用缓存
                        templateUrl: 'staff/tpl/roleInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/roleInsert.js']);
                                        });
                                }]
                        }
                    })
                    //编辑角色权限
                    .state('app.staff.roleUpdate', {
                        url: '/roleUpdate?roleId',
                        cache: false,// 禁用缓存
                        templateUrl: 'staff/tpl/roleUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/roleUpdate.js']);
                                        });
                                }]
                        }
                    })
                    //功能排序管理
                    .state('app.staff.configFuncOrder', {
                        url: '/configFuncOrder?isBack',
                        cache: false,// 禁用缓存
                        templateUrl: 'staff/tpl/configFuncOrder.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/configFuncOrderController.js']);
                                        });
                                }]
                        }
                    })
                    //人员管理-考勤管理-请假管理
                    .state('app.staff.leaveManagement', {
                        url: '/leaveManagement?isBack',
                        templateUrl: 'staff/tpl/leaveManagement.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/leaveManagement.js']);
                                        });
                                }]
                        }
                    })

                    //人员管理-考勤管理-查看请假详细
                    .state('app.staff.leaveManagementSelect', {
                        url: '/leaveManagementSelect/:oid',
                        templateUrl: 'staff/tpl/leaveManagementSelect.html',
                        //params: {'oid': null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/leaveManagementSelect.js']);
                                        });
                                }]
                        }
                    })

                    //人员管理-考勤管理-审批请假管理
                    .state('app.staff.leaveManagementDeit', {
                        url: '/leaveManagementDeit/:oid/:updtTm',
                        templateUrl: 'staff/tpl/leaveManagementDeit.html',
                        //params: {'oid': null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/leaveManagementDeit.js']);
                                        });
                                }]
                        }
                    })
                    //社保导入
                    .state('app.staff.socialSecurityBathImport', {
                        url: '/socialSecurityBathImport?isBack',
                        templateUrl: 'staff/tpl/socialSecurityBathImport.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/socialSecurityBathImport.js']);
                                        });
                                }]
                        }
                    })
                    /**
                     * 人员管理结束
                     */
                    
                    /**
                     * 法定假日补助标准管理开始
                     */
                    .state('app.staff.legalLolidays', {
                        url: '/legalLolidays?isBack',
                        templateUrl: 'staff/tpl/legalLolidays.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['staff/js/controllers/legalLolidays.js']);
                                        });
                                }]
                        }
                    })
                    /**
                     * 法定假日补助标准管理结束
                     */
                    /**
                     * 法定假日补助标准管理新增开始
                     */
                    .state('app.staff.legalLolidaysInsert', {
                      url: '/legalLolidaysInsert',
                      templateUrl: 'staff/tpl/legalLolidaysInsert.html',
                      resolve: {
                        deps: ['$ocLazyLoad',
                               function ($ocLazyLoad) {
                          return $ocLazyLoad.load('ngTable').then(
                              function () {
                                return $ocLazyLoad.load(['staff/js/controllers/legalLolidaysInsert.js']);
                              });
                        }]
                      }
                    })
                    /**
                     * 法定假日补助标准管理新增结束
                     */
                    /**
                     * 法定假日补助标准管理修改开始
                     */
                    .state('app.staff.legalLolidaysUpdate', {
                      url: '/legalLolidaysUpdate/:year',
                      templateUrl: 'staff/tpl/legalLolidaysUpdate.html',
                      resolve: {
                        deps: ['$ocLazyLoad',
                               function ($ocLazyLoad) {
                          return $ocLazyLoad.load('ngTable').then(
                              function () {
                                return $ocLazyLoad.load(['staff/js/controllers/legalLolidaysUpdate.js']);
                              });
                        }]
                      }
                    })
                    /**
                     * 法定假日补助标准管理修改结束
                     */

                    /**
                     * 统计报表开始
                     */
                    .state('app.report', {
                        url: '/report',
                        template: '<div ui-view></div>'
                    })
                    // 销售概况
                    .state('app.report.saleSummary', {
                        cache: false,
                        url: '/saleSummary?isBack',
                        templateUrl: 'report/tpl/saleSummary.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(['report/js/controllers/saleSummaryController.js']);
                                        });
                                }]
                        }
                    })
                    // 人员销售业绩汇总
                    .state('app.report.stfSaleAmountSum', {
                        cache: false,// 禁用缓存
                        url: '/stfSaleAmountSum?isBack',
                        templateUrl: 'report/tpl/stfSaleAmountSum.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable', 'ngCsv']).then(
                                        function () {
                                            return $ocLazyLoad.load(['report/js/controllers/stfSaleAmountSumController.js']);
                                        });
                                }]
                        }
                    })
                    // 查看人员销售业绩汇总
                    .state('app.report.stfSaleAmountSumView', {
                        cache: false,// 禁用缓存
                        url: '/stfSaleAmountSumView',
                        templateUrl: 'report/tpl/stfSaleAmountSumView.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['report/js/controllers/stfSaleAmountSumViewController.js']);
                                        });
                                }]
                        }
                    })
                    // 日常销售报表提交明细
                    .state('app.report.baSaleReportDtl', {
                        cache: false,// 禁用缓存
                        url: '/baSaleReportDtl?isBack',
                        templateUrl: 'report/tpl/baSaleReportDtl.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable', 'ngCsv']).then(
                                        function () {
                                            return $ocLazyLoad.load(['report/js/controllers/baSaleReportDtlController.js']);
                                        });
                                }]
                        }
                    })
                    //销售报表一览
                    .state('app.report.fcImpRepSelect', {
                        cache: false,// 禁用缓存
                        url: '/fcImpRepSelect?isBack',
                        templateUrl: 'report/tpl/fcImpRepSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['report/js/controllers/fcImpRepSelectController.js']);
                                        });
                                }]
                        }
                    })
                    //销售报表导入
                    .state('app.report.fcImpRepImport', {
                        cache: false,// 禁用缓存
                        url: '/fcImpRepImport',
                        templateUrl: 'report/tpl/fcImpRepImport.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable', 'ngFileUpload']).then(
                                        function () {
                                            return $ocLazyLoad.load(['report/js/controllers/fcImpRepImportController.js']);
                                        });
                                }]
                        }
                    })
                    //比对销售报表
                    .state('app.report.stfRptSaleInfoSelect', {
                        cache: false,// 禁用缓存
                        url: '/stfRptSaleInfoSelect?isBack',
                        templateUrl: 'report/tpl/stfRptSaleInfoSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['report/js/controllers/stfRptSaleInfoSelectController.js']);
                                        });
                                }]
                        }
                    })
                    //审批销售报表一览
                    .state('app.report.repApplSelect', {
                        cache: false,// 禁用缓存
                        url: '/repApplSelect?isBack',
                        templateUrl: 'report/tpl/repApplSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['report/js/controllers/repApplSelectController.js']);
                                        });
                                }]
                        }
                    })
                    //查看销售报表
                    .state('app.report.repApplInfoSelect', {
                        cache: false,// 禁用缓存
                        url: '/repApplInfoSelect',
                        templateUrl: 'report/tpl/repApplInfoSelect.html',
                        params:{ApplNum:null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['report/js/controllers/repApplInfoSelectController.js']);
                                        });
                                }]
                        }
                    })
                    //审批销售报表
                    .state('app.report.repApplAppr', {
                        cache: false,// 禁用缓存
                        url: '/repApplAppr',
                        templateUrl: 'report/tpl/repApplAppr.html',
                        params:{ApplNum:null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['report/js/controllers/repApplApprController.js']);
                                        });
                                }]
                        }
                    })
                    //编辑销售报表
                    .state('app.report.repApplUpdate', {
                        cache: false,// 禁用缓存
                        url: '/repApplUpdate',
                        templateUrl: 'report/tpl/repApplUpdate.html',
                        params:{ApplNum:null},
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['report/js/controllers/repApplUpdateController.js']);
                                        });
                                }]
                        }
                    })
                    // 分配督导销售业绩
                    .state('app.report.disSupSalePerfSelect', {
                        cache: false,// 禁用缓存
                        url: '/disSupSalePerfSelect?isBack',
                        templateUrl: 'report/tpl/disSupSalePerfSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['report/js/controllers/disSupSalePerfSelectController.js']);
                                        });
                                }]
                        }
                    })
                    // 分配业绩
                    .state('app.report.disSupShareSalePerf', {
                        cache: false,// 禁用缓存
                        url: '/disSupShareSalePerf/:strNum/:startTime/:endTime',
                        templateUrl: 'report/tpl/disSupShareSalePerf.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['report/js/controllers/disSupShareSalePerf.js']);
                                        });
                                }]
                        }
                    })
                    // 财务导入销售报表明细
                    .state('app.report.fcSaleReportDtl', {
                        cache: false,// 禁用缓存
                        url: '/fcSaleReportDtl?isBack',
                        templateUrl: 'report/tpl/fcSaleReportDtl.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable', 'ngCsv']).then(
                                        function () {
                                            return $ocLazyLoad.load(['report/js/controllers/fcSaleReportDtlController.js']);
                                        });
                                }]
                        }
                    })
                    /**
                     * 统计报表结束
                     */


                    /**
                     * 互动记录开始
                     */
                    .state('app.interactive', {
                        url: '/interactive',
                        template: '<div ui-view></div>'
                    })


                    //网站意见反馈一览
                    .state('app.interactive.fbkInfoSelect', {
                        url: '/fbkInfoSelect?isBack',
                        templateUrl: 'interactive/tpl/fbkInfoSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['interactive/js/controllers/fbkInfoSelectController.js']);
                                        });
                                }]
                        }
                    })
                    //网站意见反馈修改
                    .state('app.interactive.fbkInfoUpdate', {
                        url: '/fbkInfoUpdate',
                        params: {oid: null},
                        templateUrl: 'interactive/tpl/fbkInfoUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['interactive/js/controllers/fbkInfoUpdateController.js']);
                                        });
                                }]
                        }
                    })

                    //APP意见反馈
                    .state('app.interactive.appfbkInfoSelect', {
                        url: '/appfbkInfoSelect?isBack',
                        templateUrl: 'interactive/tpl/appfbkInfoSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['interactive/js/controllers/appfbkInfoSelectController.js']);
                                        });
                                }]
                        }
                    })

                    //APP意见反馈修改
                    .state('app.interactive.appfbkInfoUpdate', {
                        url: '/appfbkInfoUpdate',
                        params: {oid: null},
                        templateUrl: 'interactive/tpl/appfbkInfoUpdate.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['interactive/js/controllers/appfbkInfoUpdateController.js']);
                                        });
                                }]
                        }
                    })

                    /**
                     * 互动记录结束
                     */

                    /**
                     * 消息中心开始
                     */
                    .state('app.system', {
                        url: '/system',
                        template: '<div ui-view></div>'
                    })
                    //消息中心
                    .state('app.system.msgListSelect', {
                        url: '/msgListSelect?isBack',
                        params: {"status": null, "pageIndex": null, "count": null, "pageCount": null},
                        templateUrl: 'system/tpl/msgListSelect.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['system/js/controllers/msgListSelectController.js']);
                                        });
                                }]
                        }
                    })
                    //查看消息
                    .state('app.system.msgListInfo', {
                        url: '/msgListInfo',
                        params: {
                            "id": null,
                            "updtTm": null,
                            "status": null,
                            "curStatus": null,
                            "pageIndex": null,
                            "count": null,
                            "pageCount": null
                        },
                        templateUrl: 'system/tpl/msgListInfo.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(['system/js/controllers/msgListInfoController.js']);
                                        });
                                }]
                        }
                    })
                    /**
                     * 消息中心结束
                     */


                    /**
                     * 意见反馈开始
                     */
                    .state('app.interactive.feedBackInsert', {
                        url: '/feedBackInsert?isBack',
                        templateUrl: 'system/tpl/feedBackInsert.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['system/js/controllers/feedBackInsert.js']);
                                        });
                                }]
                        }
                    })
                    /**
                     * 意见反馈结束
                     */

                    /**
                     * 其他页面开始
                     */
                    .state('system', {
                        url: '/system',
                        template: '<div ui-view class="fade-in-right-big smooth"></div>'
                    })
                    //登陆
                    .state('system.signin', {
                        url: '/signin',
                        templateUrl: 'common/tpl/page_signin.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['common/js/controllers/signin.js']);
                                }]
                        }
                    })
                    //登出
                    .state('system.signup', {
                        url: '/signup',
                        templateUrl: 'common/tpl/page_signup.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['common/js/controllers/signup.js']);
                                }]
                        }
                    })
                    //修改密码
                    .state('system.forgotpwd', {
                        url: '/forgotpwd',
                        templateUrl: 'common/tpl/page_forgotpwd.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['common/js/controllers/forgotpwd.js']);
                                }]
                        }
                    })
                    //404页面
                    .state('system.404', {
                        url: '/404',
                        templateUrl: 'common/tpl/page_404.html'
                    })
                    //404页面
                    .state('system.test', {
                        url: '/test',
                        templateUrl: 'test/test.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['test/test.js']);
                                        });
                                }]
                        }
                    })
                    .state('system.test_validation', {
                        url: '/test_validation',
                        templateUrl: 'test/test_validation.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngTable']).then(
                                        function () {
                                            return $ocLazyLoad.load(['test/test.js']);
                                        });
                                }]
                        }
                    })

                /**
                 * 回收站
                 */
                    .state('app.recycle', {
                        url: '/recycle?isBack',
                        template: '<div ui-view></div>'
                    })
                    //部门管理
                    .state('app.recycle.rccDepMng', {
                        url: '/rccDepMng',
                        params: {"status": null, "pageIndex": null, "count": null, "pageCount": null},
                        templateUrl: 'recycle/tpl/rccDepMng.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['recycle/js/controllers/rccDepMngController.js']);
                                        });
                                }]
                        }
                    })
                    //职位管理
                    .state('app.recycle.rccJobPosMng', {
                        url: '/rccJobPosMng?isBack',
                        params: {"status": null, "pageIndex": null, "count": null, "pageCount": null},
                        templateUrl: 'recycle/tpl/rccJobPosMng.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['recycle/js/controllers/rccJobPosMngController.js']);
                                        });
                                }]
                        }
                    })
                    //销售大区信息
                    .state('app.recycle.rccMajRgn', {
                        url: '/rccMajRgn?isBack',
                        params: {"status": null, "pageIndex": null, "count": null, "pageCount": null},
                        templateUrl: 'recycle/tpl/rccMajRgn.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['recycle/js/controllers/rccMajRgnController.js']);
                                        });
                                }]
                        }
                    })
                    //城市分区信息
                    .state('app.recycle.rccUrbanDistrict', {
                        url: '/rccUrbanDistrict?isBack',
                        params: {"status": null, "pageIndex": null, "count": null, "pageCount": null},
                        templateUrl: 'recycle/tpl/rccUrbanDistrict.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['recycle/js/controllers/rccUrbanDistrictController.js']);
                                        });
                                }]
                        }
                    })
                    //销售门店信息
                    .state('app.recycle.rccStores', {
                        url: '/rccStores?isBack',
                        params: {"status": null, "pageIndex": null, "count": null, "pageCount": null},
                        templateUrl: 'recycle/tpl/rccStores.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['recycle/js/controllers/rccStoresController.js']);
                                        });
                                }]
                        }
                    })
                    //销售档期管理
                    .state('app.recycle.rccSalesSchedule', {
                        url: '/rccSalesSchedule?isBack',
                        params: {"status": null, "pageIndex": null, "count": null, "pageCount": null},
                        templateUrl: 'recycle/tpl/rccSalesSchedule.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['recycle/js/controllers/rccSalesScheduleController.js']);
                                        });
                                }]
                        }
                    })


                /**
                 * 系统设置
                 */
                .state('app.site', {
                    url: '/site?isBack',
                    template: '<div ui-view></div>'
                })
                    //数据权限设置-人员信息页面
                    .state('app.site.setStfInfoMgmt', {
                        url: '/setStfInfoMgmt',
                        params: {"status": null, "pageIndex": null, "count": null, "pageCount": null},
                        templateUrl: 'site/tpl/setStfInfoMgmt.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['site/js/controllers/setStfInfoMgmtController.js']);
                                        });
                                }]
                        }
                    })
                    //消息发送设置-操作人员信息
                    .state('app.site.setOperatorInfoMgmt', {
                        url: '/setOperatorInfoMgmt',
                        params: {"status": null, "pageIndex": null, "count": null, "pageCount": null},
                        templateUrl: 'site/tpl/setOperatorInfoMgmt.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['site/js/controllers/setOperatorInfoMgmtController.js']);
                                        });
                                }]
                        }
                    })
                    //消息发送设置-操作人员信息
                    .state('app.site.setVerMgmt', {
                        url: '/setVerMgmt',
                        params: {"status": null, "pageIndex": null, "count": null, "pageCount": null},
                        templateUrl: 'site/tpl/setVerMgmt.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngTable').then(
                                        function () {
                                            return $ocLazyLoad.load(['site/js/controllers/setVerMgmtController.js']);
                                        });
                                }]
                        }
                    })

                ;
                    /*//查看消息
                    .state('app.system.msgListInfo', {
                        url: '/msgListInfo',
                        params: {
                            "id": null,
                            "updtTm": null,
                            "status": null,
                            "pageIndex": null,
                            "count": null,
                            "pageCount": null
                        },
                        templateUrl: 'system/tpl/msgListInfo.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(['system/js/controllers/msgListInfoController.js']);
                                        });
                                }]
                        }
                    })*/
                /**
                 * 消息中心结束
                 */





                /*.state('app.recycle', {
                    url: '/forgotpwd',
                    templateUrl: 'common/tpl/page_forgotpwd.html',
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['common/js/controllers/forgotpwd.js']);
                            }]
                    }
                })*/
                /**
                 * 其他页面结束
                 */
            }

        ]
    );