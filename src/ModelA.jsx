// App.jsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const App = () => {
  const [journals, setJournals] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentJournal, setCurrentJournal] = useState({ title: '', body: '', tags: [], viewCount: 0 });

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => {
    setIsOpen(false);
    setCurrentJournal({ title: '', body: '', tags: [], viewCount: 0 });
  };

  const saveJournal = () => {
    setJournals([...journals, { ...currentJournal, id: Date.now() }]);
    closeDialog();
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  const filteredJournals = journals.filter(journal => 
    journal.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    journal.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const JournalDetail = ({ journal }) => (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{journal.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div dangerouslySetInnerHTML={{__html: formatText(journal.body)}} />
          <div className="mt-2">
            {journal.tags.map(tag => <Badge key={tag} className="mr-2">{tag}</Badge>)}
          </div>
          <p>Viewed: {journal.viewCount} times</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Input 
          placeholder="Search journals..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-1/2"
        />
        <Button onClick={openDialog}>Add Journal</Button>
      </div>

      {filteredJournals.length === 0 ? (
        <p className="text-center">No journals match your search or no journals have been created yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJournals.map(journal => (
            <div key={journal.id} onClick={() => setCurrentJournal({...journal, viewCount: journal.viewCount + 1})}>
              <JournalDetail journal={journal} />
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <Label htmlFor="journalTitle">Title</Label>
          <Input id="journalTitle" value={currentJournal.title} onChange={(e) => setCurrentJournal({...currentJournal, title: e.target.value})} />
          <Label htmlFor="journalBody" className="mt-2">Body</Label>
          <textarea 
            id="journalBody" 
            className="w-full p-2 border rounded" 
            value={currentJournal.body} 
            onChange={(e) => setCurrentJournal({...currentJournal, body: e.target.value})}
          />
          <Label htmlFor="journalTags" className="mt-2">Tags (comma separated)</Label>
          <Input id="journalTags" 
            value={currentJournal.tags.join(', ')} 
            onChange={(e) => setCurrentJournal({...currentJournal, tags: e.target.value.split(',').map(tag => tag.trim())})}
          />
          <Button onClick={saveJournal} className="mt-4">Save Journal</Button>
        </DialogContent>
      </Dialog>

      {currentJournal.id && <JournalDetail journal={currentJournal} />}
    </div>
  );
};

export default App;