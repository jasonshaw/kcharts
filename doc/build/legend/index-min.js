/*!build time : 2014-08-04 1:35:41 PM*/
KISSY.add("kg/kcharts/2.0.2/legend/index",function(a,b,c,d,e,f,g){function h(b){m||(m=a.Node("<div/>").css({visibility:"hidden",position:"fixed",left:"-9999em",top:0}).appendTo(r)),d.append(b,m);var c={width:d.outerWidth(m),height:d.outerHeight(m)};return m.html(""),c}function i(a,b){var c=this.el,d=c.icon,e=c.des;"cy"===a?d.transform("t0,"+b):"top"===a&&e.css("top",b+"px")}function j(a,b){var c=this.el,d=c.icon,e=c.des;"cx"===a?d.transform("t"+b+",0"):"left"===a&&e.css(a,b+"px")}function k(b){var c=b.get("disablestyle"),d={icon:{stroke:"#ccc",fill:"#ccc"},text:{color:"#ccc"}};d=a.isFunction(c)?a.mix(d,c(this,this.index)):a.mix(d,c);var e=this.icon,f=this.des;e.attr(d.icon),f.css(d.text)}function l(b,c){var d=b.get("enablestyle"),e={icon:{stroke:c.DEFAULT,fill:c.DEFAULT},text:{color:c.DEFAULT}};e=a.isFunction(d)?a.mix(e,d(this,this.index)):a.mix(e,d);var f=this.icon,g=this.des;f.attr(e.icon),g.css(e.text)}var m,n,o=(a.merge,f.BASIC[1]),p=window,q=p.Raphael,r=a.one(document.body),s={offset:[0,0],globalConfig:{interval:5}},t={initializer:function(){this._setupPaper(),this._setupCon();var b=(this.get("bbox"),this.get("paper"),this.get("align")),c=this.get("iconfn");c&&a.isFunction(c)&&(this.icon=c),this.align(b)},_setupPaper:function(){var a=this.get("paper");if(!a){var b=this.get("container");a=q(b[0],d.width(b),d.height(b)),this.set("paper",a)}"VML"==q.type||(a.canvas.style.zIndex=10)},bindEvent:function(){var b=this.get("els"),c=this;a.each(b,function(b){var d=b.icon,e=b.des,f={icon:d,text:e,index:b.index,el:b};a.each(["click","mouseover","mouseout"],function(a){d[a](function(){c.fire(a,f)}),e.on(a,function(){c.fire(a,f)})})})},unbindEvent:function(){var b=this.get("els");a.each(b,function(b){var c=b.icon,d=b.des;a.each(["click","mouseover","mouseout"],function(a){c["un"+a](),d.detach(a)})})},remmoveLegendIconAndText:function(){var b=this.get("els");a.each(b,function(a){var b=a.icon,c=a.des;b.remove(),c.remove()})},onframeend:function(){this.bindEvent()},_setupCon:function(){var a=this.get("container"),b=d.css(a,"position");"static"==b&&d.css(a,"position","relative")},item:function(a){var b=this.get("els");return b[a]},icon:function(a,b,c,d){var e,g=this.get("paper"),h=c;switch(d){case"triangle":e=f.triangle(a,b,{paper:g,size:h});break;case"linetriangle":e=f.linetriangle(a,b,{paper:g,size:h});break;case"rhomb":case"diamon":e=f.diamond(a,b,{paper:g,size:h});break;case"linerhomb":case"linediamond":e=f.linediamond(a,b,{paper:g,size:h});break;case"square":e=f.square(a,b,{paper:g,size:h});break;case"linesquare":e=f.linesquare(a,b,{paper:g,size:h});break;case"linecircle":e=f.linecircle(a,b,{paper:g,size:h});break;default:e=f.circle(a,b,{paper:g,size:h})}return e},align:function(a){var b={tl:"alignTopLeft",tc:"alignTopCenter",tr:"alignTopRight",rt:"alignRightTop",rm:"alignRightMiddle",rb:"alignRightBottom",bl:"alignBottomLeft",bc:"alignBottomCenter",br:"alignBottomRight",lt:"alignLeftTop",lm:"alignLeftMiddle",lb:"alignLeftBottom"},c=b[a]||"alignRight";this[c]()},alignTop:function(b,c){var e=this.get("container"),f=this.get("bbox"),i=this.get("offset"),m=(this.get("paper"),this.get("config")),n=this.get("globalConfig"),p=this,q=n.iconsize||[1,1],r=q*o||6,s=n.icontype,t=0,u=[];a.each(m,function(b,c){var d=b.text||"data"+c,e=a.Node('<span class="kcharts-legend-item">'+d+"</span>"),f=h(e);t+=f.width,u.push({el:e,width:f.width,height:f.height,zIndex:10,cursor:"pointer"})});var v=t,w=p.icon(-9999,9999,q,s),x=w.getBBox(),y=n.iconright||0,z=n.interval||0;w.remove(),v+=(x.width+y)*m.length+z*(m.length-1);var A=f.left+i[0],B=f.top+i[1]-2*r,C=A+(f.width-v)/2+r,D=B;if(c&&(D=D+4*r+f.height),"l"==b)C=0+i[0]+r;else if("r"==b){var E=d.width(e);C=E-v}var F=[],G=this.get("alignhook"),H=this.get("iconAttrHook"),I=this.get("spanAttrHook"),J=[],K=this.get("anim"),L=K?d.width(e):0,M={icontype:s,iconsize:r,iconright:y};a.each(m,function(b,c){G&&(M=G.call(p,M,c));var f=C,g=D;f+=L;var i=p.icon(f,g,q,b.icontype||M.icontype),m=i.getBBox(),n={};a.mix(n,b,!0,["DEFAULT","HOVER"]);var o={fill:n.DEFAULT};H&&(o=a.merge({fill:n.DEFAULT},H.call(p,c))),o.stroke=o.fill,i.attr(o);var r=b.text||"data"+c,s=d.create('<span class="kcharts-legend-item"></span>');d.html(s,r);var t,u,v=h(s);s=a.Node('<span class="kcharts-legend-item">'+r+"</span>"),t=C+M.iconsize+M.iconright,u=D-(m.height/2+(v.height-m.height)/2),t+=L;var w={left:t+"px",top:u+"px",position:"absolute",zIndex:10,cursor:"pointer"};n.DEFAULT&&(w.color=n.DEFAULT),I&&(w=a.merge(w,I.call(p,c))),s.css(w),s.appendTo(e),C+=v.width+2*M.iconsize+z+M.iconright;var x={icon:i,des:s,index:c,disable:function(){k.call(x,p,b)},enable:function(){l.call(x,p,b)}};F.push(x),K&&J.push({el:x,frame:j,from:{cx:0,left:t},to:{cx:-L,left:t-L}})}),this.set("els",F),K?(K.endframe=function(){p.onframeend()},g.AnimateObject(J,K)):p.onframeend()},alignTopLeft:function(){this.alignTop("l")},alignTopCenter:function(){this.alignTop("c")},alignTopRight:function(){this.alignTop("r")},alignRight:function(a){this.alignLeft(a,!0)},alignRightTop:function(){this.alignRight("t")},alignRightMiddle:function(){this.alignRight("m")},alignRightBottom:function(){this.alignRight("b")},alignBottomLeft:function(){this.alignTop("l",!0)},alignBottomCenter:function(){this.alignTop("c",!0)},alignBottomRight:function(){this.alignTop("r",!0)},alignLeft:function(b,c){var e=this.get("container"),f=this.get("bbox"),j=this.get("offset"),m=(this.get("paper"),this.get("config")),n=this.get("globalConfig"),p=this,q=n.iconsize||[1,1],r=q*o||6,s=n.icontype,t=0,u=m[0],v=p.icon(-9999,-9999,q,s),w=v.getBBox(),x=m.length,y=n.iconright||0,z=n.interval;v.remove();var A=u.text||"data",B=a.Node('<span class="kcharts-legend-item">'+A+"</span>"),C=h(B),D=Math.max(C.height,w.height);t+=D*x+z*(x-1);var E,F,G,H,I=0,J=[];a.each(m,function(b,c){{var d=a.Node('<span class="kcharts-legend-item">'+b.text+"</span>"),e=h(d);b.text||"data"+c}I<e.width&&(I=e.width),J.push({el:d,width:e.width,height:e.height})}),I+=y,c?(E=f.left+f.width+j[0],F=f.top+j[1],G=E+r,H=F):(E=f.left+j[0],F=f.top+j[1],G=E,H=F),"m"==b?H=f.top+(f.height-t)/2:"b"==b&&(H=f.top+f.height-t);var K=[],L=this.get("alignhook"),M=this.get("iconAttrHook"),N=this.get("spanAttrHook"),O=[],P=this.get("anim"),Q=P?d.height(e):0,R={icontype:s,iconright:y};a.each(m,function(b,d){L&&(R=L.call(p,R,d));var f,g;c?(f=G+j[0],g=H+j[1]):(f=G-I-r+j[0],g=H+j[1]),g+=Q;var h=p.icon(f,g,q,b.icontype||R.icontype),m=h.getBBox(),n=J[d],o={};a.mix(o,b,!0,["DEFAULT","HOVER"]);var s={fill:o.DEFAULT};M&&(s=a.merge(s,M.call(p,d))),s.stroke=s.fill,h.attr(s);var t,u,v=a.Node('<span class="kcharts-legend-item">'+b.text+"</span>");c?(t=G+r+m.width+j[0],u=H-(m.height/2+(C.height-m.height)/2)+j[1]):(t=G+j[0]-I+R.iconright,u=H-(m.height/2+(n.height-m.height)/2)+j[1]),u+=Q;var w={left:t+"px",top:u+"px",position:"absolute",zIndex:10,cursor:"pointer"};o.DEFAULT&&(w.color=o.DEFAULT),N&&(w=a.merge(w,N.call(p,d))),v.css(w),v.appendTo(e);var x=Math.max(n.height,m.height);H+=x+z;var y={icon:h,des:v,index:d,disable:function(){k.call(y,p,b)},enable:function(){l.call(y,p,b)}};K.push(y),P&&O.push({el:y,frame:i,from:{cy:0,top:u},to:{cy:-Q,top:u-Q}})}),this.set("els",K),P?(P.endframe=function(){p.onframeend()},g.AnimateObject(O,P)):p.onframeend()},alignLeftTop:function(){this.alignLeft("t")},alignLeftMiddle:function(){this.alignLeft("m")},alignLeftBottom:function(){this.alignLeft("b")},destroy:function(){this.unbindEvent(),this.remmoveLegendIconAndText()}};return b.extend?n=b.extend(t):(n=function(b){b=a.merge(s,b),this.set(b),this.initializer()},a.extend(n,b,t)),n},{requires:["base","node","dom","event","kg/kcharts/2.0.2/icons/index","kg/kcharts/2.0.2/animate/index","kg/kcharts/2.0.2/raphael/index"]});