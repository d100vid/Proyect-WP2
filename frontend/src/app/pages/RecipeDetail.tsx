import { useParams, Link } from 'react-router';
import { Clock, Users, ChefHat, ArrowLeft, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ApiService } from '../../services/api';

// Fallback mock data con instrucciones detalladas
const fallbackData: { [key: string]: any } = {
  '1': { title: 'Grilled Salmon with Lemon Butter', image: 'https://images.unsplash.com/photo-1768482303665-ed751d06af5f?q=80&w=1080', time: '25 min', difficulty: 'Medium', servings: 4, description: 'A delicious and healthy grilled salmon with a rich lemon butter sauce.', ingredients: ['4 salmon fillets', '4 tbsp butter', '2 lemons (juice/zest)', 'Salt & pepper'], instructions: ['Preheat grill to medium-high.', 'Season salmon with salt, pepper, and olive oil.', 'Whisk melted butter, lemon juice, and zest.', 'Grill salmon for 4-5 minutes per side.', 'Drizzle with sauce and serve immediately.'] },
  '2': { title: 'Classic Creamy Carbonara', image: 'https://images.unsplash.com/photo-1574885014162-92e4f12928db?q=80&w=1080', time: '20 min', difficulty: 'Easy', servings: 2, description: 'Authentic Roman-style carbonara.', ingredients: ['200g spaghetti', '100g guanciale', '2 large eggs', '50g pecorino romano'], instructions: ['Boil salted water and cook spaghetti.', 'Fry guanciale in a pan until crispy.', 'Whisk eggs and cheese in a bowl.', 'Drain pasta, toss in the pan with pork fat.', 'Remove from heat, quickly mix in egg mixture to create sauce.'] },
  '3': { title: 'Herb Grilled Chicken & Vegetables', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=1080', time: '35 min', difficulty: 'Medium', servings: 3, description: 'Perfectly charred chicken with fresh veggies.', ingredients: ['2 chicken breasts', '1 zucchini', '1 bell pepper', 'Italian herbs'], instructions: ['Cut vegetables into bite-sized pieces.', 'Marinate chicken with herbs and olive oil.', 'Grill chicken for 6 minutes per side.', 'Grill vegetables until tender.', 'Assemble on a plate and drizzle with balsamic glaze.'] },
  '4': { title: 'Asian Vegetable Stir Fry', image: 'https://images.unsplash.com/photo-1761314025701-34795be5f737?q=80&w=1080', time: '15 min', difficulty: 'Easy', servings: 2, description: 'Quick and crunchy stir fry.', ingredients: ['Broccoli', 'Carrot', 'Soy sauce', 'Ginger'], instructions: ['Heat oil in a wok over high heat.', 'Add sliced carrots and broccoli.', 'Stir-fry for 3-4 minutes.', 'Add soy sauce, ginger, and garlic.', 'Serve over steamed rice.'] },
  '5': { title: 'Fresh Garden Salad Bowl', image: 'https://images.unsplash.com/photo-1644172949364-3fcfd25604b8?q=80&w=1080', time: '10 min', difficulty: 'Easy', servings: 1, description: 'Refreshing salad for any season.', ingredients: ['Lettuce', 'Cherry tomatoes', 'Cucumber', 'Vinaigrette'], instructions: ['Wash and chop all vegetables.', 'Place greens in a large bowl.', 'Add tomatoes and cucumber slices.', 'Drizzle with your favorite vinaigrette.', 'Toss well and serve chilled.'] },
  '6': { title: 'Avocado Toast with Poached Egg', image: 'https://images.unsplash.com/photo-1676471970358-1cff04452e7b?q=80&w=1080', time: '8 min', difficulty: 'Easy', servings: 1, description: 'The ultimate breakfast choice.', ingredients: ['1 slice bread', '1/2 avocado', '1 egg', 'Chili flakes'], instructions: ['Toast the bread until golden.', 'Mash avocado with a pinch of salt.', 'Poach the egg for 3 minutes.', 'Spread avocado on toast.', 'Top with poached egg and chili flakes.'] },
  '7': { title: 'Mexican Street Tacos', image: 'https://images.unsplash.com/photo-1707604341704-74abdc25e52a?q=80&w=1080', time: '12 min', difficulty: 'Easy', servings: 4, description: 'Authentic street-style experience.', ingredients: ['Tortillas', 'Ground beef', 'Onion', 'Cilantro'], instructions: ['Cook beef in a skillet until browned.', 'Warm tortillas on a flat pan.', 'Spoon meat into tortillas.', 'Top with diced onion and chopped cilantro.', 'Serve with lime wedges.'] },
  '8': { title: 'Berry Bliss Smoothie Bowl', image: 'https://images.unsplash.com/photo-1645839449196-62bde406052e?q=80&w=1080', time: '5 min', difficulty: 'Easy', servings: 1, description: 'Packed with antioxidants.', ingredients: ['Frozen berries', 'Yogurt', 'Honey', 'Granola'], instructions: ['Blend berries and yogurt until smooth.', 'Pour into a bowl.', 'Top with crunchy granola.', 'Drizzle with honey.', 'Serve immediately.'] },
  '9': { title: 'Beef Tenderloin Steak', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400', time: '45 min', difficulty: 'Hard', servings: 2, description: 'Premium quality tenderloin.', ingredients: ['2 steaks', 'Butter', 'Garlic', 'Rosemary'], instructions: ['Bring steaks to room temperature.', 'Sear in a hot pan for 3 minutes per side.', 'Add butter, garlic, and rosemary to pan.', 'Baste the steak with melted butter.', 'Rest for 5 minutes before slicing.'] },
  '10': { title: 'Margherita Pizza', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400', time: '30 min', difficulty: 'Medium', servings: 3, description: 'Italian classic.', ingredients: ['Dough', 'Tomato sauce', 'Mozzarella', 'Basil'], instructions: ['Preheat oven to 220C.', 'Roll out the dough on a baking sheet.', 'Spread tomato sauce and add mozzarella.', 'Bake for 10-12 minutes.', 'Garnish with fresh basil leaves.'] },
  '11': { title: 'Thai Green Curry', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', time: '40 min', difficulty: 'Medium', servings: 3, description: 'Spicy and fragrant.', ingredients: ['Curry paste', 'Coconut milk', 'Chicken', 'Bamboo shoots'], instructions: ['Sauté curry paste in a pan.', 'Add coconut milk and bring to simmer.', 'Add chicken pieces and cook through.', 'Stir in bamboo shoots.', 'Serve over jasmine rice.'] },
  '12': { title: 'Caesar Salad', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', time: '10 min', difficulty: 'Easy', servings: 2, description: 'Classic caesar salad.', ingredients: ['Lettuce', 'Croutons', 'Parmesan', 'Dressing'], instructions: ['Wash and dry lettuce thoroughly.', 'Tear into bite-sized pieces.', 'Add dressing and parmesan cheese.', 'Toss with croutons just before serving.', 'Ensure even coating of dressing.'] }
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
            const ingredients = typeof data.ingredients === 'string' ? data.ingredients.split(/\r?\n/).filter(Boolean) : (data.ingredients || []);
            const instructions = typeof data.instructions === 'string' ? data.instructions.split(/\r?\n/).filter(Boolean) : (data.instructions || []);
            setRecipe({
              ...data,
              title: data.title || 'Recipe',
              image: data.image || '',
              time: data.time || '',
              difficulty: data.difficulty || 'Easy',
              servings: data.servings || 1,
              description: data.description || data.title || '',
              ingredients,
              materials: data.materials || [],
              instructions,
            });
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Error fetching recipe by id', e);
      }

      if (id && fallbackData[id]) {
        setRecipe(fallbackData[id]);
      } else {
        setRecipe(fallbackData['1']);
      }
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
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link to="/home" className="inline-flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors mb-4"><ArrowLeft className="w-5 h-5" /> Back to recipes</Link>
            <h1 className="text-center bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Recipe Haven</h1>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
            <div className="aspect-[21/9] overflow-hidden"><img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover"/></div>
            <div className="p-8">
              <div className="flex items-start justify-between mb-4"><h2 className="text-slate-800 text-3xl flex-1">{recipe.title}</h2><button className="p-3 rounded-full hover:bg-rose-50 transition-colors"><Heart className="w-6 h-6 text-slate-400 hover:text-rose-500"/></button></div>
              <p className="text-slate-600 mb-6">{recipe.description}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-xl"><Clock className="w-5 h-5 text-violet-600"/> <span>{recipe.time}</span></div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl"><Users className="w-5 h-5 text-blue-600"/> <span>{recipe.servings} servings</span></div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${difficultyColor}`}><ChefHat className="w-5 h-5"/> <span>{recipe.difficulty}</span></div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
              <h3 className="text-slate-800 mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400"></span> Ingredients</h3>
              <ul className="space-y-3">{(recipe.ingredients || []).map((i: string, index: number) => <li key={index} className="flex items-start gap-3 text-slate-600"><span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0"></span><span>{i}</span></li>)}</ul>
            </div>
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
              <h3 className="text-slate-800 mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-teal-400"></span> Materials</h3>
              <ul className="space-y-3">{(recipe.materials || []).map((m: string, index: number) => <li key={index} className="flex items-start gap-3 text-slate-600"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span><span>{m}</span></li>)}</ul>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
            <h3 className="text-slate-800 mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"></span> Instructions</h3>
            <ol className="space-y-6">{(recipe.instructions || []).map((ins: string, index: number) => <li key={index} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 text-white flex items-center justify-center text-sm font-medium">{index + 1}</span><p className="text-slate-600 pt-1">{ins}</p></li>)}</ol>
          </div>
        </div>
      </div>
  );
}