import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiCheckCircle } from 'react-icons/fi';
import api from '../../api/axiosConfig';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: 'STUDENT',
            });
            setSuccess('Compte créé avec succès ! Redirection...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
            <Row className="w-100 justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="modern-card border-0 p-4 p-md-5">
                        <div className="mb-3">
                            <Link to="/" className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1">
                                <FiArrowLeft size={16} /> Retour
                            </Link>
                        </div>

                        <h2 className="text-center fw-bold mb-1" style={{ color: '#0f172a' }}>Inscription</h2>
                        <p className="text-center text-muted small mb-4">Créez votre compte étudiant</p>

                        {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}
                        {success && <Alert variant="success" className="rounded-3">{success}</Alert>}

                        <Form onSubmit={handleSubmit} className="form-modern">
                            <Form.Group className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text"><FiUser size={18} /></span>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="Nom d'utilisateur"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text"><FiMail size={18} /></span>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text"><FiLock size={18} /></span>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Mot de passe"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        minLength={6}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <div className="input-group">
                                    <span className="input-group-text"><FiCheckCircle size={18} /></span>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirmer le mot de passe"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </Form.Group>

                            <Button
                                type="submit"
                                className="btn-modern w-100 py-2 fw-semibold rounded-pill"
                                disabled={loading}
                                style={{ background: '#10B981', border: 'none', color: '#fff' }}
                            >
                                {loading ? 'Inscription...' : 'S\'inscrire'}
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <Link to="/login" className="text-decoration-none small" style={{ color: '#3b82f6' }}>
                                Déjà un compte ? Connectez-vous
                            </Link>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;