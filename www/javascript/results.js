/**
 * Created by isaac on 10/29/13.
 */

// GLOBAL PAGE VARIABLES //
pageTitle = "Results";


$(getSurveyInfo());

function getSurveyInfo() {
    var survey = $.QueryString['survey'];
    if (survey) {
        $.ajax({
            type:'GET',
            url: AJAX_REQUEST_URL + '/getSurveyInfo',
            data: {surveyId: survey},
            xhrFields: { withCredentials: true },
            success: getSurveyResults,
            error: displayAjaxError
        });

    } else {
        askForSurveyId();
    }
}

function getSurveyResults(surveyInfo) {
    var survey = $.QueryString['survey'];
    $.ajax({
        type:'GET',
        url: AJAX_REQUEST_URL + '/getSurveyResults',
        data: {surveyId: survey},
        xhrFields: { withCredentials: true },
        success: function (surveyResults) { combineSurveyInfo(surveyInfo, surveyResults); },
        error: displayAjaxError
    });
    //setTimeout(getSurveyInfo, 2000);
}

function displayAjaxError(error) {
    if (error.status == 404) {
        // 404 happens when the survey id is invalid
        askForSurveyId();
    } else {
        console.log(error);
    }
}

function askForSurveyId() {
    var titleDiv = $("#survey-title");
    titleDiv.text("Please enter a survey ID and click 'See Results'.");

    var idBox = $("<input id='survey-id' type='text' class='no-wrap survey-id-input-box' size='5' />");
    var button = $("<button type='button' id='see-results-button'>See Results</button>");
    button.addClass("pure-button pure-button-success pure-button-small");
    button.attr('onclick', 'redirectToSurvey()');

    var form = $("<form></form>");
    form.addClass("pure-form");
    form.attr("action","javascript:$('#see-results-button').click();");
    form.append(idBox);
    form.append(button);

    var surveyDiv = $("#survey-questions");
    surveyDiv.append(form);
}

function redirectToSurvey() {
    window.location.href="?p=results&survey=" + $("#survey-id").val();
}

function combineSurveyInfo(surveyInfo, surveyResults) {
    // combine the survey info (containing questions and answer options) with the results
    // (containing the number of votes for each answer)
    $.each(surveyInfo.questions, function (_, question) {
        $.each(question.answers, function (_, answer) {
            answer.votes = surveyResults[answer.id]
        })
    });

    // surveyInfo now has all information, including results (# of votes)
    displaySurvey(surveyInfo)
}

function displaySurvey(surveyInfo) {
    console.log(surveyInfo);

    // D3 scaling function - will be used later
    var max = 0;
    $.each(surveyInfo.questions, function(index, question) {
        $.each(question.answers, function(i, answer) {
            max = Math.max(max, answer.votes);
        })
    });
    if (!max) max = 0;

    var x = d3.scale.linear()
        .domain([0, max])  // TODO fix this
        .range([0, 420]);


    var questions = d3.select("#survey-questions")
        .selectAll("div")
        .data(surveyInfo.questions);

    var questionDivs = questions.enter().append("div") // this creates the question divs
        .text(function(d) { return d.value; })
        .attr("class", "question chart rounded");

    //questions.transition()
    //    .text(function(d) { return d.value; });

    questions.exit().remove();


    var answers = questionDivs
        .selectAll("div")
        .data(function(d) { return d.answers; });

    var answerDivs = answers.enter().append("div") // this creates the nested answer divs
        .text(function(d) { return d.value; })
        .attr("class", "answer");

    answers.exit().remove();


    var answerResults = answerDivs
        .selectAll("div")
        .data(function(d) { return [d] });

    var answerResultDivs = answerResults.enter().append("div")
        .style("width", function(d) {
            return x(d.votes) + "px";
        })
        .text(function(d) { return d.votes; })
        .attr("class", "bar");


    answerResults.exit().remove();

}


