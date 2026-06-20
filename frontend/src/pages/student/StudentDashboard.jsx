import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiCheckCircle, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import StatsCard from '../../components/ui/StatsCard';
import ModernTable from '../../components/ui/ModernTable';
import Loader from '../../components/common/Loader';
import api from '../../api/axiosConfig';

const StudentDashboard = () => {
    const [stats, setStats] = useState({ available: 0, completed: 0, avgScore: 0 });
    const [recentResults, setRecentResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [availableRes, resultsRes] = await Promise.all([
                    api.get('/exams/available'),
                    api.get('/results/my')
                ]);
                const available = availableRes.data.length;
                const results = resultsRes.data;
                const completed = results.length;
                const avgScore = results.length ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length : 0;
                setStats({ available, completed, avgScore });
                setRecentResults(results.slice(0, 5));
            } catch (err) {
                console.error('Erreur chargement dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Loader />;

    const columns = ['Examen', 'Score', 'Pourcentage', 'Date'];
    const renderRow = (res) => (
        <tr key={res.id}>
            <td className="fw-semibold">{res.examTitle}</td>
            <td>{res.score} / {res.totalPoints}</td>
            <td>
                <Badge bg={res.percentage >= 70 ? 'success' : res.percentage >= 50 ? 'warning' : 'danger'} className="rounded-pill px-3">
                    {res.percentage.toFixed(1)}%
                </Badge>
            </td>
            <td>{new Date(res.submittedAt).toLocaleDateString('fr-FR')}</td>
        </tr>
    );

    return (
        <Container className="fade-in">
            <h2 className="fw-bold mb-4" style={{ color: '#0f172a' }}>
                📊 Tableau de bord étudiant
            </h2>

            <Row className="g-4 mb-5">
                <Col md={4}>
                    <StatsCard
                        title="Examens disponibles"
                        value={stats.available}
                        icon={FiBookOpen}
                        subtitle={<Link to="/student/exams" className="text-decoration-none fw-semibold" style={{ color: '#3b82f6' }}>Voir <FiArrowRight className="ms-1" /></Link>}
                    />
                </Col>
                <Col md={4}>
                    <StatsCard title="Examens complétés" value={stats.completed} icon={FiCheckCircle} color="#10B981" />
                </Col>
                <Col md={4}>
                    <StatsCard title="Score moyen" value={`${stats.avgScore.toFixed(1)}%`} icon={FiTrendingUp} color="#F59E0B" />
                </Col>
            </Row>

            <ModernTable
                columns={columns}
                data={recentResults}
                title="📋 Derniers résultats"
                renderRow={renderRow}
                emptyMessage="Aucun résultat pour le moment."
            />
        </Container>
    );
};

export default StudentDashboard;