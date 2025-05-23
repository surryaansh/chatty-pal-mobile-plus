
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal = ({ isOpen, onClose }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    // Load API key from localStorage if available
    const savedApiKey = localStorage.getItem('chatgpt-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, [isOpen]);
  
  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('chatgpt-api-key', apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your API key has been saved successfully",
      });
    } else {
      localStorage.removeItem('chatgpt-api-key');
      toast({
        title: "API Key Removed",
        description: "Your API key has been removed",
      });
    }
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle>API Key Settings</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Enter your OpenAI API key to use your own account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Input
            type="password"
            placeholder="Enter your OpenAI API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
          />
          <p className="mt-2 text-xs text-zinc-400">
            Your API key is stored locally on your browser and never sent to our servers.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-white border-zinc-700 hover:bg-zinc-700">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-zinc-700 hover:bg-zinc-600 text-white">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
