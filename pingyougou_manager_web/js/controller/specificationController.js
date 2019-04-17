 //控制层 
app.controller('specificationController' ,function($scope,$controller   ,specificationService){	
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		specificationService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		specificationService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		specificationService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}
	
	//保存   
	$scope.save=function(){				
		var serviceObject;//服务层对象  		{specification:{}, list:[]}		
		if($scope.entity.specification.id!=null){//如果有ID
			serviceObject=specificationService.update( $scope.entity ); //修改  
		}else{
			serviceObject=specificationService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.status){
					//重新查询 
		        	$scope.reloadList();//重新加载
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){		
		
		if ($scope.selectIds.length == 0) {
			alert("请至少选择一个删除！");
			return;
		}
		
		//获取选中的复选框			
		specificationService.dele( $scope.selectIds ).success(
			function(response){
				if(response.status){
					$scope.reloadList();//刷新列表
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		specificationService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	// 添加规格选项   entity  =  pojo( 规格  规格选项集合) entity = {specification:{},specificationOptionList:[] }
	$scope.addTableRow = function (){
		$scope.entity.specificationOptionList.push({});  // specificationOptionList = [{},{}]  length = 2
	}
	// 删除规格选项
	$scope.deleTableRow = function (index){
		$scope.entity.specificationOptionList.splice(index,1);
	}
	
	// 向上移动
//	$scope.removeRow = function(index){
//		var obj1 = $scope.entity.specificationOptionList[index-1];
//		var obj2 = $scope.entity.specificationOptionList[index];
//		console.log(obj1);
//		console.log(obj2);
//		var a = obj1.orders;
//		 obj1.orders = obj2.orders;
//		 obj2.orders = a;
//		 console.log("------------")
//		$scope.entity.specificationOptionList[index-1] = obj1;
//		$scope.entity.specificationOptionList[index] = obj2;
//		console.log(obj2);
//	}
    
});	
