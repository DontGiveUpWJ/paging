var ExecQueue = function() {
    this.queue = [];
};
ExecQueue.prototype = {
    add : function(fn, args, time) {
        this.queue.push( {
            fn : fn,
            args : args,
            time : time
        });
    },
    exec : function() {
        var delay = 0;
        for ( var i = 0; i < this.queue.length; i++) {
            var _this=this;
            var f=function(idx){
                return function(){
                _this.queue[idx].fn.apply(_this,_this.queue[idx].args);
                }
            }(i);
            setTimeout(f, delay);
            delay += this.queue[i].time;
        }
    }
};