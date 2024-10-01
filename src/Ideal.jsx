import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function App() {
  const [journals, setJournals] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentJournal, setCurrentJournal] = useState(null);
  const [newJournal, setNewJournal] = useState({
    title: '',
    body: '',
    tags: '',
  });

  const openAddDialog = () => setIsAddDialogOpen(true);
  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setNewJournal({ title: '', body: '', tags: '' });
  };

  const addJournal = () => {
    if (newJournal.title && newJournal.body) {
      const formattedBody = newJournal.body
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.*?)\*/g, '<i>$1</i>');
      const tagsArray = newJournal.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');
      const newEntry = {
        id: Date.now(),
        title: newJournal.title,
        body: formattedBody,
        tags: tagsArray,
        viewCount: 0,
      };
      setJournals([...journals, newEntry]);
      closeAddDialog();
    }
  };

  const viewJournal = (journal) => {
    const updatedJournal = { ...journal, viewCount: journal.viewCount + 1 };
    const updatedJournals = journals.map((j) =>
      j.id === journal.id ? updatedJournal : j
    );
    setJournals(updatedJournals);
    setCurrentJournal(updatedJournal);
  };

  const closeJournalDialog = () => {
    setCurrentJournal(null);
  };

  const filteredJournals = journals.filter(
    (journal) =>
      journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-4 sm:p-6">
      <div className="container mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-4xl font-extrabold text-white text-center sm:text-left mb-6 sm:mb-0">
            Micro Journal
          </h1>
          <Button onClick={openAddDialog} className="w-full sm:w-auto">
            Add Journal
          </Button>
        </header>

        <Input
          placeholder="Search journals or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-8 shadow-lg"
        />

        {filteredJournals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJournals.map((journal) => (
              <JournalCard
                key={journal.id}
                journal={journal}
                onView={viewJournal}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-white text-lg">
            No journals yet. Start by adding one!
          </p>
        )}

        {/* Add Journal Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="rounded-lg shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Add New Journal
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={newJournal.title}
                onChange={(e) =>
                  setNewJournal({ ...newJournal, title: e.target.value })
                }
                placeholder="Title"
                className="shadow-md"
              />
              <Textarea
                value={newJournal.body}
                onChange={(e) =>
                  setNewJournal({ ...newJournal, body: e.target.value })
                }
                placeholder="Your thoughts here... Use **bold** and *italic* for formatting."
                className="shadow-md"
              />
              <Input
                value={newJournal.tags}
                onChange={(e) =>
                  setNewJournal({ ...newJournal, tags: e.target.value })
                }
                placeholder="Tags (comma separated)"
                className="shadow-md"
              />
            </div>
            <DialogFooter>
              <Button onClick={addJournal}>Save</Button>
              <Button variant="secondary" onClick={closeAddDialog}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Journal Detail Dialog */}
        <Dialog
          open={!!currentJournal}
          onOpenChange={(isOpen) => {
            if (!isOpen) closeJournalDialog();
          }}
        >
          <DialogContent className="sm:max-w-xl rounded-lg shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                {currentJournal?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div
                dangerouslySetInnerHTML={{ __html: currentJournal?.body }}
                className="prose max-w-none text-gray-800"
              />
              <div className="flex flex-wrap gap-2">
                {currentJournal?.tags.map((tag) => (
                  <Badge key={tag} className="bg-indigo-500 text-white">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Viewed {currentJournal?.viewCount} times
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function JournalCard({ journal, onView }) {
  return (
    <Card
      onClick={() => onView(journal)}
      className="cursor-pointer hover:shadow-2xl transition-shadow bg-white bg-opacity-80 backdrop-blur-md rounded-lg overflow-hidden"
    >
      <div className="p-6">
        <CardHeader className="mb-4">
          <CardTitle className="truncate text-2xl font-bold text-gray-800">
            {journal.title}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Viewed {journal.viewCount} times
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            dangerouslySetInnerHTML={{
              __html:
                journal.body.length > 150
                  ? journal.body.slice(0, 150) + '...'
                  : journal.body,
            }}
            className="prose max-w-none text-gray-700"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {journal.tags.map((tag) => (
              <Badge key={tag} className="bg-indigo-500 text-white">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
