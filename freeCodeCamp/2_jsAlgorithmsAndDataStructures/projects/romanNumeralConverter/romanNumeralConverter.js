
function convertToRoman(num) {
    let numDigits = [];
    let numRest;
    let digitPlace = 0;
    while(num >= 1){
        numRest = num % 10;
        numDigits.push(romanCharacters(numRest, digitPlace));
        num = Math.floor(num/10);
        digitPlace++;
    }
    let digitReverse = numDigits.reverse().join("");
    return digitReverse;
    
   }
   
   function romanCharacters(number, place){
       
       const one = "I";
       const five = "V";
       const ten = "X";
       const fifty = "L";
       const hundred = "C";
       const fivehundred = "D";
       const thousand = "M";
   
       if(place == 0){
           switch(true) {
                case number < 4:
                   return one.repeat(number);
                case number == 4:
                   return one + five;
                case number == 5:
                   return five;
                case number < 9:
                   return five + one.repeat(number - 5);
                default:
                   return one + ten;
           }
       } else if(place == 1){
           switch(true) {
                case number < 4:
                   return ten.repeat(number);
                case number == 4:
                   return ten + fifty;
                case number == 5:
                   return fifty;
                case number < 9:
                   return fifty + ten.repeat(number - 5);
                default:
                   return ten + hundred;
           }
   
       } else if(place == 2){
           switch(true) {
                case number < 4:
                   return hundred.repeat(number);
                case number == 4:
                   return hundred + fivehundred;
                case number == 5:
                   return fivehundred;
                case number < 9:
                   return fivehundred + hundred.repeat(number - 5);
                default:
                   return hundred + thousand;
           }
   
       } else {
           return thousand.repeat(number);
       }
   }
   
   // Test Examples
   console.log(convertToRoman(2014));