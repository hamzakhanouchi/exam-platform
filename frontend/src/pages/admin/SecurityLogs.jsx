import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Row, Col, Badge, Card } from 'react-bootstrap';
import { FiFilter, FiShield } from 'react-icons/fi';
import Loader from '../../components/common/Loader';
import api from '../../api/axiosConfig';

const SecurityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [filterType, setFilterType] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get('/security-logs')
            .then((res) => setLogs(res.data))
            .catch((err) => console.error('Erreur chargement logs:', err))
            .finally(() => setLoading(false));
    }, []);

    const filteredLogs = filterType ? logs.filter((log) => log.eventType === filterType) : logs;

    const getBadgeColor = (type) => {
        if (type === 'TAB_SWITCH') return 'danger';
        if (type === 'PASTE_ATTEMPT') return 'warning';
        return 'info';
    };

    if (loading) return <Loader />;

    return (
        <Container className="fade-in">
            <h2 className="fw-bold mb-4" style={{ color: '#0f172a' }}>
                <FiShield className="me-2" /> Logs de sécurité
            </h2>

            <Row className="mb-3">
                <Col sm={4}>
                    <div className="d-flex align-items-center">
                        <FiFilter className="me-2 text-muted" size={18} />
                        <Form.Select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="form-modern"
                        >
                            <option value="">Tous les types</option>
                            <option value="TAB_SWITCH">Changement d'onglet</option>
                            <option value="PASTE_ATTEMPT">Tentative de collage</option>
                            <option value="FULLSCREEN_EXIT">Sortie plein écran</option>
                        </Form.Select>
                    </div>
                </Col>
            </Row>

            <Card className="modern-card border-0">
                <Card.Body className="p-0">
                    <Table responsive className="table-modern mb-0">
                        <thead>
                        <tr>
                            <th>Utilisateur</th>
                            <th>Type</th>
                            <th>Détails</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredLogs.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center text-muted py-4">
                                    Aucun log trouvé.
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.map((log) => (
                                <tr key={log.id}>
                                    <td>{log.user?.username || log.user?.email || 'N/A'}</td>
                                    <td>
                                        <Badge bg={getBadgeColor(log.eventType)} className="rounded-pill px-3">
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
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SecurityLogs;