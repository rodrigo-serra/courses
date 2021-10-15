import re

def arithmetic_arranger(*args):
  problems = args[0]
  condition = False
  if len(args) > 1 and args[1]:
    condition = args[1]

  if len(problems) > 5:
    return "Error: Too many problems." 

  str1 = ""
  str2 = ""
  str3 = ""
  str4 = ""
  ctr = 0

  for op in problems:
    splitOp = op.split()

    if re.search("\+|\-", splitOp[1]) == None:
      return "Error: Operator must be '+' or '-'."

    if re.search("^\d+$", splitOp[0]) == None or re.search("^\d+$", splitOp[2]) == None:
      return "Error: Numbers must only contain digits."
      
    if re.search("^\d{1,4}$", splitOp[0]) == None or re.search("^\d{1,4}$", splitOp[2]) == None:
      return "Error: Numbers cannot be more than four digits."

    if splitOp[1] == "+":
      result = str(int(splitOp[0]) + int(splitOp[2]))
    else:
      result = str(int(splitOp[0]) - int(splitOp[2]))

    if len(splitOp[0]) > len(splitOp[2]):
      str1 += ' '*2 + splitOp[0]
      str2 += splitOp[1] + ' ' * (1 + len(splitOp[0]) - len(splitOp[2])) + splitOp[2]
      str3 += "-" * (len(splitOp[0]) + 2)
      str4 += ' ' * (len(splitOp[0]) + 2 - len(result)) + result
    else:
      str1 += ' ' * (2 + len(splitOp[2]) - len(splitOp[0])) + splitOp[0]
      str2 += splitOp[1] + ' ' + splitOp[2]
      str3 += "-" * (len(splitOp[2]) + 2)
      str4 += ' ' * (len(splitOp[2]) + 2 - len(result)) + result

    if ctr < len(problems) - 1:
      str1 += ' ' * 4
      str2 += ' ' * 4
      str3 += ' ' * 4
      str4 += ' ' * 4
    else:
      str1 += "\n"
      str2 += "\n"
      if condition:
        str3 += "\n"

    ctr = ctr + 1

  if condition:
    return str1 + str2 + str3 + str4
  else:
    return str1 + str2 + str3