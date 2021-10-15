import copy
import random
# Consider using the modules imported above.

class Hat:
  def __init__(self, **kwargs):
    self.contents = []
    for key, value in kwargs.items():
      self.contents.extend([key] * value)

  def draw(self, num):
    drawList = []
    originalLength = len(self.contents)
    for i in range(0, num):
      if i >= originalLength:
        break
      index = random.randint(0, len(self.contents) - 1)
      drawList.append(self.contents[index])
      self.contents.pop(index)
      
    return drawList

def experiment(hat, expected_balls, num_balls_drawn, num_experiments):
  hits = 0
  for i in range(0, num_experiments):
    auxHat = copy.deepcopy(hat)
    drawList = auxHat.draw(num_balls_drawn)
    checker = 0
    for key, value in expected_balls.items():
      if drawList.count(key) >= value:
        checker += 1
    if checker == len(expected_balls):
      hits += 1
    del auxHat

  return hits / num_experiments


