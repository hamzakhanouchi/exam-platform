import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';
import api from '../../api/axiosConfig';

const CreateExam = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        description: '',
        durationMinutes: 60,
        status: 'DRAFT',
        shuffleQuestions: true,
        maxAttempts: 1,
        startDate: '',
        endDate: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/exams', form);
            navigate(`/professor/exams/${res.data.id}/questions`);
        } catch (err) {
            alert('Erreur lors de la création de l\'examen');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="fade-in">
            <h2 className="fw-bold mb-4" style={{ color: '#0f172a' }}>
                <FiPlusCircle className="me-2" /> Nouvel examen
            </h2>

            <Card className="modern-card border-0 p-4">
                <Form onSubmit={handleSubmit} className="form-modern">
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Titre *</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Introduction à Java"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Décrivez l'examen..."
                        />
                    </Form.Group>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Durée (minutes)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="durationMinutes"
                                    value={form.durationMinutes}
                                    onChange={handleChange}
                                    min={1}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Tentatives max</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="maxAttempts"
                                    value={form.maxAttempts}
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
                                <Form.Label className="fw-semibold">Date de début</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="startDate"
                                    value={form.startDate}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Date de fin</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="endDate"
                                    value={form.endDate}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button
                        type="submit"
                        className="btn-modern rounded-pill px-5"
                        disabled={loading}
                        style={{ background: '#3b82f6', border: 'none', color: '#fff' }}
                    >
                        {loading ? 'Création...' : <><FiPlusCircle className="me-2" /> Créer et ajouter des questions</>}
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default CreateExam;