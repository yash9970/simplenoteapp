import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const API_URL = "http://localhost:8080/api/notes"; // update after backend deploy

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Load notes
  useEffect(() => {
    fetch(API_URL).then(res => res.json()).then(setNotes);
  }, []);

  // Add or update note
  const saveNote = async () => {
    if (!title.trim() && !content.trim()) return;

    if (editingId) {
      // update
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
      const updated = await res.json();
      setNotes(notes.map(n => (n.id === editingId ? updated : n)));
      setEditingId(null);
    } else {
      // create
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
      const newNote = await res.json();
      setNotes([...notes, newNote]);
    }
    setTitle("");
    setContent("");
  };

  // Delete
  const deleteNote = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setNotes(notes.filter(n => n.id !== id));
  };

  // Start editing
  const editNote = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>📝 Notes App</Typography>

      <TextField
        fullWidth
        label="Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />
      <TextField
        fullWidth
        multiline
        minRows={3}
        label="Content"
        variant="outlined"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={saveNote}
        startIcon={editingId ? <SaveIcon /> : null}
      >
        {editingId ? "Save Changes" : "Add Note"}
      </Button>

      <Grid container spacing={2} style={{ marginTop: "2rem" }}>
        {notes.map((note) => (
          <Grid item xs={12} key={note.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{note.title}</Typography>
                <Typography>{note.content}</Typography>
                <div style={{ marginTop: "0.5rem" }}>
                  <IconButton onClick={() => editNote(note)}><EditIcon /></IconButton>
                  <IconButton onClick={() => deleteNote(note.id)}><DeleteIcon /></IconButton>
                  <IconButton component="a"
                    href={`${API_URL}/share/${note.shareId}`}
                    target="_blank"
                    rel="noreferrer">
                    <ShareIcon />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
