
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
	function DiffOne(value) {
	    return value.Difficulty == "1";
	}
	function DiffTwo(value) {
	    return value.Difficulty == "2";
	}
	function DiffThree(value) {
	    return value.Difficulty == "3";
	}
	function DiffFour(value) {
	    return value.Difficulty == "4";
	}
var $quiz = {
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
    loadGame: function (path) {
        if (!isCalled) {
            isCalled = true;
            $quiz.loadJSON(path, function (response) {
                var first_json = JSON.parse(response);
				var actual_JSON = first_json.filter(HasNotBeenSeen);
                $('#startGame').fadeOut();
                $('#pointLayout').fadeIn();
				
				
				var questions = [];
				for(var i = 0; i < 12; i++)
				{
					var randomAnswer = Math.floor(Math.random() * (actual_JSON.length - 1) + 1);
					questions.push(actual_JSON[randomAnswer]);
				}
				
                var table = document.getElementById('pointTable').getElementsByTagName('tbody')[0];
                var tableRow = 0;
                for (var i = 0; i < questions.length; i++) {
                    var cellNumber = i % 4;
                    if (i % 4 == 0) {
                        var row = table.insertRow(tableRow);
                        tableRow++;
                    }

                    var cell = row.insertCell(cellNumber);
                    cell.innerText = questions[i].GameTitle;
                    cell.setAttribute("class", "game-select-question");
                    cell.setAttribute("data-question-number", i);
                }

                $(".answer").click(function () {
                    var correct = $(this).attr("data-correct") === "true";
                    $quiz.isCorrect(correct, false);
                    cdreset();
                });

                $(".game-select-question").click(function () {
                    var questionNumber = $(this).attr("data-question-number");
                    $quiz.loadQuestion(questionNumber, questions[questionNumber]);
                });
            });
        }
    },
    loadNewGame: function (path) {
        if (!isCalled) {
            isCalled = true;
            $quiz.loadJSON(path, function (response) {
                var first_json = JSON.parse(response);
                var actual_JSON = first_json.filter(HasNotBeenSeen);
                var diffOne = actual_JSON.filter(DiffOne);
                var diffTwo = actual_JSON.filter(DiffTwo);
                var diffThree = actual_JSON.filter(DiffThree);
                var diffFour = actual_JSON.filter(DiffFour);
                $('#startGame').fadeOut();
                $('#pointLayout').fadeIn();
				
				// shuffle question arrays
				shuffle(diffOne);
				shuffle(diffTwo);
				shuffle(diffThree);
				shuffle(diffFour);

				// get first three questions from each difficulty
                var questions = [];
				questions.push(diffOne[0]);
				questions.push(diffOne[1]);
                questions.push(diffOne[2]);
				questions.push(diffTwo[0]);
				questions.push(diffTwo[1]);
                questions.push(diffTwo[2]);
				questions.push(diffThree[0]);
				questions.push(diffThree[1]);
                questions.push(diffThree[2]);
				questions.push(diffFour[0]);
				questions.push(diffFour[1]);
                questions.push(diffFour[2]);
                
                var table = document.getElementById('pointTable').getElementsByTagName('tbody')[0];
                var tableRow = 0;
                for (var i = 0; i < questions.length; i++) {
                    $("#question-" + i)[0].innerText = questions[i].GameTitle;
                    $quiz.textfit($("#question-" + i));
                }

                $(".answer").click(function () {
                    var correct = $(this).attr("data-correct") === "true";
                    $quiz.isCorrect(correct, false);
                    cdreset();
                });

                $(".game-select-question").click(function () {
                    var questionNumber = $(this).attr("data-question-number");
                    $quiz.loadQuestion(questionNumber, questions[questionNumber]);
                });
            });
        }
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
            $('#right-sound').clone()[0].play();
            $('.right-answer-choice').fadeIn();
        } else {
            $('#wrong-sound').clone()[0].play();
            $('.wrong-answer-choice').fadeIn();
        }

        setTimeout(function () { $quiz.setAnswerClearAndReturn(correct) }, 2000);
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

        $('#question-text').text(question.Question);
        $('#question-number').text(question.QKEY);
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

        $('#question').delay(800).fadeIn();

		// after fadeIn starts, fit text
		setTimeout(function()
		{
			$quiz.textfit($('#question-text'));
			$quiz.textfit($('#1'));
			$quiz.textfit($('#2'));
			$quiz.textfit($('#3'));
			$quiz.textfit($('#4'));
		}, 800);
    },
    setDefaultPointValues: function() {
        for (var i = 0; i < 4; i++) {
            $('#points-' + i).text($('#points-' + i).attr('default-points') * $('#question-point-multiplier').val());
        }
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