from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from config import Base


class Student(Base.Model):
    __tablename__ = 'student'
    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    class_id = Column(Integer, ForeignKey('class_group.id'), nullable=False)
    # Relations
    user = relationship('User', back_populates='student')
    class_group = relationship('ClassGroup', back_populates='students')