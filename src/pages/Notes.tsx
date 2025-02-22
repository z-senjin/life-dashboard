import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getCurrentUser, getNotes, createNote } from '@/lib/storage';
import { Note } from '@/lib/types';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Plus,
} from 'lucide-react';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const user = getCurrentUser();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Link,
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content: selectedNote?.content || '',
    onUpdate: ({ editor }) => {
      if (selectedNote) {
        const updatedNotes = notes.map((note) =>
          note.id === selectedNote.id
            ? { ...note, content: editor.getHTML(), updatedAt: new Date().toISOString() }
            : note
        );
        setNotes(updatedNotes);
        localStorage.setItem(`notes_${user?.id}`, JSON.stringify(updatedNotes));
      }
    },
  });

  useEffect(() => {
    if (user) {
      setNotes(getNotes(user.id));
    }
  }, []);

  useEffect(() => {
    if (editor && selectedNote) {
      editor.commands.setContent(selectedNote.content);
    }
  }, [selectedNote, editor]);

  const handleCreateNote = () => {
    if (!user || !title.trim()) return;

    const newNote = createNote(user.id, {
      title: title.trim(),
      content: '',
    });

    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
    setTitle('');
  };

  const MenuBar = () => {
    if (!editor) return null;

    return (
      <div className="flex flex-wrap gap-2 p-2 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-accent' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-accent' : ''}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
        <p className="text-muted-foreground">Create and manage your notes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <Card className="h-[calc(100vh-12rem)]">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="New note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateNote()}
              />
              <Button onClick={handleCreateNote}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-2">
                {notes.map((note) => (
                  <Button
                    key={note.id}
                    variant="ghost"
                    className={cn(
                      'w-full justify-start',
                      selectedNote?.id === note.id && 'bg-accent'
                    )}
                    onClick={() => setSelectedNote(note)}
                  >
                    {note.title}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="h-[calc(100vh-12rem)]">
          <MenuBar />
          <CardContent>
            <EditorContent editor={editor} className="min-h-[calc(100vh-16rem)] prose prose-sm max-w-none" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}