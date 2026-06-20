import React from 'react';
import { Table, Card } from 'react-bootstrap';

const ModernTable = ({
                         columns,
                         data,
                         title,
                         renderRow,
                         emptyMessage = 'Aucune donnée',
                     }) => {
    return (
        <Card className="modern-card border-0">
            {title && (
                <Card.Header className="bg-white fw-semibold" style={{ color: '#0f172a' }}>
                    {title}
                </Card.Header>
            )}
            <Card.Body className="p-0">
                <Table responsive className="table-modern mb-0">
                    <thead>
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx}>{col}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center text-muted py-4">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, idx) => renderRow(item, idx))
                    )}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default ModernTable;