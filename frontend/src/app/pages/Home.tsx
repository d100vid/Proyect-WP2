import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ApiService } from '../../services/api';
import { Search, Plus, LogOut, Shield } from 'lucide-react';
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
  const [serverRecipes, setServerRecipes] = useState<Recipe[]>([]); // recipes validated on server
  const [user, setUser] = useState<any>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      // Cargar las recetas del usuario (incluye pendientes)
      (async () => {
        try {
          const userRecipes = await ApiService.getRecipesByUser(parsed.id);
          // mapear a tipo Recipe local
          setCustomRecipes((userRecipes as any[]).map(r => ({
            id: r.id,
            title: r.title,
            image: r.image || '',
            time: r.time || '',
            difficulty: (r.difficulty as any) || 'Easy',
            isQuick: !!r.isQuick,
            isHealthy: !!r.isHealthy,
            hasFewIngredients: !!r.hasFewIngredients,
            validated: !!r.validated,
            ingredients: r.ingredients,
            instructions: r.instructions,
          })));
        } catch (err) {
          console.error('Error loading user recipes', err);
        }

        // If user is admin, fetch pending count for notification
        if (parsed && parsed.role === 'Admin') {
          try {
            const pend = await ApiService.getPendingRecipes(parsed.id);
            setPendingCount((pend as any[]).length || 0);
          } catch (e) {
            console.error('Error fetching pending count', e);
          }
        }
      })();
    } else {
      // Si no hay usuario, redirigir a login
      navigate('/');
    }
  }, [navigate]);

  // Fetch validated recipes from server
  useEffect(() => {
    let mounted = true;
    const fetchRecipes = async () => {
      try {
        // dynamic import to avoid circular deps
        const { ApiService } = await import('../../services/api');
        const data = await ApiService.getValidatedRecipes();
        if (mounted) setServerRecipes((data as any) || []);
      } catch (err) {
        console.error('Error fetching validated recipes', err);
      }
    };

    fetchRecipes();
    const interval = setInterval(fetchRecipes, 10000); // refresh every 10s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Default demo recipes actualizadas para coincidir con SearchResults
  const DEFAULT_RECIPES: Recipe[] = [
    {
      id: 1,
      title: 'Grilled Salmon with Lemon Butter',
      image: 'https://images.unsplash.com/photo-1768482303665-ed751d06af5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      time: '25 min',
      difficulty: 'Medium',
      isQuick: false,
      isHealthy: true,
      hasFewIngredients: false,
    },
    {
      id: 2,
      title: 'Classic Creamy Carbonara',
      image: 'https://images.unsplash.com/photo-1574885014162-92e4f12928db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      time: '20 min',
      difficulty: 'Easy',
      isQuick: true,
      isHealthy: false,
      hasFewIngredients: true,
    },
    {
      id: 3,
      title: 'Herb Grilled Chicken & Vegetables',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      time: '35 min',
      difficulty: 'Medium',
      isQuick: false,
      isHealthy: true,
      hasFewIngredients: false,
    },
    {
      id: 4,
      title: 'Asian Vegetable Stir Fry',
      image: 'https://images.unsplash.com/photo-1761314025701-34795be5f737?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      time: '15 min',
      difficulty: 'Easy',
      isQuick: true,
      isHealthy: true,
      hasFewIngredients: false,
    },
    {
      id: 5,
      title: 'Fresh Garden Salad Bowl',
      image: 'https://images.unsplash.com/photo-1644172949364-3fcfd25604b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      time: '10 min',
      difficulty: 'Easy',
      isQuick: true,
      isHealthy: true,
      hasFewIngredients: true,
    },
    {
      id: 6,
      title: 'Avocado Toast with Poached Egg',
      image: 'https://images.unsplash.com/photo-1676471970358-1cff04452e7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      time: '8 min',
      difficulty: 'Easy',
      isQuick: true,
      isHealthy: true,
      hasFewIngredients: true,
    },
    {
      id: 7,
      title: 'Mexican Street Tacos',
      image: 'https://images.unsplash.com/photo-1707604341704-74abdc25e52a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      time: '12 min',
      difficulty: 'Easy',
      isQuick: true,
      isHealthy: false,
      hasFewIngredients: false,
    },
    {
      id: 8,
      title: 'Berry Bliss Smoothie Bowl',
      image: 'https://images.unsplash.com/photo-1645839449196-62bde406052e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      time: '5 min',
      difficulty: 'Easy',
      isQuick: true,
      isHealthy: true,
      hasFewIngredients: true,
    },
    {
      id: 9,
      title: 'Beef Tenderloin Steak',
      image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400',
      time: '45 min',
      difficulty: 'Hard',
      isQuick: false,
      isHealthy: false,
      hasFewIngredients: false,
    },
    {
      id: 10,
      title: 'Margherita Pizza',
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400',
      time: '30 min',
      difficulty: 'Medium',
      isQuick: false,
      isHealthy: false,
      hasFewIngredients: true,
    },
    {
      id: 11,
      title: 'Thai Green Curry',
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400',
      time: '40 min',
      difficulty: 'Medium',
      isQuick: false,
      isHealthy: true,
      hasFewIngredients: false,
    },
    {
      id: 12,
      title: 'Caesar Salad',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
      time: '10 min',
      difficulty: 'Easy',
      isQuick: true,
      isHealthy: true,
      hasFewIngredients: true,
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const filters = ['All recipes', 'Quick meals', 'Healthy', 'Few ingredients', 'My Favorites'];

  const isFavorited = (id: number) => favorites.indexOf(id) !== -1;

  // Función para filtrar recetas según el filtro activo - CORREGIDA
  const getFilteredRecipes = () => {
    // 1. Fusionamos fuente default y server
    const allValidatedRecipes = serverRecipes && serverRecipes.length > 0
        ? [...DEFAULT_RECIPES, ...serverRecipes]
        : DEFAULT_RECIPES;

    // 2. Fusionamos con las del usuario
    const allCombined = [...allValidatedRecipes, ...customRecipes];

    // 3. Mapa para asegurar unicidad y priorizar las validadas si existen
    const recipeMap = new Map<number, Recipe>();

    allCombined.forEach(recipe => {
      const existing = recipeMap.get(recipe.id);
      // Si no existe, o si la nueva tiene 'validated: true', la guardamos
      if (!existing || (recipe as any).validated) {
        recipeMap.set(recipe.id, recipe);
      }
    });

    // 4. Convertimos a array y filtramos para que NO aparezcan las que son explícitamente "pendientes" (validated === false)
    // Aquellas que no tengan campo validated (como las DEFAULT) se incluyen.
    const visibleRecipes = Array.from(recipeMap.values()).filter(r => (r as any).validated !== false);

    if (activeFilter === 'Quick meals') {
      return visibleRecipes.filter(recipe => recipe.isQuick);
    } else if (activeFilter === 'Healthy') {
      return visibleRecipes.filter(recipe => recipe.isHealthy);
    } else if (activeFilter === 'Few ingredients') {
      return visibleRecipes.filter(recipe => recipe.hasFewIngredients);
    } else if (activeFilter === 'My Favorites') {
      return visibleRecipes.filter(recipe => isFavorited(recipe.id));
    }

    return visibleRecipes;
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
    // Newly created recipes are initially not validated; add to customRecipes
    setCustomRecipes(prev => [{ ...recipe, validated: false }, ...prev]);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-teal-50">
        {user ? (
            <>
              {/* Header */}
              <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {/* Sign In Button - Top Right */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-slate-700 font-medium">
                      {user && `Welcome, ${user.name}!`}
                    </div>
                    <div className="flex items-center gap-3">
                      {user && user.role === 'Admin' && (
                          <Link
                              to="/admin"
                              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all"
                          >
                            <Shield className="w-4 h-4" />
                            <span className="font-medium">Admin Panel</span>
                          </Link>
                      )}
                      {user && user.role === 'Admin' && pendingCount > 0 && (
                          <span className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium">
                   {pendingCount} pending
                 </span>
                      )}
                      <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
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

                {/* Pending Custom Recipes Section - only show recipes awaiting validation */}
                {(() => {
                  const pendingRecipes = customRecipes.filter(r => !(r as any).validated);
                  return pendingRecipes.length > 0 ? (
                      <section className="mb-12">
                        <h2 className="text-slate-700 mb-6">Your Recipes Pending Validation</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {pendingRecipes.map((recipe) => (
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
                  ) : null;
                })()}

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
                  userId={user?.id || 0}
              />
            </>
        ) : (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <p className="text-slate-600 text-lg">Loading...</p>
              </div>
            </div>
        )}
      </div>
  );
}