/**
 * Created by Administrator on 2016/8/11.
 */
$(function() {
    $(document).on("click", ".date-picker", function () {
        WdatePicker();
    });
    $(".panel").on("click", ".panel-tab-list li", function() {
        var index = $(this).index();
        $(this).addClass("active").siblings('li').removeClass("active");
        $(this).closest('.panel').find(">.panel-body .tab-pane").eq(index).show().siblings('.tab-pane').hide();
    })

    $(".panel").on("click", ".panel-title", function() {
        if ($(this).find(".caret").length) {
            var panel = $(this).closest('.panel');
            panel.hasClass('dropdown') ?
                panel.removeClass("dropdown").addClass("dropup") :
                panel.removeClass("dropup").addClass("dropdown");
        }

    })
    $(".panel").on("click", ".panel-tab-list li", function() {
        var index = $(this).index();
        $(this).addClass("active").siblings('li').removeClass("active");
        $(this).closest('.panel').find(".pane-body .tab-pane").eq(index).show().siblings('.tab-pane').hide();
    })

    $("#data-table-body").on("click", ".btn-opt-del", function() {
        var iWidth = $(this).closest('tr').width();
        var title = $(this).closest('tr').find("td:first-child").text();
        var sHtml = '<div class="opt-tips-box" style="width:' + iWidth + 'px;">' + '<div class="opt-tips-inner">' + '<p class="opt-title">' + title + '</p>' + '<div class="tips-tool">' + '<label>��ȷ��Ҫɾ��������Ϣô��</label>' + '<button class="js-del-y">��</button>' + '<button>��</button>' + '</div>' + '</div>' + '</div>'
        $(this).closest('td').append(sHtml);
    }).on("click", ".tips-tool button", function() {
        if ($(this).hasClass("js-del-y")) {
            $(this).closest('.opt-tips-inner').addClass('disappear');
            var target = $(this).closest('.opt-tips-box');
            var _this = this;
            setTimeout(function() {
                $(_this).closest('tr').remove();
                target.remove();
            }, 1000);

        } else {
            $(this).closest('.opt-tips-box').remove();
        }
    })

    $(".panel").on("click", ".panel-title", function() {
        if ($(this).find(".caret").length) {
            var panel = $(this).closest('.panel');
            panel.hasClass('dropdown') ?
                panel.removeClass("dropdown").addClass("dropup") :
                panel.removeClass("dropup").addClass("dropdown");
        }

    });
    $(".progress").each(function(){
        var curValue=$(this).attr('data-value');
        if(curValue>80){
            $(this).addClass('most-finished').removeClass('less-finished');
        }else if(curValue<50){
            $(this).addClass('less-finished').removeClass('most-finished');
        }
    });
    $('tbody').on('click','.icon-thumb',function(){
        var this_tr = $(this).closest('tr');
        var ID = this_tr.attr('data-ID'), PID = this_tr.attr('data-PID');
        this_tr.siblings('tr[data-PID="'+ID+'"]').toggle().trigger('visibleChange');
        if($(this).hasClass('icon-thumb-open')){
            $(this).removeClass('icon-thumb-open').addClass('icon-thumb-close');
        }else{
            $(this).addClass('icon-thumb-open').removeClass('icon-thumb-close');
        }
    });
    $('tbody tr').bind('visibleChange',  function(event) {
        if(!$(this).is(":visible")){
            var ID = $(this).attr('data-ID'), PID = $(this).attr('data-PID');
            $(this).siblings('tr[data-PID="'+ID+'"]').hide()
        }
    });

    $(document).on("click",".opt-label-btn.icon-opt-del",function(){
        $(this).closest('.opt-label').remove();
    })
//    删除当前行
    $("#data-table-body").on("click", ".icon-opt-del", function() {
        var iWidth = $(this).closest('tr').width();
        var title = $(this).closest('tr').find("td:first-child").text();
        var sHtml = '<div class="opt-tips-box warning" style="width:' + iWidth + 'px;">' + '<div class="opt-tips-inner">' + '<p class="opt-title">' + title + '</p>' + '<div class="tips-tool">' + '<label>您确认要删除这条信息么？</label>' + '<button class="js-del-y">是</button>' + '<button>否</button>' + '</div>' + '</div>' + '</div>'
        $(this).closest('td').append(sHtml);
    })
        .on("click", ".icon-opt-download", function() {
            var iWidth = $(this).closest('tr').width();
            var title = $(this).closest('tr').find("td:first-child").text();
            var sHtml = '<div class="opt-tips-box info" style="width:' + iWidth + 'px;">' + '<div class="opt-tips-inner">' + '<p class="opt-title">' + title + '</p>' + '<div class="tips-tool">' + '<label>您确认要下载吗？</label>' + '<button class="js-del-y">是</button>' + '<button>否</button>' + '</div>' + '</div>' + '</div>'
            $(this).closest('td').append(sHtml);
        })
        .on("click", ".tips-tool button", function() {
            if ($(this).hasClass("js-del-y")) {
                $(this).closest('.opt-tips-inner').addClass('disappear');
                var target = $(this).closest('.opt-tips-box');
                var _this = this;
                setTimeout(function() {
                    //$(_this).closest('tr').remove();
                    target.remove();
                    console.log('下载确认后！');
                }, 1000);

            } else {
                $(this).closest('.opt-tips-box').remove();
            }
        })
    //表格信息显示更多
    $("#data-table-body").on('click', '.btn-td-more', function(event) {
        var closestTr = $(this).closest('tr');
        if (closestTr.hasClass('hover')) {
            closestTr.next("tr").remove();
            closestTr.removeClass("hover");
        } else {
            closestTr.addClass('hover');
            var ss = closestTr.data("info");
            $("#td-more-tmpl").tmpl(ss).insertAfter(closestTr);
        }
    });
})
