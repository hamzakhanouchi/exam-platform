import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FiArrowRight, FiBookOpen, FiUsers, FiShield, FiAward } from 'react-icons/fi';
import LandingNavbar from '../components/layout/LandingNavbar';
import '../styles/landing.css';
import '../styles/global.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <LandingNavbar />
            <section className="hero-section" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)' }}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="text-white fade-in">
                            <h1 className="hero-title display-3 fw-bold mb-4">
                                Academic<span style={{ color: '#818CF8' }}>TestHub</span>
                            </h1>
                            <p className="hero-subtitle mb-4">
                                La plateforme moderne de gestion d'examens en ligne. Créez, passez et suivez vos examens en toute simplicité.
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <Button as={Link} to="/register" size="lg" className="px-5 py-3 rounded-pill fw-semibold" style={{ background: '#4F46E5', border: 'none', boxShadow: '0 4px 20px rgba(79,70,229,0.3)' }}>
                                    Commencer <FiArrowRight className="ms-2" />
                                </Button>
                                <Button as={Link} to="/login" size="lg" variant="outline-light" className="px-5 py-3 rounded-pill fw-semibold" style={{ borderColor: 'rgba(255,255,255,0.25)' }}>
                                    Se connecter
                                </Button>
                            </div>
                        </Col>
                        <Col lg={6} className="d-none d-lg-block">
                            <div className="p-4 rounded-4" style={{ background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(12px)' }}>
                                <div className="d-flex gap-4 mb-4 justify-content-center">
                                    <div className="p-3 rounded-3" style={{ background: 'rgba(79,70,229,0.15)' }}><FiBookOpen size={36} color="#818CF8" /></div>
                                    <div className="p-3 rounded-3" style={{ background: 'rgba(16,185,129,0.15)' }}><FiUsers size={36} color="#34D399" /></div>
                                    <div className="p-3 rounded-3" style={{ background: 'rgba(245,158,11,0.15)' }}><FiAward size={36} color="#F59E0B" /></div>
                                    <div className="p-3 rounded-3" style={{ background: 'rgba(239,68,68,0.15)' }}><FiShield size={36} color="#F87171" /></div>
                                </div>
                                <div className="text-center text-white">
                                    <h5 className="mb-2">Prêt à réussir ?</h5>
                                    <p style={{ color: '#94A3B8' }}>Rejoignez des milliers d'étudiants et professeurs</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="features-section py-5" style={{ background: 'white' }}>
                <Container>
                    <h2 className="text-center fw-bold mb-5">Pourquoi AcademicTestHub ?</h2>
                    <Row className="g-4">
                        {[
                            { icon: FiBookOpen, title: 'Examens en ligne', desc: 'Créez et passez des examens depuis n\'importe où', color: '#4F46E5' },
                            { icon: FiUsers, title: 'Gestion des rôles', desc: 'Administrateurs, professeurs et étudiants', color: '#10B981' },
                            { icon: FiAward, title: 'Résultats instantanés', desc: 'Correction automatique et statistiques', color: '#F59E0B' },
                            { icon: FiShield, title: 'Sécurisé', desc: 'Authentification JWT et logs de sécurité', color: '#EF4444' },
                        ].map((feature, idx) => (
                            <Col md={3} key={idx}>
                                <div className="feature-card">
                                    <div className="feature-icon" style={{ color: feature.color, background: `${feature.color}15` }}>
                                        <feature.icon />
                                    </div>
                                    <h5 className="feature-title">{feature.title}</h5>
                                    <p className="feature-desc">{feature.desc}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default LandingPage;