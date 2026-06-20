import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiList } from 'react-icons/fi';
import api from '../../api/axiosConfig';

const ManageExam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api
            .get(`/exams/${id}`)
            .then((res) => {
                setExam(res.data);
                setForm(res.data);
            })
            .catch((err) => console.error('Erreur chargement examen:', err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/exams/${id}`, form);
            alert('Examen mis à jour avec succès');
            navigate(`/professor/exams/${id}/manage`);
        } catch (err) {
            alert('Erreur lors de la mise à jour');
        } finally {
            setSaving(false);
        }
    };

    const goToQuestions = () => navigate(`/professor/exams/${id}/questions`);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="loader-spinner"></div>
            </div>
        );
    }

    return (
        <Container className="fade-in">
            <h2 className="fw-bold mb-4" style={{ color: '#0f172a' }}>
                <FiSave className="me-2" /> Modifier l'examen : {exam?.title}
            </h2>

            <Card className="modern-card border-0 p-4">
                <Form onSubmit={handleSubmit} className="form-modern">
                    <Row>
                        <Col md={8}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Titre</Form.Label>
                                <Form.Control
                                    name="title"
                                    value={form.title || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Durée (minutes)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="durationMinutes"
                                    value={form.durationMinutes || 60}
                                    onChange={handleChange}
                                    min={1}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={form.description || ''}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Tentatives max</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="maxAttempts"
                                    value={form.maxAttempts || 1}
                                    onChange={handleChange}
                                    min={1}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Mélanger les questions"
                                    name="shuffleQuestions"
                                    checked={form.shuffleQuestions}
                                    onChange={handleChange}
                                    className="fw-semibold mt-3"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Date début</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="startDate"
                                    value={form.startDate?.slice(0, 16) || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Date fin</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="endDate"
                                    value={form.endDate?.slice(0, 16) || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="mt-3 d-flex gap-2 flex-wrap">
                        <Button
                            type="submit"
                            className="btn-modern rounded-pill px-4"
                            disabled={saving}
                            style={{ background: '#3b82f6', border: 'none', color: '#fff' }}
                        >
                            <FiSave className="me-2" /> {saving ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                        <Button
                            variant="secondary"
                            className="rounded-pill px-4"
                            onClick={goToQuestions}
                        >
                            <FiList className="me-2" /> Gérer les questions
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default ManageExam;