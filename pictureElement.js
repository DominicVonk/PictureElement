(function() {
	window.matchMedia||(window.matchMedia=function(c){var a=c.document,w=a.documentElement,l=[],t=0,x="",h={},G=/\s*(only|not)?\s*(screen|print|[a-z\-]+)\s*(and)?\s*/i,H=/^\s*\(\s*(-[a-z]+-)?(min-|max-)?([a-z\-]+)\s*(:?\s*([0-9]+(\.[0-9]+)?|portrait|landscape)(px|em|dppx|dpcm|rem|%|in|cm|mm|ex|pt|pc|\/([0-9]+(\.[0-9]+)?))?)?\s*\)\s*$/,y=0,A=function(b){var z=-1!==b.indexOf(",")&&b.split(",")||[b],e=z.length-1,j=e,g=null,d=null,c="",a=0,l=!1,m="",f="",g=null,d=0,f=null,k="",p="",q="",n="",r="",k=!1;if(""===
b)return!0;do{g=z[j-e];l=!1;if(d=g.match(G))c=d[0],a=d.index;if(!d||-1===g.substring(0,a).indexOf("(")&&(a||!d[3]&&c!==d.input))k=!1;else{f=g;l="not"===d[1];a||(m=d[2],f=g.substring(c.length));k=m===x||"all"===m||""===m;g=-1!==f.indexOf(" and ")&&f.split(" and ")||[f];d=g.length-1;if(k&&0<=d&&""!==f){do{f=g[d].match(H);if(!f||!h[f[3]]){k=!1;break}k=f[2];n=p=f[5];q=f[7];r=h[f[3]];q&&(n="px"===q?Number(p):"em"===q||"rem"===q?16*p:f[8]?(p/f[8]).toFixed(2):"dppx"===q?96*p:"dpcm"===q?0.3937*p:Number(p));
k="min-"===k&&n?r>=n:"max-"===k&&n?r<=n:n?r===n:!!r;if(!k)break}while(d--)}if(k)break}}while(e--);return l?!k:k},B=function(){var b=c.innerWidth||w.clientWidth,a=c.innerHeight||w.clientHeight,e=c.screen.width,j=c.screen.height,g=c.screen.colorDepth,d=c.devicePixelRatio;h.width=b;h.height=a;h["aspect-ratio"]=(b/a).toFixed(2);h["device-width"]=e;h["device-height"]=j;h["device-aspect-ratio"]=(e/j).toFixed(2);h.color=g;h["color-index"]=Math.pow(2,g);h.orientation=a>=b?"portrait":"landscape";h.resolution=
d&&96*d||c.screen.deviceXDPI||96;h["device-pixel-ratio"]=d||1},C=function(){clearTimeout(y);y=setTimeout(function(){var b=null,a=t-1,e=a,j=!1;if(0<=a){B();do if(b=l[e-a])if((j=A(b.mql.media))&&!b.mql.matches||!j&&b.mql.matches)if(b.mql.matches=j,b.listeners)for(var j=0,g=b.listeners.length;j<g;j++)b.listeners[j]&&b.listeners[j].call(c,b.mql);while(a--)}},10)},D=a.getElementsByTagName("head")[0],a=a.createElement("style"),E=null,u="screen print speech projection handheld tv braille embossed tty".split(" "),
m=0,I=u.length,s="#mediamatchjs { position: relative; z-index: 0; }",v="",F=c.addEventListener||(v="on")&&c.attachEvent;a.type="text/css";a.id="mediamatchjs";D.appendChild(a);for(E=c.getComputedStyle&&c.getComputedStyle(a)||a.currentStyle;m<I;m++)s+="@media "+u[m]+" { #mediamatchjs { position: relative; z-index: "+m+" } }";a.styleSheet?a.styleSheet.cssText=s:a.textContent=s;x=u[1*E.zIndex||0];D.removeChild(a);B();F(v+"resize",C);F(v+"orientationchange",C);return function(a){var c=t,e={matches:!1,
media:a,addListener:function(a){l[c].listeners||(l[c].listeners=[]);a&&l[c].listeners.push(a)},removeListener:function(a){var b=l[c],d=0,e=0;if(b)for(e=b.listeners.length;d<e;d++)b.listeners[d]===a&&b.listeners.splice(d,1)}};if(""===a)return e.matches=!0,e;e.matches=A(a);t=l.push({mql:e,listeners:null});return e}}(window));
	if (typeof(HTMLPictureElement) === "undefined" && typeof(window.matchMedia) !== "undefined") {
		var wc_list = [];
		window.renameSingle = function(elm, tag) {
			var replacement = document.createElement(tag);

			for (var attribute = 0; attribute < elm.attributes.length; attribute++) {

				if (typeof elm.attributes[attribute].value !== "undefined" && typeof elm.attributes[attribute].name !== "undefined" && typeof elm.attributes[attribute].value !== "function") {
					replacement.setAttribute(elm.attributes[attribute].name, elm.attributes[attribute].value);
				}
			}

			elm.parentNode.replaceChild(replacement, elm);
			return replacement;
		};

		var each = function(elem, execute) {
			for (var result = 0; result < elem.length; result++) {
				execute(result, elem[result], elem.length);
			}
		};

		var picture = function() {
			wc_list = [];
			var pictures = document.getElementsByTagName("picture");
			each(pictures, function(pictureIndex, picture, length) {
				var done = false;
				var query = "";
				each(picture.getElementsByTagName("img"), function(imgIndex, img, innerLength) {
					if (img.hasAttribute("src") && img.hasAttribute("srcset")) {
						img.removeAttribute("src");
					}
					window.renameSingle(img, "source");
				});
				each(picture.getElementsByTagName("source"), function(sourceIndex, source, innerLength) {
					var getRightImg = null;
					var mediaQuery = source.hasAttribute("media") ? source.getAttribute("media") : "";

					if (source.hasAttribute("srcset") && !source.hasAttribute("src")) {
						getRightImg = "";
						var oldMediaQuery = mediaQuery;
						var queries = source.getAttribute("srcset").split(',');
						each(queries, function(queryIndex, thisQuery, queryLength) {
							var mediaQuery2 = "";
							thisQuery = thisQuery.trim().split(' ');
							if (thisQuery.length == 1) {
								getRightImg = thisQuery[0];
							} else if (thisQuery.length == 2) {
								if (thisQuery[1].substr(-1, 1) == "x") {
									mediaQuery2 = "(min-resolution: " + thisQuery[1].substr(0, thisQuery[1].length - 1) + "dppx)";
									if (mediaQuery === "") {
										if (oldMediaQuery === "") {
											mediaQuery = mediaQuery2;
										} else {
											mediaQuery = oldMediaQuery + " and " + mediaQuery2;
										}
									} else {
										if (oldMediaQuery === "") {
											mediaQuery += ", " + mediaQuery2;
										} else {
											mediaQuery += ", " + oldMediaQuery + " and " + mediaQuery2;
										}
									}
									var test = window.matchMedia(mediaQuery2);
									if (test.matches) {
										getRightImg = thisQuery[0];
									}
									test.addListener(pictureYes);
									wc_list.push(test);
								} else if (thisQuery[1].substr(-1, 1) == "w") {
									mediaQuery2 = "(min-width: " + thisQuery[1].substr(0, thisQuery[1].length - 1) + "px)";
									if (mediaQuery === "") {
										if (oldMediaQuery === "") {
											mediaQuery = mediaQuery2;
										} else {
											mediaQuery = oldMediaQuery + " and " + mediaQuery2;
										}
									} else {
										if (oldMediaQuery === "") {
											mediaQuery += ", " + mediaQuery2;
										} else {
											mediaQuery += ", " + oldMediaQuery + " and " + mediaQuery2;
										}
									}
									var test = window.matchMedia(mediaQuery2);
									if (test.matches) {
										getRightImg = thisQuery[0];
									}
									test.addListener(pictureYes);
									wc_list.push(test);
								}
							} else if (thisQuery.length == 3) {

								if (thisQuery[1].substr(-1, 1) == "x") {
									mediaQuery2 = "(min-resolution: " + thisQuery[1].substr(0, thisQuery[1].length - 1) + "dppx) and ";
								} else if (thisQuery[1].substr(-1, 1) == "w") {
									mediaQuery2 = "(min-width: " + thisQuery[1].substr(0, thisQuery[1].length - 1) + "px) and ";
								}
								if (thisQuery[2].substr(-1, 1) == "x") {
									mediaQuery2 += "(min-resolution: " + thisQuery[2].substr(0, thisQuery[2].length - 1) + "dppx)";
								} else if (thisQuery[2].substr(-1, 1) == "w") {
									mediaQuery2 += "(min-width: " + thisQuery[2].substr(0, thisQuery[2].length - 1) + "px)";
								}
								
								if (mediaQuery === "") {
									if (oldMediaQuery === "") {
										mediaQuery = mediaQuery2;
									} else {
										mediaQuery = oldMediaQuery + " and " + mediaQuery2;
									}
								} else {
									if (oldMediaQuery === "") {
										mediaQuery += ", " + mediaQuery2;
									} else {
										mediaQuery += ", " + oldMediaQuery + " and " + mediaQuery2;
									}
								}
								
								var test = window.matchMedia(mediaQuery2);

								if (test.matches) {
									
									getRightImg = thisQuery[0];
								}
								test.addListener(pictureYes);
								wc_list.push(test);
							}
						});
					}
					
					if (query === "" && mediaQuery !== "") {
						query += mediaQuery;
					} else if (mediaQuery !== "") {
						query += ", " + mediaQuery;
					}
					if (mediaQuery == "") {
						mediaQuery = "added";
					}
					
					var mm = window.matchMedia(mediaQuery == "added" ? query : mediaQuery);
					
					if (mediaQuery == "added") {
						mm.addListener(pictureNo);
						wc_list.push(mm);
						
					} else {
						mm.addListener(pictureYes);
						wc_list.push(mm);
					}
					
					if ((mm.matches && (getRightImg !== "" || getRightImg === null) && !done) || (innerLength - 1 == sourceIndex && !done)) {
						
						var resimg = window.renameSingle(source, "img");
						if (getRightImg !== "" && getRightImg !== null) {
							resimg.setAttribute("src", getRightImg);
						}
						done = true;

					}
				});
			});
		};
		window.addEventListener("resize", function() {
			for (var i = 0; i < wc_list.length; i++) {
				wc_list[i].removeListener(pictureNo);
				wc_list[i].removeListener(pictureYes);
			}
			picture();
		});
		var pictureYes = function(y) {
			if (y.matches) {
				for (var i = 0; i < wc_list.length; i++) {
					wc_list[i].removeListener(pictureNo);
					wc_list[i].removeListener(pictureYes);
				}
				picture();
			}
		};
		var pictureNo = function(y) {

			if (!y.matches) {
				for (var i = 0; i < wc_list.length; i++) {
					wc_list[i].removeListener(pictureNo);
					wc_list[i].removeListener(pictureYes);
				}
				picture();
			}
		};
		picture(); //true = debug Mode (in console)
	}
})();
