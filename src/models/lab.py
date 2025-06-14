from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SqlEnum, DateTime
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from config import Base
from datetime import datetime


class LabStatus(PyEnum):
    pending = 'pending'
    approved = 'approved'
    rejected = 'rejected'


class Lab(Base.Model):
    __tablename__ = 'lab'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    subject_id = Column(Integer, ForeignKey('subject.id'), nullable=False)
    created_by = Column(Integer, ForeignKey('user.id'), nullable=False)
    status = Column(SqlEnum(LabStatus),
                    default=LabStatus.pending, nullable=False)
    creation_date = Column(DateTime, default=datetime.utcnow)
    approval_date = Column(DateTime, nullable=True)
    # Relations
    subject = relationship('Subject', back_populates='labs')
    creator = relationship('User', back_populates='created_labs')
    student_progress = relationship('StudentLabProgress', back_populates='lab')
