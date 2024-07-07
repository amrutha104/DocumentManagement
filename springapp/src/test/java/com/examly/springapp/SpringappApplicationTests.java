package com.examly.springapp;

import com.examly.springapp.model.Document;
import com.examly.springapp.repository.DocumentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SpringappApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        documentRepository.deleteAll();
    }

    @Test
    void backend_testcontrollerFolderExists() {
        String directoryPath = "src/main/java/com/examly/springapp/controller";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void backend_testDocumentControllerFileExists() {
        String filePath = "src/main/java/com/examly/springapp/controller/DocumentController.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void backend_testDocumentModelFolderExists() {
        String directoryPath = "src/main/java/com/examly/springapp/model";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void backend_testDocumentModelFileExists() {
        String filePath = "src/main/java/com/examly/springapp/model/Document.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void backend_testDocumentServiceFolderExists() {
        String directoryPath = "src/main/java/com/examly/springapp/service";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void backend_testDocumentServiceFileExists() {
        String filePath = "src/main/java/com/examly/springapp/service/DocumentService.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    public void backend_shouldReturnAllDocuments() throws Exception {
        Document document1 = new Document();
        document1.setTitle("Title 1");
        document1.setDescription("Description 1");
        document1.setContent("Content 1");

        Document document2 = new Document();
        document2.setTitle("Title 2");
        document2.setDescription("Description 2");
        document2.setContent("Content 2");

        documentRepository.save(document1);
        documentRepository.save(document2);

        mockMvc.perform(get("/api/documents"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", is("Title 1")))
                .andExpect(jsonPath("$[1].title", is("Title 2")));
    }

    @Test
    public void backend_shouldReturnDocumentById() throws Exception {
        Document document = new Document();
        document.setTitle("Title");
        document.setDescription("Description");
        document.setContent("Content");
        document = documentRepository.save(document);

        mockMvc.perform(get("/api/documents/{id}", document.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is(document.getTitle())));
    }

    @Test
    public void backend_shouldCreateNewDocument() throws Exception {
        Document document = new Document();
        document.setTitle("New Title");
        document.setDescription("New Description");
        document.setContent("New Content");

        mockMvc.perform(post("/api/documents")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(document)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is(document.getTitle())));
    }

    @Test
    public void backend_shouldUpdateExistingDocument() throws Exception {
        Document document = new Document();
        document.setTitle("Title");
        document.setDescription("Description");
        document.setContent("Content");
        document = documentRepository.save(document);

        document.setTitle("Updated Title");

        mockMvc.perform(put("/api/documents/{id}", document.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(document)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Updated Title")));
    }

    @Test
    public void backend_shouldDeleteDocument() throws Exception {
        Document document = new Document();
        document.setTitle("Title");
        document.setDescription("Description");
        document.setContent("Content");
        document = documentRepository.save(document);

        mockMvc.perform(delete("/api/documents/{id}", document.getId()))
                .andExpect(status().isNoContent());

        Optional<Document> deletedDocument = documentRepository.findById(document.getId());
        assert(deletedDocument.isEmpty());
    }

    @Test
    public void backend_shouldReturnBadRequestForInvalidDocumentCreation() throws Exception {
        Document document = new Document();
        document.setDescription("Description without title");

        mockMvc.perform(post("/api/documents")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(document)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void backend_shouldReturnBadRequestForInvalidDocumentUpdate() throws Exception {
        Document document = new Document();
        document.setTitle("Title");
        document.setDescription("Description");
        document.setContent("Content");
        document = documentRepository.save(document);

        document.setTitle(null); // Invalid title

        mockMvc.perform(put("/api/documents/{id}", document.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(document)))
                .andExpect(status().isBadRequest());
    }
}