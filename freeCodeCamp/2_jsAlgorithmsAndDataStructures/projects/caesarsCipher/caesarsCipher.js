function rot13(str) {
    let characters = str.split("");
    let newChar = characters.map(function(letter){
      if(letter.match(/\W|\_/)){
        return letter;
      }else{
        let charCode = letter.charCodeAt(0);
        let newLetterCode = (charCode + 13 > 90) ? 65 + charCode + 13 - 90 - 1 : charCode + 13;
        return String.fromCharCode(newLetterCode);
      }
    });
    return newChar.join("");
  }
  
  // Testing Example
  console.log(rot13("SERR PBQR PNZC"));