from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from config import Base


class ClassSubject(Base.Model):
    __tablename__ = 'class_subject'
    class_id = Column(Integer, ForeignKey('class_group.id'), primary_key=True)
    subject_id = Column(Integer, ForeignKey('subject.id'), primary_key=True)
    # Relations
    class_group = relationship('ClassGroup', back_populates='class_subjects')
    subject = relationship('Subject', back_populates='class_subjects')
