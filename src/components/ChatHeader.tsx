
import React, { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ChatHeaderProps {
  toggleSidebar: () => void;
}

const ChatHeader = ({ toggleSidebar }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-zinc-700">
      <button
        onClick={toggleSidebar}
        className="text-white p-1.5 hover:bg-zinc-700 rounded-md"
      >
        <Menu size={20} />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 text-white hover:bg-zinc-700 py-1.5 px-3 rounded-md">
            <span>ChatGPT</span>
            <ChevronDown size={16} className="text-zinc-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-chatgpt-button border border-zinc-700">
          <DropdownMenuItem className="text-white hover:bg-zinc-700 focus:bg-zinc-700">GPT-3.5</DropdownMenuItem>
          <DropdownMenuItem className="text-white hover:bg-zinc-700 focus:bg-zinc-700">GPT-4</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="w-10"></div> {/* Spacer to balance the layout */}
    </div>
  );
};

export default ChatHeader;
