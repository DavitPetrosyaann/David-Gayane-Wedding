import React from 'react';

const BigPhoto: React.FC = () => {
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="relative w-full h-[60vh] md:h-[80vh] rounded-sm overflow-hidden shadow-2xl group">
        <img 
          src="https://picsum.photos/1600/1000?grayscale" 
          alt="Couple in wedding dresses" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          style={{ filter: 'brightness(0.8) sepia(0.2)' }}
        />
        {/* Optional subtle overlay for elegance */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
};

export default BigPhoto;