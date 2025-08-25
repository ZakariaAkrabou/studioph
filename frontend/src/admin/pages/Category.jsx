import { useState } from "react";
import EditCategoryModal from "../components/categories/EditCategoryModal";
import toast from "react-hot-toast";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../store/services/categoryApi.jsx";

export default function CategoryPage() {
  const [formData, setFormData] = useState({ name: "", description: "", image: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data: categories = [], isFetching } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image) {
      toast.error("Please select an image for the category");
      return;
    }

    try {
      await createCategory({ 
        name: formData.name, 
        description: formData.description, 
        image: formData.image 
      }).unwrap();
      
      toast.success("Category created successfully!");
      setFormData({ name: "", description: "", image: null });
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to create category");
    }
  };

  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSaveCategory = async (updated) => {
    if (!selectedCategory?._id) return;
    
    try {
      await updateCategory({ id: selectedCategory._id, ...updated }).unwrap();
      toast.success("Category updated successfully!");
      handleCloseModal();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to delete category");
    }
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
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
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  required
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Save Category"}
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
              {isFetching ? (
                <div className="p-6 text-center text-gray-500">Loading categories...</div>
              ) : categories.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No categories found. Create your first one!</div>
              ) : (
                categories.map(category => (
                  <div key={category._id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                    <img 
                      src={category.image || `https://source.unsplash.com/80x80/?${category.name}`} 
                      alt={category.name} 
                      className="w-16 h-16 rounded-md object-cover" 
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mt-1">
                        <button 
                          onClick={() => handleOpenModal(category)} 
                          className="cursor-pointer text-xs text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(category._id)} 
                          disabled={isDeleting}
                          className="cursor-pointer text-xs text-red-600 hover:underline disabled:opacity-50"
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
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