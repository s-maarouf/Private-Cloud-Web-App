from sqlalchemy import Column, Integer, String, Enum as SqlEnum
from config import Base
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum


class Role(PyEnum):
    student = 'étudiant'
    teacher = 'enseignant'
    administrator = 'administrateur'


class User(Base.Model):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(SqlEnum(Role), nullable=False)
    name = Column(String(50), nullable=False)
    first_name = Column(String(50), nullable=False)
    student = relationship('Student', uselist=False, back_populates='user')
    created_labs = relationship('Lab', back_populates='creator')
    teacher_assignments = relationship(
        'TeacherAssignment', back_populates='teacher')
    student_lab_progress = relationship(
        'StudentLabProgress', back_populates='student')
