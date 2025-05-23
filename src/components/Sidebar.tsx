
import React from 'react';
import { Plus, Settings, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import ApiKeyModal from './ApiKeyModal';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const isMobile = useIsMobile();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = React.useState(false);
  
  if (!isOpen && isMobile) return null;
  
  return (
    <>
      <div className={`${isMobile ? 'absolute inset-y-0 left-0 z-50' : 'flex-shrink-0'} h-full w-64 bg-zinc-900 flex flex-col transition-all duration-300`}>
        <div className="p-2">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 text-sm text-white border-zinc-700 hover:bg-zinc-800 bg-transparent"
            onClick={() => window.location.reload()}
          >
            <Plus size={16} />
            New chat
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-2 p-2.5 rounded-md text-gray-300 text-sm hover:bg-zinc-800">
              <MessageSquare size={15} />
              <span className="text-left truncate">Previous conversation 1</span>
            </button>
            <button className="w-full flex items-center gap-2 p-2.5 rounded-md text-gray-300 text-sm hover:bg-zinc-800">
              <MessageSquare size={15} />
              <span className="text-left truncate">Previous conversation 2</span>
            </button>
          </div>
        </div>
        
        <div className="mt-auto border-t border-zinc-800">
          <button 
            onClick={() => setIsApiKeyModalOpen(true)}
            className="w-full flex items-center gap-2 p-2.5 hover:bg-zinc-800 text-gray-300 text-sm"
          >
            <Settings size={15} />
            <span>API Key Settings</span>
          </button>
          
          <button className="w-full flex items-center gap-2 p-2.5 hover:bg-zinc-800 text-gray-300 text-sm">
            <User size={15} />
            <span>Account</span>
          </button>
        </div>
      </div>
      
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
      />
    </>
  );
};

export default Sidebar;
