app.controller('brandController', function ($scope, $controller, brandService) {

    $controller('baseController', {$scope: $scope});//继承

    $scope.searchEntity = {};
    // 分页带检索
    $scope.findPage = function (page, rows) {
        brandService.findPage(page, rows, $scope.searchEntity).success(
            function (response) {
                console.log(response);
                if (response.success) { // 得到结果集
                    $scope.list = response.queryResult.list;
                    $scope.paginationConf.totalItems = response.queryResult.total;
                }
            });
    }

    //搜索
    $scope.search = function (page, rows) {
        brandService.findPage(page, rows, $scope.searchEntity).success(
            function (response) {
                // if (response.success) {
                //     $scope.list = response.queryResult.list;
                //     $scope.paginationConf.totalItems = response.queryResult.total;// 更新总记录数
                //     $scope.num = response.queryResult.total;
                // }
                if (response.success) { // 得到结果集
                    $scope.list = response.queryResult.list;
                    $scope.paginationConf.totalItems = response.queryResult.total;
                }

                console.log(response);
            }
        );
    }
    // 新增和修改
    $scope.saveBrand = function () {
        brandService.saveBrand($scope.entity).success(function (response) {
            if (response.status) {
                $scope.reloadList();// 重新加载
            } else {
                alert(response.message);
            }
        });
    }
    // 查询
    $scope.findOne = function (id) {
        brandService.findOne(id).success(function (response) {
            $scope.entity = response;
        });
    }

    // 删除
    $scope.deleteByIds = function () {
        if ($scope.selectIds.length == 0) {
            alert("请至少选择一个删除！");
            return;
        }
        brandService.deleteByIds($scope.selectIds).success(function (response) {
            if (response.status) {
                $scope.reloadList();// 重新加载
                $scope.selectIds = [];
            } else {
                alert(response.message);
            }
        });
    }
});