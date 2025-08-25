import { useState, useMemo } from "react";
import { useGetPortfoliosQuery, useCreatePortfolioMutation, useDeletePortfolioMutation, useUpdatePortfolioMutation } from "../../store/services/portfolioApi.jsx";
import { useGetCategoriesQuery } from "../../store/services/categoryApi.jsx";
import toast from "react-hot-toast";

const initialPortfolios = [
  {
    id: 1,
    title: "Golden Hour Wedding",
    description: "Romantic outdoor ceremony with warm golden light.",
    category: "Weddings",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Studio Portrait",
    description: "Clean, minimal portrait lighting setup.",
    category: "Portraits",
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Product Flat Lay",
    description: "E-commerce ready product shot with soft shadows.",
    category: "Product",
    imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
];

const fallbackCategories = ["Weddings", "Portraits", "Events", "Fashion", "Lifestyle", "Product"];

export default function PortfolioPage() {
  const { data: items = [], isFetching } = useGetPortfoliosQuery();
  const [createPortfolio, { isLoading: isCreating }] = useCreatePortfolioMutation();
  const [updatePortfolio, { isLoading: isUpdating }] = useUpdatePortfolioMutation();
  const [deletePortfolio, { isLoading: isDeleting }] = useDeletePortfolioMutation();
  const { data: categoriesData = [] } = useGetCategoriesQuery();
  const categories = categoriesData.length ? categoriesData : [];
  const categoryNameList = categories.length ? categories.map((c) => c.name) : fallbackCategories;
  const categoryIdByName = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => map.set(c.name, c._id));
    return map;
  }, [categories]);

  const [formData, setFormData] = useState({ title: "", description: "", category: "", image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [editing, setEditing] = useState(null); 
  const [showPanel, setShowPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const matchesQuery = [p.title, p.description, p.categoryLabel || p.category]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCat = filterCategory === "All" || (p.categoryLabel || p.category) === filterCategory;
      return matchesQuery && matchesCat;
    });
  }, [items, query, filterCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", category: "", image: null });
    setImagePreview(null);
    setEditing(null);
    setShowPanel(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    const categoryId = formData.category || categoryIdByName.get(categoryNameList[0]) || '';

    if (!editing) {
      try {
        await createPortfolio({
          title: formData.title,
          description: formData.description,
          category: categoryId,
          image: formData.image,
        }).unwrap();
        resetForm();
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        await updatePortfolio({
          id: editing._id,
          title: formData.title,
          description: formData.description,
          category: categoryId,
          image: formData.image,
        }).unwrap();
        resetForm();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const onEdit = (item) => {
    setEditing(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      category: item.category?._id || "",
      image: null,
    });
    setImagePreview(item.imageUrl);
    setShowPanel(true);
  };

  const actuallyDelete = async (id) => {
    try {
      await deletePortfolio(id).unwrap();
      if (editing?._id === id) resetForm();
      toast.success("Portfolio deleted");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to delete portfolio");
    }
  };

  const onDelete = (id) => {
    const toastId = toast.custom((t) => (
      <div className={`max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-red-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Delete this portfolio?</p>
            <p className="text-xs text-gray-600 mt-0.5">This action cannot be undone.</p>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button onClick={() => { toast.dismiss(toastId); }} className="cursor-pointer px-3 py-1.5 text-xs rounded-md border bg-white hover:bg-gray-50">Cancel</button>
              <button onClick={() => { toast.dismiss(toastId); actuallyDelete(id); }} className="cursor-pointer px-3 py-1.5 text-xs rounded-md bg-red-600 text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      </div>
    ), { duration: 8000 });
  };

  return (
    <div className="space-y-6">
      {/* Hero / Toolbar */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_10%,#6366f1,transparent_35%),radial-gradient(circle_at_80%_0%,#8b5cf6,transparent_35%)]" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Portfolio Manager</h1>
              <p className="text-white/70 mt-1">Curate stunning visuals and organize your work — locally, no API.</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-3 py-2 border border-white/10 w-full sm:w-auto">
                <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="M21 21l-4.3-4.3" strokeWidth="2"/></svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search portfolio..."
                  className="bg-transparent placeholder-white/50 text-white focus:outline-none text-sm w-40 sm:w-56"
                />
              </div>
              <div className="relative w-full sm:w-auto">
                {/* leading icon */}
                <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-white/70">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 7h16M6 12h12M8 17h8" strokeWidth="2"/></svg>
                </span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="appearance-none text-sm bg-white/10 text-white/90 rounded-full pl-8 pr-9 py-2 border border-white/20 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-white/50 w-full shadow-[inset_0_0_0_9999px_rgba(255,255,255,0.02)] backdrop-blur-md"
                >
                  <option className="text-gray-900">All</option>
                  {categoryNameList.map((c) => (
                    <option key={c} value={c} className="text-gray-900">{c}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/80">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" strokeWidth="2"/></svg>
                </span>
              </div>
              <button
                onClick={() => { setShowPanel(true); setEditing(null); setFormData({ title: "", description: "", category: categoryIdByName.get(categoryNameList[0]) || "", image: null }); setImagePreview(null); }}
                className="cursor-pointer inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 rounded-full px-4 py-2 text-sm font-medium shadow-md w-full sm:w-auto"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14" strokeWidth="2"/></svg>
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid - equal size cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {isFetching ? (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl border">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl border">No items match your search or filters.</div>
        ) : (
          pageItems.map((item) => (
            <article key={item._id} className="flex flex-col rounded-xl border bg-white overflow-hidden shadow-sm h-full">
              <div className="relative h-40 md:h-48">
                <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs rounded-full bg-white/95 text-gray-900 border border-white shadow-sm">{item.categoryLabel || item.category?.name || item.category}</span>
                </div>
              </div>
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap mt-1">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-auto pt-3 flex items-center gap-2 sm:justify-end">
                  <button onClick={() => onEdit(item)} className="cursor-pointer px-3 py-2 text-xs rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 w-full sm:w-auto">
                    Edit
                  </button>
                  <button onClick={() => onDelete(item._id)} className="cursor-pointer px-3 py-2 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100 w-full sm:w-auto" disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Pagination */}
      {filtered.length > pageSize && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <div className="text-sm text-gray-600">Page {currentPage} of {totalPages}</div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              className="cursor-pointer px-3 py-1.5 text-sm rounded-md border bg-white hover:bg-gray-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`cursor-pointer w-8 h-8 rounded-md text-sm border ${currentPage === i + 1 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-gray-50'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="cursor-pointer px-3 py-1.5 text-sm rounded-md border bg-white hover:bg-gray-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Slide-over Form Panel */}
      <div className={`fixed inset-0 z-50 ${showPanel ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${showPanel ? "opacity-100" : "opacity-0"}`}
          onClick={() => setShowPanel(false)}
        />
        {/* Panel */}
        <div className={`absolute top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-2xl border-l transform transition-transform ${showPanel ? "translate-x-0" : "translate-x-full"}`}>
          <div className="h-full flex flex-col">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{editing ? "Edit Portfolio Item" : "New Portfolio Item"}</h2>
                <p className="text-xs text-gray-500">Fill the details and add your visual.</p>
              </div>
              <button onClick={resetForm} className="p-2 rounded hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2"/></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Sunset at the Beach"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Short description of the project"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {categories.length
                    ? categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))
                    : categoryNameList.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <div className="flex items-start gap-3">
                  <div className="w-28 h-28 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-xs">No image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block">
                      <span className="sr-only">Choose file</span>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG up to ~5MB.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                {editing && (
                  <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
                )}
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow disabled:opacity-50"
                >
                  {isCreating || isUpdating ? 'Saving...' : editing ? "Save Changes" : "Add Portfolio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
