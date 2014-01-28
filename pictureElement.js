if (!window.matchMedia) {
    window.matchMedia = function (str) {
        return {
            matches: false
        };
    };
}
var wc_list = [];
window.renameSingle = function (elm, tag) {
    var replacement = document.createElement(tag);
    
    for (var attribute = 0; attribute < elm.attributes.length; attribute++) {
      
        if (typeof elm.attributes[attribute].value !== "undefined" && typeof elm.attributes[attribute].name !== "undefined" && typeof elm.attributes[attribute].value !== "function") {
            replacement.setAttribute(elm.attributes[attribute].name, elm.attributes[attribute].value);
        }
    }
  
    elm.parentNode.replaceChild(replacement, elm);
    return replacement;
};


picture = function () {
    var pictures = document.getElementsByTagName("picture");
    for (var i = 0; i < pictures.length; i++) {
        var done = false;
        var query = "";
        for (var img = 0; img < pictures[i].getElementsByTagName("img").length; img++) {
            if (pictures[i].getElementsByTagName("img")[img]) {
                window.renameSingle(pictures[i].getElementsByTagName("img")[img], "source");
            }
        }

        for (var source = 0; source < pictures[i].getElementsByTagName("source").length; source++) {
            var sourceElm = pictures[i].getElementsByTagName("source")[source];

            var wc = sourceElm.hasAttribute("media") ? window.matchMedia(sourceElm.getAttribute("media")) : {
                matches: false
            };
            if (wc.matches && !done) {
                if (query === "") {
                    query += wc.media;
                } else {
                    query += ", " + wc.media;
                }
                window.renameSingle(sourceElm, "img");
                wc.addListener(pictureYes);
                wc_list.push(wc);
                done = true;
            } else if ( !! (wc.media)) {
                if (query === "") {
                    query += wc.media;
                } else {
                    query += ", " + wc.media;
                }
                wc.addListener(pictureYes);
                wc_list.push(wc);
            } else if (!done && !sourceElm.hasAttribute("media")) {
                wc = window.matchMedia(query);
                if ( !! (wc.media)) {
                    wc.addListener(pictureNo);
                    wc_list.push(wc);
                }
                window.renameSingle(sourceElm, "img");
                done = true;
            } else {
                wc = window.matchMedia(query);
                if ( !! (wc.media)) {
                    wc.addListener(pictureNo);
                    wc_list.push(wc);
                }
            }

        }
    }
};

function pictureYes(y) {
    if (y.matches) {
        for(var i = 0; i < wc_list.length; i++) {
            wc_list[i].removeListener(pictureNo);
            wc_list[i].removeListener(pictureYes);
        }
        picture();
    }
    
}

function pictureNo(y) {
    
    if (!y.matches) {
        for(var i = 0; i < wc_list.length; i++) {
            wc_list[i].removeListener(pictureNo);
            wc_list[i].removeListener(pictureYes);
        }
        picture();
        
    }
   
}
picture();
