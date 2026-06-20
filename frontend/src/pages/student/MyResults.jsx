import React, { useState, useEffect } from 'react';
import { Container, Badge } from 'react-bootstrap';
import { FiBarChart2 } from 'react-icons/fi';
import ModernTable from '../../components/ui/ModernTable';
import Loader from '../../components/common/Loader';
import api from '../../api/axiosConfig';

const MyResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/results/my')
            .then((res) => setResults(res.data))
            .catch((err) => console.error('Erreur chargement résultats:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loader />;

    const columns = ['Examen', 'Score', 'Pourcentage', 'Date', 'Alertes'];
    const renderRow = (res) => (
        <tr key={res.id}>
            <td className="fw-semibold">{res.examTitle}</td>
            <td>{res.score} / {res.totalPoints}</td>
            <td>
                <Badge bg={res.percentage >= 70 ? 'success' : res.percentage >= 50 ? 'warning' : 'danger'} className="rounded-pill px-3">
                    {res.percentage.toFixed(1)}%
                </Badge>
            </td>
            <td>{new Date(res.submittedAt).toLocaleString('fr-FR')}</td>
            <td>
        <span className="text-muted small">
          {res.tabSwitchCount} tab(s) · {res.pasteAttemptCount} paste(s)
        </span>
            </td>
        </tr>
    );

    return (
        <Container className="fade-in">
            <h2 className="fw-bold mb-4" style={{ color: '#0f172a' }}>
                <FiBarChart2 className="me-2" /> Mes résultats
            </h2>

            {results.length === 0 ? (
                <div className="modern-card p-5 text-center">
                    <p className="text-muted mb-0">Aucun résultat trouvé.</p>
                </div>
            ) : (
                <ModernTable columns={columns} data={results} renderRow={renderRow} />
            )}
        </Container>
    );
};

export default MyResults;