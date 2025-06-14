from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from config import Base


class ClassGroup(Base.Model):
    __tablename__ = 'class_group'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    # Relations
    students = relationship('Student', back_populates='class_group')
    class_subjects = relationship('ClassSubject', back_populates='class_group')
    teacher_assignments = relationship(
        'TeacherAssignment', back_populates='class_group')
