
/* http://stackoverflow.com/a/2450976 */
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

var isCalled = false;
	function HasNotBeenSeen(value) {
		return value.HasSeen == false;
	}
	function DiffOneOrTwo(value) {
	    return value.Difficulty == "1" || value.Difficulty == "2";
	}
var $quizblitz = {
	questions: null,
	currentQuestionNumber: 0,
	allQuestions: null,
    loadJSON: function(path, callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', path, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);  
    },
	resetGameBoard: function() {
		$('.answer').removeClass("show-wrong");
        $('.answer').removeClass("show-correct");
		$('.question-bubble').removeClass("show-wrong");
        $('.question-bubble').removeClass("show-correct");
		for(var i = 0; i <= 3; i++) {
			$('#question-point-total-' + i).text('');
		}
	},
	startNewGame: function() {
		$quizblitz.resetGameBoard();
		$quizblitz.currentQuestionNumber = 0;
		$quizblitz.loadQuestion(0, $quizblitz.questions[0]);
		$('#title-screen').hide();
        $('#question-template').show();
	},
	rerollQuestion: function() {
		shuffle($quizblitz.allQuestions);
		$quizblitz.questions[$quizblitz.currentQuestionNumber] = $quizblitz.allQuestions[0];
		$quizblitz.loadQuestion($quizblitz.currentQuestionNumber, $quizblitz.questions[$quizblitz.currentQuestionNumber]);
	},
	nextQuestion: function() {
		if($quizblitz.currentQuestionNumber >= 3) {
			$quizblitz.currentQuestionNumber = 3;
			return;
		}
		$('.answer').removeClass("show-wrong");
        $('.answer').removeClass("show-correct");
		$quizblitz.currentQuestionNumber++;
		$quizblitz.loadQuestion($quizblitz.currentQuestionNumber, $quizblitz.questions[$quizblitz.currentQuestionNumber]);
	},
	previousQuestion: function() {
		if($quizblitz.currentQuestionNumber <= 0) {
			$quizblitz.currentQuestionNumber = 0;
			return;
		}
		$('.answer').removeClass("show-wrong");
        $('.answer').removeClass("show-correct");
		$quizblitz.currentQuestionNumber--;
		$quizblitz.loadQuestion($quizblitz.currentQuestionNumber, $quizblitz.questions[$quizblitz.currentQuestionNumber]);
	},
    loadNewGame: function (path) {
		$quizblitz.resetGameBoard();
		$quizblitz.currentQuestionNumber = 0;
		if(!isCalled) {
			isCalled = true;
			
			$(".answer").click(function () {
                    var correct = $(this).attr("data-correct") === "true";
                    $quizblitz.isCorrect(correct, false);
                    cdreset();
                });
		}
		
		$quizblitz.loadJSON(path, function (response) {
                var first_json = JSON.parse(response);
                var actual_JSON = first_json.filter(HasNotBeenSeen);
                $quizblitz.allQuestions = actual_JSON.filter(DiffOneOrTwo);

                $('#title-screen').show();
				$('#question-template').hide();
				$('.main-content').show();
				// shuffle question arrays
				shuffle($quizblitz.allQuestions);
                
                $quizblitz.questions = [];
				$quizblitz.questions.push($quizblitz.allQuestions[0]);
				$quizblitz.questions.push($quizblitz.allQuestions[1]);
                $quizblitz.questions.push($quizblitz.allQuestions[2]);
				$quizblitz.questions.push($quizblitz.allQuestions[3]);
                
            });
    },
	// based on https://github.com/nbrunt/TextFit
	// modified to require a max-height
    textfit: function (node) {
		node[0].style["font-size"] = null;
        var fs = parseInt(node.css("font-size"), 10);
        var mh = parseInt(node.css("max-height"), 10);
        while (node.height() > mh) {
            node.css("font-size", --fs + "px");
        }
	},
    isCorrect: function (correct, timeup) {
        $('[data-correct="false"]').addClass("show-wrong");
        $('[data-correct="true"]').addClass("show-correct");
        if (correct) {
			$('#question-bubble-' + $quizblitz.currentQuestionNumber).toggleClass("show-correct");
            $('#right-sound').clone()[0].play();
			$('#question-point-total-' + $quizblitz.currentQuestionNumber).text('+5');
            //$('.right-answer-choice').fadeIn();
        } else {
            $('#wrong-sound').clone()[0].play();
			$('#question-bubble-' + $quizblitz.currentQuestionNumber).toggleClass("show-wrong");
			$('#question-point-total-' + $quizblitz.currentQuestionNumber).text('-5');
            //$('.wrong-answer-choice').fadeIn();
        }

        //setTimeout(function () { $quizblitz.setAnswerClearAndReturn(correct) }, 2000);
    },
    loadQuestion: function (questionNumber, question) {
        $('#pointTable').fadeOut();
        $('#question').attr("data-selected-question", questionNumber);

        if (typeof question.Submitter === 'undefined' || question.Submitter == "") {
            $('.submitter-text').hide();
        } else {
            $('.submitter-text').show();
            $('#submitter-text').text(question.Submitter);
        }

		$('#question-title').text(question.QKEY + ': ' + question.GameTitle);
        $('#question-text').text(question.Question);
        $('#question-comment').text(question.Comments);

        var randomCorrectAnswerBank = Math.floor(Math.random() * (4 - 1) + 1);
        $("#" + randomCorrectAnswerBank).attr("data-correct", true);
        $("#" + randomCorrectAnswerBank).text(question.CorrectAnswer);

        var wrongAnswerBanks = [];
        for (var i = 1; i < 5; i++) {
            if (i != randomCorrectAnswerBank) {
                wrongAnswerBanks.push(i);
            }
        }

        $("#" + wrongAnswerBanks[0]).attr("data-correct", false);
        $("#" + wrongAnswerBanks[0]).text(question.FakeAnswer1);

        $("#" + wrongAnswerBanks[1]).attr("data-correct", false);
        $("#" + wrongAnswerBanks[1]).text(question.FakeAnswer2);

        $("#" + wrongAnswerBanks[2]).attr("data-correct", false);
        $("#" + wrongAnswerBanks[2]).text(question.FakeAnswer3);

        // $('#question').delay(800).fadeIn();

		// // after fadeIn starts, fit text
		// setTimeout(function()
		// {
			// $quizblitz.textfit($('#question-text'));
			// $quizblitz.textfit($('#1'));
			// $quizblitz.textfit($('#2'));
			// $quizblitz.textfit($('#3'));
			// $quizblitz.textfit($('#4'));
		// }, 800);
    },
    setAnswerClearAndReturn: function (correct) {
        $('td[data-question-number=' + $('#question').attr("data-selected-question") + ']').removeClass('answered-right');
        $('td[data-question-number=' + $('#question').attr("data-selected-question") + ']').removeClass('answered-wrong');
        if (correct) {
            $('td[data-question-number=' + $('#question').attr("data-selected-question") + ']').addClass("answered-right");

        } else {
            $('td[data-question-number=' + $('#question').attr("data-selected-question") + ']').addClass("answered-wrong");
        }
        $('#question').fadeOut();
        $('#pointTable').delay(800).fadeIn();
        $('.wrong-answer-choice').fadeOut();
        $('.right-answer-choice').fadeOut();
        $('.answer').removeClass("show-wrong");
        $('.answer').removeClass("show-correct");
    },
    clearAndReturn: function () {
        $('#question').fadeOut();
        $('#pointTable').delay(800).fadeIn();
        $('.wrong-answer-choice').fadeOut();
        $('.right-answer-choice').fadeOut();
        $('.answer').removeClass("show-wrong");
        $('.answer').removeClass("show-correct");
    }
}