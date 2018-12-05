define(["jquery_page",'css!./pageing',],function(){
	/**
	 * 组件名:ajaxutil<br/> 组件功能：一个实例化分页功能组件
	 * 
	 * @exports page
	 * @author kangjy
	 * @version 1.0
	 * @class
	 * 
	 */
	
	var pageing=function(id,fn,sum,page){
		var mpage=!!page?page:10;
		var ractpage=$(id).paging(sum, { // make 1337 elements navigatable
            format: '[< nnncnnn >]', 
            perpage: mpage, // show 10 elements per page
            lapping: 0, // don't overlap pages for the moment
            page: 1, // start at page, can also be "null" or negative
            onSelect: function (page) { 
            	$("#_pageshow").html(page);
                fn(page);
            },
            onFormat: function (type) {
                switch (type) {
                    case 'block': // n and c
                        if (this.value==this.page)
                            return  '<a href="#' + this.value + '" style="background-color:#f1f1f1">' + this.value + '</a>';
                        else if(!this.active){
                            return "";
                        }else if (this.value != this.page)
                            return '<a href="#' + this.value + '">' + this.value + '</a>';
                        return '<span class="on">' + this.value + '</span>';
                    case 'next': // >
                        return '<a href="next">下一页</a>';
                    case 'prev': // <
                        return '<a href="prev">上一页</a>';
                    case 'first': // [
                        return '';
                    case 'last': // ]
                        return "<span id='_pageshow'>1</span>"+"/"+Math.ceil(sum/mpage)+"页&nbsp;&nbsp;共"+sum+"条";
                }
        }});
		ractpage.pagenum=Math.ceil(sum/mpage);
		return ractpage;
	};
	return pageing;
})