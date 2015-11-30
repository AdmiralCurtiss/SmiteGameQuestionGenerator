using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CsvHelper;
using Newtonsoft.Json;
using SmiteGameQuestionGenerator.Models;

namespace SmiteGameQuestionGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            var path = string.Empty;
            var questionNumber = 2;
#if DEBUG
            path = "Test1.csv";
#else
            if (!args.Any())
            {
                Console.WriteLine("You must enter the name of the csv file!");
                return;
            }

            if (args.Length <= 2)
            {
                path = args[0];
            }

            if (args.Length >= 2)
            {
                questionNumber = Convert.ToInt32(args[1]);
            }
#endif
            var config = new CsvHelper.Configuration.CsvConfiguration();
            config.SkipEmptyRecords = true;
            config.WillThrowOnMissingField = false;
            config.DetectColumnCountChanges = false;
            var questions = new List<GameQuestionCsv>();
            var allQuestions = new List<GameQuestionCsv>();
            using (var textreader = File.OpenText(path))
            {
                var csv = new CsvReader(textreader);
                var list = csv.GetRecords<GameQuestionCsv>().ToList();
                allQuestions = list;
                Random rnd = new Random();
                var level1Questions =
                    list.OrderBy(user => rnd.Next()).Where(node => !node.HasSeen && node.Difficulty == 1).Take(questionNumber);
                questions.AddRange(level1Questions);
                var level2Questions =
                    list.OrderBy(user => rnd.Next()).Where(node => !node.HasSeen && node.Difficulty == 2).Take(questionNumber);
                questions.AddRange(level2Questions);
                var level3Questions =
                    list.OrderBy(user => rnd.Next()).Where(node => !node.HasSeen && node.Difficulty == 3).Take(questionNumber);
                questions.AddRange(level3Questions);
                var level4Questions =
                    list.OrderBy(user => rnd.Next()).Where(node => !node.HasSeen && node.Difficulty == 4).Take(questionNumber);
                questions.AddRange(level4Questions);
                var level5Questions =
                    list.OrderBy(user => rnd.Next()).Where(node => !node.HasSeen && node.Difficulty == 5).Take(questionNumber);
                questions.AddRange(level5Questions);
                foreach (var question in questions)
                {
                    var oldQuestion = allQuestions.First(node => node.QKEY == question.QKEY);
                    oldQuestion.HasSeen = true;
                }
            }

            var json = JsonConvert.SerializeObject(questions, Formatting.Indented);
            File.WriteAllText("questions.json", json);

            using (var textWriter = new StreamWriter("Edited_" + path))
            {
                var csv = new CsvWriter(textWriter);
                csv.WriteRecords(allQuestions);
            }
        }
    }
}
