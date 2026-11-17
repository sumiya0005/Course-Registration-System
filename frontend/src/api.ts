
const API_BASE_URL = "https://course-registration-system-delta.vercel.app";

export interface Course {
  id: number;
  course_code: string;
  course_title: string;
  credits: number;
  department: string;
  description: string | null;
}

export interface CourseInput {
  course_code: string;
  course_title: string;
  credits: number;
  department: string;
  description: string | null;
}

// Get all courses
export async function getCourses(): Promise<Course[]> {
  const response = await fetch(`${API_BASE_URL}/api/courses`);

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  return response.json();
}

// Get single course
export async function getCourse(id: number): Promise<Course> {
  const response = await fetch(`${API_BASE_URL}/api/courses/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }

  return response.json();
}

// Create course
export async function createCourse(data: CourseInput): Promise<Course> {
  const response = await fetch(`${API_BASE_URL}/api/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create course");
  }

  return response.json();
}

// Update course
export async function updateCourse(
  id: number,
  data: CourseInput
): Promise<Course> {
  const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update course");
  }

  return response.json();
}

// Delete course
export async function deleteCourse(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete course");
  }
}
