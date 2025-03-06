
import React from 'react';

const AdSpace: React.FC = () => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <p className="text-xs text-muted-foreground mb-2">ADVERTISEMENT</p>
      <div className="h-[250px] bg-gray-100 rounded flex items-center justify-center">
        <p className="text-sm text-gray-400">Ad Space (300x250)</p>
      </div>
    </div>
  );
};

export default AdSpace;
