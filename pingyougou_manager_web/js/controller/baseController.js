app.controller('baseController', function($scope,$location) {
	// 重新加载列表 数据
	$scope.reloadList = function() {
		// 接收上一次分页的记录
// 		if ($location.search()['page']!=null){
// //			alert($location.search()['page']);
// 			$scope.paginationConf.currentPage = $location.search()['page'];
// 			$scope.paginationConf.itemsPerPage = $location.search()['rows'];
// 		}
		// 切换页码
		$scope.search($scope.paginationConf.currentPage,
				$scope.paginationConf.itemsPerPage);
	}
	
	// 分页控件配置 
	$scope.paginationConf = {
		currentPage : 1,
		// totalItems : 10, //22
		itemsPerPage : 10,
		perPageOptions : [ 10, 20, 30, 40, 50 ],
		onChange : function() {  // 只要上述参数中有一个参数发送改变，就会出发当前的事件
			$scope.reloadList();// 重新加载
		}
	};
	// 多选操作
	$scope.selectIds = [];
	$scope.updateSelection = function($event, id) {
		if ($event.target.checked) {
			$scope.selectIds.push(id);
		} else {
			var index = $scope.selectIds.indexOf(id);  // 如果数组中不存在当前的id 会返回-1
			$scope.selectIds.splice(index, 1);
		}
	}
	
	// json转字符串 
	$scope.jsonToString = function (jsonString,key){  
		var value = "";
		var json = JSON.parse(jsonString);
		for(var i=0;i<json.length;i++){		
			if(i>0){
				value+=",";
			}
			value+=json[i][key];
		}
		return value;
	}
	
	//  集合中 根据key查询指定的值 的对象
	$scope.searchObjectByKey = function (list,key,keyValue){
		for (var i=0; i<list.length; i++){
			if (list[i][key] == keyValue){
				return list[i];
			}
		}
		
		return null;
	}
});