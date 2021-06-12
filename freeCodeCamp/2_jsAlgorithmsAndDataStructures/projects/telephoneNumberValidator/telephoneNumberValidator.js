function telephoneCheck(str) {
    // Turn into object
    let phoneFormat = {
        1: /^\d{3}-\d{3}-\d{4}$/,
        2: /^1-\d{3}-\d{3}-\d{4}$/,
        3: /^\(\d{3}\)\d{3}-\d{4}$/,
        4: /^1\(\d{3}\)\d{3}-\d{4}$/,
        5: /^\d{3} \d{3} \d{4}$/,
        6: /^1 \d{3} \d{3} \d{4}$/,
        7: /^\d{3}\d{3}\d{4}$/,
        8: /^1\d{3}\d{3}\d{4}$/,
        9: /^1 \d{3}-\d{3}-\d{4}$/,
        10: /^1 \(\d{3}\) \d{3}-\d{4}$/
    };
    for(let format in phoneFormat){
      if(phoneFormat[format].test(str))
        return true;
    }
    return false;
  }
  
  // Testing Example
  console.log(telephoneCheck("1 555 555 5555"));