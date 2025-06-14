from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from config import Base

class TeacherAssignment(Base.Model):
    __tablename__ = 'teacher_assignment'
    teacher_id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    class_id = Column(Integer, ForeignKey('class_group.id'), primary_key=True)
    subject_id = Column(Integer, ForeignKey('subject.id'), primary_key=True)
    # Relations
    teacher = relationship('User', back_populates='teacher_assignments')
    class_group = relationship('ClassGroup', back_populates='teacher_assignments')
    subject = relationship('Subject', back_populates='teacher_assignments')