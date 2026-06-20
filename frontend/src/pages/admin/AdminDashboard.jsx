import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiUsers, FiBookOpen, FiClock, FiActivity, FiFilter } from 'react-icons/fi';
import Loader from '../../components/common/Loader';
import api from '../../api/axiosConfig';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalExams: 0, totalSessions: 0, totalLogs: 0 });
    const [logs, setLogs] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllLogs, setShowAllLogs] = useState(false);
    const [logOrder, setLogOrder] = useState('desc');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, examsRes, statsRes, logsRes] = await Promise.allSettled([
                    api.get('/users'),
                    api.get('/exams'),
                    api.get('/admin/stats'),
                    api.get('/security-logs'),
                ]);

                setStats({
                    totalUsers: usersRes.status === 'fulfilled' ? usersRes.value.data.length : 0,
                    totalExams: examsRes.status === 'fulfilled' ? examsRes.value.data.length : 0,
                    totalSessions: statsRes.status === 'fulfilled' ? statsRes.value.data.totalSessions : 0,
                    totalLogs: statsRes.status === 'fulfilled' ? statsRes.value.data.totalLogs : 0,
                });

                if (examsRes.status === 'fulfilled') setExams(examsRes.value.data);
                if (logsRes.status === 'fulfilled') setLogs(logsRes.value.data);
            } catch (err) {
                console.error('Erreur chargement dashboard admin:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const displayedLogs = showAllLogs ? sortedLogs : sortedLogs.slice(0, 10);

    if (loading) return <Loader />;

    const statCards = [
        { title: 'Utilisateurs', value: stats.totalUsers, icon: FiUsers, color: '#3b82f6' },
        { title: 'Examens', value: stats.totalExams, icon: FiBookOpen, color: '#10B981' },
        { title: 'Sessions', value: stats.totalSessions, icon: FiClock, color: '#F59E0B' },
        { title: 'Logs sécurité', value: stats.totalLogs, icon: FiActivity, color: '#EF4444' },
    ];

    return (
        <Container className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#0f172a' }}>
                    🛡️ Administration
                </h2>
                <Button
                    as={Link}
                    to="/admin/users"
                    className="btn-modern rounded-pill px-4"
                    style={{ background: '#3b82f6', border: 'none', color: '#fff' }}
                >
                    <FiUsers className="me-2" /> Utilisateurs
                </Button>
            </div>

            <Row className="g-4 mb-5">
                {statCards.map((card, idx) => (
                    <Col md={3} key={idx}>
                        <Card className="modern-card border-0 text-center p-3">
                            <div style={{ fontSize: '2rem', color: card.color }}>
                                <card.icon />
                            </div>
                            <h3 className="fw-bold">{card.value}</h3>
                            <p className="text-muted small">{card.title}</p>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Liste des examens */}
            <Card className="modern-card border-0 mb-4">
                <Card.Header className="bg-white fw-semibold" style={{ color: '#0f172a' }}>
                    📋 Liste des examens
                </Card.Header>
                <Card.Body className="p-0">
                    <Table responsive className="table-modern mb-0">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Titre</th>
                            <th>Professeur</th>
                            <th>Statut</th>
                        </tr>
                        </thead>
                        <tbody>
                        {exams.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center text-muted py-4">
                                    Aucun examen trouvé.
                                </td>
                            </tr>
                        ) : (
                            exams.map((exam) => (
                                <tr key={exam.id}>
                                    <td>{exam.id}</td>
                                    <td className="fw-semibold">{exam.title}</td>
                                    <td>{exam.professorName || 'Inconnu'}</td>
                                    <td>
                                        <Badge bg={exam.status === 'ACTIVE' ? 'success' : 'secondary'} className="rounded-pill px-3">
                                            {exam.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Logs de sécurité */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <h5 className="fw-semibold" style={{ color: '#0f172a' }}>
                    <FiActivity className="me-2" /> Alertes de sécurité
                    <Badge bg="secondary" className="ms-2 rounded-pill">{logs.length}</Badge>
                </h5>
                <div className="d-flex gap-2">
                    <Form.Select
                        size="sm"
                        value={logOrder}
                        onChange={(e) => setLogOrder(e.target.value)}
                        style={{ width: '140px' }}
                        className="form-modern"
                    >
                        <option value="desc">Plus récents</option>
                        <option value="asc">Plus anciens</option>
                    </Form.Select>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        className="rounded-pill"
                        onClick={() => setShowAllLogs(!showAllLogs)}
                    >
                        {showAllLogs ? '10 derniers' : 'Voir tout'}
                    </Button>
                    <Button
                        as={Link}
                        to="/admin/logs"
                        variant="outline-secondary"
                        size="sm"
                        className="rounded-pill"
                    >
                        <FiFilter className="me-1" /> Détail
                    </Button>
                </div>
            </div>

            <Table responsive className="table-modern">
                <thead>
                <tr>
                    <th>Utilisateur</th>
                    <th>Type</th>
                    <th>Détails</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {displayedLogs.length === 0 ? (
                    <tr>
                        <td colSpan="4" className="text-center text-muted py-4">
                            Aucun log de sécurité.
                        </td>
                    </tr>
                ) : (
                    displayedLogs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.username || 'Inconnu'}</td>
                            <td>
                                <Badge bg={log.eventType === 'TAB_SWITCH' ? 'danger' : 'warning'} className="rounded-pill px-3">
                                    {log.eventType}
                                </Badge>
                            </td>
                            <td>{log.details}</td>
                            <td>{new Date(log.timestamp).toLocaleString('fr-FR')}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </Table>
        </Container>
    );
};

export default AdminDashboard;