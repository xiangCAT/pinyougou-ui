// 登录服务层
app.service('loginService', function($http) {
	this.showName = function(){
		return $http.get('../login/name.do');
	}
});