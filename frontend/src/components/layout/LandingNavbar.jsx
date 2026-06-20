import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Button } from 'react-bootstrap';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

const LandingNavbar = () => {
    return (
        <Navbar expand="lg" fixed="top" className="py-3" style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)' }}>
            <Container>
                <Navbar.Brand as={Link} to="/" className="text-white fw-bold fs-4">
                    AcademicTestHub
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarLanding" className="border-0" />
                <Navbar.Collapse id="navbarLanding" className="justify-content-end">
                    <div className="d-flex gap-2">
                        <Button as={Link} to="/register" variant="primary" className="rounded-pill px-4 fw-semibold" style={{ background: '#4F46E5', border: 'none' }}>
                            <FiUserPlus className="me-2" /> S'inscrire
                        </Button>
                        <Button as={Link} to="/login" variant="outline-light" className="rounded-pill px-4 fw-semibold" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                            <FiLogIn className="me-2" /> Se connecter
                        </Button>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default LandingNavbar;