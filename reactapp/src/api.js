// src/api.js
const API_BASE_URL = 'https://8080-edbbcdbcdfbeebb313964481aeabdaffbaathree.premiumproject.examly.io';

export const fetchDocuments = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/documents`);
        if (!response.ok) throw new Error('Failed to fetch documents');
        return await response.json();
    } catch (error) {
        console.error('Error fetching documents:', error);
        return [];
    }
};

export const fetchDocumentById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/documents/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch document with id ${id}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching document:', error);
        return null;
    }
};

export const createDocument = async (document) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/documents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(document),
        });
        if (!response.ok) throw new Error('Failed to create document');
        return await response.json();
    } catch (error) {
        console.error('Error creating document:', error);
        return null;
    }
};

export const updateDocument = async (id, document) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(document),
        });
        if (!response.ok) throw new Error(`Failed to update document with id ${id}`);
        return await response.json();
    } catch (error) {
        console.error('Error updating document:', error);
        return null;
    }
};

export const deleteDocument = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Failed to delete document with id ${id}`);
    } catch (error) {
        console.error('Error deleting document:', error);
    }
};