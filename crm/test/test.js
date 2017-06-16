/**
 * Created by Administrator on 2016-3-11.
 */
app.controller("myNgTable", function ($scope, $http, NgTableParams, comApi,$location) {


    //分页查询
    $scope.selectSTFBASPAGE = function(){
        comApi.post("selectSTFBASPAGE",{pageSize: 20,pageNum:0,sort:"sex desc",params:{}},function(data){
            console.log(data)
        });
    };




    //无传参获取全部 HTTP写法1
    $http({
        method: 'GET',
        url: '/CrmWeb/api/selectALL',
        data: '',
        dataType: 'test'
    }).success(function (data) {
        $scope.tableParams = new NgTableParams(
            {
                page: 1,
                count: 3
            },
            {
                counts: [3, 5, 10, 25],
                dataset: data
            })
    }).error(function (data) {
        //$scope.authError = '连接服务器失败';
    });

    //HTTP写法2 地址栏传参方式.
    $scope.selectListById = function (id) {
        comApi.setParameters("1",45646);
        $http.get("/CrmWeb/api/selectListById?id=" + id)
            .success(function (data) {
                $scope.tableParams = new NgTableParams(
                    {
                        page: 1,
                        count: 3
                    },
                    {
                        counts: [3, 5, 10, 25],
                        dataset: [data]
                    })
            })
            .error(function (data) {
                if (!data.meta.success) {
                    alert(data.meta.message)
                }
            });
    }

    //HTTP写法2 地址栏传参方式.
    $scope.selectListById2 = function (id) {
        var bbb = {};
        bbb.aaa= "1";
        comApi.setParameters("2",bbb);
        comApi.get("/CrmWeb/api/selectListById2/" + id,function (data) {
            $scope.tableParams = new NgTableParams(
                {
                    page: 1,
                    count: 3
                },
                {
                    counts: [3, 5, 10, 25],
                    dataset: [data]
                })
        });

        //$http.get("/CrmWeb/api/selectListById2/" + id)
        //    .success(function (data) {
        //        $scope.tableParams = new NgTableParams(
        //            {
        //                page: 1,
        //                count: 3
        //            },
        //            {
        //                counts: [3, 5, 10, 25],
        //                dataset: [data]
        //            })
        //    })
        //    .error(function (data) {
        //        if (!data.meta.success) {
        //            alert(data.meta.message)
        //        }
        //    });
    }

    //HTTP写法3 post方式.
    $scope.selectListById3 = function (id) {
        comApi.setParameters("3","555555555");
        comApi.post("/CrmWeb/api/selectListById3",{id: id},function(data){
            $scope.tableParams = new NgTableParams(
                {
                    page: 1,
                    count: 3
                },
                {
                    counts: [3, 5, 10, 25],
                    dataset: [data]
                })
        });
        //$http.post("/CrmWeb/api/selectListById3", {id: id})
        //    .success(function (data) {
        //        $scope.tableParams = new NgTableParams(
        //            {
        //                page: 1,
        //                count: 3
        //            },
        //            {
        //                counts: [3, 5, 10, 25],
        //                dataset: [data]
        //            })
        //    })
        //    .error(function (data) {
        //        if (!data.meta.success) {
        //            alert(data.meta.message)
        //        }
        //    });
    }

});

app.controller("myNgTableInsert", function ($scope, $http, $location,comApi) {
    //插入数据方式1
    $scope.insert1 = function () {
        $.ajax({
            type: "POST",
            url: "/CrmWeb/api/insert1",
            //提交的数据
            data: $scope.insertCun.test,
            //datatype: "html",//"xml", "html", "script", "json", "jsonp", "text".
            //在请求之前调用的函数
            beforeSend: function () {
            },
            //成功返回之后调用的函数
            success: function (data) {

            },
            //调用执行后调用的函数
            complete: function (XMLHttpRequest, textStatus) {
                alert(XMLHttpRequest.responseText);
                alert(textStatus);
            },
            //调用出错执行的函数
            error: function () {
            }
        });
    }


    //插入数据方式2
    $scope.insertCun.insert2 = function () {
        alert(comApi.getParameters("1"));
        alert(comApi.getParameters("2"));
        alert(comApi.getParameters("3"));
        comApi.post("/CrmWeb/api/insert2",$scope.insertCun.test,function(data){
            alert(data)
        });
    }

    //插入数据方式3
    $scope.insert3 = function () {
        $.ajax({
            type: "POST",
            url: "/CrmWeb/api/insert3",
            //提交的数据
            data: $scope.insertCun.test,
            //datatype: "html",//"xml", "html", "script", "json", "jsonp", "text".
            //在请求之前调用的函数
            beforeSend: function () {
            },
            //成功返回之后调用的函数
            success: function (data) {

            },
            //调用执行后调用的函数
            complete: function (XMLHttpRequest, textStatus) {
                alert(XMLHttpRequest.responseText);
                alert(textStatus);
            },
            //调用出错执行的函数
            error: function () {
            }
        });
    }
});


app.controller("myNgTableUpdateAndDelete", function ($scope, $http, $location) {
    //插入数据方式2
    $scope.updateCon.update = function () {
        $http.put("/CrmWeb/api/update", $scope.updateCon.test)
            .success(function (data) {
                alert(data)
            })
            .error(function (data) {
                if (!data.meta.success) {
                    alert(data.meta.message)
                }
            });
    }

    $scope.updateCon.delete1 = function () {

        //$http.delete("/CrmWeb/api/delete", {id:1})
        //    .success(function (data) {
        //        alert(data)
        //    })
        //    .error(function (data) {
        //        if (!data.meta.success) {
        //            alert(data.meta.message)
        //        }
        //    });

        $http({
            method: 'DELETE',
            url: '/CrmWeb/api/delete',
            data: $scope.updateCon.test,
            dataType: 'text'
        }).success(function (data) {
        }).error(function (data) {
            if (!data.meta.success) {
                alert(data.meta.message)
            }
        });



        //$.ajax({
        //    type: "DELETE",
        //    url: "/CrmWeb/api/delete",
        //    //提交的数据
        //    data: $scope.updateCon.test,
        //    //datatype: "html",//"xml", "html", "script", "json", "jsonp", "text".
        //    //在请求之前调用的函数
        //    beforeSend: function () {
        //    },
        //    //成功返回之后调用的函数
        //    success: function (data) {
        //
        //    },
        //    //调用执行后调用的函数
        //    complete: function (XMLHttpRequest, textStatus) {
        //        alert(XMLHttpRequest.responseText);
        //        alert(textStatus);
        //    },
        //    //调用出错执行的函数
        //    error: function () {
        //    }
        //});

    }

});