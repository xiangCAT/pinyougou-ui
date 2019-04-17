app.controller('indexController', function($scope, $controller, loginService) {
	$scope.loginName = function(){
		loginService.showName().success(
			function(response){
				$scope.loginName=response.loginName;
			}
		);
	}
});