/**
 * balanced.js v0.0.13
 */
var balanced=function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={exports:{},id:d,loaded:!1};return a[d].call(e.exports,e,e.exports,b),e.loaded=!0,e.exports}var c={};return b.m=a,b.c=c,b.p="",b(0)}([function(a,b){function c(a){if(a=a||{},!a.open)throw new Error('Balanced: please provide a "open" property');if(!a.close)throw new Error('Balanced: please provide a "close" property');if(this.balance=a.balance||!1,this.exceptions=a.exceptions||!1,this.caseInsensitive=a.caseInsensitive,this.head=a.head||a.open,this.head=Array.isArray(this.head)?this.head:[this.head],this.open=Array.isArray(a.open)?a.open:[a.open],this.close=Array.isArray(a.close)?a.close:[a.close],!Array.isArray(this.head)||!Array.isArray(this.open)||!Array.isArray(this.close)||this.head.length!==this.open.length||this.open.length!==this.close.length)throw new Error('Balanced: if you use arrays for a "head,open,close" you must use matching arrays for all options');var b=i(this.head.map(this.regExpFromArrayGroupedMap,this)),c=i(this.open.map(this.regExpFromArrayGroupedMap,this)),d=i(this.close.map(this.regExpFromArrayGroupedMap,this));this.regExp=i([b,c,d],"g"+(this.caseInsensitive?"i":"")),this.regExpGroupLength=this.head.length}function d(a,b,c){for(var d=f(b.substr(0,c+1),/^.*\n?$/gim),e=f(b,/^.*\n?$/gim),g=d.length-1,h=d.length?d[d.length-1].index:0,i=c+1-h,j="",k=2;k>=0;k--)g-k>=0&&e[g-k]&&(j+=b.substr(e[g-k].index,e[g-k].length)+"\n");for(k=0;i-1>k;k++)j+="-";for(j+="^\n",k=1;2>=k;k++)g+k>=0&&e[g+k]&&(j+=b.substr(e[g+k].index,e[g+k].length)+"\n");j=j.replace(/\t/g," ").replace(/\n$/,"");var l=new Error(a+" at "+(g+1)+":"+i+"\n\n"+j);return l.line=g+1,l.column=i,l.index=c,l}function e(a,b){return a>=b.index&&a<=b.index+b.length-1}function f(a,b){var c,d=new RegExp(b),e=[];if(a)for(;c=d.exec(a);)e.push({index:c.index,length:c[0].length,match:c[0]}),c[0].length||d.lastIndex++;return e}function g(a,b,c){for(var d=0,e=0;e<a.length;e++){var f=a[e],g=c(b.substr(f.index+d+f.head.length,f.length-f.head.length-f.tail.length),f.head,f.tail);b=b.substr(0,f.index+d)+g+b.substr(f.index+d+f.length,b.length-(f.index+d+f.length)),d+=g.length-f.length}return b}function h(a){return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}function i(a,b,c){var d=a.map(function(a){return a instanceof RegExp?a.source:h(a)},this).join("|");return d=c?"("+d+")":"(?:"+d+")",new RegExp(d,b||void 0)}function j(a,b){return a.filter(function(a){for(var c=!1,d=0;d<b.length;d++)if(e(a.index,b[d])){c=!0;break}return!c})}c.prototype={regExpFromArrayGroupedMap:function(a){return i([a],null,!0)},matchContentsInBetweenBrackets:function(a,b){for(var c,f=new RegExp(this.regExp),g=[],h=[],i=null,j=!0;c=f.exec(a);){if(b){for(var k=!1,l=0;l<b.length;l++)e(c.index,b[l])&&(k=!0);if(k)continue}var m=c.indexOf(c[0],1)-1,n=Math.floor(m/this.regExpGroupLength),o=m-Math.floor(m/this.regExpGroupLength)*this.regExpGroupLength;if(i||0!==n||this.balance&&(!this.balance||g.length)){if(1===n||0===n)g.push(o);else if(2===n){var p=g.pop();if(p===o)null!==i&&0===g.length&&(h.push({index:i.index,length:c.index+c[0].length-i.index,head:i[0],tail:c[0]}),i=null);else if(this.balance&&(j=!1,this.exceptions)){if(void 0===p)throw d("Balanced: unexpected close bracket",a,c.index);if(p!==o)throw d('Balanced: mismatching close bracket, expected "'+this.close[p]+'" but found "'+this.close[o]+'"',a,c.index)}}}else i=c,this.balance?g.push(o):g=[o]}if(this.balance){if(this.exceptions&&(!j||0!==g.length))throw d("Balanced: expected close bracket",a,a.length-1);return j&&0===g.length?h:null}return h},replaceMatchesInBetweenBrackets:function(a,b,c){var d=this.matchContentsInBetweenBrackets(a,c);return g(d,a,b)}},b.replaceMatchesInString=g,b.getRangesForMatch=f,b.isIndexInRage=e,b.rangesWithout=j,b.Balanced=c,b.replacements=function(a){a=a||{};var b=new c({head:a.head,open:a.open,close:a.close,balance:a.balance,exceptions:a.exceptions,caseInsensitive:a.caseInsensitive});if(!a.source)throw new Error('Balanced: please provide a "source" property');if("function"!=typeof a.replace)throw new Error('Balanced: please provide a "replace" function');return b.replaceMatchesInBetweenBrackets(a.source,a.replace)},b.matches=function(a){var b=new c({head:a.head,open:a.open,close:a.close,balance:a.balance,exceptions:a.exceptions,caseInsensitive:a.caseInsensitive});if(!a.source)throw new Error('Balanced: please provide a "source" property');return b.matchContentsInBetweenBrackets(a.source,a.ignore)}}]);