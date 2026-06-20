import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiUsers, FiPlay, FiCalendar } from 'react-icons/fi';
import Loader from '../../components/common/Loader';
import api from '../../api/axiosConfig';

const AvailableExams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await api.get('/exams/available');
                setExams(res.data);
            } catch (err) {
                setError('Impossible de charger les examens disponibles');
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    const startExam = (examId) => navigate(`/student/exam/${examId}`);

    if (loading) return <Loader />;
    if (error) return <Alert variant="danger" className="modern-card">{error}</Alert>;

    return (
        <Container className="fade-in">
            <h2 className="fw-bold mb-4" style={{ color: '#0f172a' }}>
                📖 Examens disponibles
            </h2>

            {exams.length === 0 ? (
                <div className="modern-card p-5 text-center">
                    <p className="text-muted mb-0">Aucun examen actif pour le moment.</p>
                </div>
            ) : (
                <Row className="g-4">
                    {exams.map((exam) => (
                        <Col md={6} lg={4} key={exam.id}>
                            <Card className="modern-card border-0 h-100 d-flex flex-column">
                                <Card.Body className="flex-grow-1">
                                    <Card.Title className="fw-bold fs-5">{exam.title}</Card.Title>
                                    <Card.Text className="text-muted small">{exam.description?.substring(0, 80)}...</Card.Text>
                                    <div className="d-flex flex-wrap gap-2 mt-3">
                                        <Badge bg="light" className="text-dark rounded-pill px-3 py-2">
                                            <FiClock className="me-1" /> {exam.durationMinutes} min
                                        </Badge>
                                        <Badge bg="light" className="text-dark rounded-pill px-3 py-2">
                                            <FiUsers className="me-1" /> {exam.maxAttempts} tentative(s)
                                        </Badge>
                                        {exam.endDate && (
                                            <Badge bg="light" className="text-dark rounded-pill px-3 py-2">
                                                <FiCalendar className="me-1" /> {new Date(exam.endDate).toLocaleDateString('fr-FR')}
                                            </Badge>
                                        )}
                                    </div>
                                </Card.Body>
                                <Card.Footer className="bg-white border-0 pt-0">
                                    <Button
                                        variant="primary"
                                        className="w-100 btn-modern rounded-pill"
                                        onClick={() => startExam(exam.id)}
                                    >
                                        <FiPlay className="me-2" /> Commencer
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default AvailableExams;