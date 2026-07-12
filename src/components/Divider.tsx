import React from 'react';

const Divider: React.FC = () => (
  <div className="flex items-center justify-center w-full py-8 opacity-80">
    <div className="h-[1px] w-16 md:w-32 bg-gradient-to-r from-transparent to-wedding-accent"></div>
    <div className="w-1.5 h-1.5 rotate-45 bg-wedding-accent mx-3 shadow-[0_0_8px_rgba(139,154,133,0.8)]"></div>
    <div className="h-[1px] w-16 md:w-32 bg-gradient-to-l from-transparent to-wedding-accent"></div>
  </div>
);

export default Divider;