import React from 'react';
import { Card } from 'react-bootstrap';

const StatsCard = ({
                       title,
                       value,
                       icon: Icon,
                       color = '#3b82f6',
                       subtitle,
                   }) => {
    return (
        <Card className="modern-card border-0 text-center p-3 h-100">
            <Card.Body>
                <div className="mb-2" style={{ fontSize: '2rem', color }}>
                    <Icon />
                </div>
                <h3 className="fw-bold mb-0">{value}</h3>
                <p className="text-muted small mb-0">{title}</p>
                {subtitle && <small className="text-muted">{subtitle}</small>}
            </Card.Body>
        </Card>
    );
};

export default StatsCard;