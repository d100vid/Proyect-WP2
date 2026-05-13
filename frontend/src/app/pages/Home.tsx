import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Plus, LogIn } from 'lucide-react';
import { RecipeCard } from '../components/RecipeCard';
import { FilterChip } from '../components/FilterChip';
import { AddRecipeModal } from '../components/AddRecipeModal';

interface Recipe {
  id: number;
  title: string;
  image: string;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isQuick?: boolean;
  isHealthy?: boolean;
  hasFewIngredients?: boolean;
}

export function Home() {
  const [activeFilter, setActiveFilter] = useState<string>('All recipes');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  const filters = ['All recipes', 'Quick meals', 'Healthy', 'Few ingredients', 'My Favorites'];

  const isFavorited = (id: number) => favorites.indexOf(id) !== -1;

  const allRecipes: Recipe[] = [
    {
      id: 1,
      title: 'Grilled Salmon with Lemon Butter',
      image: 'https://images.unsplash.com/photo-1768482303665-ed751d06af5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsbW9uJTIwZGlzaHxlbnwxfHx8fDE3NzU2Njk2MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      time: '25 min',
      difficulty: 'Medium',
      isHealthy: true
    },
    {
      id: 2,
      title: 'Classic Creamy Carbonara',
      image: 'https://images.unsplash.com/photo-1574885014162-92e4f12928db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYSUyMGZvb2R8ZW58MXx8fHwxNzc1NjY5NjIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      time: '20 min',
      difficulty: 'Easy',
      isQuick: true
    },
    {
      id: 3,
      title: 'Herb Grilled Chicken & Vegetables',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzc1NjY1MDQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      time: '35 min',
      difficulty: 'Medium',
      isHealthy: true
    },
    {
      id: 4,
      title: 'Asian Vegetable Stir Fry',
      image: 'https://images.unsplash.com/photo-1761314025701-34795be5f737?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHN0aXIlMjBmcnl8ZW58MXx8fHwxNzc1NjYyNzgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      time: '15 min',
      difficulty: 'Easy',
      isQuick: true,
      isHealthy: true,
      hasFewIngredients: true
    },
    {
      id: 5,
      title: 'Fresh Garden Salad Bowl',
      image: 'https://images.unsplash.com/photo-1644172949364-3fcfd25604b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGdyZWVuJTIwc2FsYWR8ZW58MXx8fHwxNzc1NjQwMjE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      time: '10 min',
      difficulty: 'Easy',
      isQuick: true,
      isHealthy: true,
      hasFewIngredients: true
    },
    {
      id: 6,
      title: 'Avocado Toast with Poached Egg',
      image: 'https://images.unsplash.com/photo-1676471970358-1cff04452e7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjBhdm9jYWRvJTIwdG9hc3R8ZW58MXx8fHwxNzc1NTUyOTgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      time: '8 min',
      difficulty: 'Easy',
      isQuick: true,
      isHealthy: true,
      hasFewIngredients: true
    },
    {
      id: 7,
      title: 'Mexican Street Tacos',
      image: 'https://images.unsplash.com/photo-1707604341704-74abdc25e52a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWNvcyUyMG1leGljYW4lMjBmb29kfGVufDF8fHx8MTc3NTY1MDkyMXww&ixlib=rb-4.1.0&q=80&w=1080',
      time: '12 min',
      difficulty: 'Easy',
      isQuick: true,
      hasFewIngredients: true
    },
    {
      id: 8,
      title: 'Berry Bliss Smoothie Bowl',
      image: 'https://images.unsplash.com/photo-1645839449196-62bde406052e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXJyeSUyMHNtb290aGllJTIwYm93bHxlbnwxfHx8fDE3NzU2NjUwNDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      time: '5 min',
      difficulty: 'Easy',
      isQuick: true,
      isHealthy: true,
      hasFewIngredients: true
    }
  ];

  // Función para filtrar recetas según el filtro activo
  const getFilteredRecipes = () => {
    let filtered = allRecipes;
    
    if (activeFilter === 'Quick meals') {
      filtered = allRecipes.filter(recipe => recipe.isQuick);
    } else if (activeFilter === 'Healthy') {
      filtered = allRecipes.filter(recipe => recipe.isHealthy);
    } else if (activeFilter === 'Few ingredients') {
      filtered = allRecipes.filter(recipe => recipe.hasFewIngredients);
    } else if (activeFilter === 'My Favorites') {
      // Combinar recetas de favoritos con recetas personalizadas
      const favoriteRecipes = allRecipes.filter(recipe => isFavorited(recipe.id));
      const favoriteCustomRecipes = customRecipes.filter(recipe => isFavorited(recipe.id));
      filtered = [...favoriteCustomRecipes, ...favoriteRecipes];
    } else {
      filtered = allRecipes;
    }
    
    return filtered;
  };

  const filteredRecipes = getFilteredRecipes();


  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking favorite
    setFavorites(prev => 
      prev.indexOf(id) !== -1
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const handleAddRecipe = (recipe: Recipe) => {
    setCustomRecipes(prev => [recipe, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Sign In Button - Top Right */}
          <div className="flex justify-end mb-4">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl hover:from-violet-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              <span className="font-medium">Sign In</span>
            </Link>
          </div>

          <h1 className="text-center bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8 text-4xl">
            Recipe Haven
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for recipes..."
              className="w-full pl-14 pr-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition-all shadow-sm cursor-pointer"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => navigate('/search')}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Chips */}
        <div className="flex gap-3 overflow-x-auto pb-6 mb-10 scrollbar-hide">
          {filters.map((filter) => (
            <FilterChip
              key={filter}
              label={filter}
              active={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            />
          ))}
        </div>

        {/* Custom Recipes Section */}
        {customRecipes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-slate-700 mb-6">Your Custom Recipes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {customRecipes.map((recipe) => (
                <Link key={recipe.id} to={`/recipe/${recipe.id}`}>
                  <RecipeCard
                    image={recipe.image}
                    title={recipe.title}
                    time={recipe.time}
                    difficulty={recipe.difficulty}
                    isFavorite={isFavorited(recipe.id)}
                    onToggleFavorite={(e) => toggleFavorite(recipe.id, e)}
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recommended for you */}
        <section className="mb-12">
          <h2 className="text-slate-700 mb-6">
            {activeFilter === 'All recipes' && 'All Recipes'}
            {activeFilter === 'Quick meals' && 'Quick Recipes'}
            {activeFilter === 'Healthy' && 'Healthy Recipes'}
            {activeFilter === 'Few ingredients' && 'Low Ingredient Recipes'}
            {activeFilter === 'My Favorites' && 'My Favorite Recipes'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <Link key={recipe.id} to={`/recipe/${recipe.id}`}>
                <RecipeCard
                  image={recipe.image}
                  title={recipe.title}
                  time={recipe.time}
                  difficulty={recipe.difficulty}
                  isFavorite={isFavorited(recipe.id)}
                  onToggleFavorite={(e) => toggleFavorite(recipe.id, e)}
                />
              </Link>
            ))}
          </div>
          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">
                {activeFilter === 'My Favorites' 
                  ? 'No favorite recipes yet. Click the star icon to save recipes!' 
                  : 'No recipes found for this filter.'}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Floating Add Recipe Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Recipe Modal */}
      <AddRecipeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddRecipe={handleAddRecipe}
      />
    </div>
  );
}