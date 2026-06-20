import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Table, Row, Col, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import api from '../../api/axiosConfig';

const AddQuestions = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [exam, setExam] = useState(null);
    const [message, setMessage] = useState({ text: '', variant: '' });
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        content: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        points: 1,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [examRes, qRes] = await Promise.all([
                    api.get(`/exams/${id}`),
                    api.get(`/exams/${id}/questions`),
                ]);
                setExam(examRes.data);
                setQuestions(qRes.data);
            } catch (err) {
                setMessage({ text: 'Erreur chargement', variant: 'danger' });
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setForm({ content: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', points: 1 });
        setEditingId(null);
    };

    const handleEdit = (q) => {
        setEditingId(q.id);
        setForm({
            content: q.content,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            points: q.points,
        });
    };

    const saveQuestion = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', variant: '' });
        try {
            if (editingId) {
                await api.put(`/exams/${id}/questions/${editingId}`, form);
                setMessage({ text: 'Question modifiée', variant: 'success' });
            } else {
                const res = await api.post(`/exams/${id}/questions`, form);
                setQuestions([...questions, res.data]);
                setMessage({ text: 'Question ajoutée', variant: 'success' });
            }
            const qRes = await api.get(`/exams/${id}/questions`);
            setQuestions(qRes.data);
            resetForm();
        } catch (err) {
            setMessage({ text: 'Erreur lors de l\'opération', variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const deleteQuestion = async (qId) => {
        if (!window.confirm('Supprimer cette question ?')) return;
        try {
            await api.delete(`/exams/${id}/questions/${qId}`);
            setQuestions(questions.filter((q) => q.id !== qId));
            setMessage({ text: 'Question supprimée', variant: 'success' });
        } catch (err) {
            setMessage({ text: 'Erreur suppression', variant: 'danger' });
        }
    };

    const activateExam = async () => {
        if (questions.length === 0) {
            setMessage({ text: 'Ajoutez au moins une question avant d\'activer', variant: 'warning' });
            return;
        }
        try {
            await api.put(`/exams/${id}/status?status=ACTIVE`);
            setMessage({ text: 'Examen activé !', variant: 'success' });
            setTimeout(() => navigate('/professor/dashboard'), 1500);
        } catch (err) {
            setMessage({ text: 'Erreur activation', variant: 'danger' });
        }
    };

    return (
        <Container className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#0f172a' }}>
                    <FiPlus className="me-2" /> Ajouter des questions - {exam?.title}
                </h2>
                {exam?.status === 'DRAFT' && (
                    <Button
                        variant="success"
                        className="rounded-pill px-4"
                        onClick={activateExam}
                        style={{ background: '#10B981', border: 'none' }}
                    >
                        <FiCheckCircle className="me-2" /> Activer l'examen
                    </Button>
                )}
            </div>

            {message.text && (
                <Alert variant={message.variant} dismissible onClose={() => setMessage({ text: '', variant: '' })} className="rounded-3">
                    {message.text}
                </Alert>
            )}

            <Row>
                <Col md={5}>
                    <Card className="modern-card border-0 p-3 mb-4">
                        <Form onSubmit={saveQuestion} className="form-modern">
                            <Form.Group className="mb-2">
                                <Form.Label className="fw-semibold">Énoncé</Form.Label>
                                <Form.Control
                                    name="content"
                                    value={form.content}
                                    onChange={handleChange}
                                    required
                                    placeholder="Texte de la question..."
                                />
                            </Form.Group>

                            <Row>
                                {['A', 'B', 'C', 'D'].map((opt) => (
                                    <Col key={opt}>
                                        <Form.Label className="fw-semibold">{opt}</Form.Label>
                                        <Form.Control
                                            name={`option${opt}`}
                                            value={form[`option${opt}`]}
                                            onChange={handleChange}
                                            required
                                            placeholder={`Option ${opt}`}
                                        />
                                    </Col>
                                ))}
                            </Row>

                            <Row className="mt-2">
                                <Col>
                                    <Form.Label className="fw-semibold">Réponse correcte</Form.Label>
                                    <Form.Select name="correctAnswer" value={form.correctAnswer} onChange={handleChange}>
                                        <option>A</option>
                                        <option>B</option>
                                        <option>C</option>
                                        <option>D</option>
                                    </Form.Select>
                                </Col>
                                <Col>
                                    <Form.Label className="fw-semibold">Points</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="points"
                                        value={form.points}
                                        onChange={handleChange}
                                        min={1}
                                    />
                                </Col>
                            </Row>

                            <div className="mt-3">
                                <Button
                                    type="submit"
                                    className="btn-modern rounded-pill px-4"
                                    disabled={loading}
                                    style={{ background: '#3b82f6', border: 'none', color: '#fff' }}
                                >
                                    {editingId ? <><FiEdit2 className="me-2" /> Mettre à jour</> : <><FiPlus className="me-2" /> Ajouter</>}
                                </Button>
                                {editingId && (
                                    <Button
                                        variant="secondary"
                                        className="rounded-pill ms-2"
                                        onClick={resetForm}
                                    >
                                        Annuler
                                    </Button>
                                )}
                            </div>
                        </Form>
                    </Card>
                </Col>

                <Col md={7}>
                    <h5 className="fw-semibold mb-3">Questions ({questions.length})</h5>
                    <Card className="modern-card border-0">
                        <Card.Body className="p-0">
                            <Table responsive className="table-modern mb-0">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Énoncé</th>
                                    <th>Réponse</th>
                                    <th>Points</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {questions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted py-4">
                                            Aucune question ajoutée.
                                        </td>
                                    </tr>
                                ) : (
                                    questions.map((q, idx) => (
                                        <tr key={q.id}>
                                            <td>{idx + 1}</td>
                                            <td>{q.content.substring(0, 50)}...</td>
                                            <td>
                                                <Badge bg="success" className="rounded-pill px-3">
                                                    {q.correctAnswer}
                                                </Badge>
                                            </td>
                                            <td>{q.points}</td>
                                            <td className="text-end">
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="rounded-pill me-1"
                                                    onClick={() => handleEdit(q)}
                                                >
                                                    <FiEdit2 />
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="rounded-pill"
                                                    onClick={() => deleteQuestion(q.id)}
                                                >
                                                    <FiTrash2 />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddQuestions;