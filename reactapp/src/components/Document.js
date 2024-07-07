// src/components/Document.js
import React from 'react';

const Document = ({ document, onDelete, onEdit }) => {
    return (
        <li>
            <h3>{document.title}</h3>
            <p>{document.description}</p>
            <button onClick={() => onEdit(document)}>Edit</button>
            <button onClick={() => onDelete(document.id)}>Delete</button>
        </li>
    );
};

export default Document;