import { X, Upload } from 'lucide-react';
import { useState } from 'react';
import { ApiService } from '../../services/api';

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecipe: (recipe: any) => void;
  userId: number;
}

export function AddRecipeModal({ isOpen, onClose, onAddRecipe, userId }: AddRecipeModalProps) {
  const categories = ['Seafood', 'Pasta', 'Chicken', 'Vegetarian', 'Salads', 'Breakfast', 'Mexican', 'Beef', 'Italian', 'Thai'];
  
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    category: '',
    ingredients: '',
    instructions: '',
    isQuick: false,
    isHealthy: false,
    hasFewIngredients: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
       const form = new FormData();
       form.append('title', formData.title);
       form.append('time', formData.time);
       form.append('difficulty', formData.difficulty);
       form.append('category', formData.category);
       form.append('ingredients', formData.ingredients);
       form.append('instructions', formData.instructions);
       form.append('isQuick', String(formData.isQuick));
       form.append('isHealthy', String(formData.isHealthy));
       form.append('hasFewIngredients', String(formData.hasFewIngredients));
       form.append('userId', String(userId));
       if (imageFile) {
         form.append('image', imageFile);
       }

      const response = await ApiService.createRecipe(form);

      if (response.success && response.recipe) {
        const r = response.recipe;
        const newRecipe = {
          id: r.id,
          title: r.title,
          image: r.image || '',
          time: r.time || '',
          difficulty: (r.difficulty as any) || 'Easy',
          isQuick: !!r.isQuick,
          isHealthy: !!r.isHealthy,
          hasFewIngredients: !!r.hasFewIngredients,
          validated: !!r.validated,
        };

        onAddRecipe(newRecipe);

         // Reset form
         setFormData({
           title: '',
           time: '',
           difficulty: 'Easy',
           category: '',
           ingredients: '',
           instructions: '',
           isQuick: false,
           isHealthy: false,
           hasFewIngredients: false
         });
        setImageFile(null);
        setImagePreview(null);
        onClose();
      } else {
        setError(response.message || 'Error creating recipe');
      }
    } catch (err: any) {
      setError(err.message || 'Error creating recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-slate-800 text-2xl">Add New Recipe</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* Success Message */}
          <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm border border-blue-200">
            Your recipe will be visible after admin validation
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Recipe Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Chocolate Chip Cookies"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Upload Recipe Image *
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-violet-400 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer">
                {imagePreview ? (
                  <div className="space-y-2">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                    <p className="text-sm text-violet-600">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-slate-600">Click to upload image or drag and drop</p>
                    <p className="text-slate-400 text-sm">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

           {/* Time, Difficulty, Category */}
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-slate-700 font-medium mb-2">
                 Time (minutes) *
               </label>
               <input
                 type="number"
                 name="time"
                 value={formData.time}
                 onChange={handleChange}
                 required
                 min="1"
                 placeholder="30"
                 className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent"
               />
             </div>

             <div>
               <label className="block text-slate-700 font-medium mb-2">
                 Difficulty *
               </label>
               <select
                 name="difficulty"
                 value={formData.difficulty}
                 onChange={handleChange}
                 required
                 className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent"
               >
                 <option value="Easy">Easy</option>
                 <option value="Medium">Medium</option>
                 <option value="Hard">Hard</option>
               </select>
             </div>
           </div>

           {/* Category */}
           <div>
             <label className="block text-slate-700 font-medium mb-2">
               Category *
             </label>
             <select
               name="category"
               value={formData.category}
               onChange={handleChange}
               required
               className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent"
             >
               <option value="">Select a category</option>
               {categories.map(cat => (
                 <option key={cat} value={cat}>{cat}</option>
               ))}
             </select>
           </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="block text-slate-700 font-medium mb-2">Tags</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isQuick"
                  checked={formData.isQuick}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-slate-700">Quick Meal (&le;20 min)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isHealthy"
                  checked={formData.isHealthy}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-slate-700">Healthy</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="hasFewIngredients"
                  checked={formData.hasFewIngredients}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-slate-700">Few Ingredients</span>
              </label>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Ingredients (one per line) *
            </label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              required
              rows={5}
              placeholder="2 cups flour&#10;1 cup sugar&#10;3 eggs"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent resize-none font-mono text-sm"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Instructions (one step per line) *
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Preheat oven to 350°F&#10;Mix flour and sugar&#10;Add eggs and mix well"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent resize-none font-mono text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl hover:from-violet-600 hover:to-indigo-600 transition-colors shadow-lg shadow-violet-500/30 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Add Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
