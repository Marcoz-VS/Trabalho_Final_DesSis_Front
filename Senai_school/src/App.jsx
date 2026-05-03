import { Routes, Route } from "react-router-dom";
import LoginStudent from "./pages/student/LoginStudent";
import RegisterStudent from "./pages/student/RegisterStudent";
import HomeStudent from "./pages/student/HomeStudent";
import ScoreStudent from "./pages/student/ScoreStudent";
import ProfileStudent from "./pages/student/ProfileStudent";
import FirstTimePassword from "./pages/student/FirstTimeUpdate";
import ClassStudent from "./pages/student/ClassStudent";
import ScheduleStudent from "./pages/student/ScheduleStudent";
import EnrollmentStudent from "./pages/student/EnrollmentStudent";
import Layout from "./components/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminEnrollments from "./pages/admin/AdminEnrollments";
import AdminScores from "./pages/admin/AdminScores";
import AdminSchedules from "./pages/admin/AdminSchedules";
import HomeProfessor from "./pages/professor/HomeProfessor";
import RegisterProfessor from "./pages/professor/RegisterProfessor";
import ScheduleTeacher from "./pages/professor/ScheduleTeacher"
import TeacherScores from "./pages/professor/ScoresTeacher";
import ClassTeacher from "./pages/professor/ClassTeacher"
import ProfessorStudents from "./pages/professor/StudentsTeacher";
import {
  ProtectedRoute,
  FirstTimeGate,
  FirstLoginRoute,
  RoleRoute,
} from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Layout showHeader={false}>
              <LoginStudent />
            </Layout>
          }
        />
        <Route
          path="/registerStudent"
          element={
            <Layout showHeader={false}>
              <RegisterStudent />
            </Layout>
          }
        />

        <Route
          path="/registerProfessor"
          element={
            <Layout showHeader={false}>
              <RegisterProfessor />
            </Layout>
          }
        />

        <Route
          path="/first-login"
          element={
            <Layout showHeader={false}>
              <FirstLoginRoute>
                <FirstTimePassword />
              </FirstLoginRoute>
            </Layout>
          }
        />

        <Route
          path="/admin"
          element={
            <Layout showHeader={false}>
              <ProtectedRoute>
                <FirstTimeGate>
                  <RoleRoute roles={["admin"]}>
                    <AdminLayout />
                  </RoleRoute>
                </FirstTimeGate>
              </ProtectedRoute>
            </Layout>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="enrollments" element={<AdminEnrollments />} />
          <Route path="scores" element={<AdminScores />} />
          <Route path="schedules" element={<AdminSchedules />} />
        </Route>

        <Route
          path="/homeStudent"
          element={
            <Layout>
              <ProtectedRoute>
                <FirstTimeGate>
                  <RoleRoute roles={["student"]}>
                    <HomeStudent />
                  </RoleRoute>
                </FirstTimeGate>
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/homeProfessor"
          element={
            <Layout>
              <ProtectedRoute>
                <FirstTimeGate>
                  <RoleRoute roles={["professor"]}>
                    <HomeProfessor />
                  </RoleRoute>
                </FirstTimeGate>
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/teacher/scores"
          element={
            <Layout>
              <ProtectedRoute>
                <FirstTimeGate>
                  <RoleRoute roles={["professor"]}>
                    <TeacherScores />
                  </RoleRoute>
                </FirstTimeGate>
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/teacher/class"
          element={
            <Layout>
              <ProtectedRoute>
                <FirstTimeGate>
                  <RoleRoute roles={["professor"]}>
                    <ClassTeacher />
                  </RoleRoute>
                </FirstTimeGate>
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/teacher/schedule"
          element={
            <Layout>
              <ProtectedRoute>
                <FirstTimeGate>
                  <RoleRoute roles={["professor"]}>
                    <ScheduleTeacher />
                  </RoleRoute>
                </FirstTimeGate>
              </ProtectedRoute>
            </Layout>
          }
        />

                <Route
          path="/teacher/enrollment"
          element={
            <Layout>
              <ProtectedRoute>
                <FirstTimeGate>
                  <RoleRoute roles={["professor"]}>
                    <ProfessorStudents />
                  </RoleRoute>
                </FirstTimeGate>
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/student/scores"
          element={
            <Layout>
              <ProtectedRoute>
                <FirstTimeGate>
                  <RoleRoute roles={["student"]}>
                    <ScoreStudent />
                  </RoleRoute>
                </FirstTimeGate>
              </ProtectedRoute>
            </Layout>
          }
        />
        

        <Route
          path="/student/profile"
          element={
            <Layout>
              <ProtectedRoute>
                <FirstTimeGate>
                  <RoleRoute roles={["student"]}>
                    <ProfileStudent />
                  </RoleRoute>
                </FirstTimeGate>
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/student/class"
          element={
            <Layout>
              <ProtectedRoute>
                <FirstTimeGate>
                  <RoleRoute roles={["student"]}>
                    <ClassStudent />
                  </RoleRoute>
                </FirstTimeGate>
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/student/schedule"
          element={
            <Layout>
              <ProtectedRoute>
                <FirstTimeGate>
                  <RoleRoute roles={["student"]}>
                    <ScheduleStudent />
                  </RoleRoute>
                </FirstTimeGate>
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/student/enrollment"
          element={
            <Layout>
              <ProtectedRoute>
                <FirstTimeGate>
                  <RoleRoute roles={["student"]}>
                    <EnrollmentStudent />
                  </RoleRoute>
                </FirstTimeGate>
              </ProtectedRoute>
            </Layout>
          }
        />
      </Routes>
    </>
  );
}
