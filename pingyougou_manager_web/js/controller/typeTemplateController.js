 //控制层 
app.controller('typeTemplateController' ,function($scope,$controller,
		typeTemplateService,brandService,specificationService){	
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		typeTemplateService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		typeTemplateService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		typeTemplateService.findOne(id).success(
			function(response){
				$scope.entity=response;	
//				alert(response);
//				alert(JSON.stringify(response));
				// 将字符串转换成json对象  
				//  将json对象转换成 字符串 var string = JSON.stringify(response)
				$scope.entity.brandIds=JSON.parse($scope.entity.brandIds);//转换品牌列表
				$scope.entity.specIds=JSON.parse($scope.entity.specIds);//转换规格列表
				$scope.entity.customAttributeItems=JSON.parse($scope.entity.customAttributeItems);//转换扩展属性
				
			}
		);				
	}
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=typeTemplateService.update( $scope.entity ); //修改  
		}else{
			serviceObject=typeTemplateService.add( $scope.entity  );//增加 
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
		if ($scope.selectIds.length==0){
			alert("请至少选择一条记录删除");
			return false;
		}
		//获取选中的复选框			
		typeTemplateService.dele( $scope.selectIds ).success(
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
		typeTemplateService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	//品牌列表
//	$scope.brandList={data:[{id:1,text:'联想'},{id:2,text:'华为'},{id:3,text:'小米'}]};
	$scope.brandList={data:[]};
	$scope.brandOptionList = function(){
		brandService.selectOptionList().success(
				function(response){
					$scope.brandList= {data:response};					
				}
		);				
	}
	// 规格列表
	$scope.specList={data:[]};
	$scope.specOptionList = function(){
		specificationService.selectOptionList().success(
				function(response){
					$scope.specList= {data:response};					
				}
		);				
	}
	
	// 添加扩展属性
	$scope.addTableRow = function () {
		$scope.entity.customAttributeItems.push({});
	}
	// 删除属性
	$scope.deleTableRow = function (index) {
		$scope.entity.customAttributeItems.splice(index,1);
	}
    
});	
