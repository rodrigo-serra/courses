const CURRENCY_UNIT = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.1,
  "QUARTER": 0.25,
  "ONE": 1,
  "FIVE": 5,
  "TEN": 10,
  "TWENTY": 20,
  "ONE HUNDRED": 100
};

function checkCashRegister(price, cash, cid) {
    let change = cash - price;
    let originalChange = change;
    let totalCashInDrawer = (cid.reduce((sum, element) => sum += element[1], 0)).toFixed(2);
    if(totalCashInDrawer < change){
        return {status: "INSUFFICIENT_FUNDS", change: []};
    }else if (totalCashInDrawer == change){
        // Return all elements
        return {status: "CLOSED", change: cid};
    }else{
        let cidReverse = cid.reverse();
        let changeArr = cidReverse.map(function(element){
        let currentMoney = element[1];
        let moneyCounter = 0;
        while(change - CURRENCY_UNIT[element[0]] >= 0 && currentMoney > 0){
            change = (change - CURRENCY_UNIT[element[0]]).toFixed(2);
            currentMoney -= CURRENCY_UNIT[element[0]];
            moneyCounter += CURRENCY_UNIT[element[0]];;
        }
        return [element[0], moneyCounter];
    });
    
        let finalChangeArr = changeArr.filter(element => element[1] != 0);
        if(finalChangeArr.reduce((sum, element) => sum += element[1], 0) < originalChange)
            return {status: "INSUFFICIENT_FUNDS", change: []};

        return {status: "OPEN", change: finalChangeArr};
    }
  
}

// Testing Example
console.log(checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));