import { Clock, Star } from 'lucide-react';

interface RecipeCardProps {
  image: string;
  title: string;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export function RecipeCard({ image, title, time, difficulty, isFavorite = false, onToggleFavorite }: RecipeCardProps) {
  const difficultyColor = {
    Easy: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    Medium: 'bg-amber-50 text-amber-600 border border-amber-100',
    Hard: 'bg-rose-50 text-rose-600 border border-rose-100'
  }[difficulty];

  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100 relative">
      {/* Favorite Star Button */}
      <button
        onClick={onToggleFavorite}
        className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
      >
        <Star 
          className={`w-5 h-5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`}
        />
      </button>
      
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <h3 className="text-slate-700 mb-3 line-clamp-2">{title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${difficultyColor}`}>
            {difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}