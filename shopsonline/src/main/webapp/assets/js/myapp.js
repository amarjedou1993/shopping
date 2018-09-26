$(function() {

	// for handling CSRF token
		var token = $('meta[name="_csrf"]').attr('content');
		var header = $('meta[name="_csrf_header"]').attr('content');
		
		if((token!=undefined && header !=undefined) && (token.length > 0 && header.length > 0)) {		
			// set the token header for the ajax request
			$(document).ajaxSend(function(e, xhr, options) {			
				xhr.setRequestHeader(header,token);			
			});				
		}

	// solving active menu problem
	switch (menu) {

	case 'About Us':
		$('#about').addClass('active');
		break;

	case 'Contact':
		$('#contact').addClass('active');
		break;

	case 'All Products':
		$('#list').addClass('active');
		break;
		
	case 'User Cart':
		$('#userCart').addClass('active');
		break;

	case 'Manage Products':
		$('#manageProducts').addClass('active');
		break;

	default:
		if (menu == "Home") break;
		$('#list').addClass('active');
		$('#a_' + menu).addClass('active');
		break;
	}

	
	/*
	 * handling the click event of refresh cart button
	 * */
	$('button[name="refreshCart"]').click(function(){
		
		//fetch the cartLine id
		var cartLineId = $(this).attr('value');
		var countElement = $('#count_'+cartLineId);
		var originalCount = countElement.attr('value');
		var currentCount = countElement.val();
		
		//work only when the count changed
		if(currentCount!==originalCount){
			//console.log("current count : " + currentCount);
			//console.log("original count : " + originalCount);
			if(currentCount <1 || currentCount>3 ){
				//reverting back the original count
				//user has giving value below 1 and above 3
				countElement.val(originalCount);
				bootbox.alert({
					size : 'medium',
				    title : 'Error',
				    message : 'Product count should be minimum 1 and maximum 3'
				
				});
				
			}
			else{
				
				var updateUrl = window.context + '/cart/' + cartLineId + '/update?count=' + currentCount;
				//forward it to the controller
				window.location.href = updateUrl;
				
			}
		}
	})

	//code for jquey Datatable
	//create a dataset
	/*var products = [
		
		
		['1','ABC'],
		['2','DFG'],
		['3','HJK'],
		['4','LMN'],
		['5','OPQ'],
		['6','RST'],
		['7','VWY'],
		['8','XVY'],
		['9','ALC']
		
	];*/
	
	var $table = $('#productListTable');

	//execute this code below only when we have this table
	if ($table.length) {

		var jsonUrl = '';
		if (window.categoryId == '') {

			jsonUrl = window.context + '/json/data/all/products';
		} else {
			jsonUrl = window.context + '/json/data/category/' + window.categoryId + '/products';
		}

		//console.log('Inside the datatable');
		$table.dataTable({
			"bServerSide" : true,
			"sAjaxSource" : jsonUrl,
			"bProcessing" : false,
			// "sPaginationType": "full_numbers",
			/*lengthMenu : [ [ 3, 5, 10, -1 ], [ '3 Records', '5 Records', '10 Records', 'ALL' ] ],
			pageLength : 5,*/

			//data : products

			/*ajax : {
				
				url : jsonUrl,
				dataSrc : ''
			},*/

			"aoColumns" : [


				{
					data : 'code',
					mRender : function(data, type, row) {

						return '<img src="' + window.context + '/resources/images/' + data + '.jpg" class="dataTableImg"/>';
					}
				},
				{
					data : 'name'
				},
				{
					data : 'brand'
				},
				{
					data : 'unitPrice',
					mRender : function(data, type, row) {

						return '&#36; ' + data;
					}
				},
				{
					data : 'quantity',
					mRender : function(data, type, row) {

						if (data < 1) {
							return '<span style="color:red">Out of Stock!</span>';
						}

						return data;
					}
				},
				{
					data : 'id',
					mRender : function(data, type, row) {

						var str = '';
						str += '<a href="' + window.context + '/show/' + data + '/product" class="btn btn-primary"><span class="glyphicon glyphicon-eye-open"></span></a> &#160;';

						if (userRole == 'ADMIN') {
							str += '<a href="' + window.context + '/manage/' + data + '/product" class="btn btn-warnign"><span class="glyphicon glyphicon-pencil"></span></a>';
						} else {
							if (row.quantity < 1) {

								str += '<a href="javascript:void(0)" class="btn btn-success disabled"><span class="glyphicon glyphicon-shopping-cart"></span></a>';

							} else {
								str += '<a href="' + window.context + '/cart/add/' + data + '/product" class="btn btn-success"><span class="glyphicon glyphicon-shopping-cart"></span></a>';
							}
						}

						return str;
					}
				}

			]
		});


	}

	//dismissing the alert in 3 seconds
	var $alert = $('.alert');
	if ($alert.length) {

		setTimeout(function() {
			$alert.fadeOut('slow');
		}, 3000);
	}


	//----------


	//----------------
	//Admin DataTable 
	//----------------

	var $adminProductTable = $('#adminProductsTable');

	//execute this code below only when we have this table
	if ($adminProductTable.length) {

		var jsonUrl = window.context + '/json/data/admin/all/products';

		//console.log('Inside the datatable');
		$adminProductTable.dataTable({

			/*lengthMenu : [ [ 10, 30, 50, -1 ], [ '10 Records', '30 Records', '50 Records', 'ALL' ] ],
			pageLength : 30,
			//data : products
			
			ajax : {
				url : jsonUrl,
				dataSrc : ''
			},*/

			"bServerSide" : true,
			"sAjaxSource" : jsonUrl,
			"bProcessing" : false,
			// "sPaginationType": "full_numbers",
			/*lengthMenu : [ [ 3, 5, 10, -1 ], [ '3 Records', '5 Records', '10 Records', 'ALL' ] ],
			pageLength : 5,*/

			//data : products

			/*ajax : {
				
				url : jsonUrl,
				dataSrc : ''
			},*/

			"aoColumns" :

			//columns : 
			[

				{
					data : 'id'
				},

				{
					data : 'code',
					mRender : function(data, type, row) {

						return '<img src="' + window.context + '/resources/images/' + data + '.jpg" class="adminDataTableImg"/>';
					}
				},
				{
					data : 'name'
				},
				{
					data : 'brand'
				},

				{
					data : 'quantity',
					mRender : function(data, type, row) {

						if (data < 1) {
							return '<span style="color:red">Out of Stock!</span>';
						}

						return data;
					}
				},

				{
					data : 'unitPrice',
					mRender : function(data, type, row) {

						return '&#36; ' + data;
					}
				},
				{
					data : 'active',
					mRender : function(data, type, row) {

						var str = '';


						if (data) {

							str += '<label class="switch"><input type="checkbox" checked="checked" value="' + row.id + '" /><div class="slider"></div></label>';
						} else {

							str += '<label class="switch"><input type="checkbox" value="' + row.id + '" /><div class="slider"></div></label>';

						}


						return str;

					}
				},

				{
					data : 'id',
					mRender : function(data, type, row) {

						var str = '';
						str += '<a href="' + window.context + '/manage/' + data + '/product" class="btn btn-warning">';
						str += '<span class="glyphicon glyphicon-pencil"></span></a>';

						return str;
					}
				}

			],

			initComplete : function() {
				var api = this.api();
				api.$('.switch input[type="checkbox"]').on('change', function() {

					var checkbox = $(this);
					var checked = checkbox.prop('checked');
					var dMsg = (checked) ? 'You want to activate the product ?' :
						'You want to desactivate the product ?';

					var value = checkbox.prop('value');

					bootbox.confirm({
						size : 'meduim',
						title : 'Product Activation & Desactivation',
						message : dMsg,
						callback : function(confirmed) {

							if (confirmed) {
								console.log(value);
								bootbox.alert({
									size : 'meduim',
									title : 'Information',
									message : 'You are going to perform operation on product ' + value
								})
							} else {

								checkbox.prop('checked', !checked);
							}

						}
					});

				});

			}
		});


	}
	//------------------

	//Validation code for category
	var $categoryForm = $('#categoryForm');
	if ($categoryForm.length) {
		$categoryForm.validate({
			rules : {
				name : {
					required : true,
					minlength : 2
				},

				description : {
					required : true
				}
			},

			messages : {
				name : {
					required : 'Please add the category name!',
					minlength : 'The category length should not be less than 2 characters'
				},

				descritpion : {
					required : 'Please add the category description!'
				}
			},

			errorElement : 'em',
			errorPlacement : function(error, element) {
				//add the class of help-block
				error.addClass('help-block');
				//insert the error after the element input
				error.insertAfter(element);
			}
		});
	}
	//--------------


	//Validation code for login form
	var $loginForm = $('#loginForm');
	if ($loginForm.length) {
		$loginForm.validate({
			rules : {
				username : {
					required : true,
					email : true
				},

				password : {
					required : true
				}
			},

			messages : {
				username : {
					required : 'Please enter the username!',
					email : 'Please enter a valid email'
				},

				password : {
					required : 'Please add the password!'
				}
			},

			errorElement : 'em',
			errorPlacement : function(error, element) {
				//add the class of help-block
				error.addClass('help-block');
				//insert the error after the element input
				error.insertAfter(element);
			}
		});
	}
//---------
});