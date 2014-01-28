if (!window.matchMedia) {
    window.matchMedia = function (str) {
        return {
            matches: false
        };
    };
}

$.fn.renameTagName = function(tag){
   // create the new, empty shim
   var replacement = $('<' + tag + '>');
   // empty container to hold attributes
   var attributes = {};
   // copy all the attributes to the shell
   $.each(this.get(0).attributes, function(index, attribute) {
       attributes[attribute.name] = attribute.value;
   }); 
   // assign attributes to replacement
   replacement.attr(attributes);
   // copy the data
   replacement.data(this.data());
   // get all the kids, with data and events
   var contents = this.children().clone(true);
   // inseminate
   replacement.append(contents);
   // swap it out
   this.replaceWith(replacement);
   // and we're done
   return replacement;
}
function pictureYes(y) {
                    if (y.matches) {
                       $.picture();
                    }
    y.removeListener(pictureYes);
}
function pictureNo(y) {
                    if (!y.matches) {
                       $.picture();
                    }
   y.removeListener(pictureNo);
}
$.picture = function () {
    $("picture").each(function (a, picture) {
        var done = false;
        var query = "";
        $(picture).children("img").renameTagName("source");
        $(picture).children("source").each(function (b, source) {
            var wc = !! ($(source).attr("media")) ? window.matchMedia($(source).attr("media")) : {
                matches: false
            };
            if (wc.matches && !done) {
                if (query === "") {
                    query += wc.media;
                } else {
                    query += ", " + wc.media;
                }
                $(source).renameTagName("img");
                wc.addListener(pictureYes);
                done = true;
            } else if ( !! (wc.media)) {
                if (query === "") {
                    query += wc.media;
                } else {
                    query += ", " + wc.media;
                }
                wc.addListener(pictureYes);
            } else if (!done && !($(source).attr("media"))) {
                wc = window.matchMedia(query);
                if ( !! (wc.media)) {
                    wc.addListener(pictureNo);
                }
                $(source).renameTagName("img");
                done = true;
            } else {
                wc = window.matchMedia(query);
                if ( !! (wc.media)) {
                    wc.addListener(pictureNo);
                }
            }
        });
    });
};

$.picture();
