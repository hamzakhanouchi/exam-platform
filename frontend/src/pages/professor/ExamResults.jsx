import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FiDownload, FiBarChart2, FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import Loader from '../../components/common/Loader';
import api from '../../api/axiosConfig';

const ExamResults = () => {
    const { id } = useParams();
    const [results, setResults] = useState([]);
    const [stats, setStats] = useState({ average: 0, min: 0, max: 0, totalSubmissions: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resultsRes, statsRes] = await Promise.all([
                    api.get(`/results/exam/${id}`),
                    api.get(`/results/exam/${id}/stats`),
                ]);
                setResults(resultsRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error('Erreur chargement résultats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const exportCSV = () => {
        const csvRows = [['Étudiant', 'Score', 'Total', 'Pourcentage', 'Date']];
        results.forEach((r) => {
            csvRows.push([
                r.studentName || 'Anonyme',
                r.score,
                r.totalPoints,
                r.percentage.toFixed(2),
                new Date(r.submittedAt).toLocaleString('fr-FR'),
            ]);
        });
        const csvContent = csvRows.map((row) => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exam_${id}_results.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) return <Loader />;

    return (
        <Container className="fade-in">
            <h2 className="fw-bold mb-4" style={{ color: '#0f172a' }}>
                <FiBarChart2 className="me-2" /> Résultats de l'examen
            </h2>

            <Row className="g-4 mb-4">
                <Col md={3}>
                    <Card className="modern-card border-0 text-center p-3">
                        <h6 className="text-muted">Moyenne</h6>
                        <h3 className="fw-bold">{stats.average?.toFixed(1)}%</h3>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="modern-card border-0 text-center p-3">
                        <h6 className="text-muted"><FiTrendingDown className="me-1" /> Min</h6>
                        <h3 className="fw-bold">{stats.min?.toFixed(1)}%</h3>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="modern-card border-0 text-center p-3">
                        <h6 className="text-muted"><FiTrendingUp className="me-1" /> Max</h6>
                        <h3 className="fw-bold">{stats.max?.toFixed(1)}%</h3>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="modern-card border-0 text-center p-3">
                        <h6 className="text-muted">Soumissions</h6>
                        <h3 className="fw-bold">{stats.totalSubmissions}</h3>
                    </Card>
                </Col>
            </Row>

            <Button
                variant="secondary"
                className="rounded-pill mb-3"
                onClick={exportCSV}
                style={{ background: '#64748b', border: 'none' }}
            >
                <FiDownload className="me-2" /> Exporter CSV
            </Button>

            <Card className="modern-card border-0">
                <Card.Body className="p-0">
                    <Table responsive className="table-modern mb-0">
                        <thead>
                        <tr>
                            <th>Étudiant</th>
                            <th>Score</th>
                            <th>Pourcentage</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center text-muted py-4">
                                    Aucun résultat pour cet examen.
                                </td>
                            </tr>
                        ) : (
                            results.map((res) => (
                                <tr key={res.id}>
                                    <td className="fw-semibold">{res.studentName || '-'}</td>
                                    <td>{res.score} / {res.totalPoints}</td>
                                    <td>
                                        <Badge
                                            bg={res.percentage >= 70 ? 'success' : res.percentage >= 50 ? 'warning' : 'danger'}
                                            className="rounded-pill px-3"
                                        >
                                            {res.percentage.toFixed(1)}%
                                        </Badge>
                                    </td>
                                    <td>{new Date(res.submittedAt).toLocaleString('fr-FR')}</td>
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

export default ExamResults;