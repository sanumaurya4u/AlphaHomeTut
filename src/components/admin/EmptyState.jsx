import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'No data found', description = 'There are no items to display at the moment.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-gray-500 font-semibold text-base mb-1">{title}</h3>
      <p className="text-gray-400 text-sm max-w-xs">{description}</p>
    </div>
  );
}
