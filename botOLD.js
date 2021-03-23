// A list of rules. Each rule is defined by a pattern consisting of
// words or '*' and a reply which contains words or indices (starting
// from zero) that refer to matched '*' word lists in the pattern.
var rules =
  [
    {
      "pattern": ["*", "I", "am", "*"],
      "reply": ["Can you explain what made you ", 1, "?"]
    },
    {
      "pattern": ["*", "I", "remember", "*"],
      "reply": ["What made you think about ", 1, "?"]
    },
    {
      "pattern": ["*", "loves", "*"],
      "reply": ["How does that make you feel about ", 0, "?"]
    },
    {
      "pattern": ["*", "mother", "*"],
      "reply": ["Tell me more about your family."]
    },
    {
      "pattern": ["*", "father", "*"],
      "reply": ["Tell me more about your family."]
    },
  ]

// Some words need to be replaced when recomposing the reply so that
// "I remember my dog" -> "What made you think about *your* dog?"
var replacements =
  [
    ["my", "your"],
    ["My", "your"],
    ["me", "you"],
    ["Me", "you"],
    ["I", "you"]
  ]

// Checks whether given words match given pattern (pIndex and wi are
// indices of current position in pattern and word that we are 
// looking at). Returns 'null' if matching fails or an array of 
// matched word(s) that correspond to all '*' in the pattern.
function matchPattern(pattern, word, pIndex, wIndex) {
  if (pIndex == pattern.length && wIndex == word.length) return [];
  if (pIndex == pattern.length) {
    return null;
  }
  if (pattern[pIndex] == "*") {
    // Try matching '*' with anything between zero or all remaining words
    for (var l = 0; l <= word.length - wIndex; l++) {
      var res = matchPattern(pattern, word, pIndex + 1, wIndex + l)
      if (res) {
        // If matching succeeded, apply replacements and add 
        // words matched against the current '*' to returned result
        var sub = word.slice(wIndex, wIndex + l);
        for (var i = 0; i < sub.length; i++) {
          for (var j = 0; j < replacements.length; j++) {
            if (sub[i] == replacements[j][0]) sub[i] = replacements[j][1];
          }
        }
        return [sub.join(' ')].concat(res);
      }
    }
    return null;
  }
  if (wIndex == word.length)
    return null;
  if (pattern[pIndex] == word[wordIndex]) {
    return matchPattern(pattern, word, pIndex + 1, wIndex + 1)
  }
}

function saySomething() {
  var message = document.getElementById('message').value;  
  reply(message);
}

function reply(message) {
  var conversation = document.getElementById('conversation');
  var answer = "Can you tell me more about that?";
  var words = message.split(' ');
  // Iterate over all rules and find the first one that matches
  for (var i = 0; i < rules.length; i++) {
    var match = matchPattern(rules[i].pattern, words, 0, 0)
    if (match) {
      // Reconstruct a reply - if a token is a number, find the
      // matched word from 'match', otherwise just append the word
      var res = ""
      for (var token of rules[i].reply) {
        if (typeof (token) == "number") res += match[token]
        else res += token;
      }
      answer = res;
    }
  }
  conversation.innerHTML += "<p><strong>You:</strong> " + message + "</p>";
  conversation.innerHTML += "<p><strong>Eliza:</strong> " + answer + "</p>";
}