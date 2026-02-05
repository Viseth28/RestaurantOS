import React, { useState } from 'react';
import { MenuItem, Category, TelegramConfig } from '../types';
import { Plus, Trash2, Save, X, Edit2, Coffee, Settings, Upload, Link, Check, LogOut, Store, Bell, AlertCircle } from 'lucide-react';

interface AdminViewProps {
  restaurantName: string;
  onUpdateRestaurantName: (name: string) => void;
  telegramConfig: TelegramConfig;
  onUpdateTelegramConfig: (config: TelegramConfig) => void;
  menuItems: MenuItem[];
  categories: Category[];
  onUpdateMenu: (items: MenuItem[]) => void;
  onUpdateCategories: (cats: Category[]) => void;
  onClose: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  restaurantName,
  onUpdateRestaurantName,
  telegramConfig,
  onUpdateTelegramConfig,
  menuItems,
  categories,
  onUpdateMenu,
  onUpdateCategories,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'settings'>('menu');
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  
  // Editor States
  const [useImageUrl, setUseImageUrl] = useState(true);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imageError, setImageError] = useState<string>('');
  
  // Settings State
  const [tempName, setTempName] = useState(restaurantName);
  const [tempTelegram, setTempTelegram] = useState<TelegramConfig>(telegramConfig);

  // --- Menu Handlers ---
  const handleSaveItem = () => {
    if (!editingItem || !editingItem.name || !editingItem.price) return;

    const newItem = {
      ...editingItem,
      id: editingItem.id || Date.now().toString(),
      ingredients: typeof editingItem.ingredients === 'string' 
        ? (editingItem.ingredients as string).split(',').map(s => s.trim()) 
        : editingItem.ingredients || []
    } as MenuItem;

    if (editingItem.id) {
      onUpdateMenu(menuItems.map(i => i.id === newItem.id ? newItem : i));
    } else {
      onUpdateMenu([...menuItems, newItem]);
    }
    setEditingItem(null);
    setIsCreatingCategory(false);
    setNewCategoryName('');
    setImageError('');
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      onUpdateMenu(menuItems.filter(i => i.id !== id));
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError('');
    if (file) {
      if (file.size > 500 * 1024) {
          setImageError('Image is too large. Please use an image under 500KB or use an Image URL.');
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Category Handlers (Inline) ---
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    const newId = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    const newCategory: Category = {
        id: newId,
        name: newCategoryName,
        icon: 'Utensils'
    };
    onUpdateCategories([...categories, newCategory]);
    setEditingItem(prev => ({...prev, categoryId: newId}));
    setIsCreatingCategory(false);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (!categoryId) return;
    const isUsed = menuItems.some(i => i.categoryId === categoryId);
    if (isUsed) {
        alert("Cannot delete this category because it has items assigned to it. Please reassign items first.");
        return;
    }
    if (confirm(`Delete category '${categories.find(c => c.id === categoryId)?.name}'?`)) {
        onUpdateCategories(categories.filter(c => c.id !== categoryId));
        if (editingItem?.categoryId === categoryId) {
            setEditingItem(prev => ({...prev, categoryId: ''}));
        }
    }
  };

  return (
    <div className="h-screen bg-stone-50 flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar / Tabs */}
        <div className="w-16 md:w-72 bg-white border-r border-gray-100 flex flex-col flex-shrink-0 z-20 shadow-sm">
           
           <div className="p-6 flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
                <Settings size={20} />
              </div>
              <span className="hidden md:block font-bold text-xl tracking-tight text-slate-900">Admin</span>
           </div>

           <div className="flex-1 space-y-1 px-3">
            <button 
              onClick={() => setActiveTab('menu')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'menu' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-stone-50'}`}
            >
              <Coffee size={20} />
              <span className="hidden md:block font-medium">Menu Management</span>
            </button>
            <button 
               onClick={() => { 
                   setActiveTab('settings'); 
                   setTempName(restaurantName);
                   setTempTelegram(telegramConfig);
               }}
               className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'settings' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-stone-50'}`}
            >
              <Store size={20} />
              <span className="hidden md:block font-medium">Store Settings</span>
            </button>
           </div>

           <div className="p-4 border-t border-gray-100">
              <button onClick={onClose} className="w-full p-3 rounded-xl flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors font-medium">
                <LogOut size={20} />
                <span className="hidden md:block">Logout</span>
              </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-stone-50 relative">
          
          {/* --- MENU TAB --- */}
          {activeTab === 'menu' && (
            <div className="h-full overflow-y-auto p-4 md:p-10">
              <div className="max-w-5xl mx-auto pb-20">
                <div className="flex justify-between items-center mb-8">
                  <div>
                      <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Menu Items</h3>
                      <p className="text-slate-500">Manage your dishes, prices, and availability.</p>
                  </div>
                  <button 
                    onClick={() => {
                        setEditingItem({ categoryId: categories[0]?.id || 'mains', ingredients: [] });
                        setUseImageUrl(true);
                        setImageError('');
                    }}
                    className="bg-brand-500 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-brand-600 shadow-lg shadow-brand-500/20 font-bold transition-transform active:scale-95"
                  >
                    <Plus size={20} /> Add New Item
                  </button>
                </div>

                {/* Edit Modal / Form Overlay */}
                {editingItem && (
                  <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h3 className="font-bold text-xl text-slate-900">{editingItem.id ? 'Edit Item' : 'New Menu Item'}</h3>
                        <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-gray-100 rounded-full text-slate-500"><X size={24} /></button>
                      </div>
                      
                      <div className="p-8 space-y-6 overflow-y-auto">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Item Name</label>
                          <input 
                            type="text" 
                            value={editingItem.name || ''} 
                            onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                            className="w-full bg-stone-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all"
                            placeholder="e.g. Truffle Wagyu Burger"
                          />
                        </div>
                        
                        {/* Price and Category */}
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Price ($)</label>
                            <input 
                              type="number" 
                              value={editingItem.price || ''} 
                              onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                              className="w-full bg-stone-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all"
                              placeholder="0.00"
                            />
                          </div>
                          
                          {/* Custom Category Logic */}
                          <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                             {isCreatingCategory ? (
                                 <div className="flex gap-2">
                                     <input 
                                       type="text"
                                       value={newCategoryName}
                                       onChange={(e) => setNewCategoryName(e.target.value)}
                                       placeholder="New Category Name"
                                       className="w-full bg-stone-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                       autoFocus
                                     />
                                     <button 
                                      onClick={handleCreateCategory}
                                      className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 flex-shrink-0 shadow-md"
                                      title="Save Category"
                                     >
                                         <Check size={18} />
                                     </button>
                                     <button 
                                      onClick={() => { setIsCreatingCategory(false); setNewCategoryName(''); }}
                                      className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 flex-shrink-0"
                                      title="Cancel"
                                     >
                                         <X size={18} />
                                     </button>
                                 </div>
                             ) : (
                                 <div className="flex gap-2">
                                      <div className="relative flex-1">
                                          <select 
                                              value={editingItem.categoryId || ''}
                                              onChange={e => setEditingItem({...editingItem, categoryId: e.target.value})}
                                              className="w-full appearance-none bg-stone-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none text-slate-700 pr-8"
                                          >
                                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                          </select>
                                          <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">
                                              <Settings size={14} />
                                          </div>
                                      </div>
                                      <button 
                                          onClick={() => setIsCreatingCategory(true)}
                                          className="p-3 bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-100 border border-brand-100"
                                          title="Create New Category"
                                      >
                                          <Plus size={18} />
                                      </button>
                                      <button 
                                          onClick={() => handleDeleteCategory(editingItem.categoryId as string)}
                                          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 border border-red-100"
                                          title="Delete Selected Category"
                                          disabled={!editingItem.categoryId}
                                      >
                                          <Trash2 size={18} />
                                      </button>
                                 </div>
                             )}
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                          <textarea 
                            value={editingItem.description || ''} 
                            onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                            className="w-full bg-stone-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none h-24 resize-none transition-all"
                            placeholder="Brief description of the dish..."
                          />
                        </div>

                        {/* Image Handler */}
                        <div className="p-5 bg-stone-50 rounded-2xl border border-gray-200">
                          <div className="flex justify-between items-center mb-4">
                              <label className="block text-sm font-bold text-slate-700">Item Image</label>
                              <label className="flex items-center gap-2 text-xs font-bold text-brand-600 cursor-pointer hover:underline">
                                  <input 
                                      type="checkbox" 
                                      checked={useImageUrl} 
                                      onChange={(e) => {
                                          setUseImageUrl(e.target.checked);
                                          setImageError('');
                                      }}
                                      className="accent-brand-500"
                                  />
                                  Use Image URL
                              </label>
                          </div>

                          {imageError && (
                              <div className="mb-3 bg-red-50 text-red-600 text-xs font-bold p-3 rounded-lg flex items-center gap-2">
                                  <AlertCircle size={14} /> {imageError}
                              </div>
                          )}
                          
                          {useImageUrl ? (
                               <div className="flex items-center gap-2">
                                  <div className="bg-white p-2 rounded-lg border border-gray-200"><Link size={18} className="text-gray-400" /></div>
                                  <input 
                                      type="text" 
                                      value={editingItem.image || ''} 
                                      onChange={e => setEditingItem({...editingItem, image: e.target.value})}
                                      placeholder="https://example.com/image.jpg"
                                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                  />
                               </div>
                          ) : (
                              <div className="flex items-center gap-2">
                                  <label className="flex-1 cursor-pointer">
                                      <div className="w-full bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 hover:border-brand-300 transition-all group">
                                          <div className="bg-brand-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-brand-500 group-hover:scale-110 transition-transform">
                                              <Upload size={20} />
                                          </div>
                                          <span className="text-xs font-bold text-gray-500">Click to upload image (Max 500KB)</span>
                                          <input 
                                              type="file" 
                                              accept="image/*" 
                                              onChange={handleImageFileChange}
                                              className="hidden"
                                          />
                                      </div>
                                  </label>
                              </div>
                          )}
                          
                          {editingItem.image && !imageError && (
                              <div className="mt-4 relative h-40 w-full rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm">
                                  <img src={editingItem.image} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Ingredients <span className="font-normal text-gray-400">(comma separated)</span></label>
                          <input 
                            type="text" 
                            value={Array.isArray(editingItem.ingredients) ? editingItem.ingredients.join(', ') : editingItem.ingredients} 
                            onChange={e => setEditingItem({...editingItem, ingredients: e.target.value.split(',')})}
                            className="w-full bg-stone-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                            placeholder="e.g. Flour, Sugar, Eggs"
                          />
                        </div>
                        <div className="flex gap-6 pt-2">
                           <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
                             <div className="relative flex items-center">
                               <input 
                                type="checkbox" 
                                checked={editingItem.popular || false}
                                onChange={e => setEditingItem({...editingItem, popular: e.target.checked})}
                                className="w-5 h-5 accent-brand-500 rounded cursor-pointer"
                               />
                             </div>
                             Popular Item
                           </label>
                           <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
                             <input 
                              type="checkbox" 
                              checked={editingItem.spicy || false}
                              onChange={e => setEditingItem({...editingItem, spicy: e.target.checked})}
                              className="w-5 h-5 accent-red-500 rounded cursor-pointer"
                             />
                             Spicy
                           </label>
                           <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
                             <input 
                              type="checkbox" 
                              checked={editingItem.vegan || false}
                              onChange={e => setEditingItem({...editingItem, vegan: e.target.checked})}
                              className="w-5 h-5 accent-green-500 rounded cursor-pointer"
                             />
                             Vegan
                           </label>
                        </div>
                      </div>
                      <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3">
                        <button onClick={() => setEditingItem(null)} className="px-6 py-3 text-slate-600 hover:bg-stone-100 rounded-xl font-bold transition-colors">Cancel</button>
                        <button onClick={handleSaveItem} className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-black flex items-center gap-2 font-bold shadow-lg shadow-slate-900/20 transition-transform active:scale-95">
                          <Save size={18} /> Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid gap-4">
                  {menuItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-all group">
                      <div className="flex items-center gap-5">
                        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-stone-100 shadow-sm group-hover:scale-105 transition-transform duration-300" />
                        <div>
                          <h4 className="font-bold text-lg text-slate-800 mb-1">{item.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                            <span className="text-slate-900 font-bold">${item.price}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{categories.find(c => c.id === item.categoryId)?.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                              setEditingItem(item);
                              setUseImageUrl(true); 
                          }}
                          className="p-3 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- SETTINGS TAB --- */}
          {activeTab === 'settings' && (
             <div className="h-full overflow-y-auto p-4 md:p-10">
                <div className="max-w-2xl mx-auto pb-20">
                    <h3 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Store Settings</h3>
                    
                    <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 space-y-8">
                      {/* Branding */}
                      <div>
                        <h4 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                           <Store size={20} /> Branding
                        </h4>
                        <div className="space-y-4 pl-2">
                           <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Restaurant Name</label>
                              <div className="flex gap-3">
                                <input 
                                  type="text" 
                                  value={tempName}
                                  onChange={(e) => setTempName(e.target.value)}
                                  className="flex-1 bg-stone-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all"
                                />
                                <button 
                                  onClick={() => onUpdateRestaurantName(tempName)}
                                  disabled={tempName === restaurantName || !tempName.trim()}
                                  className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                  Save
                                </button>
                              </div>
                              <p className="text-xs text-slate-400 mt-2">This name will be displayed on the customer landing page and header.</p>
                           </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-8">
                        <h4 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                           <Bell size={20} /> Notifications (Telegram)
                        </h4>
                        <div className="space-y-4 pl-2">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Bot API Token</label>
                                <input 
                                  type="text" 
                                  value={tempTelegram.botToken}
                                  onChange={(e) => setTempTelegram({...tempTelegram, botToken: e.target.value})}
                                  placeholder="e.g. 123456789:ABC..."
                                  className="w-full bg-stone-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Chat / User ID</label>
                                <input 
                                  type="text" 
                                  value={tempTelegram.chatId}
                                  onChange={(e) => setTempTelegram({...tempTelegram, chatId: e.target.value})}
                                  placeholder="e.g. 12345678"
                                  className="w-full bg-stone-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all"
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <button 
                                  onClick={() => onUpdateTelegramConfig(tempTelegram)}
                                  className="bg-brand-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-600 transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20"
                                >
                                  <Save size={18} /> Update Notification Settings
                                </button>
                            </div>
                            <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-xs leading-relaxed border border-blue-100">
                                <strong>How to set up:</strong>
                                <ol className="list-decimal ml-4 mt-2 space-y-1">
                                    <li>Create a bot with <strong>@BotFather</strong> on Telegram to get your <em>Token</em>.</li>
                                    <li>Start a chat with your new bot.</li>
                                    <li>Send a message to <strong>@userinfobot</strong> to get your numerical <em>User ID</em>.</li>
                                    <li>Enter both values above to receive real-time order alerts.</li>
                                </ol>
                            </div>
                        </div>
                      </div>
                    </div>
                 </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};