import { useParams, Link } from 'react-router';
import { Clock, Users, ChefHat, ArrowLeft, Heart } from 'lucide-react';

// Mock data - en una app real esto vendría de una API
const recipeData: { [key: string]: any } = {
  '1': {
    title: 'Grilled Salmon with Lemon Butter',
    image: 'https://images.unsplash.com/photo-1768482303665-ed751d06af5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsbW9uJTIwZGlzaHxlbnwxfHx8fDE3NzU2Njk2MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '25 min',
    difficulty: 'Medium',
    servings: 4,
    description: 'A delicious and healthy grilled salmon with a rich lemon butter sauce. Perfect for a special dinner or a nutritious weeknight meal.',
    ingredients: [
      '4 salmon fillets (6 oz each)',
      '4 tbsp unsalted butter',
      '2 lemons (juice and zest)',
      '3 cloves garlic, minced',
      '2 tbsp fresh parsley, chopped',
      'Salt and pepper to taste',
      '2 tbsp olive oil',
      '1 tsp paprika'
    ],
    materials: [
      'Grill or grill pan',
      'Mixing bowl',
      'Small saucepan',
      'Basting brush',
      'Tongs',
      'Cutting board',
      'Sharp knife'
    ],
    instructions: [
      'Pat the salmon fillets dry with paper towels and season both sides with salt, pepper, and paprika.',
      'Preheat your grill to medium-high heat and brush with olive oil to prevent sticking.',
      'In a small saucepan, melt the butter over medium heat. Add minced garlic and cook for 1-2 minutes until fragrant.',
      'Add lemon juice and zest to the butter mixture. Stir in fresh parsley and keep warm.',
      'Place salmon fillets on the grill, skin-side down. Grill for 4-5 minutes without moving.',
      'Carefully flip the salmon and grill for another 3-4 minutes until cooked through.',
      'Remove from grill and immediately drizzle with the lemon butter sauce.',
      'Serve hot with your favorite vegetables or rice. Enjoy!'
    ]
  },
  '2': {
    title: 'Classic Creamy Carbonara',
    image: 'https://images.unsplash.com/photo-1574885014162-92e4f12928db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYSUyMGZvb2R8ZW58MXx8fHwxNzc1NjY5NjIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '20 min',
    difficulty: 'Easy',
    servings: 4,
    description: 'An authentic Italian carbonara with a silky, creamy sauce made with eggs, cheese, and crispy pancetta.',
    ingredients: [
      '400g spaghetti',
      '200g pancetta or guanciale, diced',
      '4 large egg yolks',
      '1 whole egg',
      '100g Pecorino Romano, grated',
      '50g Parmesan cheese, grated',
      'Black pepper, freshly ground',
      'Salt for pasta water'
    ],
    materials: [
      'Large pot for pasta',
      'Large skillet or pan',
      'Mixing bowl',
      'Whisk',
      'Tongs or pasta fork',
      'Grater',
      'Colander'
    ],
    instructions: [
      'Bring a large pot of salted water to boil. Cook spaghetti according to package directions until al dente.',
      'While pasta cooks, heat a large skillet over medium heat. Add diced pancetta and cook until crispy, about 5-7 minutes.',
      'In a mixing bowl, whisk together egg yolks, whole egg, both cheeses, and plenty of black pepper.',
      'Reserve 1 cup of pasta cooking water before draining. Drain the pasta.',
      'Remove skillet from heat. Add hot pasta to the pancetta and toss to combine.',
      'Quickly add the egg mixture to the pasta, tossing constantly. Add reserved pasta water gradually to create a creamy sauce.',
      'The heat from the pasta will cook the eggs gently. Keep tossing until creamy and glossy.',
      'Serve immediately with extra cheese and black pepper on top.'
    ]
  }
};

export function RecipeDetail() {
  const { id } = useParams();
  const recipe = recipeData[id || '1'] || recipeData['1'];

  const difficultyColor = {
    Easy: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    Medium: 'bg-amber-50 text-amber-600 border border-amber-100',
    Hard: 'bg-rose-50 text-rose-600 border border-rose-100'
  }[recipe.difficulty];

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
              {recipe.materials.map((material: string, index: number) => (
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