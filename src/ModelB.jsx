import React, { useState, useEffect } from 'react';
// import { Button, Input, Textarea, Card, CardContent, CardHeader, CardTitle, CardDescription, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Badge } from "@/components/ui";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';


function App() {
  const [journals, setJournals] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentJournal, setCurrentJournal] = useState({ title: '', body: '', tags: [], viewCount: 0 });

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => { 
    setIsOpen(false); 
    setCurrentJournal({ title: '', body: '', tags: [], viewCount: 0 });
  };

  const addJournal = () => {
    if (currentJournal.title && currentJournal.body) {
      setJournals([...journals, { 
        ...currentJournal, 
        id: Date.now(),
        body: currentJournal.body.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\*(.*?)\*/g, '<i>$1</i>')
      }]);
      closeDialog();
    }
  };

  const viewJournal = (journal) => {
    const updatedJournals = journals.map(j => 
      j.id === journal.id ? { ...j, viewCount: j.viewCount + 1 } : j
    );
    setJournals(updatedJournals);
    setCurrentJournal(journal);
  };

  const filteredJournals = journals.filter(journal => 
    journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Micro Journal</h1>
        <Button onClick={openDialog}>Add Journal</Button>
      </header>
      <Input 
        placeholder="Search journals or tags..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="mb-4"
      />
      {filteredJournals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJournals.map(journal => (
            <JournalCard key={journal.id} journal={journal} onView={viewJournal} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No journals yet. Start by adding one!</p>
      )}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Journal</DialogTitle>
          </DialogHeader>
          <Input 
            value={currentJournal.title} 
            onChange={(e) => setCurrentJournal({...currentJournal, title: e.target.value})}
            placeholder="Title" 
            className="my-2"
          />
          <Textarea 
            value={currentJournal.body} 
            onChange={(e) => setCurrentJournal({...currentJournal, body: e.target.value})}
            placeholder="Your thoughts here... Use **bold** and *italic* for formatting."
            className="my-2"
          />
          <Input 
            value={currentJournal.tags.join(', ')} 
            onChange={(e) => setCurrentJournal({...currentJournal, tags: e.target.value.split(',').map(tag => tag.trim())})}
            placeholder="Tags (comma separated)" 
            className="my-2"
          />
          <DialogFooter>
            <Button onClick={addJournal}>Save</Button>
            <Button variant="secondary" onClick={closeDialog}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {currentJournal.id && (
        <JournalDetail journal={currentJournal} onClose={() => setCurrentJournal({})} />
      )}
    </div>
  );
}

function JournalCard({ journal, onView }) {
  return (
    <Card onClick={() => onView(journal)} className="cursor-pointer">
      <CardHeader>
        <CardTitle>{journal.title}</CardTitle>
        <CardDescription>Viewed: {journal.viewCount} times</CardDescription>
      </CardHeader>
      <CardContent>
        <div dangerouslySetInnerHTML={{ __html: journal.body.slice(0, 100) + '...' }}></div>
        <div className="mt-2">
          {journal.tags.map(tag => <Badge key={tag} className="mr-1">{tag}</Badge>)}
        </div>
      </CardContent>
    </Card>
  );
}

function JournalDetail({ journal, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <Card>
          <CardHeader>
            <CardTitle>{journal.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: journal.body }}></div>
            <div className="mt-2">
              {journal.tags.map(tag => <Badge key={tag} className="mr-1">{tag}</Badge>)}
            </div>
          </CardContent>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </Card>
      </div>
    </div>
  );
}

export default App;