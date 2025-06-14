from sqlalchemy import Column, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship
from config import Base
from sqlalchemy import Float, DateTime, Text, UniqueConstraint
from datetime import datetime
import enum


class ProgressStatus(enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    completed = "completed"


class StudentLabProgress(Base.Model):
    __tablename__ = 'student_lab_progress'
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    lab_id = Column(Integer, ForeignKey('lab.id'), nullable=False)
    progress = Column(Float, default=0.0)
    last_saved = Column(DateTime, default=datetime.utcnow)
    work_data = Column(Text)
    status = Column(Enum(ProgressStatus), default=ProgressStatus.not_started)
    # Contrainte unique
    __table_args__ = (UniqueConstraint('student_id', 'lab_id'),)
    # Relations
    student = relationship('User', back_populates='student_lab_progress')
    lab = relationship('Lab', back_populates='student_progress')
