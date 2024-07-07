import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DocumentList from './components/DocumentList';
import DocumentForm from './components/DocumentForm';
import { fetchDocuments, updateDocument, deleteDocument, createDocument } from './api';
import './App.css';

const App = () => {
    const [documents, setDocuments] = useState([]);
    const [documentToEdit, setDocumentToEdit] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Function to load documents from API
    const loadDocuments = async () => {
        try {
            const docs = await fetchDocuments();
            setDocuments(docs);
        } catch (error) {
            console.error('Error loading documents:', error);
        }
    };

    useEffect(() => {
        loadDocuments(); // Load documents on component mount
    }, []); // Empty dependency array ensures this runs only once

    const handleEdit = (document) => {
        setDocumentToEdit(document);
    };

    const handleSave = async (documentData) => {
        try {
            if (documentToEdit) {
                await updateDocument(documentToEdit.id, documentData);
                setSuccessMessage('Document Updated Successfully');
            } else {
                await createDocument(documentData);
                setSuccessMessage('Document Created Successfully');
            }
            setTimeout(() => {
                setSuccessMessage('');
                loadDocuments(); // Reload documents after save
                setDocumentToEdit(null); // Reset documentToEdit state
                window.location.href = '/documents';
            }, 1000);
        } catch (error) {
            console.error('Error saving document:', error);
        }
    };

    const handleDelete = async (documentId) => {
        try {
            await deleteDocument(documentId);
            setSuccessMessage('Document Deleted Successfully');
            const updatedDocuments = documents.filter(doc => doc.id !== documentId);
            setDocuments(updatedDocuments);
            setTimeout(() => {
                setSuccessMessage('');
                loadDocuments(); // Reload documents after delete
                setDocumentToEdit(null); // Reset documentToEdit state
            }, 1000);
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const handleCreateClick = () => {
        setDocumentToEdit(null);
    };

    return (
        <Router>
            <div className="container">
                <nav className="navbar">
                    <div className="navbar-content">
                        <Link to="/" className="brand-logo">Document Management System</Link>
                        <ul className="nav-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/documents">Document List</Link></li>
                            <li><Link to="/create" onClick={handleCreateClick}>Create Document</Link></li>
                        </ul>
                    </div>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/documents" element={<DocumentList documents={documents} onEdit={handleEdit} onDelete={handleDelete} successMessage={successMessage} />} />
                    <Route path="/create" element={<DocumentForm documentToEdit={documentToEdit} onSave={handleSave} />} />
                </Routes>
                {successMessage && <p className="success-message">{successMessage}</p>}
                <footer className="footer">
                    &copy; 2024 Document Management System. All rights reserved.
                </footer>
            </div>
        </Router>
    );
};

const Home = () => (
    <div className="homepage">
        <h1>Welcome to the Document Management System</h1>
        <p>Manage your documents efficiently and effectively. Navigate to the documents section to get started.</p>
    </div>
);

export default App;