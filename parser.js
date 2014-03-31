
//TODO documentation
module.exports = { 
   toUrl:function(data) {
   var urlVars = '';
   for (var name in data) {
      if(urlVars != ''){
         urlVars += '&';
      }
      urlVars += name.replace(/ /g,'+') + '=' + data[name].toString().replace(/ /g,'+');
  }
  return urlVars;
}
}
