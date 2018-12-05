//页面加载用户信息
$(document).ready(function () {
	var addParam = {};
	$.ajax({
				cache: true,
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: 'http://127.0.0.1:8089/serviceBP/users',
				/* data:$('#userForm').serialize(),// 你的formid */
				data: JSON.stringify(addParam),
				// 你的formid
				async: false,
				success: function(result) {
				   renderData1(result.data);
				   
				}
          });

});

//页面加载拼接数据
function renderData1(data) {
    var list  = data.list;
    var html = '';
    $("#show_count").html('共有数据：'+data.total+'条');

    for ( var a in list){
        var uid = list[a].id;
        var username = list[a].username||'';
        var password = list[a].password||'';
        var enable = list[a].enable||'';
		html += '<tr f="tr" name="tr" id="tr">';
       
        html += '<td f="td" class="text-center"><input type="checkbox" f="checkbox" class="checkchild" value = "'+uid+'"></td>';
        html += '<td f="td">'+uid+ 	'</td>';
        html += '<td f="td">'+username+ 	'</td>';
		if(enable == 1){
			html += '<td f="td"><i class="effective" f="font-icon"></i></td>';
		}else{
			 html += '<td f="td"><i class="effective no-effective" f="font-icon"></i></td>';
		}
       
        html += '<td f="td">'+password+	'</td>';
		html += '<td f="td" class="text-primary"><a href="javascript:;" onclick="user_show('+ uid +')" f="a" class="mgr-sm text-primary">查看</a>|<a href="javascript:;" onclick="find_user('+ uid +')" f="a" class="mgl-sm text-primary">修改</a></td>'
     
        html += '</tr>';
    }
	

    $("#sList").html(html);
	fenye(data);
}
//用户分页信息
function fenye(data){
	$('#pageList').jqPaginator({
		totalPages: data.pages,
		visiblePages: 5,
		currentPage: data.pageNum,
		first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
		prev: '<li class="prev"><a href="javascript:void(0);">上一页</a></li>',
		next: '<li class="next"><a href="javascript:void(0);">下一页</a></li>',
		last: '<li class="last"><a href="javascript:void(0);">尾页</a></li>',
		page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
		onPageChange: function (num, type) {
			var uid = $("#userId").val();
			var uname = $("#uName").val();
			var param = {id:uid,username:uname,PAGE_NUM:num};
			if (type == 'change'){
				$.ajax({
					async: false,
					type: "POST",
					contentType: "application/json; charset=utf-8",
                    url: 'http://127.0.0.1:8089/serviceBP/users',
					data: JSON.stringify(param),
					dataType: "json",
					success: function (result) {
						if(result.message == "success"){
							renderData1(result.data);
						} else {
							alert('数据异常');
						}						
					},
					error: function () {
					}
				});
			}

		}
	});
}
