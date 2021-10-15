class Category:
  def __init__(self, name):
    self.categType = name
    self.ledger = []
    self.balance = 0

  def deposit(self, *args):
    amount = args[0]
    description = args[1] if len(args) > 1 else ""
    self.ledger.append({"amount": amount, "description": description})
    self.balance = self.balance + amount

  def get_balance(self):
    return self.balance

  def check_funds(self, amount):
    return False if amount > self.balance else True

  def withdraw(self, *args):
    amount = args[0]
    description = args[1] if len(args) > 1 else ""
    if not self.check_funds(amount):
      return False
    self.ledger.append({"amount": amount*-1, "description": description})
    self.balance = self.balance - amount
    return True
    
  def transfer(self, amount, budgetCateg):
    if self.withdraw(amount, "Transfer to " + budgetCateg.categType):
      budgetCateg.deposit(amount, "Transfer from " + self.categType)
      return True
    return False

  # Print object
  def __str__(self):
    # First line of print
    numOfStars = int((30 - len(self.categType)) / 2)
    output = "*"*numOfStars + self.categType + "*"*numOfStars + "\n"
    
    # List of items in the ledger
    # Description + amount
    for mov in self.ledger:
      if len(mov["description"]) > 23:
        descriptionString = mov["description"][0:23]
      elif len(mov["description"]) == 23:
        descriptionString = mov["description"]
      else:
        descriptionString = mov["description"] + " "*(23 - len(mov["description"]))
      
      checkAmount = str(mov["amount"]).split(".")
      if len(checkAmount) > 1:
        if len(checkAmount[1]) == 1:
          amountString = " "*(7 - len(str(mov["amount"])) - 1) + str(mov["amount"]) + "0\n"
        else:
          amountString = " "*(7 - len(str(mov["amount"]))) + str(mov["amount"]) + "\n"
      else:
          amountString = " "*(7 - len(str(mov["amount"])) - 3) + str(mov["amount"]) + ".00\n"
      output = output + descriptionString + amountString

    # Last line of print (balance)
    checkBalance = str(self.balance).split(".")
    if len(checkBalance) > 1:
      if len(checkBalance[1]) == 1:
        output += "Total: " + str(self.balance) + "0"
      else:
        output += "Total: " + str(self.balance)
    else:
      output = "Total: " + str(self.balance) + ".00"

    return output
    

# The markdown says "The percentage should be calculated only with withdrawals and not deposits".
# This means that 100% corresponds to the sum of all withdrawals from each category,
# i.e. 100% --> withdrawals from food + withdrawals from clothing + withdrawals from auto.
# The percentage spent by category is calculated from this sum and the sum of all withdrawals per category,
# i.e. Food --> 100 * SUM(withdrawals from Food) / sum of all 
def create_spend_chart(categories):
  spentPerCat = [moneySpent(cat) for cat in categories]
  totalSpent = sum(spentPerCat)
  spentPerCatPercent = [ x * 100 / totalSpent for x in spentPerCat]
  for i in range(0, len(spentPerCatPercent)):
    numString = (str(spentPerCatPercent[i])).split(".")
    spentPerCatPercent[i] = int(numString[0][0] + "0") if len(numString[0]) > 1 else int(numString[0][0])
  return generateFinalString(categories, spentPerCatPercent)


def moneySpent(category):
  sum = 0
  for mov in category.ledger:
    sum += mov["amount"] if mov["amount"] < 0 else 0
  return sum


def generateFinalString(categoriesObjects, spentPerCatPercent):
  categories = [cat.categType for cat in categoriesObjects]
  # Title
  output = "Percentage spent by category\n"
  # Addresing chart
  numOfSpaces = 3 * len(categories) + 1
  for i in range(100, -10, -10):
    s = " " * (3 - len(str(i))) + str(i) + "|" + " "*numOfSpaces
    listOfS = list(s)
    index = 5
    for percent in spentPerCatPercent:
      if percent >= i:
        listOfS[index] = "o"
      index += 3
    output += "".join(listOfS) + "\n"
  # Adding the "-----"
  output += " " * 4 + "-" * (len(categories) * 3 + 1)
  # Labels
  numOfSpaces += 4
  i = 0
  ctr = 0
  while True:
    s =  " " * numOfSpaces
    listOfS = list(s)
    index = 5
    ctr = 0
    for cat in categories:
      if i >= len(cat):
        ctr += 1
      else:
        listOfS[index] = cat[i]
      index += 3
    if ctr == len(categories):
      break
    output += "\n" + "".join(listOfS)
    i += 1

  return output

