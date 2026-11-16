
from sqlalchemy import Column, Integer, String, Text, Float
from database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    course_code = Column(String(20), unique=True, nullable=False, index=True)
    course_title = Column(String(150), nullable=False)
    credits = Column(Float, nullable=False)
    department = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
