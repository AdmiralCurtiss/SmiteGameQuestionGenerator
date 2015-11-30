using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SmiteGameQuestionGenerator.Models
{
    public class GameQuestionCsv
    {
        [JsonProperty("Timestamp")]
        public string Timestamp { get; set; }

        [JsonProperty("QKEY")]
        public string QKEY { get; set; }

        [JsonProperty("Submitter")]
        public string Submitter { get; set; }

        [JsonProperty("GameTitle")]
        public string GameTitle { get; set; }

        [JsonProperty("Question")]
        public string Question { get; set; }

        [JsonProperty("CorrectAnswer")]
        public string CorrectAnswer { get; set; }

        [JsonProperty("FakeAnswer1")]
        public string FakeAnswer1 { get; set; }

        [JsonProperty("FakeAnswer2")]
        public string FakeAnswer2 { get; set; }

        [JsonProperty("FakeAnswer3")]
        public string FakeAnswer3 { get; set; }

        [JsonProperty("Difficulty")]
        public int Difficulty { get; set; }

        [JsonProperty("Comments")]
        public string Comments { get; set; }

        [JsonProperty("HasSeen")]
        public bool HasSeen { get; set; }
    }
}
