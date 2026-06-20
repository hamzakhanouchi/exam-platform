import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';


// Pages publiques
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages étudiant
import StudentDashboard from './pages/student/StudentDashboard';
import AvailableExams from './pages/student/AvailableExams';
import TakeExam from './pages/student/TakeExam';
import MyResults from './pages/student/MyResults';

// Pages professeur
import ProfessorDashboard from './pages/professor/ProfessorDashboard';
import CreateExam from './pages/professor/CreateExam';
import ManageExam from './pages/professor/ManageExam';
import AddQuestions from './pages/professor/AddQuestions';
import ExamResults from './pages/professor/ExamResults';

// Pages admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import SecurityLogs from './pages/admin/SecurityLogs';

// Toast provider (notifications)
import { ToastProvider } from './components/ui/Toast';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastProvider>
                    <Routes>
                        {/* Routes publiques */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Routes étudiant */}
                        <Route path="/student/*" element={
                            <ProtectedRoute requiredRole="STUDENT">
                                <Layout>
                                    <StudentRoutes />
                                </Layout>
                            </ProtectedRoute>
                        } />

                        {/* Routes professeur */}
                        <Route path="/professor/*" element={
                            <ProtectedRoute requiredRole="PROFESSOR">
                                <Layout>
                                    <ProfessorRoutes />
                                </Layout>
                            </ProtectedRoute>
                        } />

                        {/* Routes admin */}
                        <Route path="/admin/*" element={
                            <ProtectedRoute requiredRole="ADMIN">
                                <Layout>
                                    <AdminRoutes />
                                </Layout>
                            </ProtectedRoute>
                        } />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </ToastProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

// Sous-routes étudiant
const StudentRoutes = () => (
    <Routes>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="exams" element={<AvailableExams />} />
        <Route path="exam/:examId" element={<TakeExam />} />
        <Route path="results" element={<MyResults />} />
    </Routes>
);

// Sous-routes professeur
const ProfessorRoutes = () => (
    <Routes>
        <Route path="dashboard" element={<ProfessorDashboard />} />
        <Route path="exams/create" element={<CreateExam />} />
        <Route path="exams/:id/manage" element={<ManageExam />} />
        <Route path="exams/:id/questions" element={<AddQuestions />} />
        <Route path="exams/:id/results" element={<ExamResults />} />
    </Routes>
);

// Sous-routes admin
const AdminRoutes = () => (
    <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="logs" element={<SecurityLogs />} />
    </Routes>
);

export default App;