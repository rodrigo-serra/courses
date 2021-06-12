function palindrome(str) {
    let replacedString = str.toLowerCase().replace(/\W|_/g,"").split("");
    let reversedArr = replacedString.slice(0).reverse();
    if(replacedString.every((c, index) => c === reversedArr[index]))
      return true;
    else
      return false;
  }
  
  // Testing Examples
  console.log(palindrome("not a palindrome"));
  console.log(palindrome("level"));