
import React from 'react';

// Fix for 'iconify-icon' property errors in JSX by extending both global and React's internal JSX namespaces
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { 
        icon?: string; 
        width?: string | number; 
        height?: string | number;
        flip?: string;
        rotate?: string | number;
        mode?: string;
        inline?: boolean;
        style?: React.CSSProperties;
      }, HTMLElement>;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { 
        icon?: string; 
        width?: string | number; 
        height?: string | number;
        flip?: string;
        rotate?: string | number;
        mode?: string;
        inline?: boolean;
        style?: React.CSSProperties;
      }, HTMLElement>;
    }
  }
}

export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  GURU_ADMIN = 'GURU_ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  nisn?: string;
  class?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  teacherName: string;
  description: string;
  color: string;
  enrolledStudentIds?: string[];
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  fileName?: string;
  fileData?: string; // Base64 string
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content: string;
  fileName?: string;
  fileData?: string; // Base64 string
  submittedAt: string;
  grade?: number;
  status: 'submitted' | 'pending' | 'graded';
}

export interface RoomBooking {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: 'room' | 'item';
  studentName: string;
  studentClass: string;
  purpose: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  level?: 'X' | 'XI' | 'XII';
  quantity?: number;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: string;
  level?: 'X' | 'XI' | 'XII';
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  quantity?: number;
}

export interface AcademicEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string YYYY-MM-DD
  level: 'X' | 'XI' | 'XII' | 'SEMUA';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}
