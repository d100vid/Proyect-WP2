import { X } from 'lucide-react';
import { useState } from 'react';

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecipe: (recipe: any) => void;
}

export function AddRecipeModal({ isOpen, onClose, onAddRecipe }: AddRecipeModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    time: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    category: '',
    description: '',
    ingredients: '',
    materials: '',
    instructions: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecipe = {
      id: Date.now(),
      title: formData.title,
      image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      time: formData.time,
      difficulty: formData.difficulty,
      category: formData.category,
      timeInMinutes: parseInt(formData.time),
      description: formData.description,
      ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
      materials: formData.materials.split('\n').filter(m => m.trim()),
      instructions: formData.instructions.split('\n').filter(i => i.trim())
    };

    onAddRecipe(newRecipe);
    
    // Reset form
    setFormData({
      title: '',
      image: '',
      time: '',
      difficulty: 'Easy',
      category: '',
      description: '',
      ingredients: '',
      materials: '',
      instructions: ''
    });
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

          {/* Image URL */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg (optional)"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent"
            />
            <p className="text-slate-500 text-sm mt-1">Leave empty for a default image</p>
          </div>

          {/* Time, Difficulty, Category in a row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div>
              <label className="block text-slate-700 font-medium mb-2">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g., Dessert"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="A brief description of your recipe..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent resize-none"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Ingredients (one per line)
            </label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows={5}
              placeholder="2 cups flour&#10;1 cup sugar&#10;3 eggs"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent resize-none font-mono text-sm"
            />
          </div>

          {/* Materials */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Materials & Equipment (one per line)
            </label>
            <textarea
              name="materials"
              value={formData.materials}
              onChange={handleChange}
              rows={4}
              placeholder="Mixing bowl&#10;Whisk&#10;Baking sheet"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent resize-none font-mono text-sm"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Instructions (one step per line)
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
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
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl hover:from-violet-600 hover:to-indigo-600 transition-colors shadow-lg shadow-violet-500/30"
            >
              Add Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
