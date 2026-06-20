import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FiMail, FiLock, FiLogIn, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(username, password);
        if (!result.success) {
            setError(result.message || 'Identifiants incorrects');
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={5} xl={4}>
                    <Card className="modern-card border-0 p-4 p-md-5">
                        <div className="mb-3">
                            <Link to="/" className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1">
                                <FiArrowLeft size={16} /> Retour
                            </Link>
                        </div>

                        <div className="text-center mb-4">
                            <h2 className="fw-bold" style={{ color: '#0f172a' }}>
                                Academic<span style={{ color: '#3b82f6' }}>TestHub</span>
                            </h2>
                            <p className="text-muted small">Connectez-vous à votre compte</p>
                        </div>

                        {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

                        <Form onSubmit={handleSubmit} className="form-modern">
                            <Form.Group className="mb-4">
                                <div className="input-group">
                                    <span className="input-group-text"><FiMail size={18} /></span>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nom d'utilisateur"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <div className="input-group">
                                    <span className="input-group-text"><FiLock size={18} /></span>
                                    <Form.Control
                                        type="password"
                                        placeholder="Mot de passe"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </Form.Group>

                            <Button
                                type="submit"
                                className="btn-modern w-100 py-2 fw-semibold rounded-pill"
                                disabled={loading}
                                style={{ background: '#3b82f6', border: 'none', color: '#fff' }}
                            >
                                {loading ? 'Connexion...' : <><FiLogIn className="me-2" /> Se connecter</>}
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <Link to="/register" className="text-decoration-none small" style={{ color: '#3b82f6' }}>
                                Pas encore de compte ? Inscrivez-vous
                            </Link>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;