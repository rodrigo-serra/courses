def add_time(*args):
  
  phase = ["AM", "PM"]
  weekDays = ["Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday", "Sunday"]

  timeSplit = args[0].split()

  # Variable working as switch in every 12 hour cycle
  # 0 for AM and 1 for PM
  phaseVar = 1 if timeSplit[1] == "PM" else 0

  # Extract integers from current clock
  clock = timeSplit[0].split(":")
  clockHours = int(clock[0])
  clockMinutes = int(clock[1])

  # Extract integers from duration
  durationSplit = args[1].split(":")
  durationHours = int(durationSplit[0])
  durationMinutes = int(durationSplit[1])

  # Find index that matches week day
  weekIndex = 0
  if len(args) == 3:
    weekIndex = weekDays.index(args[2].capitalize())

  # Addressing minutes first
  totalMinutes = clockMinutes + durationMinutes
  restMinutes = totalMinutes - 60
  if restMinutes > 0:
    durationHours = durationHours + 1
    totalMinutes = restMinutes

  # Addressing Hours
  dayCounter = 0
  for i in range(0, durationHours):
    clockHours = clockHours + 1 if clockHours < 12 else 1
    if clockHours == 12:
      if phaseVar == 1:
        phaseVar = 0
        dayCounter = dayCounter + 1
        weekIndex = weekIndex + 1 if weekIndex < len(weekDays) - 1 else 0 
      else:
        phaseVar = 1
  
  # Building result
  finalHour = str(clockHours)
  finalMinutes = str(totalMinutes)
  if len(finalMinutes) == 1:
    finalMinutes = "0" + finalMinutes
  
  if len(args) == 3:
    if dayCounter > 1:
      return finalHour + ":" + finalMinutes + " " + phase[phaseVar] + ", " + weekDays[weekIndex] + " (" + str(dayCounter) + " days later)"
    elif dayCounter == 1:
      return finalHour + ":" + finalMinutes + " " + phase[phaseVar] + ", " + weekDays[weekIndex] + " (next day)"
    else:
      return finalHour + ":" + finalMinutes + " " + phase[phaseVar] + ", " + weekDays[weekIndex]
  else:
    if dayCounter > 1:
      return finalHour + ":" + finalMinutes + " " + phase[phaseVar] + " (" + str(dayCounter) + " days later)"
    elif dayCounter == 1:
      return finalHour + ":" + finalMinutes + " " + phase[phaseVar] + " (next day)"
    else:
      return finalHour + ":" + finalMinutes + " " + phase[phaseVar]
