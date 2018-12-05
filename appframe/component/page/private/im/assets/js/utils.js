function getarg()
{
  var url = decodeURI(window.location.href);
  var allargs = url.split("?")[1];
  var args = allargs.split("&");
  for(var i=0; i<args.length; i++)
  {
  	var arg = args[i].split("=");
  	eval('this.'+arg[0]+'="'+arg[1]+'";');
  }
}