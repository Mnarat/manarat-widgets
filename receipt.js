/* qrcode-generator 1.4.4 — (c) Kazuhiko Arase — MIT License — https://github.com/kazuhikoarase/qrcode-generator */
var qrcode=function(){var t=function(t,r){var e=t,n=g[r],o=null,i=0,a=null,u=[],f={},c=function(t,r){o=function(t){for(var r=new Array(t),e=0;e<t;e+=1){r[e]=new Array(t);for(var n=0;n<t;n+=1)r[e][n]=null}return r}(i=4*e+17),l(0,0),l(i-7,0),l(0,i-7),s(),h(),d(t,r),e>=7&&v(t),null==a&&(a=p(e,n,u)),w(a,r)},l=function(t,r){for(var e=-1;e<=7;e+=1)if(!(t+e<=-1||i<=t+e))for(var n=-1;n<=7;n+=1)r+n<=-1||i<=r+n||(o[t+e][r+n]=0<=e&&e<=6&&(0==n||6==n)||0<=n&&n<=6&&(0==e||6==e)||2<=e&&e<=4&&2<=n&&n<=4)},h=function(){for(var t=8;t<i-8;t+=1)null==o[t][6]&&(o[t][6]=t%2==0);for(var r=8;r<i-8;r+=1)null==o[6][r]&&(o[6][r]=r%2==0)},s=function(){for(var t=B.getPatternPosition(e),r=0;r<t.length;r+=1)for(var n=0;n<t.length;n+=1){var i=t[r],a=t[n];if(null==o[i][a])for(var u=-2;u<=2;u+=1)for(var f=-2;f<=2;f+=1)o[i+u][a+f]=-2==u||2==u||-2==f||2==f||0==u&&0==f}},v=function(t){for(var r=B.getBCHTypeNumber(e),n=0;n<18;n+=1){var a=!t&&1==(r>>n&1);o[Math.floor(n/3)][n%3+i-8-3]=a}for(n=0;n<18;n+=1){a=!t&&1==(r>>n&1);o[n%3+i-8-3][Math.floor(n/3)]=a}},d=function(t,r){for(var e=n<<3|r,a=B.getBCHTypeInfo(e),u=0;u<15;u+=1){var f=!t&&1==(a>>u&1);u<6?o[u][8]=f:u<8?o[u+1][8]=f:o[i-15+u][8]=f}for(u=0;u<15;u+=1){f=!t&&1==(a>>u&1);u<8?o[8][i-u-1]=f:u<9?o[8][15-u-1+1]=f:o[8][15-u-1]=f}o[i-8][8]=!t},w=function(t,r){for(var e=-1,n=i-1,a=7,u=0,f=B.getMaskFunction(r),c=i-1;c>0;c-=2)for(6==c&&(c-=1);;){for(var g=0;g<2;g+=1)if(null==o[n][c-g]){var l=!1;u<t.length&&(l=1==(t[u]>>>a&1)),f(n,c-g)&&(l=!l),o[n][c-g]=l,-1==(a-=1)&&(u+=1,a=7)}if((n+=e)<0||i<=n){n-=e,e=-e;break}}},p=function(t,r,e){for(var n=A.getRSBlocks(t,r),o=b(),i=0;i<e.length;i+=1){var a=e[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var u=0;for(i=0;i<n.length;i+=1)u+=n[i].dataCount;if(o.getLengthInBits()>8*u)throw"code length overflow. ("+o.getLengthInBits()+">"+8*u+")";for(o.getLengthInBits()+4<=8*u&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(!1);for(;!(o.getLengthInBits()>=8*u||(o.put(236,8),o.getLengthInBits()>=8*u));)o.put(17,8);return function(t,r){for(var e=0,n=0,o=0,i=new Array(r.length),a=new Array(r.length),u=0;u<r.length;u+=1){var f=r[u].dataCount,c=r[u].totalCount-f;n=Math.max(n,f),o=Math.max(o,c),i[u]=new Array(f);for(var g=0;g<i[u].length;g+=1)i[u][g]=255&t.getBuffer()[g+e];e+=f;var l=B.getErrorCorrectPolynomial(c),h=k(i[u],l.getLength()-1).mod(l);for(a[u]=new Array(l.getLength()-1),g=0;g<a[u].length;g+=1){var s=g+h.getLength()-a[u].length;a[u][g]=s>=0?h.getAt(s):0}}var v=0;for(g=0;g<r.length;g+=1)v+=r[g].totalCount;var d=new Array(v),w=0;for(g=0;g<n;g+=1)for(u=0;u<r.length;u+=1)g<i[u].length&&(d[w]=i[u][g],w+=1);for(g=0;g<o;g+=1)for(u=0;u<r.length;u+=1)g<a[u].length&&(d[w]=a[u][g],w+=1);return d}(o,n)};f.addData=function(t,r){var e=null;switch(r=r||"Byte"){case"Numeric":e=M(t);break;case"Alphanumeric":e=x(t);break;case"Byte":e=m(t);break;case"Kanji":e=L(t);break;default:throw"mode:"+r}u.push(e),a=null},f.isDark=function(t,r){if(t<0||i<=t||r<0||i<=r)throw t+","+r;return o[t][r]},f.getModuleCount=function(){return i},f.make=function(){if(e<1){for(var t=1;t<40;t++){for(var r=A.getRSBlocks(t,n),o=b(),i=0;i<u.length;i++){var a=u[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var g=0;for(i=0;i<r.length;i++)g+=r[i].dataCount;if(o.getLengthInBits()<=8*g)break}e=t}c(!1,function(){for(var t=0,r=0,e=0;e<8;e+=1){c(!0,e);var n=B.getLostPoint(f);(0==e||t>n)&&(t=n,r=e)}return r}())},f.createTableTag=function(t,r){t=t||2;var e="";e+='<table style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: "+(r=void 0===r?4*t:r)+"px;",e+='">',e+="<tbody>";for(var n=0;n<f.getModuleCount();n+=1){e+="<tr>";for(var o=0;o<f.getModuleCount();o+=1)e+='<td style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: 0px;",e+=" width: "+t+"px;",e+=" height: "+t+"px;",e+=" background-color: ",e+=f.isDark(n,o)?"#000000":"#ffffff",e+=";",e+='"/>';e+="</tr>"}return e+="</tbody>",e+="</table>"},f.createSvgTag=function(t,r,e,n){var o={};"object"==typeof arguments[0]&&(t=(o=arguments[0]).cellSize,r=o.margin,e=o.alt,n=o.title),t=t||2,r=void 0===r?4*t:r,(e="string"==typeof e?{text:e}:e||{}).text=e.text||null,e.id=e.text?e.id||"qrcode-description":null,(n="string"==typeof n?{text:n}:n||{}).text=n.text||null,n.id=n.text?n.id||"qrcode-title":null;var i,a,u,c,g=f.getModuleCount()*t+2*r,l="";for(c="l"+t+",0 0,"+t+" -"+t+",0 0,-"+t+"z ",l+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',l+=o.scalable?"":' width="'+g+'px" height="'+g+'px"',l+=' viewBox="0 0 '+g+" "+g+'" ',l+=' preserveAspectRatio="xMinYMin meet"',l+=n.text||e.text?' role="img" aria-labelledby="'+y([n.id,e.id].join(" ").trim())+'"':"",l+=">",l+=n.text?'<title id="'+y(n.id)+'">'+y(n.text)+"</title>":"",l+=e.text?'<description id="'+y(e.id)+'">'+y(e.text)+"</description>":"",l+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',l+='<path d="',a=0;a<f.getModuleCount();a+=1)for(u=a*t+r,i=0;i<f.getModuleCount();i+=1)f.isDark(a,i)&&(l+="M"+(i*t+r)+","+u+c);return l+='" stroke="transparent" fill="black"/>',l+="</svg>"},f.createDataURL=function(t,r){t=t||2,r=void 0===r?4*t:r;var e=f.getModuleCount()*t+2*r,n=r,o=e-r;return I(e,e,function(r,e){if(n<=r&&r<o&&n<=e&&e<o){var i=Math.floor((r-n)/t),a=Math.floor((e-n)/t);return f.isDark(a,i)?0:1}return 1})},f.createImgTag=function(t,r,e){t=t||2,r=void 0===r?4*t:r;var n=f.getModuleCount()*t+2*r,o="";return o+="<img",o+=' src="',o+=f.createDataURL(t,r),o+='"',o+=' width="',o+=n,o+='"',o+=' height="',o+=n,o+='"',e&&(o+=' alt="',o+=y(e),o+='"'),o+="/>"};var y=function(t){for(var r="",e=0;e<t.length;e+=1){var n=t.charAt(e);switch(n){case"<":r+="&lt;";break;case">":r+="&gt;";break;case"&":r+="&amp;";break;case'"':r+="&quot;";break;default:r+=n}}return r};return f.createASCII=function(t,r){if((t=t||1)<2)return function(t){t=void 0===t?2:t;var r,e,n,o,i,a=1*f.getModuleCount()+2*t,u=t,c=a-t,g={"██":"█","█ ":"▀"," █":"▄","  ":" "},l={"██":"▀","█ ":"▀"," █":" ","  ":" "},h="";for(r=0;r<a;r+=2){for(n=Math.floor((r-u)/1),o=Math.floor((r+1-u)/1),e=0;e<a;e+=1)i="█",u<=e&&e<c&&u<=r&&r<c&&f.isDark(n,Math.floor((e-u)/1))&&(i=" "),u<=e&&e<c&&u<=r+1&&r+1<c&&f.isDark(o,Math.floor((e-u)/1))?i+=" ":i+="█",h+=t<1&&r+1>=c?l[i]:g[i];h+="\n"}return a%2&&t>0?h.substring(0,h.length-a-1)+Array(a+1).join("▀"):h.substring(0,h.length-1)}(r);t-=1,r=void 0===r?2*t:r;var e,n,o,i,a=f.getModuleCount()*t+2*r,u=r,c=a-r,g=Array(t+1).join("██"),l=Array(t+1).join("  "),h="",s="";for(e=0;e<a;e+=1){for(o=Math.floor((e-u)/t),s="",n=0;n<a;n+=1)i=1,u<=n&&n<c&&u<=e&&e<c&&f.isDark(o,Math.floor((n-u)/t))&&(i=0),s+=i?g:l;for(o=0;o<t;o+=1)h+=s+"\n"}return h.substring(0,h.length-1)},f.renderTo2dContext=function(t,r){r=r||2;for(var e=f.getModuleCount(),n=0;n<e;n++)for(var o=0;o<e;o++)t.fillStyle=f.isDark(n,o)?"black":"white",t.fillRect(n*r,o*r,r,r)},f};t.stringToBytes=(t.stringToBytesFuncs={default:function(t){for(var r=[],e=0;e<t.length;e+=1){var n=t.charCodeAt(e);r.push(255&n)}return r}}).default,t.createStringToBytes=function(t,r){var e=function(){for(var e=S(t),n=function(){var t=e.read();if(-1==t)throw"eof";return t},o=0,i={};;){var a=e.read();if(-1==a)break;var u=n(),f=n()<<8|n();i[String.fromCharCode(a<<8|u)]=f,o+=1}if(o!=r)throw o+" != "+r;return i}(),n="?".charCodeAt(0);return function(t){for(var r=[],o=0;o<t.length;o+=1){var i=t.charCodeAt(o);if(i<128)r.push(i);else{var a=e[t.charAt(o)];"number"==typeof a?(255&a)==a?r.push(a):(r.push(a>>>8),r.push(255&a)):r.push(n)}}return r}};var r,e,n,o,i,a=1,u=2,f=4,c=8,g={L:1,M:0,Q:3,H:2},l=0,h=1,s=2,v=3,d=4,w=5,p=6,y=7,B=(r=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],e=1335,n=7973,i=function(t){for(var r=0;0!=t;)r+=1,t>>>=1;return r},(o={}).getBCHTypeInfo=function(t){for(var r=t<<10;i(r)-i(e)>=0;)r^=e<<i(r)-i(e);return 21522^(t<<10|r)},o.getBCHTypeNumber=function(t){for(var r=t<<12;i(r)-i(n)>=0;)r^=n<<i(r)-i(n);return t<<12|r},o.getPatternPosition=function(t){return r[t-1]},o.getMaskFunction=function(t){switch(t){case l:return function(t,r){return(t+r)%2==0};case h:return function(t,r){return t%2==0};case s:return function(t,r){return r%3==0};case v:return function(t,r){return(t+r)%3==0};case d:return function(t,r){return(Math.floor(t/2)+Math.floor(r/3))%2==0};case w:return function(t,r){return t*r%2+t*r%3==0};case p:return function(t,r){return(t*r%2+t*r%3)%2==0};case y:return function(t,r){return(t*r%3+(t+r)%2)%2==0};default:throw"bad maskPattern:"+t}},o.getErrorCorrectPolynomial=function(t){for(var r=k([1],0),e=0;e<t;e+=1)r=r.multiply(k([1,C.gexp(e)],0));return r},o.getLengthInBits=function(t,r){if(1<=r&&r<10)switch(t){case a:return 10;case u:return 9;case f:case c:return 8;default:throw"mode:"+t}else if(r<27)switch(t){case a:return 12;case u:return 11;case f:return 16;case c:return 10;default:throw"mode:"+t}else{if(!(r<41))throw"type:"+r;switch(t){case a:return 14;case u:return 13;case f:return 16;case c:return 12;default:throw"mode:"+t}}},o.getLostPoint=function(t){for(var r=t.getModuleCount(),e=0,n=0;n<r;n+=1)for(var o=0;o<r;o+=1){for(var i=0,a=t.isDark(n,o),u=-1;u<=1;u+=1)if(!(n+u<0||r<=n+u))for(var f=-1;f<=1;f+=1)o+f<0||r<=o+f||0==u&&0==f||a==t.isDark(n+u,o+f)&&(i+=1);i>5&&(e+=3+i-5)}for(n=0;n<r-1;n+=1)for(o=0;o<r-1;o+=1){var c=0;t.isDark(n,o)&&(c+=1),t.isDark(n+1,o)&&(c+=1),t.isDark(n,o+1)&&(c+=1),t.isDark(n+1,o+1)&&(c+=1),0!=c&&4!=c||(e+=3)}for(n=0;n<r;n+=1)for(o=0;o<r-6;o+=1)t.isDark(n,o)&&!t.isDark(n,o+1)&&t.isDark(n,o+2)&&t.isDark(n,o+3)&&t.isDark(n,o+4)&&!t.isDark(n,o+5)&&t.isDark(n,o+6)&&(e+=40);for(o=0;o<r;o+=1)for(n=0;n<r-6;n+=1)t.isDark(n,o)&&!t.isDark(n+1,o)&&t.isDark(n+2,o)&&t.isDark(n+3,o)&&t.isDark(n+4,o)&&!t.isDark(n+5,o)&&t.isDark(n+6,o)&&(e+=40);var g=0;for(o=0;o<r;o+=1)for(n=0;n<r;n+=1)t.isDark(n,o)&&(g+=1);return e+=Math.abs(100*g/r/r-50)/5*10},o),C=function(){for(var t=new Array(256),r=new Array(256),e=0;e<8;e+=1)t[e]=1<<e;for(e=8;e<256;e+=1)t[e]=t[e-4]^t[e-5]^t[e-6]^t[e-8];for(e=0;e<255;e+=1)r[t[e]]=e;var n={glog:function(t){if(t<1)throw"glog("+t+")";return r[t]},gexp:function(r){for(;r<0;)r+=255;for(;r>=256;)r-=255;return t[r]}};return n}();function k(t,r){if(void 0===t.length)throw t.length+"/"+r;var e=function(){for(var e=0;e<t.length&&0==t[e];)e+=1;for(var n=new Array(t.length-e+r),o=0;o<t.length-e;o+=1)n[o]=t[o+e];return n}(),n={getAt:function(t){return e[t]},getLength:function(){return e.length},multiply:function(t){for(var r=new Array(n.getLength()+t.getLength()-1),e=0;e<n.getLength();e+=1)for(var o=0;o<t.getLength();o+=1)r[e+o]^=C.gexp(C.glog(n.getAt(e))+C.glog(t.getAt(o)));return k(r,0)},mod:function(t){if(n.getLength()-t.getLength()<0)return n;for(var r=C.glog(n.getAt(0))-C.glog(t.getAt(0)),e=new Array(n.getLength()),o=0;o<n.getLength();o+=1)e[o]=n.getAt(o);for(o=0;o<t.getLength();o+=1)e[o]^=C.gexp(C.glog(t.getAt(o))+r);return k(e,0).mod(t)}};return n}var A=function(){var t=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],r=function(t,r){var e={};return e.totalCount=t,e.dataCount=r,e},e={};return e.getRSBlocks=function(e,n){var o=function(r,e){switch(e){case g.L:return t[4*(r-1)+0];case g.M:return t[4*(r-1)+1];case g.Q:return t[4*(r-1)+2];case g.H:return t[4*(r-1)+3];default:return}}(e,n);if(void 0===o)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+n;for(var i=o.length/3,a=[],u=0;u<i;u+=1)for(var f=o[3*u+0],c=o[3*u+1],l=o[3*u+2],h=0;h<f;h+=1)a.push(r(c,l));return a},e}(),b=function(){var t=[],r=0,e={getBuffer:function(){return t},getAt:function(r){var e=Math.floor(r/8);return 1==(t[e]>>>7-r%8&1)},put:function(t,r){for(var n=0;n<r;n+=1)e.putBit(1==(t>>>r-n-1&1))},getLengthInBits:function(){return r},putBit:function(e){var n=Math.floor(r/8);t.length<=n&&t.push(0),e&&(t[n]|=128>>>r%8),r+=1}};return e},M=function(t){var r=a,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+2<r.length;)t.put(o(r.substring(n,n+3)),10),n+=3;n<r.length&&(r.length-n==1?t.put(o(r.substring(n,n+1)),4):r.length-n==2&&t.put(o(r.substring(n,n+2)),7))}},o=function(t){for(var r=0,e=0;e<t.length;e+=1)r=10*r+i(t.charAt(e));return r},i=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);throw"illegal char :"+t};return n},x=function(t){var r=u,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+1<r.length;)t.put(45*o(r.charAt(n))+o(r.charAt(n+1)),11),n+=2;n<r.length&&t.put(o(r.charAt(n)),6)}},o=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);if("A"<=t&&t<="Z")return t.charCodeAt(0)-"A".charCodeAt(0)+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return n},m=function(r){var e=f,n=t.stringToBytes(r),o={getMode:function(){return e},getLength:function(t){return n.length},write:function(t){for(var r=0;r<n.length;r+=1)t.put(n[r],8)}};return o},L=function(r){var e=c,n=t.stringToBytesFuncs.SJIS;if(!n)throw"sjis not supported.";!function(){var t=n("友");if(2!=t.length||38726!=(t[0]<<8|t[1]))throw"sjis not supported."}();var o=n(r),i={getMode:function(){return e},getLength:function(t){return~~(o.length/2)},write:function(t){for(var r=o,e=0;e+1<r.length;){var n=(255&r[e])<<8|255&r[e+1];if(33088<=n&&n<=40956)n-=33088;else{if(!(57408<=n&&n<=60351))throw"illegal char at "+(e+1)+"/"+n;n-=49472}n=192*(n>>>8&255)+(255&n),t.put(n,13),e+=2}if(e<r.length)throw"illegal char at "+(e+1)}};return i},D=function(){var t=[],r={writeByte:function(r){t.push(255&r)},writeShort:function(t){r.writeByte(t),r.writeByte(t>>>8)},writeBytes:function(t,e,n){e=e||0,n=n||t.length;for(var o=0;o<n;o+=1)r.writeByte(t[o+e])},writeString:function(t){for(var e=0;e<t.length;e+=1)r.writeByte(t.charCodeAt(e))},toByteArray:function(){return t},toString:function(){var r="";r+="[";for(var e=0;e<t.length;e+=1)e>0&&(r+=","),r+=t[e];return r+="]"}};return r},S=function(t){var r=t,e=0,n=0,o=0,i={read:function(){for(;o<8;){if(e>=r.length){if(0==o)return-1;throw"unexpected end of file./"+o}var t=r.charAt(e);if(e+=1,"="==t)return o=0,-1;t.match(/^\s$/)||(n=n<<6|a(t.charCodeAt(0)),o+=6)}var i=n>>>o-8&255;return o-=8,i}},a=function(t){if(65<=t&&t<=90)return t-65;if(97<=t&&t<=122)return t-97+26;if(48<=t&&t<=57)return t-48+52;if(43==t)return 62;if(47==t)return 63;throw"c:"+t};return i},I=function(t,r,e){for(var n=function(t,r){var e=t,n=r,o=new Array(t*r),i={setPixel:function(t,r,n){o[r*e+t]=n},write:function(t){t.writeString("GIF87a"),t.writeShort(e),t.writeShort(n),t.writeByte(128),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(255),t.writeByte(255),t.writeByte(255),t.writeString(","),t.writeShort(0),t.writeShort(0),t.writeShort(e),t.writeShort(n),t.writeByte(0);var r=a(2);t.writeByte(2);for(var o=0;r.length-o>255;)t.writeByte(255),t.writeBytes(r,o,255),o+=255;t.writeByte(r.length-o),t.writeBytes(r,o,r.length-o),t.writeByte(0),t.writeString(";")}},a=function(t){for(var r=1<<t,e=1+(1<<t),n=t+1,i=u(),a=0;a<r;a+=1)i.add(String.fromCharCode(a));i.add(String.fromCharCode(r)),i.add(String.fromCharCode(e));var f,c,g,l=D(),h=(f=l,c=0,g=0,{write:function(t,r){if(t>>>r!=0)throw"length over";for(;c+r>=8;)f.writeByte(255&(t<<c|g)),r-=8-c,t>>>=8-c,g=0,c=0;g|=t<<c,c+=r},flush:function(){c>0&&f.writeByte(g)}});h.write(r,n);var s=0,v=String.fromCharCode(o[s]);for(s+=1;s<o.length;){var d=String.fromCharCode(o[s]);s+=1,i.contains(v+d)?v+=d:(h.write(i.indexOf(v),n),i.size()<4095&&(i.size()==1<<n&&(n+=1),i.add(v+d)),v=d)}return h.write(i.indexOf(v),n),h.write(e,n),h.flush(),l.toByteArray()},u=function(){var t={},r=0,e={add:function(n){if(e.contains(n))throw"dup key:"+n;t[n]=r,r+=1},size:function(){return r},indexOf:function(r){return t[r]},contains:function(r){return void 0!==t[r]}};return e};return i}(t,r),o=0;o<r;o+=1)for(var i=0;i<t;i+=1)n.setPixel(i,o,e(i,o));var a=D();n.write(a);for(var u=function(){var t=0,r=0,e=0,n="",o={},i=function(t){n+=String.fromCharCode(a(63&t))},a=function(t){if(t<0);else{if(t<26)return 65+t;if(t<52)return t-26+97;if(t<62)return t-52+48;if(62==t)return 43;if(63==t)return 47}throw"n:"+t};return o.writeByte=function(n){for(t=t<<8|255&n,r+=8,e+=1;r>=6;)i(t>>>r-6),r-=6},o.flush=function(){if(r>0&&(i(t<<6-r),t=0,r=0),e%3!=0)for(var o=3-e%3,a=0;a<o;a+=1)n+="="},o.toString=function(){return n},o}(),f=a.toByteArray(),c=0;c<f.length;c+=1)u.writeByte(f[c]);return u.flush(),"data:image/gif;base64,"+u};return t}();qrcode.stringToBytesFuncs["UTF-8"]=function(t){return function(t){for(var r=[],e=0;e<t.length;e++){var n=t.charCodeAt(e);n<128?r.push(n):n<2048?r.push(192|n>>6,128|63&n):n<55296||n>=57344?r.push(224|n>>12,128|n>>6&63,128|63&n):(e++,n=65536+((1023&n)<<10|1023&t.charCodeAt(e)),r.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n))}return r}(t)},function(t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports&&(module.exports=t())}(function(){return qrcode});
/* ============================================================
   MN-RECEIPT v1 — «تحميل الإيصال» + صفحة التحقق (منارات) — 2026-11-25
   يعمل في صفحات: /o/<رمز>/inv و /order-completed/<رمز>/invoice و /orders/<رمز>/invoice
   وأي صفحة + #receipt=XXXX-XXXX (صفحة التحقق)
   السكربت: «إيصالات منارات» (يتأكد من الدفع ويعطي البيانات فقط). الرسم هنا في المتصفح بالتصميم المعتمد H12b / H12.
   الإيقاف السريع: RECEIPT_ON=0 في شيت «إيصالات منارات».
   ============================================================ */
(function () {
  'use strict';
  if (window.MNReceipt) return;
  var API = 'https://script.google.com/macros/s/AKfycbws9bcPh3ahR1U-qY_c2VgXbx-R3rl5HMC7nvIw7BUs8DqNt7oxPugvlal3tpfc5YSa/exec';
  var NAVY = '#052560', INK2 = '#3A4247', LINE = '#E1E3E3', TEAL = '#00B5A7';
  var ME = (document.currentScript && document.currentScript.src) || '';
  if (!ME) { var sc = document.querySelector('script[src*="receipt.js"]'); ME = sc ? sc.src : ''; }
  var BASE = ME.replace(/[^\/]*$/, '');
  var ORG = 'جمعية منارات مكة للعناية بالمساجد';
  var LIC = 'مسجلة لدى المركز الوطني لتنمية القطاع غير الربحي برقم 1000593700';
  var ERR = {
    not_paid: 'لم يكتمل الدفع لهذا التبرع بعد.', bad_order: 'رابط التبرع غير صحيح.', locked: 'محاولات كثيرة. حاول بعد ساعة.',
    paused: 'الإيصالات متوقفة مؤقتاً. حاول لاحقاً.', net: 'تعذّر الاتصال. تأكد من الإنترنت ثم أعد المحاولة.', server: 'حدث خطأ. أعد المحاولة بعد قليل.'
  };

  /* ---------- أدوات ---------- */
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function post(body) {
    return fetch(API, {method: 'POST', body: JSON.stringify(body)}).then(function (r) { return r.json(); });
  }
  function orderFromPath(p) {
    var m = String(p || '').match(/\/(?:o\/([A-Za-z0-9]{6,24})\/inv|(?:order-completed|orders)\/([A-Za-z0-9]{6,24})\/invoice)/);
    return m ? (m[1] || m[2]) : '';
  }
  function fmtAmt(a) { a = Number(a) || 0; return (Math.round(a * 100) % 100) ? a.toFixed(2) : String(Math.round(a)); }

  /* التاريخ: من created_at (UTC) إلى توقيت الرياض */
  var MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  function riyadh(iso) {
    var m = String(iso || '').match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
    if (!m) return null;
    return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) + 3 * 3600e3); // نقرأ بـ getUTC*
  }
  function gregText(d) {
    var h = d.getUTCHours(), mi = d.getUTCMinutes(), ap = h < 12 ? 'ص' : 'م', h12 = h % 12 || 12;
    return d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear() + ' – ' + h12 + ':' + (mi < 10 ? '0' : '') + mi + ' ' + ap;
  }
  function hijriText(d) {
    try {
      var f = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'});
      var s = f.format(d).replace(/\s*هـ$/, '').trim();
      return /\d{4}/.test(s) ? s + 'هـ' : '';
    } catch (e) { return ''; }
  }
  function dateParts(r) {
    var d = riyadh(r.iso);
    if (d) return {g: gregText(d), h: hijriText(d)};
    return {g: String(r.date || '').replace('|', '–'), h: ''};
  }

  /* المبلغ كتابةً (ريالات صحيحة حتى 999,999 + هللات) */
  var ONES = ['','واحد','اثنان','ثلاثة','أربعة','خمسة','ستة','سبعة','ثمانية','تسعة','عشرة','أحد عشر','اثنا عشر','ثلاثة عشر','أربعة عشر','خمسة عشر','ستة عشر','سبعة عشر','ثمانية عشر','تسعة عشر'];
  var TENS = ['','','عشرون','ثلاثون','أربعون','خمسون','ستون','سبعون','ثمانون','تسعون'];
  var HUND = ['','مئة','مئتان','ثلاثمئة','أربعمئة','خمسمئة','ستمئة','سبعمئة','ثمانمئة','تسعمئة'];
  function below1000(n) {
    var h = Math.floor(n / 100), r = n % 100, p = [];
    if (h) p.push(HUND[h]);
    if (r) {
      if (r < 20) p.push(ONES[r]);
      else { var o = r % 10, t = Math.floor(r / 10); p.push(o ? ONES[o] + ' و' + TENS[t] : TENS[t]); }
    }
    return p.join(' و');
  }
  function riyalWord(n) {           // تمييز العدد
    var r = n % 100;
    if (n === 1) return 'ريال سعودي';
    if (n === 2) return 'ريالان سعوديان';
    if (r >= 3 && r <= 10) return 'ريالات سعودية';
    return 'ريال سعودي';
  }
  function words(a) {
    a = Math.round((Number(a) || 0) * 100);
    var n = Math.floor(a / 100), hl = a % 100, s = '';
    if (n === 0) s = 'صفر';
    else if (n === 1) s = '';
    else if (n === 2) s = '';
    else {
      var th = Math.floor(n / 1000), rest = n % 1000, p = [];
      if (th) {
        if (th === 1) p.push('ألف');
        else if (th === 2) p.push('ألفان');
        else if (th >= 3 && th <= 10) p.push(below1000(th) + ' آلاف');
        else p.push(below1000(th) + ' ألف');
      }
      if (rest) p.push(below1000(rest));
      s = p.join(' و');
    }
    var out = (n === 1 ? 'ريال سعودي واحد' : n === 2 ? 'ريالان سعوديان' : s + ' ' + riyalWord(n));
    if (hl) out += ' و' + below1000(hl) + ' ' + (hl >= 3 && hl <= 10 ? 'هللات' : 'هللة');
    return out + ' فقط';
  }

  /* ---------- الخطوط والصور ---------- */
  var assets = null;
  function loadAssets() {
    if (assets) return assets;
    var fonts = [
      ['MNRT', 'fonts/Tajawal-Regular.ttf', '400'], ['MNRT', 'fonts/Tajawal-Bold.ttf', '700'],
      ['MNRT', 'fonts/Tajawal-ExtraBold.ttf', '800'], ['MNRA', 'fonts/Amiri-Bold-dua.ttf', '700']
    ].map(function (f) {
      var ff = new FontFace(f[0], 'url(' + BASE + f[1] + ')', {weight: f[2]});
      return ff.load().then(function (x) { document.fonts.add(x); });
    });
    var logo = new Promise(function (ok, no) { var i = new Image(); i.crossOrigin = 'anonymous'; i.onload = function () { ok(i); }; i.onerror = no; i.src = BASE + 'img/receipt/logo.png'; });
    var wm = new Promise(function (ok) { var i = new Image(); i.crossOrigin = 'anonymous'; i.onload = function () { ok(i); }; i.onerror = function () { ok(null); }; i.src = BASE + 'img/receipt/logo-wm.png'; });
    assets = Promise.all([Promise.all(fonts), logo, wm]).then(function (r) { return {logo: r[1], wm: r[2]}; });
    assets.catch(function () { assets = null; });
    return assets;
  }

  /* ---------- رمز QR ---------- */
  function qrCanvas(text, size) {
    var q = qrcode(0, 'M'); q.addData(text); q.make();
    var n = q.getModuleCount(), quiet = 0, cv = document.createElement('canvas'), cell = size / (n + quiet * 2);
    cv.width = cv.height = size; var c = cv.getContext('2d');
    c.fillStyle = '#fff'; c.fillRect(0, 0, size, size); c.fillStyle = NAVY;
    for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) if (q.isDark(r, k)) c.fillRect(Math.floor((k + quiet) * cell), Math.floor((r + quiet) * cell), Math.ceil(cell), Math.ceil(cell));
    return cv;
  }

  /* ---------- الرسم ---------- */
  // يرسم الإيصال بالتخطيط المعتمد. kind: 'sq' (1080×1080) أو 'a5' (1080×1532)
  function draw(kind, d, A, scale) {
    var S = kind === 'sq' ? {
      W:1080, H:1080, pad:48, h1:44, org:30, amtTop:4, amtL:32, amtN:92, amtU:42, wTop:2, wSize:30, barT:20, barB:16,
      rowPad:14, lab:28, val:36, sub:28, duaM:20, dua:34, ln:28, ct:30, ctT:8, ln2T:6, qr:0, hg:44, wmW:620
    } : {
      W:1080, H:1532, pad:88, h1:52, org:30, amtTop:24, amtL:36, amtN:160, amtU:56, wTop:10, wSize:34, barT:28, barB:28,
      rowPad:18, lab:30, val:40, sub:30, duaM:28, dua:40, ln:28, ct:30, ctT:12, ln2T:12, qr:152, hg:66, wmW:760
    };
    scale = scale || 1;
    var cv = document.createElement('canvas'); cv.width = S.W * scale; cv.height = S.H * scale;
    var c = cv.getContext('2d'); c.scale(scale, scale);
    c.fillStyle = '#fff'; c.fillRect(0, 0, S.W, S.H);
    c.direction = 'rtl'; c.textBaseline = 'alphabetic';

    function font(sz, w, fam) { c.font = (w || 400) + ' ' + sz + 'px ' + (fam || 'MNRT') + ', Tahoma, sans-serif'; }
    function asc(sz) { var m = c.measureText('إيصال'); return {a: m.fontBoundingBoxAscent || sz * 0.95, d: m.fontBoundingBoxDescent || sz * 0.35}; }
    // يكتب سطراً داخل صندوق ارتفاعه lh*sz ويرجع الارتفاع
    function line(txt, x, top, sz, w, color, lh, align, fam) {
      font(sz, w, fam); c.fillStyle = color; c.textAlign = align || 'right';
      var m = asc(sz), boxH = sz * lh, y = top + (boxH - (m.a + m.d)) / 2 + m.a;
      c.fillText(txt, x, y); return boxH;
    }
    function width(txt, sz, w, fam) { font(sz, w, fam); return c.measureText(txt).width; }

    /* الشعار خلفية خفيفة في منتصف الإيصال (الفراغ فوقه = الفراغ تحته) */
    if (A.wm) {
      var ww = S.wmW, wh = Math.round(A.wm.naturalHeight * ww / A.wm.naturalWidth);
      c.globalAlpha = 0.04; c.drawImage(A.wm, (S.W - ww) / 2, (S.H - wh) / 2, ww, wh); c.globalAlpha = 1;
    }

    var P = S.pad, W = S.W, y = P;

    /* الرأس: الشعار يميناً، QR يساراً، والعنوان في الوسط */
    var lw = 195, lh = Math.round(A.logo.naturalHeight * lw / A.logo.naturalWidth);
    c.drawImage(A.logo, W - P - lw, y, lw, lh);
    var labW = width('امسح للتحقق', 28, 700), qs = S.qr || Math.round(labW), labSz = S.qr ? 28 * qs / labW : 28;
    var qcv = qrCanvas('https://mmcm.sa/#receipt=' + d.v.slice(0, 4) + '-' + d.v.slice(4), qs * 2);
    c.drawImage(qcv, P, y, qs, qs);
    var qrBlockH = qs + 8 + line('امسح للتحقق', P + qs / 2, y + qs + 8, labSz, 700, NAVY, 1.2, 'center');
    var hdH = Math.max(lh, qrBlockH), HG = S.hg;  // HG: أقل فراغ بين العنوان وبين الشعار ورمز QR
    var midL = P + qs + HG, midR = W - P - lw - HG, midC = (midL + midR) / 2, midW = midR - midL;
    var t1 = S.h1, t2 = S.org;                     // نصغّر العنوان قليلاً إن لم يتسع (بحد أدنى)
    while (t1 > 34 && width('إيصال تبرع إلكتروني', t1, 800) > midW) t1 -= 2;
    while (t2 > 26 && width(ORG, t2, 700) > midW) t2 -= 1;
    var midH = t1 * 1.2 + 6 + t2 * 1.35, my = y + (lh - midH) / 2;   // في منتصف ارتفاع الشعار
    my += line('إيصال تبرع إلكتروني', midC, my, t1, 800, NAVY, 1.2, 'center') + 6;
    line(ORG, midC, my, t2, 700, INK2, 1.35, 'center');
    y += hdH + S.amtTop;

    /* المبلغ */
    var nTxt = fmtAmt(d.amt), gap = 18;
    var wl = width('المبلغ', S.amtL, 700), wn = width(nTxt, S.amtN, 800), wu = width('ريال', S.amtU, 800);
    var tot = wl + wn + wu + gap * 2, xr = W / 2 + tot / 2;
    font(S.amtN, 800); var mN = asc(S.amtN), base = y + (S.amtN - (mN.a + mN.d)) / 2 + mN.a;
    c.textAlign = 'right';
    font(S.amtL, 700); c.fillStyle = INK2; c.fillText('المبلغ', xr, base);
    font(S.amtN, 800); c.fillStyle = NAVY; c.direction = 'ltr'; c.textAlign = 'right'; c.fillText(nTxt, xr - wl - gap, base); c.direction = 'rtl';
    font(S.amtU, 800); c.textAlign = 'right'; c.fillText('ريال', xr - wl - gap - wn - gap, base);
    y += S.amtN + S.wTop;
    y += line(words(d.amt), W / 2, y, S.wSize, 700, NAVY, 1.25, 'center');

    /* الخط الفيروزي */
    y += S.barT; c.fillStyle = TEAL; roundRect(c, W / 2 - 70, y, 140, 5, 2.5); c.fill(); y += 5 + S.barB;

    /* الصفوف */
    var dp = dateParts(d), colW = (W - 2 * P - 40) / 2, xR = W - P, xL = P + colW;
    var gift = d.gift && d.gift.to ? d.gift : null;
    var rows = kind === 'sq' ? [
      [['رقم الإيصال', d.n], ['الرقم المرجعي للعملية', d.ref || '—']],
      [['التاريخ والوقت', dp.g, dp.h], ['طريقة الدفع', d.pay || '—']],
      [['اسم المتبرع', d.name], ['المشروع', d.proj]]
    ] : [
      [['رقم الإيصال', d.n], ['الرقم المرجعي للعملية', d.ref || '—']],
      [['التاريخ والوقت', dp.g, dp.h]],
      [['اسم المتبرع', d.name], ['المشروع', d.proj]],
      gift ? [['طريقة الدفع', d.pay || '—'], [gift.mourn ? 'صدقة عن' : 'إهداء إلى', gift.to]] : [['طريقة الدفع', d.pay || '—']]
    ];
    rows.forEach(function (row) {
      var top = y + S.rowPad, hMax = 0, one = row.length === 1;
      row.forEach(function (cell, i) {
        var x = one ? W / 2 : (i === 0 ? xR : P), al = one ? "center" : (i === 0 ? "right" : "left"), h = 0;
        h += line(cell[0], x, top + h, S.lab, 400, INK2, 1.2, al);
        h += 9; h += line(fit(cell[1], S.val, 800, one ? W - 2 * P : colW), x, top + h, S.val, 800, NAVY, 1.25, al);
        if (cell[2]) { h += 5; h += line(cell[2], x, top + h, S.sub, 400, INK2, 1.25, al); }
        hMax = Math.max(hMax, h);
      });
      y = top + hMax + S.rowPad;
      c.fillStyle = LINE; c.fillRect(P, y, W - 2 * P, 2); y += 2;
    });
    function fit(t, sz, w, maxW) {   // يختصر النص الطويل حتى لا يتجاوز العمود
      t = String(t == null ? '' : t); if (width(t, sz, w) <= maxW) return t;
      while (t.length > 1 && width(t + '…', sz, w) > maxW) t = t.slice(0, -1);
      return t + '…';
    }

    /* الدعاء */
    y += S.duaM;
    line('تقبّل الله منك، وجعله في ميزان حسناتك.', W / 2, y, S.dua, 700, NAVY, 1.4, 'center', 'MNRA');

    /* التذييل مثبت في الأسفل */
    var foot = kind === 'sq'
      ? [[LIC, S.ln, 400, INK2, 0], ['0555 43 8678 · mmcm.sa', S.ct, 800, NAVY, S.ctT, 1], ['لا يحتاج توقيعاً ولا ختماً', S.ln, 400, INK2, S.ln2T]]
      : [[LIC, S.ln, 400, INK2, 0], ['0555 43 8678 · mmcm.sa · info@mmcm.org.sa', S.ct, 800, NAVY, S.ctT, 1], ['إيصال إلكتروني لا يحتاج توقيعاً ولا ختماً', S.ln, 400, INK2, S.ln2T]];
    var fh = foot.reduce(function (s, f) { return s + f[4] + f[1] * 1.3; }, 0), fy = S.H - P - fh;
    foot.forEach(function (f) { fy += f[4]; if (f[5]) c.direction = 'ltr'; fy += line(f[0], W / 2, fy, f[1], f[2], f[3], 1.3, 'center'); c.direction = 'rtl'; });
    return cv;
  }
  function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

  /* ---------- PDF بصفحة A5 فيها صورة الإيصال ---------- */
  function pdfFromJpeg(jpeg, pxW, pxH) {
    var W = 419.53, H = 595.28, enc = new TextEncoder(), parts = [], off = 0, xref = [];
    function add(x) { var b = typeof x === 'string' ? enc.encode(x) : x; parts.push(b); off += b.length; }
    function obj(n, body) { xref[n] = off; add(n + ' 0 obj\n'); body(); add('\nendobj\n'); }
    add('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    obj(1, function () { add('<< /Type /Catalog /Pages 2 0 R >>'); });
    obj(2, function () { add('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'); });
    obj(3, function () { add('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W + ' ' + H + '] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>'); });
    var cs = 'q ' + W + ' 0 0 ' + H + ' 0 0 cm /Im0 Do Q';
    obj(4, function () { add('<< /Length ' + cs.length + ' >>\nstream\n' + cs + '\nendstream'); });
    obj(5, function () { add('<< /Type /XObject /Subtype /Image /Width ' + pxW + ' /Height ' + pxH + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpeg.length + ' >>\nstream\n'); add(jpeg); add('\nendstream'); });
    var xo = off, s = 'xref\n0 6\n0000000000 65535 f \n';
    for (var i = 1; i <= 5; i++) s += String(xref[i]).padStart(10, '0') + ' 00000 n \n';
    add(s + 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xo + '\n%%EOF');
    return new Blob(parts, {type: 'application/pdf'});
  }
  function toBlob(cv, type, q) { return new Promise(function (ok) { cv.toBlob(ok, type, q); }); }
  function save(blob, name) {
    var u = URL.createObjectURL(blob), a = el('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 4000);
  }

  /* ---------- الواجهة ---------- */
  var css = false;
  function style() {
    if (css) return; css = true;
    var s = el('style'); s.textContent = [
      '.mnr-card{direction:rtl;text-align:center;background:#fff;border:1px solid ' + LINE + ';border-radius:16px;padding:16px;margin:14px 0;font-family:inherit}',
      '.mnr-card p{margin:0 0 12px;font-size:16px;color:' + INK2 + '}',
      '.mnr-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:48px;border:0;border-radius:12px;background:' + NAVY + ';color:#fff!important;font:inherit;font-size:17px;font-weight:700;cursor:pointer}',
      '.mnr-btn[disabled]{opacity:.65;cursor:wait}',
      '.mnr-btn2{background:#fff;color:' + NAVY + '!important;border:2px solid ' + NAVY + '}',
      '.mnr-lnk{display:inline-block;margin-top:12px;font-size:15px;font-weight:700;color:' + NAVY + '!important;text-decoration:none!important;background:none;border:0;cursor:pointer;font-family:inherit}',
      '.mnr-ov{position:fixed;inset:0;z-index:2147483100;background:rgba(5,37,96,.55);display:flex;align-items:center;justify-content:center;padding:14px;direction:rtl}',
      '.mnr-sh{background:#fff;border-radius:20px;padding:14px;width:100%;max-width:440px;max-height:calc(100vh - 28px);overflow:auto;font-family:inherit;text-align:center}',
      '.mnr-x{width:34px;height:34px;border-radius:50%;border:0;background:#F2F4F5;color:' + INK2 + ';font-size:18px;line-height:1;padding:0;cursor:pointer;display:flex;align-items:center;justify-content:center;margin:0 auto 10px 0}',
      '.mnr-sh img{display:block;width:100%;border-radius:12px;border:1px solid ' + LINE + '}',
      '.mnr-row{display:flex;gap:10px;margin-top:12px}.mnr-row .mnr-btn{height:46px;font-size:16px}',
      '.mnr-note{margin:10px 0 0;font-size:14px;color:' + INK2 + '}',
      '.mnr-msg{padding:22px 8px;font-size:16px;color:' + INK2 + '}',
      '.mnr-ok{font-size:22px;font-weight:800;color:' + NAVY + ';margin:6px 0 14px}',
      '.mnr-kv{display:flex;justify-content:space-between;gap:12px;padding:10px 4px;border-bottom:1px solid ' + LINE + ';font-size:16px}',
      '.mnr-kv b{color:' + NAVY + '}.mnr-kv span{color:' + INK2 + '}'
    ].join('\n');
    document.head.appendChild(s);
  }
  function overlay() {
    style();
    var ov = el('div', 'mnr-ov'), sh = el('div', 'mnr-sh'), x = el('button', 'mnr-x');
    x.type = 'button'; x.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style="display:block"><path d="M2 2L12 12M12 2L2 12" stroke="' + INK2 + '" stroke-width="2" stroke-linecap="round"/></svg>'; x.setAttribute('aria-label', 'إغلاق'); sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true');
    sh.appendChild(x); ov.appendChild(sh); document.body.appendChild(ov);
    function close() { ov.remove(); document.removeEventListener('keydown', esc); }
    function esc(e) { if (e.key === 'Escape') close(); }
    x.onclick = close; ov.onclick = function (e) { if (e.target === ov) close(); }; document.addEventListener('keydown', esc);
    setTimeout(function () { x.focus(); }, 30);
    return {sh: sh, close: close};
  }
  function icon() {
    var s = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M4 20h16"/></svg>';
    var w = el('span'); w.innerHTML = s; return w.firstChild;
  }

  var cache = {};
  function getReceipt(order) {
    if (!cache[order]) {
      cache[order] = post({a: 'receipt', o: order});
      cache[order].catch(function () { delete cache[order]; });
    }
    return cache[order];
  }

  // يفتح نافذة الإيصال لطلب معيّن (تُستعمل أيضاً من نافذة الإهداء)
  function open(order) {
    var o = overlay(), wait = el('div', 'mnr-msg', 'نجهّز إيصالك…'); o.sh.appendChild(wait);
    Promise.all([getReceipt(order), loadAssets()]).then(function (r) {
      var d = r[0], A = r[1];
      if (!d || !d.ok) { wait.textContent = ERR[d && d.error] || ERR.server; return; }
      var sq = draw('sq', d, A, 1);
      wait.remove();
      var im = el('img'); im.alt = 'إيصال التبرع رقم ' + d.n; im.src = sq.toDataURL('image/png'); o.sh.appendChild(im);
      var row = el('div', 'mnr-row'), b1 = el('button', 'mnr-btn', 'حفظ الصورة'), b2 = el('button', 'mnr-btn mnr-btn2', 'ملف PDF');
      b1.type = b2.type = 'button'; row.appendChild(b1); row.appendChild(b2); o.sh.appendChild(row);
      if (d.gift && d.gift.to) o.sh.appendChild(el('p', 'mnr-note', 'الإيصال لك أنت وفيه المبلغ. البطاقة هي التي تُرسل.'));
      b1.onclick = function () { toBlob(sq, 'image/png').then(function (b) { save(b, 'إيصال-تبرع-' + d.n + '.png'); }); };
      b2.onclick = function () {
        b2.disabled = true;
        var a5 = draw('a5', d, A, 2);
        toBlob(a5, 'image/jpeg', 0.92).then(function (b) { return b.arrayBuffer(); }).then(function (buf) {
          save(pdfFromJpeg(new Uint8Array(buf), a5.width, a5.height), 'إيصال-تبرع-' + d.n + '.pdf');
        }).finally(function () { b2.disabled = false; });
      };
    }).catch(function () { wait.textContent = ERR.net; });
  }

  // صفحة التحقق: #receipt=XXXX-XXXX
  function verifyPage(code) {
    var o = overlay(), wait = el('div', 'mnr-msg', 'نتحقق من الإيصال…'); o.sh.appendChild(wait);
    post({a: 'verify', v: code}).then(function (r) {
      wait.remove();
      if (!r || !r.ok) { o.sh.appendChild(el('div', 'mnr-msg', ERR[r && r.error] || ERR.server)); return; }
      if (!r.valid) {
        o.sh.appendChild(el('div', 'mnr-ok', 'لم نجد هذا الإيصال'));
        o.sh.appendChild(el('p', 'mnr-note', 'تأكد من الرمز، أو تواصل مع الجمعية على 0555 43 8678.'));
        return;
      }
      o.sh.appendChild(el('div', 'mnr-ok', '✅ إيصال صحيح'));
      o.sh.appendChild(el('p', 'mnr-note', 'صادر من ' + ORG));
      [['رقم الإيصال', r.n], ['المبلغ', fmtAmt(r.amt) + ' ريال'], ['المشروع', r.proj], ['التاريخ', String(r.date || '').replace('|', '–')]]
        .forEach(function (kv) { var w = el('div', 'mnr-kv'); w.appendChild(el('span', '', kv[0])); w.appendChild(el('b', '', String(kv[1]))); o.sh.appendChild(w); });
    }).catch(function () { wait.textContent = ERR.net; });
  }

  // بطاقة «إيصال تبرعك جاهز» في صفحة الفاتورة/الشكر
  function card(order) {
    var tries = 0;
    (function place() {
      var title = document.querySelector('main.content-container .page-title') || document.querySelector('.z-order-invoice-view .page-title');
      if (!title) { var h1 = document.querySelector('.order-completed-content h1'); if (h1) title = h1.closest('.d-flex') || h1; }   /* صفحة الشكر بعد الدفع */
      if (!title) { if (++tries < 40) setTimeout(place, 250); return; }
      if (document.querySelector('.mnr-card')) return;
      getReceipt(order).then(function (d) {
        if (!d || !d.ok) return;               // غير مدفوع أو خطأ: لا نعرض شيئاً
        if (document.querySelector('.mnr-card')) return;
        style();
        var cd = el('div', 'mnr-card'), b = el('button', 'mnr-btn'), l = el('button', 'mnr-lnk', 'تحقق من الإيصال');
        cd.appendChild(el('p', '', 'إيصال تبرعك جاهز'));
        b.type = l.type = 'button'; b.appendChild(icon()); b.appendChild(document.createTextNode('تحميل الإيصال'));
        b.onclick = function () { open(order); }; l.onclick = function () { verifyPage(d.v); };
        cd.appendChild(b); cd.appendChild(l);
        if (d.gift && d.gift.to && window.MNGift) {   // للمُهدي: رجوع لبطاقة الإهداء
          var gl = el('button', 'mnr-lnk', d.gift.mourn ? 'أرسل البطاقة' : 'أكمل إرسال هديتك'); gl.type = 'button';
          gl.style.marginInlineStart = '16px'; gl.onclick = function () { window.MNGift.complete(order); }; cd.appendChild(gl);
        }
        title.parentNode.insertBefore(cd, title.nextSibling);
        loadAssets();                           // نجهّز الخطوط مبكراً
      }).catch(function () {});
    })();
  }

  window.MNReceipt = {open: open, verify: verifyPage};

  function route() {
    var h = location.hash || '', m = h.match(/^#receipt=([A-Za-z0-9]{4}-?[A-Za-z0-9]{4})$/);
    if (m) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} verifyPage(m[1].replace('-', '').toUpperCase()); return; }
    if (location.pathname === '/account-orders') { ordersPage(); return; }
    var ord = orderFromPath(location.pathname);
    if (ord) card(ord);
  }

  /* «طلباتي وإيصالاتي»: زر «الإيصال» بجانب «مشاهدة» في كل تبرع (2026-11-25) */
  function ordersPage() {
    if (!document.getElementById('mnr-orders-css')) {
      var s = el('style'); s.id = 'mnr-orders-css';
      s.textContent = 'table.order-table td.order-action{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}' +
        'table.order-table td.order-action a.btn,table.order-table td.order-action .mnr-rbtn{box-sizing:border-box;display:inline-flex!important;align-items:center;justify-content:center;gap:6px;width:120px;height:40px!important;margin:6px 0 0!important;padding:0 10px!important;border-radius:10px!important;font-size:15px!important;font-weight:700!important;text-decoration:none!important;line-height:1!important;cursor:pointer}' +
        'table.order-table td.order-action a.btn{background:#fff!important;color:' + NAVY + '!important;border:2px solid ' + NAVY + '!important}' +
        'table.order-table td.order-action .mnr-rbtn{background:' + NAVY + '!important;color:#fff!important;border:2px solid ' + NAVY + '!important;font-family:inherit}' +
        /* الجوال: كل تبرع بطاقة، و«بانتظار الدفع» (2026-11-25) */
        '@media (max-width:767px){table.order-table,table.order-table tbody{display:block!important;width:100%!important;border:0!important}table.order-table tbody tr{display:grid!important;grid-template-columns:1fr auto;grid-template-areas:"num st" "dt tot" "act act";gap:8px 10px;align-items:center;background:#fff;border:1px solid #E1E3E3!important;border-radius:14px;padding:14px!important;margin:0 0 12px!important;box-shadow:0 1px 3px rgba(5,37,96,.06)}table.order-table tbody tr td{display:block!important;width:auto!important;padding:0!important;border:0!important;text-align:right!important}table.order-table td.order-status::before,table.order-table td.order-date::before,table.order-table td.order-total::before,table.order-table td.order-action::before,table.order-table td.order-date::after,table.order-table td.order-total::after{display:none!important;content:none!important}table.order-table td.order-number{grid-area:num;display:flex!important;direction:rtl!important;align-items:center!important;gap:6px;justify-content:flex-start;font-size:16px;font-weight:700}table.order-table td.order-number::before{content:"رقم التبرع"!important;font-weight:400;font-size:13px;color:#3A4247;width:auto!important;min-width:0!important;max-width:none!important;padding:0!important;margin:0!important;text-align:right!important;flex:none!important;position:relative!important;top:-2px!important;line-height:1.2!important;display:block!important}table.order-table td.order-number a{direction:ltr;position:relative;top:1px}table.order-table td.order-status{grid-area:st;justify-self:end;width:max-content!important;min-width:0!important;max-width:none!important;height:26px;display:flex!important;align-items:center;justify-content:center;line-height:1!important;box-sizing:border-box;padding:0 12px .5px!important;font-size:13px!important;font-weight:700;border-radius:999px;text-align:center!important}table.order-table td.mnr-st-ok{background:#CFEDEA;color:#052560}table.order-table td.mnr-st-wait{background:#F1F3F5;color:#3A4247}table.order-table td.order-date{grid-area:dt;font-size:13px;color:#3A4247}table.order-table td.order-total{grid-area:tot;justify-self:end;font-size:17px;font-weight:800;color:#052560}table.order-table td.order-action{grid-area:act;display:flex!important;gap:8px;flex-wrap:nowrap!important;padding-top:4px!important}table.order-table td.order-action a.btn,table.order-table td.order-action .mnr-rbtn{flex:1 1 0;width:auto!important;margin:0!important;height:42px!important}table.order-table td.order-action a.btn{padding:0 10px!important}table.order-table td.order-action .mnr-wait{flex:1 1 0;width:auto!important;margin:0!important;height:42px!important}}table.order-table td.order-action .mnr-wait{box-sizing:border-box;display:inline-flex!important;align-items:center;justify-content:center;width:120px;height:40px;margin:6px 0 0;padding:2px 10px 0;border-radius:10px;background:#F1F3F5;color:#3A4247;font-size:15px;font-weight:700;line-height:1;cursor:default;font-family:inherit}';
      document.head.appendChild(s);
    }
    var fill = function () {
      var h1 = document.querySelector('h1');
      if (h1 && (h1.textContent || '').trim() === 'طلباتي') h1.textContent = 'طلباتي وإيصالاتي';
      document.querySelectorAll('table.order-table tbody tr').forEach(function (tr) {
        var st = tr.querySelector('td.order-status');
        if (st && (st.textContent || '').trim() === 'تم التوصيل') st.textContent = 'تم التبرع';
        if (st) { st.classList.remove('mnr-st-ok', 'mnr-st-wait'); st.classList.add((st.textContent || '').trim() === 'تم التبرع' ? 'mnr-st-ok' : 'mnr-st-wait'); }
        if (tr.querySelector('.mnr-rbtn,.mnr-wait')) return;
        var a = null, as = tr.querySelectorAll('a');
        for (var i = 0; i < as.length; i++) if (/\/invoice/.test(as[i].getAttribute('href') || '')) { a = as[i]; break; }
        var o = a && orderFromPath(a.getAttribute('href'));
        if (!o) return;
        var b = el('button', 'mnr-rbtn'); b.type = 'button';
        b.appendChild(icon()); b.appendChild(document.createTextNode('الإيصال'));
        b.querySelector('svg').setAttribute('width', '16'); b.querySelector('svg').setAttribute('height', '16');
        b.onclick = function () { open(o); };
        a.parentNode.appendChild(b);
        /* تبرع غير مدفوع: «بانتظار الدفع» بدل «الإيصال»؛ إن فشل الطلب يبقى الزر */
        fetch('/api/v1/orders/' + o + '/invoice', {headers: {Accept: 'application/json'}}).then(function (r) { return r.json(); }).then(function (j) {
          var od = j && (j.order || (j.data && j.data.order));
          if (od && String(od.payment_status || '').toLowerCase() !== 'paid' && b.isConnected) { var w = el('span', 'mnr-wait', 'بانتظار الدفع'); b.replaceWith(w); }
        }).catch(function () {});
      });
    };
    fill(); setTimeout(fill, 800); setTimeout(fill, 2500); setTimeout(fill, 6000);
    var tm = 0; try { new MutationObserver(function () { clearTimeout(tm); tm = setTimeout(fill, 150); }).observe(document.body, {childList: true, subtree: true}); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', route); else route();
  window.addEventListener('hashchange', route);
})();
