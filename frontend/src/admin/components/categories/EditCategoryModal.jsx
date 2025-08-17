import { useState, useEffect } from 'react';

export default function EditCategoryModal({ isOpen, onClose, category, onSave }) {
  const [formData, setFormData] = useState({ name: '', description: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isOpen && category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: null, // Always reset the file input on open
      });
      setImagePreview(category.image); // Use existing image URL for preview
    } else {
        setImagePreview(null); // Clear preview when closing
    }
  }, [isOpen, category]);

  if (!isOpen || !category) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Edit Category</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {/* Image Column */}
            <div className="space-y-4 flex flex-col">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Category Preview" className="w-full h-full object-cover rounded-md" />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>
              </div>
              <div className="flex-grow flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">Change Image</label>
                <div className="mt-1 flex-grow flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="image" className="relative cursor-pointer bg-gray-50 rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input id="image" name="image" type="file" className="sr-only" onChange={handleChange} accept="image/*" />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">{formData.image?.name || "or drag and drop"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="12"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 px-6 py-4 bg-gray-100 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold text-sm shadow-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
