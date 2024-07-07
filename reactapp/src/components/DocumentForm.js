import React, { useState, useEffect } from 'react';
import { updateDocument, createDocument } from '../api';
import './DocumentForm.css'; // Make sure to create and import the CSS file

const DocumentForm = ({ documentToEdit, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState({ title: false, description: false, content: false });

    useEffect(() => {
        if (documentToEdit) {
            setTitle(documentToEdit.title);
            setDescription(documentToEdit.description);
            setContent(documentToEdit.content);
        } else {
            setTitle('');
            setDescription('');
            setContent('');
        }
    }, [documentToEdit]);

    const validate = () => {
        const newErrors = { title: false, description: false, content: false };
        let valid = true;

        if (!title) {
            newErrors.title = true;
            valid = false;
        }
        if (!description) {
            newErrors.description = true;
            valid = false;
        }
        if (!content) {
            newErrors.content = true;
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        const documentData = { title, description, content };
        try {
            await createDocument(documentData);
            onSave(); // Notify parent component of successful save
        } catch (error) {
            console.error('Error creating document:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        const documentData = { title, description, content };
        try {
            await updateDocument(documentToEdit.id, documentData);
            onSave(); // Notify parent component of successful save
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };

    return (
        <form onSubmit={documentToEdit ? handleUpdate : handleCreate} className="document-form">
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={errors.title ? 'error-input' : ''}
                    placeholder={errors.title ? 'Title is required' : 'Enter title'}
                />
            </div>
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={errors.description ? 'error-input' : ''}
                    placeholder={errors.description ? 'Description is required' : 'Enter description'}
                ></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={errors.content ? 'error-input' : ''}
                    placeholder={errors.content ? 'Content is required' : 'Enter content'}
                ></textarea>
            </div>
            {documentToEdit ? (
                <button type="submit" className="btn-primary">Update</button>
            ) : (
                <button type="submit" className="btn-primary">Create</button>
            )}
        </form>
    );
};

export default DocumentForm;