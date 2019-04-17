 //控制层 
app.controller('itemCatController' ,function($scope,$controller   
		,itemCatService,typeTemplateService){	
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		itemCatService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		itemCatService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		itemCatService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=itemCatService.update( $scope.entity ); //修改  
		}else{
			$scope.entity.parentId=$scope.parentId;//赋予上级ID**
			serviceObject=itemCatService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.status){
					//重新查询 
					$scope.findByParentId($scope.parentId);
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
			return;
		}
		//获取选中的复选框			
		itemCatService.dele( $scope.selectIds ).success(
			function(response){
//				alert(JSON.stringify(response));
				if(response.status){
					$scope.findByParentId($scope.parentId);
				}else{
					alert(response.message);
				}				
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		itemCatService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	$scope.parentId=0;//记录上级ID
	//根据父节点id查询分类列表
	$scope.findByParentId=function(parentId){	
		
		$scope.parentId=parentId;//记住上级ID
		
		itemCatService.findByParentId(parentId).success(
				function(response){
					$scope.list= response;					
				}
		);				
	}
	
	// 面包屑导航窗口
	$scope.grade=1;//默认显示为1级
	// 设置等级 1 2 3 目前只有三级导航
	$scope.setGrade = function (value){
		$scope.grade=value;
	}
	 
	// 显示分类导航  p_entity：当前点击的一行记录的对象  
	$scope.selectList = function(p_entity){
		
		if ($scope.grade==1){ // 当前为1级 后面都是 “空” 
			$scope.entity_1=null;	
			$scope.entity_2=null;
		}
		if ($scope.grade==2){ // 当前为第2级 三级为 “空”
			$scope.entity_1=p_entity;	
			$scope.entity_2=null;
		}
		if ($scope.grade==3){ // 当前为第3级
			$scope.entity_2=p_entity;	
		}
		
		$scope.findByParentId(p_entity.id);	//查询此级下级列表
	}
    
	// 下拉列表显示类型模板
	$scope.selectOptionsList={data:[]};
	$scope.optionList = function(){
		typeTemplateService.optionsList().success(
				function(response){
					$scope.selectOptionsList= {data:response};					
				}
		);				
	}
	
	
});	
