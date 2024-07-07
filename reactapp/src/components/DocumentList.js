// DocumentList.js

import React from 'react';
import { Link } from 'react-router-dom';

const DocumentList = ({ documents, onEdit, onDelete }) => {
    return (
        <ul className="document-list">
            {documents.map((document) => (
                <li key={document.id} className="document-item">
                    <div>
                        <h3>{document.title}</h3>
                        <p>{document.description}</p>
                        <p>{document.content}</p>
                    </div>
                    <div className="document-actions">
                        <Link to="/create">
                            <button className="edit-button" onClick={() => onEdit(document)}>Edit</button>
                        </Link>
                        <button className="delete-button" onClick={() => onDelete(document.id)}>Delete</button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default DocumentList;