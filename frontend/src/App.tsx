
import { useEffect, useState } from "react";
import "./App.css";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  type Course,
  type CourseInput,
} from "./api";

function App() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    course_code: "",
    course_title: "",
    credits: "3",
    department: "",
    description: "",
  });

  // Load courses from backend
  async function loadCourses() {
    try {
      setError("");
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load courses"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  // Dashboard statistics
  const totalCourses = courses.length;

  const totalDepartments = new Set(
    courses.map((course) => course.department)
  ).size;

  const totalCredits = courses.reduce(
    (total, course) => total + course.credits,
    0
  );

  // Open empty form
  function openAddForm() {
    setEditingCourse(null);
    setFormData({
      course_code: "",
      course_title: "",
      credits: "3",
      department: "",
      description: "",
    });
    setActiveMenu("Add Course");
  }

  // Open edit form
  function openEditForm(course: Course) {
    setEditingCourse(course);
    setFormData({
      course_code: course.course_code,
      course_title: course.course_title,
      credits: String(course.credits),
      department: course.department,
      description: course.description || "",
    });
    setActiveMenu("Add Course");
  }

  // Handle form input
  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Create or update course
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const courseData: CourseInput = {
      course_code: formData.course_code.trim(),
      course_title: formData.course_title.trim(),
      credits: Number(formData.credits),
      department: formData.department.trim(),
      description: formData.description.trim() || null,
    };

    try {
      setSaving(true);
      setError("");

      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData);
        alert("Course updated successfully!");
      } else {
        await createCourse(courseData);
        alert("Course created successfully!");
      }

      await loadCourses();
      setEditingCourse(null);
      setActiveMenu("All Courses");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save course"
      );
    } finally {
      setSaving(false);
    }
  }

  // Delete course
  async function handleDelete(course: Course) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${course.course_code}?`
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteCourse(course.id);

      if (selectedCourse?.id === course.id) {
        setSelectedCourse(null);
        setActiveMenu("All Courses");
      }

      await loadCourses();
      alert("Course deleted successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete course"
      );
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>IUBi<span>CAS</span></h2>

        <p className="menu-label">MENU</p>

        {["Dashboard", "All Courses", "Add Course"].map((item) => (
          <button
            key={item}
            className={activeMenu === item ? "menu-item active" : "menu-item"}
            onClick={() => {
              if (item === "Add Course") {
                openAddForm();
              } else {
                setActiveMenu(item);
                setSelectedCourse(null);
              }
            }}
          >
            {item}
          </button>
        ))}

        <div className="sidebar-footer">
          <p>IUB Course & Academic System</p>
          <small>Version 1.0.0</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{activeMenu === "Add Course" && editingCourse ? "Edit Course" : activeMenu}</h1>
            <p>Manage your university courses easily.</p>
          </div>

          <div className="profile">
            <div className="avatar">A</div>
            <span>Admin</span>
          </div>
        </header>

        {error && (
          <section className="content-card">
            <p style={{ color: "red" }}>{error}</p>
          </section>
        )}

        {loading ? (
          <section className="content-card">
            <p>Loading course information...</p>
          </section>
        ) : (
          <>
            {/* Dashboard */}
            {activeMenu === "Dashboard" && (
              <>
                <section className="welcome">
                  <div>
                    <h2>Welcome to IUBiCAS!</h2>
                    <p>
                      Manage courses, organize information, and keep
                      everything in one place.
                    </p>
                  </div>
                  <div className="welcome-icon">🎓</div>
                </section>

                <section className="stats">
                  <div className="stat-card purple">
                    <span>Total Courses</span>
                    <h2>{totalCourses}</h2>
                    <p>Available courses</p>
                  </div>

                  <div className="stat-card orange">
                    <span>Departments</span>
                    <h2>{totalDepartments}</h2>
                    <p>Academic departments</p>
                  </div>

                  <div className="stat-card green">
                    <span>Total Credits</span>
                    <h2>{totalCredits}</h2>
                    <p>Across all courses</p>
                  </div>
                </section>

                <section className="content-card">
                  <h2>Getting Started</h2>
                  <p>
                    Your Course Management Dashboard is connected
                    to the backend.
                  </p>

                  <button
                    className="primary-button"
                    onClick={openAddForm}
                  >
                    + Add New Course
                  </button>
                </section>
              </>
            )}

            {/* All Courses */}
            {activeMenu === "All Courses" && (
              <section className="content-card">
                <div className="courses-header">
                  <div>
                    <h2>All Courses</h2>
                    <p>Total courses: {totalCourses}</p>
                  </div>

                  <button
                    className="primary-button"
                    onClick={openAddForm}
                  >
                    + Add Course
                  </button>
                </div>

                {courses.length === 0 ? (
                  <p>No courses found. Add your first course.</p>
                ) : (
                  <div className="table-container">
                    <table className="courses-table">
                      <thead>
                        <tr>
                          <th>Course Code</th>
                          <th>Course Title</th>
                          <th>Department</th>
                          <th>Credits</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {courses.map((course) => (
                          <tr key={course.id}>
                            <td><strong>{course.course_code}</strong></td>
                            <td>{course.course_title}</td>
                            <td>{course.department}</td>
                            <td>{course.credits}</td>
                            <td>
                              <div className="course-actions">
                                <button
                                  className="view-button"
                                  onClick={() => {
                                    setSelectedCourse(course);
                                    setActiveMenu("Course Details");
                                  }}
                                >
                                  View
                                </button>

                                <button
                                  className="edit-button"
                                  onClick={() => openEditForm(course)}
                                >
                                  Edit
                                </button>

                                <button
                                  className="delete-button"
                                  onClick={() => handleDelete(course)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* Course Details */}
            {activeMenu === "Course Details" && selectedCourse && (
              <section className="content-card">
                <h2>Course Details</h2>

                <p><strong>Course Code:</strong> {selectedCourse.course_code}</p>
                <p><strong>Course Title:</strong> {selectedCourse.course_title}</p>
                <p><strong>Department:</strong> {selectedCourse.department}</p>
                <p><strong>Credits:</strong> {selectedCourse.credits}</p>
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedCourse.description || "No description available"}
                </p>

                <button
                  className="primary-button"
                  onClick={() => setActiveMenu("All Courses")}
                >
                  Back to Courses
                </button>
              </section>
            )}

            {/* Add and Edit Course */}
            {activeMenu === "Add Course" && (
              <section className="content-card">
                <h2>{editingCourse ? "Edit Course" : "Add New Course"}</h2>

                <form className="course-form" onSubmit={handleSubmit}>
                  <label>Course Code</label>
                  <input
                    name="course_code"
                    value={formData.course_code}
                    onChange={handleInputChange}
                    placeholder="e.g. CSE101"
                    required
                  />

                  <label>Course Title</label>
                  <input
                    name="course_title"
                    value={formData.course_title}
                    onChange={handleInputChange}
                    placeholder="Enter course title"
                    required
                  />

                  <label>Credits</label>
                  <input
                    name="credits"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.credits}
                    onChange={handleInputChange}
                    required
                  />

                  <label>Department</label>
                  <input
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g. Computer Science"
                    required
                  />

                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter course description"
                    rows={4}
                  />

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="primary-button"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : editingCourse
                        ? "Update Course"
                        : "Save Course"}
                    </button>

                    <button
                      type="button"
                      className="view-button"
                      onClick={() => {
                        setEditingCourse(null);
                        setActiveMenu("All Courses");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
