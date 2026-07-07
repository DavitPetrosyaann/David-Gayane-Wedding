import React from 'react';

const PhotoCollage: React.FC = () => {
  return (
    <section className="py-16 px-4 max-w-4xl mx-auto overflow-hidden">
      <div className="flex flex-col items-center space-y-16 md:space-y-12">
        
        {/* 19 */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full justify-start md:pl-12">
          <div className="text-6xl md:text-8xl text-wedding-accent font-serif opacity-80">19</div>
          <img 
            src="https://picsum.photos/400/300?grayscale" 
            alt="Couple 1" 
            className="w-full max-w-[16rem] h-48 object-cover shadow-lg rounded-sm"
          />
        </div>

        {/* 09 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-4 md:gap-8 w-full justify-start md:pr-12">
          <div className="text-6xl md:text-8xl text-wedding-accent font-serif opacity-80">09</div>
          <img 
            src="https://picsum.photos/300/400?grayscale" 
            alt="Couple 2" 
            className="w-full max-w-[12rem] h-64 object-cover shadow-lg rounded-sm"
          />
        </div>

        {/* 2026 */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full justify-start md:pl-12">
          <div className="text-6xl md:text-8xl text-wedding-accent font-serif opacity-80">2026</div>
          <img 
            src="https://picsum.photos/400/400?grayscale" 
            alt="Couple 3" 
            className="w-full max-w-[16rem] h-64 object-cover shadow-lg rounded-sm"
          />
        </div>

      </div>
    </section>
  );
};

export default PhotoCollage;