from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from config import Base


class Subject(Base.Model):
    __tablename__ = 'subject'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    # Relations
    labs = relationship('Lab', back_populates='subject')
    class_subjects = relationship('ClassSubject', back_populates='subject')
    teacher_assignments = relationship('TeacherAssignment', back_populates='subject')