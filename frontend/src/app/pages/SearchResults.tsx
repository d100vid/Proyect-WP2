import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { Search, SlidersHorizontal, X, Clock, ChefHat } from 'lucide-react';
import { RecipeCard } from '../components/RecipeCard';
import { ApiService } from '../../services/api';

interface Recipe {
  id: number;
  title: string;
  image: string;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeInMinutes: number;
}

// Mock database de recetas
const allRecipes: Recipe[] = [
  { id: 1, title: 'Grilled Salmon with Lemon Butter', image: 'https://images.unsplash.com/photo-1768482303665-ed751d06af5f?q=80&w=1080', time: '25 min', difficulty: 'Medium', category: 'Seafood', timeInMinutes: 25 },
  { id: 2, title: 'Classic Creamy Carbonara', image: 'https://images.unsplash.com/photo-1574885014162-92e4f12928db?q=80&w=1080', time: '20 min', difficulty: 'Easy', category: 'Pasta', timeInMinutes: 20 },
  { id: 3, title: 'Herb Grilled Chicken & Vegetables', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=1080', time: '35 min', difficulty: 'Medium', category: 'Chicken', timeInMinutes: 35 },
  { id: 4, title: 'Asian Vegetable Stir Fry', image: 'https://images.unsplash.com/photo-1761314025701-34795be5f737?q=80&w=1080', time: '15 min', difficulty: 'Easy', category: 'Vegetarian', timeInMinutes: 15 },
  { id: 5, title: 'Fresh Garden Salad Bowl', image: 'https://images.unsplash.com/photo-1644172949364-3fcfd25604b8?q=80&w=1080', time: '10 min', difficulty: 'Easy', category: 'Salads', timeInMinutes: 10 },
  { id: 6, title: 'Avocado Toast with Poached Egg', image: 'https://images.unsplash.com/photo-1676471970358-1cff04452e7b?q=80&w=1080', time: '8 min', difficulty: 'Easy', category: 'Breakfast', timeInMinutes: 8 },
  { id: 7, title: 'Mexican Street Tacos', image: 'https://images.unsplash.com/photo-1707604341704-74abdc25e52a?q=80&w=1080', time: '12 min', difficulty: 'Easy', category: 'Mexican', timeInMinutes: 12 },
  { id: 8, title: 'Berry Bliss Smoothie Bowl', image: 'https://images.unsplash.com/photo-1645839449196-62bde406052e?q=80&w=1080', time: '5 min', difficulty: 'Easy', category: 'Breakfast', timeInMinutes: 5 },
  { id: 9, title: 'Beef Tenderloin Steak', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400', time: '45 min', difficulty: 'Hard', category: 'Beef', timeInMinutes: 45 },
  { id: 10, title: 'Margherita Pizza', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400', time: '30 min', difficulty: 'Medium', category: 'Italian', timeInMinutes: 30 },
  { id: 11, title: 'Thai Green Curry', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', time: '40 min', difficulty: 'Medium', category: 'Thai', timeInMinutes: 40 },
  { id: 12, title: 'Caesar Salad', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', time: '10 min', difficulty: 'Easy', category: 'Salads', timeInMinutes: 10 }
];

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxTime, setMaxTime] = useState<number>(60);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      loadUserRecipes(userData.id);
    }
  }, []);

  const loadUserRecipes = async (userId: number) => {
    try {
      const recipes = await ApiService.getRecipesByUser(userId);
      const validRecipes = (recipes as any[])
          .filter(r => r.validated)
          .map(r => ({
            id: r.id,
            title: r.title,
            image: r.image || '',
            time: r.time || '',
            difficulty: (r.difficulty || 'Easy') as 'Easy' | 'Medium' | 'Hard',
            category: r.category || 'Other',
            timeInMinutes: parseInt(String(r.time).match(/\d+/)?.[0] || '30') || 30
          }));
      setUserRecipes(validRecipes);
    } catch (err) {
      console.error('Error loading user recipes', err);
    }
  };

  // Lógica central: combinamos estáticas + usuario y filtramos
  const filteredRecipes = useMemo(() => {
    const allCombined = [...allRecipes, ...userRecipes];
    // Eliminar duplicados por ID
    const uniqueRecipes = Array.from(new Map(allCombined.map(r => [r.id, r])).values());

    return uniqueRecipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty = selectedDifficulty.length === 0 ||
          selectedDifficulty.includes(recipe.difficulty);

      const matchesCategory = selectedCategories.length === 0 ||
          selectedCategories.includes(recipe.category);

      const matchesTime = recipe.timeInMinutes <= maxTime;

      return matchesSearch && matchesDifficulty && matchesCategory && matchesTime;
    });
  }, [searchQuery, selectedDifficulty, selectedCategories, maxTime, userRecipes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulty(prev =>
        prev.includes(difficulty)
            ? prev.filter(d => d !== difficulty)
            : [...prev, difficulty]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
        prev.includes(category)
            ? prev.filter(c => c !== category)
            : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSelectedDifficulty([]);
    setSelectedCategories([]);
    setMaxTime(60);
  };

  const activeFiltersCount = selectedDifficulty.length + selectedCategories.length + (maxTime < 60 ? 1 : 0);
  const categories = ['Seafood', 'Pasta', 'Chicken', 'Vegetarian', 'Salads', 'Breakfast', 'Mexican', 'Beef', 'Italian', 'Thai'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-teal-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link to="/home" className="inline-block mb-6">
              <h1 className="text-center bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent text-3xl">
                Recipe Haven
              </h1>
            </Link>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <form onSubmit={handleSearch} className="w-full">
                  <input
                      type="text"
                      placeholder="Search for recipes..."
                      className="w-full pl-14 pr-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition-all shadow-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition-all shadow-sm border ${
                      showFilters ? 'bg-violet-500 text-white border-violet-500' : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300'
                  }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                    <span className="bg-white text-violet-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                  {activeFiltersCount}
                </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 flex-shrink-0`}>
              <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-100 sticky top-32">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-slate-800 text-lg font-medium">Filters</h3>
                  {activeFiltersCount > 0 && (
                      <button onClick={clearAllFilters} className="text-violet-600 text-sm hover:text-violet-700 transition-colors">Clear all</button>
                  )}
                </div>

                {/* Difficulty */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <ChefHat className="w-4 h-4 text-violet-600" />
                    <h4 className="text-slate-700 font-medium">Difficulty</h4>
                  </div>
                  <div className="space-y-2">
                    {difficulties.map(d => (
                        <label key={d} className="flex items-center gap-3 p-3 rounded-xl hover:bg-violet-50 cursor-pointer transition-colors">
                          <input type="checkbox" checked={selectedDifficulty.includes(d)} onChange={() => toggleDifficulty(d)} className="w-4 h-4 text-violet-600 rounded border-slate-300" />
                          <span className="text-slate-600">{d}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Time */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <h4 className="text-slate-700 font-medium">Max Time</h4>
                  </div>
                  <div className="px-2">
                    <input type="range" min="5" max="60" step="5" value={maxTime} onChange={(e) => setMaxTime(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500" />
                    <div className="flex justify-between mt-2 text-sm text-slate-600">
                      <span>5 min</span>
                      <span className="font-medium text-violet-600">{maxTime} min</span>
                      <span>60 min</span>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <h4 className="text-slate-700 font-medium mb-4">Category</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {categories.map(c => (
                        <label key={c} className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors">
                          <input type="checkbox" checked={selectedCategories.includes(c)} onChange={() => toggleCategory(c)} className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                          <span className="text-slate-600">{c}</span>
                        </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-slate-700">{searchQuery ? `Search results for "${searchQuery}"` : 'All Recipes'}</h2>
                <p className="text-slate-500 mt-1">{filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found</p>
              </div>

              {/* Tags */}
              {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedDifficulty.map(d => (
                        <button key={d} onClick={() => toggleDifficulty(d)} className="flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm hover:bg-violet-200">
                          {d} <X className="w-4 h-4" />
                        </button>
                    ))}
                    {selectedCategories.map(c => (
                        <button key={c} onClick={() => toggleCategory(c)} className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200">
                          {c} <X className="w-4 h-4" />
                        </button>
                    ))}
                    {maxTime < 60 && (
                        <button onClick={() => setMaxTime(60)} className="flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm hover:bg-teal-200">
                          Max {maxTime} min <X className="w-4 h-4" />
                        </button>
                    )}
                  </div>
              )}

              {filteredRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRecipes.map(recipe => (
                        <Link key={recipe.id} to={`/recipe/${recipe.id}`}>
                          <RecipeCard image={recipe.image} title={recipe.title} time={recipe.time} difficulty={recipe.difficulty} />
                        </Link>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
                      <Search className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-slate-700 text-xl mb-2">No recipes found</h3>
                    <p className="text-slate-500 mb-6">Try adjusting your filters or search terms</p>
                    <button onClick={clearAllFilters} className="px-6 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-colors">Clear all filters</button>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}