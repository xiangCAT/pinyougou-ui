// 品牌服务层
app.service('brandService', function($http) {

	this.findPage = function (page,size,searchEntity) {
		var _searchEntity = JSON.stringify(searchEntity);
		// alert(_searchEntity);
        return $http.get('http://localhost:9001/brand/findPage/' + page + '/' + size);
    }


});