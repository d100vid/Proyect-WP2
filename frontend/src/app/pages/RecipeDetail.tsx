import { useParams, Link } from 'react-router';
import { Clock, Users, ChefHat, ArrowLeft, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ApiService } from '../../services/api';

// Fallback mock data for demo when API has no data
const fallbackData: { [key: string]: any } = {
  '1': {
    title: 'Grilled Salmon with Lemon Butter',
    image: 'https://images.unsplash.com/photo-1768482303665-ed751d06af5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    time: '25 min',
    difficulty: 'Medium',
    servings: 4,
    description: 'A delicious and healthy grilled salmon with a rich lemon butter sauce. Perfect for a special dinner or a nutritious weeknight meal.',
    ingredients: ['4 salmon fillets (6 oz each)', '4 tbsp unsalted butter', '2 lemons (juice and zest)'],
    materials: ['Grill or grill pan', 'Mixing bowl'],
    instructions: ['Preheat grill', 'Cook salmon']
  }
};

export function RecipeDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        if (id) {
          const data: any = await ApiService.getRecipeById(Number(id));
          if (mounted && data) {
            // normalize fields: ingredients/instructions may be stored as newline text
            const ingredients = typeof data.ingredients === 'string' ? data.ingredients.split(/\r?\n/).filter(Boolean) : (data.ingredients || []);
            const instructions = typeof data.instructions === 'string' ? data.instructions.split(/\r?\n/).filter(Boolean) : (data.instructions || []);
            setRecipe({
              title: data.title || 'Recipe',
              image: data.image || '',
              time: data.time || '',
              difficulty: data.difficulty || 'Easy',
              servings: data.servings || 1,
              description: data.title || '',
              ingredients,
              materials: [],
              instructions,
            });
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Error fetching recipe by id', e);
      }
      // fallback to mock
      setRecipe(fallbackData[id || '1'] || fallbackData['1']);
      setLoading(false);
    };

    fetchRecipe();
    return () => { mounted = false; };
  }, [id]);

  if (loading || !recipe) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const diffKey = (recipe.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Easy';
  const difficultyColor = {
    Easy: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    Medium: 'bg-amber-50 text-amber-600 border border-amber-100',
    Hard: 'bg-rose-50 text-rose-600 border border-rose-100'
  }[diffKey];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/home" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to recipes</span>
          </Link>
          <h1 className="text-center bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Recipe Haven
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Image */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          <div className="aspect-[21/9] overflow-hidden">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Recipe Header Info */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-slate-800 text-3xl flex-1">{recipe.title}</h2>
              <button className="p-3 rounded-full hover:bg-rose-50 transition-colors">
                <Heart className="w-6 h-6 text-slate-400 hover:text-rose-500" />
              </button>
            </div>
            
            <p className="text-slate-600 mb-6">{recipe.description}</p>
            
            {/* Quick Info */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-xl">
                <Clock className="w-5 h-5 text-violet-600" />
                <span className="text-slate-700">{recipe.time}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-slate-700">{recipe.servings} servings</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${difficultyColor}`}>
                <ChefHat className="w-5 h-5" />
                <span>{recipe.difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Ingredients */}
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
            <h3 className="text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400"></span>
              Ingredients
            </h3>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Materials/Equipment */}
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
            <h3 className="text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-teal-400"></span>
              Materials & Equipment
            </h3>
            <ul className="space-y-3">
              {(recipe.materials || []).map((material: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
                  <span>{material}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
          <h3 className="text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"></span>
            Instructions
          </h3>
          <ol className="space-y-6">
            {recipe.instructions.map((instruction: string, index: number) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 text-white flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <p className="text-slate-600 pt-1">{instruction}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}