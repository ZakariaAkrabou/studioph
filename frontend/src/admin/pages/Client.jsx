import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useGetSpacesQuery, useCreateSpaceMutation, useUploadImagesMutation, useUpdateSpaceMutation, useDeleteSpaceMutation, useDeleteImageMutation, useReplaceImageMutation } from "../../store/services/clientSpaceApi.jsx";

export default function ClientSpacesPage() {
  const { data: spaces = [], isFetching } = useGetSpacesQuery();
  const [createSpace, { isLoading: isCreating }] = useCreateSpaceMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadImagesMutation();
  const [updateSpace, { isLoading: isUpdating }] = useUpdateSpaceMutation();
  const [deleteSpace, { isLoading: isDeleting }] = useDeleteSpaceMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [replaceImage] = useReplaceImageMutation();
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", key: "", cover: null, gallery: [] });
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [activeSpaceIdx, setActiveSpaceIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [tempPreview, setTempPreview] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", key: "", cover: null });
  const [editCoverPreview, setEditCoverPreview] = useState(null);
  const [showAddImages, setShowAddImages] = useState(false);
  const [addImagesForm, setAddImagesForm] = useState({ files: [] });
  const [addImagesPreviews, setAddImagesPreviews] = useState([]);
  const [currentSpaceForAdd, setCurrentSpaceForAdd] = useState(null);

  const filtered = useMemo(() => {
    return spaces.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
  }, [spaces, query]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cover" && files && files[0]) {
      const file = files[0];
      setForm((p) => ({ ...p, cover: file }));
      setCoverPreview(URL.createObjectURL(file));
    } else if (name === 'gallery' && files && files.length) {
      const list = Array.from(files);
      setForm((p) => ({ ...p, gallery: list }));
      setGalleryPreviews(list.map((f) => URL.createObjectURL(f)));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm({ name: "", key: "", cover: null, gallery: [] });
    setCoverPreview(null);
    setGalleryPreviews([]);
    setShowCreate(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.key.trim()) return;
    try {
      const created = await createSpace({ name: form.name, key: form.key }).unwrap();
      // Upload optimization: upload cover synchronously (for immediate visibility)
      if (form.cover) {
        try { await uploadImages({ id: created._id, files: [form.cover] }).unwrap(); } catch {}
      }
      // Upload remaining gallery files in background without blocking UI
      if (form.gallery?.length) {
        const remaining = form.gallery;
        toast("Uploading " + remaining.length + " image(s) in background...", { icon: '⬆️' });
        uploadImages({ id: created._id, files: remaining }).unwrap()
          .then(() => toast.success('Gallery uploaded'))
          .catch(() => toast.error('Some images failed to upload'));
      }
      resetForm();
      toast.success('Space created');
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || 'Failed to create space');
    }
  };

  const removeSpace = async (id) => {
    try {
      await deleteSpace(id).unwrap();
      toast.success('Space deleted');
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || 'Failed to delete');
    }
  };

  const confirmDelete = (id) => {
    const toastId = toast.custom((t) => (
      <div className={`max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-red-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Delete this space?</p>
            <p className="text-xs text-gray-600 mt-0.5">This action cannot be undone.</p>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button onClick={() => toast.dismiss(toastId)} className="cursor-pointer px-3 py-1.5 text-xs rounded-md border bg-white hover:bg-gray-50">Cancel</button>
              <button onClick={() => { toast.dismiss(toastId); removeSpace(id); toast.success('Space deleted'); }} className="cursor-pointer px-3 py-1.5 text-xs rounded-md bg-red-600 text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      </div>
    ), { duration: 8000 });
  };

  const openPreview = (idx) => {
    setActiveSpaceIdx(idx);
    setActiveImageIdx(0);
    setImageLoading(true);
    setShowPreview(true);
  };

  const prevSpace = () => {
    setActiveSpaceIdx((i) => {
      const next = (i - 1 + filtered.length) % filtered.length;
      return next;
    });
    setActiveImageIdx(0);
    setImageLoading(true);
    setTempPreview(null);
  };
  const nextSpace = () => {
    setActiveSpaceIdx((i) => {
      const next = (i + 1) % filtered.length;
      return next;
    });
    setActiveImageIdx(0);
    setImageLoading(true);
    setTempPreview(null);
  };
  const prevImage = () => {
    setActiveImageIdx((i) => {
      const len = filtered[activeSpaceIdx].images.length;
      const next = (i - 1 + len) % len;
      return next;
    });
    setImageLoading(true);
    setTempPreview(null);
  };
  const nextImage = () => {
    setActiveImageIdx((i) => {
      const len = filtered[activeSpaceIdx].images.length;
      const next = (i + 1) % len;
      return next;
    });
    setImageLoading(true);
    setTempPreview(null);
  };

  const openEdit = (space) => {
    setEditForm({ name: space.name, key: "", cover: null });
    setEditCoverPreview(space.cover || space.images?.[0] || null);
    setShowEdit(true);
  };

  const openAddImages = (space) => {
    setCurrentSpaceForAdd(space);
    setAddImagesForm({ files: [] });
    setAddImagesPreviews([]);
    setShowAddImages(true);
  };

  const handleAddImagesChange = (e) => {
    const { files } = e.target;
    if (files && files.length) {
      const list = Array.from(files);
      setAddImagesForm({ files: list });
      setAddImagesPreviews(list.map((f) => URL.createObjectURL(f)));
    }
  };

  const handleAddImages = async (e) => {
    e.preventDefault();
    if (!currentSpaceForAdd || addImagesForm.files.length === 0) return;
    
    try {
      await uploadImages({ id: currentSpaceForAdd._id, files: addImagesForm.files }).unwrap();
      toast.success(`${addImagesForm.files.length} image${addImagesForm.files.length > 1 ? 's' : ''} added successfully`);
      setShowAddImages(false);
      setAddImagesForm({ files: [] });
      setAddImagesPreviews([]);
      setCurrentSpaceForAdd(null);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add images');
    }
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cover' && files && files[0]) {
      const file = files[0];
      setEditForm((p) => ({ ...p, cover: file }));
      setEditCoverPreview(URL.createObjectURL(file));
    } else {
      setEditForm((p) => ({ ...p, [name]: value }));
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    const current = filtered[activeSpaceIdx];
    
    // Close modal immediately
    setShowEdit(false);
    setEditForm({ name: "", key: "", cover: null });
    setEditCoverPreview(null);
    
    try {
      await updateSpace({ id: current._id, name: editForm.name, key: editForm.key }).unwrap();
      if (editForm.cover) {
        // If there's an existing cover, replace it at index 0, otherwise upload as new image
        if (current.cover || (current.images && current.images.length > 0)) {
          await replaceImage({ id: current._id, index: 0, file: editForm.cover }).unwrap();
          toast.success('Cover image updated successfully');
        } else {
          await uploadImages({ id: current._id, files: [editForm.cover] }).unwrap();
          toast.success('Cover image added successfully');
        }
      } else {
        toast.success('Space updated successfully');
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || 'Failed to update space');
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_15%_10%,#6366f1,transparent_35%),radial-gradient(circle_at_85%_0%,#8b5cf6,transparent_35%)]" />
        <div className="relative p-4 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Client Spaces</h1>
              <p className="text-white/80 mt-1 text-sm sm:text-base">Share curated galleries with clients. Local demo with elegant UX.</p>
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-3 py-2 w-full sm:w-64">
                <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="M21 21l-4.3-4.3" strokeWidth="2"/></svg>
                <input aria-label="Search spaces" className="bg-transparent text-sm placeholder-white/60 text-white focus:outline-none w-full" placeholder="Search spaces..." value={query} onChange={(e)=>setQuery(e.target.value)} />
              </div>
              <button onClick={()=>{setShowCreate(true)}} className="cursor-pointer inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 rounded-full px-4 py-2 text-sm font-medium shadow-md w-full sm:w-auto">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14" strokeWidth="2"/></svg>
                New Space
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {isFetching ? (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl border">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl border">No spaces found.</div>
        ) : (
          filtered.map((s) => (
            <article key={s._id} className="flex flex-col rounded-xl border bg-white overflow-hidden shadow-sm h-full">
              <div className="relative h-40 md:h-48">
                <img src={s.cover || s.images?.[0]} alt={s.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/0 to-transparent">
                  <div className="flex items-end justify-between gap-3">
                    <span className="max-w-[70%] truncate text-white font-semibold leading-tight bg-black/45 backdrop-blur-sm px-2 py-1 rounded-md">
                      {s.name}
                    </span>
                    <span className="text-xs text-white bg-black/45 backdrop-blur-sm px-2 py-1 rounded-md whitespace-nowrap">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                  {(s.images?.slice(0,4) || []).map((img, i) => (
                    <div key={i} className="relative group w-20 h-14">
                      <img src={img} alt="thumb" className="w-20 h-14 object-cover rounded-md border" />
                      <div className="absolute right-1 top-1 hidden group-hover:flex flex-col gap-1">
                        <button
                          title="Replace image"
                          className="w-6 h-6 rounded-full bg-white text-gray-700 shadow flex items-center justify-center"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                await replaceImage({ id: s._id, index: i, file }).unwrap();
                                toast.success('Image replaced');
                              } catch (err) {
                                toast.error('Failed to replace image');
                              }
                            };
                            input.click();
                          }}
                        >
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9" strokeWidth="2"/><path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z" strokeWidth="2"/></svg>
                        </button>
                        <button
                          title="Delete image"
                          className="w-6 h-6 rounded-full bg-red-600 text-white shadow flex items-center justify-center"
                          onClick={async (ev) => {
                            ev.stopPropagation();
                            try {
                              await deleteImage({ id: s._id, index: i }).unwrap();
                              toast.success('Image removed');
                            } catch (err) {
                              toast.error('Failed to remove image');
                            }
                          }}
                        >
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18" strokeWidth="2"/><path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6" strokeWidth="2"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  {!!(s.images && s.images.length > 4) && (
                    <button
                      type="button"
                      onClick={() => { setActiveImageIdx(4); openPreview(filtered.findIndex(fs=>fs._id===s._id)); }}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-white border text-gray-700 shadow-sm hover:bg-gray-50"
                      title={`View ${s.images.length - 4} more`}
                    >
                      <span className="text-[11px] font-semibold">+{s.images.length - 4}</span>
                    </button>
                  )}
                </div>
                <div className="mt-auto pt-3 flex items-center gap-2 sm:justify-end">
                  <button onClick={()=>openPreview(filtered.findIndex(fs=>fs._id===s._id))} className="cursor-pointer w-full sm:w-auto px-3 py-2 text-xs rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800">Preview</button>
                  <button onClick={()=>openAddImages(s)} className="cursor-pointer w-full sm:w-auto px-3 py-2 text-xs rounded-md bg-green-50 text-green-600 hover:bg-green-100">Add Images</button>
                  <button onClick={()=>openEdit(s)} className="cursor-pointer w-full sm:w-auto px-3 py-2 text-xs rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800">Edit</button>
                  <button onClick={()=>confirmDelete(s._id)} className="cursor-pointer w-full sm:w-auto px-3 py-2 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Create Drawer */}
      <div className={`fixed inset-0 z-50 ${showCreate ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${showCreate ? 'opacity-100' : 'opacity-0'}`} onClick={()=>setShowCreate(false)} />
        <div className={`absolute top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-2xl border-l transform transition-transform ${showCreate ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Create Client Space</h2>
                <p className="text-xs text-gray-500">Add a name and an access key hint.</p>
              </div>
              <button onClick={resetForm} className="p-2 rounded hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2"/></svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Space Name</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g., Miller Wedding Gallery" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Hint</label>
                <input name="key" value={form.key} onChange={handleChange} required placeholder="e.g., WED-2025-MILL" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <div className="flex items-start gap-3">
                  <div className="w-28 h-28 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                    {coverPreview ? <img src={coverPreview} alt="preview" className="w-full h-full object-cover" /> : <span className="text-gray-400 text-xs">No image</span>}
                  </div>
                  <div className="flex-1">
                    <label className="block">
                      <span className="sr-only">Choose file</span>
                      <input type="file" name="cover" accept="image/*" onChange={handleChange} className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG up to ~5MB.</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                <div className="space-y-2">
                  <input type="file" name="gallery" accept="image/*" multiple onChange={handleChange} className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  {galleryPreviews.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                      {galleryPreviews.map((src, i) => (
                        <img key={i} src={src} alt="sel" className="w-16 h-12 object-cover rounded border" />
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">You can select multiple images at once.</p>
                </div>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isCreating} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow disabled:opacity-50">{isCreating ? 'Creating...' : 'Create Space'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/70" onClick={()=>setShowPreview(false)} />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-full sm:max-w-3xl md:max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
              {filtered[activeSpaceIdx] && (
                <div className="flex flex-col">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h3 className="font-semibold text-gray-900 truncate">{filtered[activeSpaceIdx].name}</h3>
                    <button onClick={()=>setShowPreview(false)} className="p-2 rounded hover:bg-gray-100" aria-label="Close">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2"/></svg>
                    </button>
                  </div>
                  <div className="relative bg-black">
                    <img
                      src={tempPreview || (filtered[activeSpaceIdx].images?.[activeImageIdx] || filtered[activeSpaceIdx].cover)}
                      alt="slide"
                      className={`w-full max-h-[60vh] sm:max-h-[70vh] object-contain transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                      onLoad={() => setImageLoading(false)}
                    />
                    {imageLoading && (
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="w-8 h-8 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {/* Per-image actions */}
                    <div className="absolute right-2 top-2 sm:right-3 sm:top-3 flex gap-2">
                      <button
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-600 text-white shadow flex items-center justify-center hover:bg-green-700"
                        title="Add new images"
                        onClick={() => {
                          const current = filtered[activeSpaceIdx];
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.multiple = true;
                          input.onchange = async (e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length === 0) return;
                            try {
                              await uploadImages({ id: current._id, files }).unwrap();
                              toast.success(`${files.length} image${files.length > 1 ? 's' : ''} added successfully`);
                            } catch {
                              toast.error('Failed to add images');
                            }
                          };
                          input.click();
                        }}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14" strokeWidth="2"/></svg>
                      </button>
                      <button
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-gray-800 shadow flex items-center justify-center hover:bg-gray-100"
                        title="Replace image"
                        onClick={() => {
                          const current = filtered[activeSpaceIdx];
                          const idx = activeImageIdx;
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              // show local preview immediately
                              const localUrl = URL.createObjectURL(file);
                              setTempPreview(localUrl);
                              setImageLoading(false);
                              await replaceImage({ id: current._id, index: idx, file }).unwrap();
                              toast.success('Image replaced');
                            } catch {
                              toast.error('Failed to replace image');
                            }
                            // remove temp preview shortly after mutation settles (RTK Query refetch will refresh images)
                            setTimeout(() => setTempPreview(null), 300);
                          };
                          input.click();
                        }}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9" strokeWidth="2"/><path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z" strokeWidth="2"/></svg>
                      </button>
                      <button
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-600 text-white shadow flex items-center justify-center hover:bg-red-700"
                        title="Delete image"
                        onClick={async () => {
                          const current = filtered[activeSpaceIdx];
                          const idx = activeImageIdx;
                          try {
                            await deleteImage({ id: current._id, index: idx }).unwrap();
                            // Adjust active index if needed
                            const remaining = (current.images?.length || 1) - 1;
                            if (idx >= remaining && remaining > 0) setActiveImageIdx(remaining - 1);
                            toast.success('Image removed');
                          } catch {
                            toast.error('Failed to remove image');
                          }
                        }}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18" strokeWidth="2"/><path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6" strokeWidth="2"/></svg>
                      </button>
                    </div>
                    <button onClick={prevImage} className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full p-1.5 sm:p-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 18l-6-6 6-6" strokeWidth="2"/></svg>
                    </button>
                    <button onClick={nextImage} className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full p-1.5 sm:p-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 6l6 6-6 6" strokeWidth="2"/></svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-t bg-gray-50 gap-2">
                    <button onClick={prevSpace} className="cursor-pointer px-2.5 sm:px-3 py-1.5 text-xs rounded-md border bg-white hover:bg-gray-50">Previous Space</button>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1 justify-center">
                      {filtered[activeSpaceIdx].images?.map((img, i) => (
                        <button key={i} onClick={()=>setActiveImageIdx(i)} className={`w-14 h-10 sm:w-16 sm:h-12 rounded border ${i===activeImageIdx ? 'ring-2 ring-indigo-500' : ''}`}>
                          <img src={img} alt="thumb" className="w-full h-full object-cover rounded" />
                        </button>
                      ))}
                    </div>
                    <button onClick={nextSpace} className="cursor-pointer px-2.5 sm:px-3 py-1.5 text-xs rounded-md border bg-white hover:bg-gray-50">Next Space</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Drawer */}
      <div className={`fixed inset-0 z-50 ${showEdit ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${showEdit ? 'opacity-100' : 'opacity-0'}`} onClick={()=>setShowEdit(false)} />
        <div className={`absolute top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-2xl border-l transform transition-transform ${showEdit ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Edit Client Space</h2>
                <p className="text-xs text-gray-500">Update name, key hint or cover image.</p>
              </div>
              <button onClick={()=>setShowEdit(false)} className="p-2 rounded hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2"/></svg>
              </button>
            </div>

            <form onSubmit={saveEdit} className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Space Name</label>
                <input name="name" value={editForm.name} onChange={handleEditChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Hint (optional)</label>
                <input name="key" value={editForm.key} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                <p className="mt-1 text-xs text-gray-500">Leave blank to keep current key.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <div className="flex items-start gap-3">
                  <div className="w-28 h-28 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                    {editCoverPreview ? <img src={editCoverPreview} alt="preview" className="w-full h-full object-cover" /> : <span className="text-gray-400 text-xs">No image</span>}
                  </div>
                  <div className="flex-1">
                    <label className="block">
                      <span className="sr-only">Choose file</span>
                      <input type="file" name="cover" accept="image/*" onChange={handleEditChange} className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG up to ~5MB.</p>
                  </div>
                </div>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <button type="button" onClick={()=>setShowEdit(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Add Images Modal */}
      <div className={`fixed inset-0 z-50 ${showAddImages ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${showAddImages ? 'opacity-100' : 'opacity-0'}`} onClick={()=>setShowAddImages(false)} />
        <div className={`absolute top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-2xl border-l transform transition-transform ${showAddImages ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Add Images</h2>
                <p className="text-xs text-gray-500">Add new images to {currentSpaceForAdd?.name}</p>
              </div>
              <button onClick={()=>setShowAddImages(false)} className="p-2 rounded hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2"/></svg>
              </button>
            </div>

            <form onSubmit={handleAddImages} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Images</label>
                <div className="space-y-2">
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleAddImagesChange} 
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
                  />
                  {addImagesPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {addImagesPreviews.map((src, i) => (
                        <div key={i} className="relative group">
                          <img src={src} alt={`preview-${i}`} className="w-full h-20 object-cover rounded border" />
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = addImagesForm.files.filter((_, idx) => idx !== i);
                              const newPreviews = addImagesPreviews.filter((_, idx) => idx !== i);
                              setAddImagesForm({ files: newFiles });
                              setAddImagesPreviews(newPreviews);
                            }}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2"/></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">You can select multiple images at once. JPG, PNG up to ~5MB each.</p>
                </div>
              </div>
              
              <div className="pt-2 flex items-center gap-2 mt-auto">
                <button type="button" onClick={()=>setShowAddImages(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isUploading || addImagesForm.files.length === 0} 
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow disabled:opacity-50"
                >
                  {isUploading ? 'Adding...' : `Add ${addImagesForm.files.length} Image${addImagesForm.files.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
