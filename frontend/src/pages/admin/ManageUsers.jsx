import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Alert, Modal, Form, Card } from 'react-bootstrap';
import { FiUserPlus, FiUserCheck, FiUserX, FiTrash2 } from 'react-icons/fi';
import { useToast } from '../../components/ui/Toast';
import Loader from '../../components/common/Loader';
import api from '../../api/axiosConfig';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            let userList = [];
            if (Array.isArray(response.data)) {
                userList = response.data;
            } else if (response.data?.content) {
                userList = response.data.content;
            } else {
                throw new Error('Format de données non reconnu');
            }
            setUsers(userList);
            setError('');
        } catch (err) {
            console.error('Erreur fetchUsers:', err);
            setError(err.response?.data?.message || err.message || 'Impossible de charger les utilisateurs');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleEnable = async (userId, currentStatus) => {
        try {
            await api.put(`/users/${userId}/enable?enabled=${!currentStatus}`);
            addToast('Statut utilisateur mis à jour', 'success');
            fetchUsers();
        } catch (err) {
            addToast('Erreur lors du changement de statut', 'danger');
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm('Supprimer définitivement cet utilisateur ?')) return;
        try {
            await api.delete(`/users/${userId}`);
            addToast('Utilisateur supprimé', 'success');
            fetchUsers();
        } catch (err) {
            addToast('Erreur lors de la suppression', 'danger');
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/admin/teachers', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: 'PROFESSOR',
            });
            addToast('Professeur créé avec succès !', 'success');
            setShowModal(false);
            setFormData({ username: '', email: '', password: '' });
            fetchUsers();
        } catch (err) {
            addToast(err.response?.data?.message || 'Erreur lors de la création', 'danger');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;
    if (error) return <Alert variant="danger" className="rounded-3">{error}</Alert>;

    return (
        <Container className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#0f172a' }}>
                    👥 Gestion des utilisateurs
                </h2>
                <Button
                    variant="primary"
                    className="rounded-pill px-4"
                    onClick={() => setShowModal(true)}
                    style={{ background: '#3b82f6', border: 'none' }}
                >
                    <FiUserPlus className="me-2" /> Ajouter un professeur
                </Button>
            </div>

            {users.length === 0 ? (
                <div className="modern-card p-5 text-center">
                    <p className="text-muted mb-0">Aucun utilisateur trouvé.</p>
                </div>
            ) : (
                <Card className="modern-card border-0">
                    <Card.Body className="p-0">
                        <Table responsive className="table-modern mb-0">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th>Statut</th>
                                <th className="text-end">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td className="fw-semibold">{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <Badge
                                            bg={user.role === 'ADMIN' ? 'danger' : user.role === 'PROFESSOR' ? 'primary' : 'success'}
                                            className="rounded-pill px-3"
                                        >
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td>{user.enabled ? 'Actif' : 'Désactivé'}</td>
                                    <td className="text-end">
                                        <Button
                                            size="sm"
                                            variant={user.enabled ? 'warning' : 'success'}
                                            className="rounded-pill me-1"
                                            onClick={() => toggleEnable(user.id, user.enabled)}
                                        >
                                            {user.enabled ? <FiUserX /> : <FiUserCheck />}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            className="rounded-pill"
                                            onClick={() => deleteUser(user.id)}
                                        >
                                            <FiTrash2 />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {/* Modal création professeur */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>👨‍🏫 Ajouter un professeur</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateTeacher} className="form-modern">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Nom d'utilisateur</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                        </Form.Group>
                        <div className="d-flex gap-2">
                            <Button
                                type="submit"
                                variant="primary"
                                className="rounded-pill px-4"
                                disabled={submitting}
                                style={{ background: '#3b82f6', border: 'none' }}
                            >
                                {submitting ? 'Création...' : 'Créer le professeur'}
                            </Button>
                            <Button
                                variant="secondary"
                                className="rounded-pill px-4"
                                onClick={() => setShowModal(false)}
                            >
                                Annuler
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ManageUsers;