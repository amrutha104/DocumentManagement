import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App';
import DocumentForm from '../components/DocumentForm';
import DocumentList from '../components/DocumentList';
import { fetchDocuments, createDocument, updateDocument, deleteDocument } from '../api';

jest.mock('../api');

const mockDocuments = [
    { id: 1, title: 'Doc 1', description: 'Description 1', content: 'Content 1' },
    { id: 2, title: 'Doc 2', description: 'Description 2', content: 'Content 2' },
];

const mockDocument = { id: 1, title: 'Test Doc', description: 'Test Description', content: 'Test Content' };

test('frontend_should check_App component without crashing', () => {
    render(<App />);
  
    expect(screen.getByText('Document Management System')).toBeInTheDocument();
});

test('frontend_should check_DocumentList with documents', () => {
    render(
        <Router>
            <DocumentList documents={mockDocuments} />
        </Router>
    );

    // Check for the presence of document titles within list items
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(mockDocuments.length); // Check if correct number of items are rendered

    mockDocuments.forEach((document, index) => {
        const listItem = listItems[index];
        expect(listItem).toHaveTextContent(document.title);
        expect(listItem).toHaveTextContent(document.description);
        expect(listItem).toHaveTextContent(document.content);
    });
});

test('frontend_should check_onEdit function when Edit button is clicked', () => {
    const handleEdit = jest.fn();
    render(
        <Router>
            <DocumentList documents={mockDocuments} onEdit={handleEdit} />
        </Router>
    );

    // Find all Edit buttons
    const editButtons = screen.getAllByText('Edit');

    // Simulate clicking Edit button for the first document
    fireEvent.click(editButtons[0]); // Click the Edit button for the first document

    expect(handleEdit).toHaveBeenCalledWith(mockDocuments[0]);
});

test('frontend_should check_onDelete function when Delete button is clicked', () => {
    const handleDelete = jest.fn();
    render(
        <Router>
            <DocumentList documents={mockDocuments} onDelete={handleDelete} />
        </Router>
    );

    // Simulate clicking Delete button for the second document
    fireEvent.click(screen.getAllByText('Delete')[1]); // Assuming second delete button in the list

    expect(handleDelete).toHaveBeenCalledWith(mockDocuments[1].id);
});


test('frontend_should check_DocumentForm for create', () => {
    render(<DocumentForm onSave={jest.fn()} />);

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Content')).toBeInTheDocument();
});

test('frontend_should check_DocumentForm for edit', () => {
    render(<DocumentForm documentToEdit={mockDocument} onSave={jest.fn()} />);

    expect(screen.getByDisplayValue('Test Doc')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Content')).toBeInTheDocument();
});

test('frontend_should check_creating new document in DocumentForm', async () => {
    const onSave = jest.fn();
    render(<DocumentForm onSave={onSave} />);
  
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Doc' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New Description' } });
    fireEvent.change(screen.getByLabelText('Content'), { target: { value: 'New Content' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Create' }));
  
    await waitFor(() => expect(createDocument).toHaveBeenCalledWith({
        title: 'New Doc',
        description: 'New Description',
        content: 'New Content'
    }));
    expect(onSave).toHaveBeenCalled();
});

test('frontend_should check_updating existing document in DocumentForm', async () => {
    const onSave = jest.fn();
    render(<DocumentForm documentToEdit={mockDocument} onSave={onSave} />);
  
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Doc' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Updated Description' } });
    fireEvent.change(screen.getByLabelText('Content'), { target: { value: 'Updated Content' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Update' }));
  
    await waitFor(() => expect(updateDocument).toHaveBeenCalledWith(mockDocument.id, {
        title: 'Updated Doc',
        description: 'Updated Description',
        content: 'Updated Content'
    }));
    expect(onSave).toHaveBeenCalled();
});

test('frontend_should check_handling error in fetchDocuments', async () => {
    fetchDocuments.mockResolvedValueOnce([]); // Mocking a successful response for the initial render
    fetchDocuments.mockRejectedValueOnce(new Error('Failed to fetch documents')); // Mocking a failed response
    
    render(<App />);
});