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
				for(var i = 0; i < 8; i++)
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
                var diffOne = first_json.filter(DiffOne);
                var diffTwo = first_json.filter(DiffTwo);
                var diffThree = first_json.filter(DiffThree);
                var diffFour = first_json.filter(DiffFour);
                $('#startGame').fadeOut();
                $('#pointLayout').fadeIn();


                var questions = [];
                for (var i = 0; i < 8; i++) {
                    if (i < 2) {
                        var randomAnswer = Math.floor(Math.random() * (diffOne.length - 1) + 1);
                        questions.push(diffOne[randomAnswer]);
                    }
                    if (i < 4) {
                        var randomAnswer = Math.floor(Math.random() * (diffTwo.length - 1) + 1);
                        questions.push(diffTwo[randomAnswer]);
                    }
                    if (i < 6) {
                        var randomAnswer = Math.floor(Math.random() * (diffThree.length - 1) + 1);
                        questions.push(diffThree[randomAnswer]);
                    }
                    if (i < 8) {
                        var randomAnswer = Math.floor(Math.random() * (diffFour.length - 1) + 1);
                        questions.push(diffFour[randomAnswer]);
                    }
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
            $('#submitter-text').hide();
        } else {
            $('#submitter-text').show();
            $('#submitter-text').text("Submitted By: " + question.Submitter);
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