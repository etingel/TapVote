/* GLOBAL CONFIGURATION */

// We need to determine if this client is being served from the local machine or another host
// If it's serving from localhost, make sure that every Ajax request is sent to this machine
// If it's being served from somewhere else, make all Ajax requests to dev.isaacdontjelindell.com (for now!)
var AJAX_REQUEST_URL;
if (window.document.location.port != "") {
    AJAX_REQUEST_URL = "";
} else {
    //AJAX_REQUEST_URL = "http://dev.isaacdontjelindell.com:8000";
    AJAX_REQUEST_URL = "http://tapvote.isaacdontjelindell.com:8000";
}

var pageTitle;
var loadingSpinnerIntervalId;

// site-global
var showLoadingIndicator = function() {

    $("#content").append("<div id='loading-indicator'></div>");
    var counter = 0;
    loadingSpinnerIntervalId = setInterval(function() {
        var frames=19; var frameWidth = 30;
        var offset=counter * -frameWidth;
        document.getElementById("loading-indicator").style.backgroundPosition=0 + "px" + " " + offset + "px";
        counter++; if (counter>=frames) counter =0;
    }, 50);
};

// site-global
var hideLoadingIndicator = function() {
    $("#loading-indicator").remove();
    clearInterval(loadingSpinnerIntervalId);
};

// usage: $.QueryString["param"]
(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);


// load the header, footer, content
$(function() {
    $("#header").load("header.html");
    $("#footer").load("footer.html");

    var page = $.QueryString["p"];

    if(!page)
        $("#content").load("home.html", null, pageLoadHandler); // load home by default
    else {
        $("#content").load(page + ".html", null, pageLoadHandler);
    }


    function pageLoadHandler(response, status, xhr) {
        if (status == "error") {
            // show a 404
            window.location.href = "/404.html";
        } else {
            // set the page title. pageTitle is declared globally in site specific JS files
            // (if it isn't declared, just use "TapVote" as the title)
            if(!pageTitle) $("title").html("TapVote");
            else $("title").html(pageTitle + " - TapVote" )
        }
    }

});

/* returns the string name of the type of question for displaying. Used in createQuestion and displaySurvey*/
getTypeStr = function(type){
    var str = ""
    
    if (type =='FR') {
        str = 'Free Response'
    } else if (type == 'MCSR') {
        str = 'Multiple Choice, Single Response'
    } else if (type == 'MCMR') {
        str = 'Multiple Choice, Multiple Response'
    }
    
    return str
};
