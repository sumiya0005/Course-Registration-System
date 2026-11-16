
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


# Course create করার জন্য
class CourseCreate(BaseModel):
    course_code: str = Field(min_length=2, max_length=20)
    course_title: str = Field(min_length=2, max_length=150)
    credits: float = Field(gt=0, le=10)
    department: str = Field(min_length=2, max_length=100)
    description: Optional[str] = None


# Course update করার জন্য
class CourseUpdate(BaseModel):
    course_code: str = Field(min_length=2, max_length=20)
    course_title: str = Field(min_length=2, max_length=150)
    credits: float = Field(gt=0, le=10)
    department: str = Field(min_length=2, max_length=100)
    description: Optional[str] = None


# API response-এর জন্য
class CourseResponse(CourseCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)
