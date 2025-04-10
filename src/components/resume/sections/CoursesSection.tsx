
import React from "react";
import { Course } from "@/contexts/ResumeContext";
import { format } from "date-fns";

interface CoursesSectionProps {
  courses: Course[];
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ courses }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Courses & Certifications</h2>
      {courses.map((course) => (
        <div key={course.id} className="mb-4">
          <div className="flex justify-between">
            <h3 className="font-bold text-base">{course.name}</h3>
            <span className="text-sm">
              {course.startDate && format(new Date(course.startDate), "MMM yyyy")}
              {course.startDate && course.endDate && " - "}
              {course.endDate && format(new Date(course.endDate), "MMM yyyy")}
            </span>
          </div>
          <p className="text-sm font-medium">{course.institution}</p>
          {course.certificateLink && (
            <a 
              href={course.certificateLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Certificate Link
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default CoursesSection;
