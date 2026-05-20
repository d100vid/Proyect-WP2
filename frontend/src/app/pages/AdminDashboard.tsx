import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { CheckCircle, XCircle, LogOut, Trash2 } from 'lucide-react';
import { ApiService } from '../../services/api';

interface Recipe {
  id: number;
  title: string;
  image: string;
  time: string;
  difficulty: string;
  ingredients: string;
  instructions: string;
  userId: number;
  validated: boolean;
  createdAt: string;
}

export function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [pendingRecipes, setPendingRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'Admin') {
        navigate('/home');
        return;
      }
      setUser(userData);
      loadRecipes(userData.id);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const loadRecipes = async (adminId: number) => {
    try {
      setLoading(true);
      // Get all recipes (pending and validated)
      const pending = await ApiService.getPendingRecipes(adminId);
      setPendingRecipes((pending as any) || []);
      
      // Get validated recipes
      const validated = await ApiService.getValidatedRecipes();
      
      // Combine all recipes
      const combined = [...(pending as any), ...(validated as any)];
      setAllRecipes(combined);
    } catch (err: any) {
      setError(err.message || 'Error loading recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (recipeId: number, approved: boolean) => {
    try {
      await ApiService.validateRecipe(recipeId, user.id, approved);
      // Reload recipes
      loadRecipes(user.id);
    } catch (err: any) {
      setError(err.message || 'Error validating recipe');
    }
  };

  const handleDelete = async (recipeId: number) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }
    try {
      await ApiService.deleteRecipe(recipeId, user.id);
      // Reload recipes
      loadRecipes(user.id);
    } catch (err: any) {
      setError(err.message || 'Error deleting recipe');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/home" className="text-slate-600 hover:text-violet-600">Back to Home</Link>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-700">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {/* Title */}
         <div className="mb-8">
           <h2 className="text-2xl font-bold text-slate-800 mb-2">
             Recipe Management
           </h2>
           <p className="text-slate-600">
             Review, approve, and manage all recipes
           </p>
         </div>

         {/* Notification banner if there are pending recipes */}
         {pendingRecipes.length > 0 && (
           <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
             <div className="text-sm text-yellow-800">
               You have <strong>{pendingRecipes.length}</strong> recipe(s) pending validation.
             </div>
             <div className="flex items-center gap-2">
               <a href="#pending" className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                 Go to pending
               </a>
             </div>
           </div>
         )}

         {/* Error Message */}
         {error && (
           <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200 mb-6">
             {error}
           </div>
         )}

         {/* Loading */}
         {loading && (
           <div className="text-center py-12">
             <p className="text-slate-600">Loading recipes...</p>
           </div>
         )}

         {/* No Recipes */}
         {!loading && allRecipes.length === 0 && (
           <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
             <p className="text-slate-600 text-lg">No recipes found</p>
             <p className="text-slate-400 mt-2">Recipes will appear here when users create them.</p>
           </div>
         )}

         {/* Recipes Grid */}
         <div id="pending" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {allRecipes.map((recipe) => (
             <div
               key={recipe.id}
               className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
             >
               {/* Image */}
               <div className="relative h-40 bg-slate-200 overflow-hidden">
                 {recipe.image ? (
                   <img
                     src={recipe.image}
                     alt={recipe.title}
                     className="w-full h-full object-cover"
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-400">
                     No image
                   </div>
                 )}
                 {/* Validation Status Badge */}
                 <div className="absolute top-2 right-2">
                   {recipe.validated ? (
                     <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                       Approved
                     </span>
                   ) : (
                     <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                       Pending
                     </span>
                   )}
                 </div>
               </div>

               {/* Content */}
               <div className="p-4">
                 <h3 className="font-bold text-slate-800 mb-2 line-clamp-2">
                   {recipe.title}
                 </h3>

                 {/* Meta Info */}
                 <div className="flex gap-4 text-sm text-slate-600 mb-3">
                   <span>Time: {recipe.time}</span>
                   <span>Difficulty: {recipe.difficulty}</span>
                 </div>

                 {/* Ingredients Preview */}
                 <div className="mb-3">
                   <p className="text-xs font-medium text-slate-600 mb-1">Ingredients:</p>
                   <p className="text-xs text-slate-500 line-clamp-2">
                     {recipe.ingredients || 'N/A'}
                   </p>
                 </div>

                 {/* Instructions Preview */}
                 <div className="mb-4">
                   <p className="text-xs font-medium text-slate-600 mb-1">Instructions:</p>
                   <p className="text-xs text-slate-500 line-clamp-2">
                     {recipe.instructions || 'N/A'}
                   </p>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex flex-col gap-2">
                   {!recipe.validated && (
                     <div className="flex gap-2">
                       <button
                         onClick={() => handleValidate(recipe.id, false)}
                         className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                       >
                         <XCircle className="w-4 h-4" />
                         <span className="text-xs">Reject</span>
                       </button>
                       <button
                         onClick={() => handleValidate(recipe.id, true)}
                         className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                       >
                         <CheckCircle className="w-4 h-4" />
                         <span className="text-xs">Approve</span>
                       </button>
                     </div>
                   )}
                   <button
                     onClick={() => handleDelete(recipe.id)}
                     className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                   >
                     <Trash2 className="w-4 h-4" />
                     <span className="text-xs">Delete</span>
                   </button>
                 </div>
               </div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}

