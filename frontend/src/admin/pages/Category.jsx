import { useState } from "react";
import EditCategoryModal from "../components/categories/EditCategoryModal";

// Mock data for categories - replace with API call
const initialCategories = [
  {
    id: 1,
    name: "Wedding Photography",
    description: "Capturing beautiful moments from the special day.",
    itemCount: 15,
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&q=60",
  },
  {
    id: 2,
    name: "Portrait Photography",
    description: "Professional headshots and personal portraits.",
    itemCount: 22,
    imageUrl: "https://images.unsplash.com/photo-1588516103997-07741f46546b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&q=60",
  },
  {
    id: 3,
    name: "Product Photography",
    description: "High-quality images for e-commerce and marketing.",
    itemCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1612151855475-877969f4a6cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&q=60",
  },
];

export default function CategoryPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Category:", formData);
    // Logic to add the new category to the list
    const newCategory = {
      id: categories.length + 1,
      name: formData.name,
      description: formData.description,
      itemCount: 0,
      imageUrl: `https://source.unsplash.com/80x80/?${formData.name}`
    };
    setCategories([newCategory, ...categories]);
    setFormData({ name: "", description: "", image: null }); // Reset form
  };

  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSaveCategory = (id, updatedData) => {
    setCategories(categories.map(cat => cat.id === id ? { ...cat, ...updatedData, imageUrl: updatedData.image ? URL.createObjectURL(updatedData.image) : cat.imageUrl } : cat));
    console.log("Saving category:", id, updatedData);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
        <p className="text-gray-600 mt-1">Create, view, and organize your portfolio categories.</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Category Form (Left Column) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Wedding Photography"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="A short description of the category"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>

        {/* Categories List (Right Column) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Existing Categories</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {categories.map(category => (
                <div key={category.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <img src={category.imageUrl} alt={category.name} className="w-16 h-16 rounded-md object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-800 font-medium">{category.itemCount} items</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => handleOpenModal(category)} className="text-xs text-blue-600 hover:underline">Edit</button>
                      <button className="text-xs text-red-600 hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <EditCategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
}