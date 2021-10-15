import math

class Rectangle:
  def __init__(self, width, height):
    self.w = width
    self.h = height

  def set_width(self, width):
    self.w = width

  def set_height(self, height):
    self.h = height

  def get_area(self):
    return self.w * self.h

  def get_perimeter(self):
    return 2 * self.w + 2 * self.h

  def get_diagonal(self):
    return (self.w ** 2 + self.h ** 2) ** .5

  def get_picture(self):
    if self.w > 50 or self.h > 50:
      return "Too big for picture."
    string = "*" * self.w + "\n"
    string += string * (self.h - 1)
    return string

  def get_amount_inside(self, shape):
    return math.floor(self.get_area() / shape.get_area())

  def __str__(self):
    return "Rectangle(width=" + str(self.w) + ", height=" + str(self.h) + ")"



class Square(Rectangle):
  def __init__(self, length):
    self.w = length
    self.h = length

  def set_side(self, length):
    self.w = length
    self.h = length

  def set_width(self, width):
    self.w = width
    self.h = width

  def set_height(self, height):
    self.h = height
    self.w = height

  def __str__(self):
    return "Square(side=" + str(self.w) + ")"
