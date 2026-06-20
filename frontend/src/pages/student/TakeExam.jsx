import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, ProgressBar, Modal, Card, Row, Col, Alert } from 'react-bootstrap';
import { FiClock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import api from '../../api/axiosConfig';

const TakeExam = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [sessionId, setSessionId] = useState(null);
    const [examTitle, setExamTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [warning, setWarning] = useState('');
    const [showFullscreenModal, setShowFullscreenModal] = useState(false);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);

    const timerRef = useRef(null);
    const devToolsIntervalRef = useRef(null);

    // --- Soumission ---
    const handleSubmit = useCallback(async () => {
        if (submitting || result) return;
        setSubmitting(true);
        try {
            const payload = { answers };
            const res = await api.post(`/sessions/submit/${sessionId}`, payload);
            setResult(res.data);
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert(err.response?.data?.message || 'Erreur lors de la soumission');
        } finally {
            setSubmitting(false);
        }
    }, [submitting, result, answers, sessionId]);

    // --- Démarrage de l'examen ---
    useEffect(() => {
        const startExam = async () => {
            try {
                setLoading(true);
                const res = await api.post(`/sessions/start/${examId}`);
                const data = res.data;

                if (!data.sessionId || !data.durationMinutes || data.durationMinutes <= 0 || !data.questions?.length) {
                    throw new Error('Données d\'examen invalides');
                }

                setSessionId(data.sessionId);
                setExamTitle(data.examTitle);
                setQuestions(data.questions);
                setTimeLeft(data.durationMinutes * 60);
                setLoading(false);

                // Demander le plein écran
                document.documentElement.requestFullscreen().catch(console.warn);
            } catch (err) {
                setLoading(false);
                const msg = err.response?.data?.message || err.message || 'Erreur au chargement de l\'examen';
                alert(msg);
                navigate('/student/exams');
            }
        };
        startExam();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (devToolsIntervalRef.current) clearInterval(devToolsIntervalRef.current);
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
        };
    }, [examId, navigate]);

    // --- Timer ---
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [timeLeft, handleSubmit]);

    // --- Détection changement d'onglet ---
    useEffect(() => {
        const handleVisibility = () => {
            if (document.hidden && !result) {
                const newCount = tabSwitchCount + 1;
                setTabSwitchCount(newCount);
                api.post('/security-logs', {
                    eventType: 'TAB_SWITCH',
                    details: `Onglet changé (${newCount})`,
                    sessionId,
                });
                setWarning(`⚠️ Changement d'onglet détecté (${newCount}/3)`);
                if (newCount >= 3) handleSubmit();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [tabSwitchCount, sessionId, result, handleSubmit]);

    // --- Perte de focus fenêtre ---
    useEffect(() => {
        const handleBlur = () => {
            if (!result) {
                api.post('/security-logs', {
                    eventType: 'TAB_SWITCH',
                    details: 'Perte de focus',
                    sessionId,
                });
                setWarning('⚠️ Vous avez quitté la fenêtre de l\'examen');
            }
        };
        window.addEventListener('blur', handleBlur);
        return () => window.removeEventListener('blur', handleBlur);
    }, [sessionId, result]);

    // --- Plein écran obligatoire ---
    useEffect(() => {
        const fullscreenChange = () => {
            if (!document.fullscreenElement && !result) {
                api.post('/security-logs', {
                    eventType: 'FULLSCREEN_EXIT',
                    details: 'Sortie plein écran',
                    sessionId,
                });
                setShowFullscreenModal(true);
            } else {
                setShowFullscreenModal(false);
            }
        };
        document.addEventListener('fullscreenchange', fullscreenChange);
        return () => document.removeEventListener('fullscreenchange', fullscreenChange);
    }, [sessionId, result]);

    // --- Blocage raccourcis ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            const blocked = [
                e.key === 'F12',
                e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'),
                e.ctrlKey && (e.key === 'u' || e.key === 'p'),
                e.altKey && e.key === 'Tab',
            ];
            if (blocked.some(Boolean)) {
                e.preventDefault();
                setWarning('⛔ Raccourci désactivé');
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // --- Détection DevTools ---
    useEffect(() => {
        const detectDevTools = () => {
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;
            if (widthDiff > 160 || heightDiff > 160) {
                api.post('/security-logs', {
                    eventType: 'DEVTOOLS_OPEN',
                    details: 'DevTools ouvert',
                    sessionId,
                });
                setWarning('⚠️ Outils de développement détectés');
            }
        };
        devToolsIntervalRef.current = setInterval(detectDevTools, 2000);
        return () => clearInterval(devToolsIntervalRef.current);
    }, [sessionId]);

    // --- Gestion des réponses ---
    const handleAnswer = (qId, option) => {
        setAnswers((prev) => ({ ...prev, [qId]: option }));
    };

    const formatTime = (sec) => {
        const mins = Math.floor(sec / 60);
        const s = sec % 60;
        return `${mins}:${s < 10 ? '0' : ''}${s}`;
    };

    // --- États de chargement / résultat ---
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="loader-spinner"></div>
            </div>
        );
    }

    if (result) {
        return (
            <Container className="mt-5 text-center fade-in">
                <Card className="modern-card p-5 border-0">
                    <div className="mb-3" style={{ fontSize: '3rem', color: '#10B981' }}>
                        <FiCheckCircle />
                    </div>
                    <h2 className="fw-bold" style={{ color: '#0f172a' }}>Examen terminé !</h2>
                    <h4 className="mt-3">
                        Votre score : <span className="fw-bold">{result.score} / {result.totalPoints}</span>
                    </h4>
                    <h5>Pourcentage : <span className="fw-bold">{result.percentage.toFixed(1)}%</span></h5>
                    <Button
                        variant="primary"
                        className="btn-modern rounded-pill px-5 mt-4"
                        onClick={() => navigate('/student/results')}
                    >
                        Voir mes résultats
                    </Button>
                </Card>
            </Container>
        );
    }

    if (!questions.length) {
        return (
            <Container className="mt-5 text-center">
                <div className="modern-card p-5">
                    <FiAlertTriangle size={48} className="text-warning mb-3" />
                    <p className="text-muted">Aucune question trouvée.</p>
                </div>
            </Container>
        );
    }

    const current = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const allAnswered = questions.every((q) => answers[q.id]);

    return (
        <div
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onPaste={(e) => {
                e.preventDefault();
                api.post('/security-logs', {
                    eventType: 'PASTE_ATTEMPT',
                    details: 'Collage',
                    sessionId,
                });
                setWarning('❌ Copier/coller désactivé');
            }}
            onContextMenu={(e) => e.preventDefault()}
        >
            <Container fluid className="mt-3 fade-in">
                {warning && (
                    <Alert variant="warning" dismissible onClose={() => setWarning('')} className="rounded-3">
                        {warning}
                    </Alert>
                )}

                {/* En-tête */}
                <Row className="mb-3 align-items-center">
                    <Col>
                        <h4 className="fw-bold" style={{ color: '#0f172a' }}>
                            {examTitle}
                        </h4>
                    </Col>
                    <Col className="text-end">
            <span className={timeLeft < 300 ? 'text-danger fw-bold' : 'text-dark fw-semibold'}>
              <FiClock className="me-1" /> {formatTime(timeLeft)}
            </span>
                    </Col>
                </Row>

                {/* Progression */}
                <ProgressBar
                    now={progress}
                    label={`${currentIndex + 1}/${questions.length}`}
                    className="mb-4 rounded-pill"
                    style={{ height: '10px' }}
                />

                {/* Question */}
                <Card className="modern-card mb-4 border-0">
                    <Card.Body>
                        <h5 className="mb-3">{current.content}</h5>
                        {['A', 'B', 'C', 'D'].map((opt) => (
                            <div key={opt} className="mb-2">
                                <Button
                                    variant={answers[current.id] === opt ? 'primary' : 'outline-secondary'}
                                    onClick={() => handleAnswer(current.id, opt)}
                                    className="w-100 text-start rounded-pill py-2 px-4"
                                >
                                    {opt}. {current[`option${opt}`]}
                                </Button>
                            </div>
                        ))}
                    </Card.Body>
                </Card>

                {/* Navigation */}
                <div className="d-flex justify-content-between">
                    <Button
                        variant="outline-secondary"
                        className="rounded-pill px-4"
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex((i) => i - 1)}
                    >
                        Précédent
                    </Button>

                    {currentIndex === questions.length - 1 ? (
                        <Button
                            variant="success"
                            className="rounded-pill px-5"
                            onClick={handleSubmit}
                            disabled={submitting || !allAnswered}
                            style={{ background: '#10B981', border: 'none' }}
                        >
                            {submitting ? 'Soumission...' : <><FiCheckCircle className="me-2" />Soumettre</>}
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            className="rounded-pill px-4"
                            onClick={() => setCurrentIndex((i) => i + 1)}
                        >
                            Suivant
                        </Button>
                    )}
                </div>

                {/* Paliers de navigation */}
                <div className="mt-4 d-flex flex-wrap gap-2 justify-content-center">
                    {questions.map((q, idx) => (
                        <Button
                            key={q.id}
                            variant={answers[q.id] ? 'success' : 'secondary'}
                            size="sm"
                            onClick={() => setCurrentIndex(idx)}
                            className="rounded-circle"
                            style={{ width: '36px', height: '36px' }}
                        >
                            {idx + 1}
                        </Button>
                    ))}
                </div>
            </Container>

            {/* Modal plein écran */}
            <Modal show={showFullscreenModal} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <Modal.Title>⚠️ Plein écran requis</Modal.Title>
                </Modal.Header>
                <Modal.Body>Vous avez quitté le mode plein écran. Pour continuer, vous devez le réactiver.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="rounded-pill" onClick={() => document.documentElement.requestFullscreen()}>
                        Retourner en plein écran
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TakeExam;