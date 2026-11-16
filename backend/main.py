
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from models import Course
from schemas import CourseCreate, CourseUpdate, CourseResponse

# Database table তৈরি
Base.metadata.create_all(bind=engine)

# FastAPI application
app = FastAPI(
    title="Course Registration System API",
    description="API for managing university courses",
    version="1.0.0"
)


# Home route
@app.get("/")
def home():
    return {"message": "Course Registration System API is running"}


# Health check
@app.get("/api/health")
def health_check():
    return {"status": "ok"}


# 1. CREATE COURSE
@app.post("/api/courses", response_model=CourseResponse, status_code=201)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):

    existing_course = db.query(Course).filter(
        Course.course_code == course.course_code
    ).first()

    if existing_course:
        raise HTTPException(
            status_code=400,
            detail="Course code already exists"
        )

    new_course = Course(**course.model_dump())

    db.add(new_course)
    db.commit()
    db.refresh(new_course)

    return new_course


# 2. READ ALL COURSES
@app.get("/api/courses", response_model=list[CourseResponse])
def get_courses(db: Session = Depends(get_db)):

    courses = db.query(Course).all()

    return courses


# 3. READ SINGLE COURSE
@app.get("/api/courses/{course_id}", response_model=CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db)):

    course = db.query(Course).filter(
        Course.id == course_id
    ).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    return course


# 4. UPDATE COURSE
@app.put("/api/courses/{course_id}", response_model=CourseResponse)
def update_course(
    course_id: int,
    updated_data: CourseUpdate,
    db: Session = Depends(get_db)
):

    course = db.query(Course).filter(
        Course.id == course_id
    ).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    duplicate_course = db.query(Course).filter(
        Course.course_code == updated_data.course_code,
        Course.id != course_id
    ).first()

    if duplicate_course:
        raise HTTPException(
            status_code=400,
            detail="Course code already exists"
        )

    for key, value in updated_data.model_dump().items():
        setattr(course, key, value)

    db.commit()
    db.refresh(course)

    return course


# 5. DELETE COURSE
@app.delete("/api/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):

    course = db.query(Course).filter(
        Course.id == course_id
    ).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    db.delete(course)
    db.commit()

    return {"message": "Course deleted successfully"}
