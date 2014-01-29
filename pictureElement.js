pictureDebug = false;
(function() {
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

		var picture = function(debug) {
			pictureDebug = (debug === true || pictureDebug === true) ? true : false;
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
						(pictureDebug ? console.log("Picture #" + (pictureIndex + 1) + ": Fallback") : '');
					} else {
						mm.addListener(pictureYes);
						wc_list.push(mm);
						(pictureDebug ? console.log("Picture #" + (pictureIndex + 1) + ": " + mediaQuery) : '');
					}

					if ((mm.matches && !done) || (innerLength - 1 == sourceIndex && !done)) {
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
			picture(pictureDebug);
		});
		var pictureYes = function(y) {
			if (y.matches) {
				for (var i = 0; i < wc_list.length; i++) {
					wc_list[i].removeListener(pictureNo);
					wc_list[i].removeListener(pictureYes);
				}
				picture(pictureDebug);
			}
		};
		var pictureNo = function(y) {

			if (!y.matches) {
				for (var i = 0; i < wc_list.length; i++) {
					wc_list[i].removeListener(pictureNo);
					wc_list[i].removeListener(pictureYes);
				}
				picture(pictureDebug);
			}
		};
		picture(pictureDebug); //true = debug Mode (in console)
	}
})();
