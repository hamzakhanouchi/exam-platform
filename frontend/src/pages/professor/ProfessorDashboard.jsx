import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiCheckCircle, FiUsers, FiEdit2, FiList, FiBarChart2 } from 'react-icons/fi';
import StatsCard from '../../components/ui/StatsCard';
import Loader from '../../components/common/Loader';
import api from '../../api/axiosConfig';

const ProfessorDashboard = () => {
    const [exams, setExams] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, totalStudents: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/exams/my');
                setExams(res.data);
                const total = res.data.length;
                const active = res.data.filter((e) => e.status === 'ACTIVE').length;
                setStats({ total, active, totalStudents: 0 });
            } catch (err) {
                console.error('Erreur chargement dashboard professeur:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Loader />;

    return (
        <Container className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#0f172a' }}>
                    👨‍🏫 Dashboard professeur
                </h2>
                <Button
                    as={Link}
                    to="/professor/exams/create"
                    className="btn-modern rounded-pill px-4"
                    style={{ background: '#3b82f6', border: 'none', color: '#fff' }}
                >
                    <FiPlusCircle className="me-2" /> Nouvel examen
                </Button>
            </div>

            <Row className="g-4 mb-5">
                <Col md={4}>
                    <StatsCard title="Examens créés" value={stats.total} icon={FiCheckCircle} color="#3b82f6" />
                </Col>
                <Col md={4}>
                    <StatsCard title="Examens actifs" value={stats.active} icon={FiCheckCircle} color="#10B981" />
                </Col>
                <Col md={4}>
                    <StatsCard title="Étudiants participants" value={stats.totalStudents} icon={FiUsers} color="#F59E0B" />
                </Col>
            </Row>

            <Card className="modern-card border-0">
                <Card.Header className="bg-white fw-semibold" style={{ color: '#0f172a' }}>
                    📋 Mes examens
                </Card.Header>
                <Card.Body className="p-0">
                    <Table responsive className="table-modern mb-0">
                        <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Statut</th>
                            <th>Questions</th>
                            <th className="text-end">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {exams.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center text-muted py-4">
                                    Aucun examen créé.
                                </td>
                            </tr>
                        ) : (
                            exams.map((exam) => (
                                <tr key={exam.id}>
                                    <td className="fw-semibold">{exam.title}</td>
                                    <td>
                                        <Badge bg={exam.status === 'ACTIVE' ? 'success' : 'secondary'} className="rounded-pill px-3">
                                            {exam.status}
                                        </Badge>
                                    </td>
                                    <td>{exam.questions?.length || 0}</td>
                                    <td className="text-end">
                                        <Button
                                            as={Link}
                                            to={`/professor/exams/${exam.id}/manage`}
                                            size="sm"
                                            variant="outline-primary"
                                            className="rounded-pill me-1"
                                        >
                                            <FiEdit2 className="me-1" /> Gérer
                                        </Button>
                                        <Button
                                            as={Link}
                                            to={`/professor/exams/${exam.id}/questions`}
                                            size="sm"
                                            variant="outline-secondary"
                                            className="rounded-pill me-1"
                                        >
                                            <FiList className="me-1" /> Questions
                                        </Button>
                                        <Button
                                            as={Link}
                                            to={`/professor/exams/${exam.id}/results`}
                                            size="sm"
                                            variant="outline-success"
                                            className="rounded-pill"
                                        >
                                            <FiBarChart2 className="me-1" /> Résultats
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProfessorDashboard;