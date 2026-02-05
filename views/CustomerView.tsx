import React, { useState, useMemo } from 'react';
import { MenuItem, CartItem, Category } from '../types';
import { MenuCard } from '../components/MenuCard';
import { ShoppingBag, ChevronLeft, Minus, Plus, CheckCircle2, MapPin } from 'lucide-react';

interface CustomerViewProps {
  tableId: number;
  restaurantName: string;
  onPlaceOrder: (items: CartItem[], tableId: number) => void;
  menuItems: MenuItem[];
  categories: Category[];
}

export const CustomerView: React.FC<CustomerViewProps> = ({ 
  tableId, 
  restaurantName,
  onPlaceOrder, 
  menuItems,
  categories
}) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || 'mains');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Table selection state (defaulting to 1 if not set)
  const [selectedTable, setSelectedTable] = useState<number>(1);
  
  const filteredItems = useMemo(() => 
    menuItems.filter(item => item.categoryId === selectedCategory),
  [selectedCategory, menuItems]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, cartId: Date.now().toString() }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
        if (item.id === itemId) {
            return { ...item, quantity: Math.max(0, item.quantity + delta) };
        }
        return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Fire and forget with selected table
    onPlaceOrder(cart, selectedTable);
    
    // Clear local state
    setCart([]);
    setIsCartOpen(false);
    
    // Show success feedback
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // --- CART VIEW ---
  if (isCartOpen) {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="p-4 flex items-center gap-4 sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-50">
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                    <ChevronLeft size={24} className="text-slate-800" />
                </button>
                <h2 className="text-xl font-bold text-slate-900">Your Order</h2>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                    <div className="text-center py-32 text-slate-400">
                        <div className="bg-stone-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                           <ShoppingBag size={40} className="opacity-20 text-slate-900" />
                        </div>
                        <p className="font-medium text-lg text-slate-600">Your cart is empty.</p>
                        <p className="text-sm text-slate-400 mb-6">Looks like you haven't made your choice yet.</p>
                        <button onClick={() => setIsCartOpen(false)} className="text-brand-600 font-bold hover:underline">Browse Menu</button>
                    </div>
                ) : (
                    cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                                <div>
                                    <h4 className="font-bold text-slate-800">{item.name}</h4>
                                    <p className="text-brand-600 font-bold">${item.price}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2 bg-stone-100 rounded-xl p-1.5 mr-2">
                                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-lg shadow-sm transition-colors text-slate-700">
                                    <Plus size={14} />
                                </button>
                                <span className="font-bold text-sm">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-lg shadow-sm transition-colors text-slate-700">
                                    <Minus size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-6 border-t border-gray-50 bg-white pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] rounded-t-3xl">
                {/* Table Selector */}
                <div className="mb-6 bg-stone-50 p-4 rounded-2xl flex items-center justify-between border border-gray-100">
                    <div className="flex items-center gap-3 text-slate-800">
                        <MapPin size={20} className="text-brand-500" />
                        <span className="font-bold">Table Number</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setSelectedTable(prev => Math.max(1, prev - 1))}
                            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm text-slate-600"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="text-xl font-extrabold w-8 text-center">{selectedTable}</span>
                        <button 
                            onClick={() => setSelectedTable(prev => prev + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm text-slate-600"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex justify-between mb-6 text-xl font-bold text-slate-900 items-end">
                    <span className="text-slate-500 text-sm font-medium">Total Amount</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="w-full bg-brand-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-600 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-95 text-lg"
                >
                    Send Order • ${cartTotal.toFixed(2)}
                </button>
            </div>
        </div>
    );
  }

  // --- MENU VIEW ---
  return (
    <div className="min-h-screen bg-stone-50 pb-32">
      {/* Success Modal */}
      {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl max-w-xs w-full animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Order Sent!</h3>
                  <p className="text-slate-500 mb-6">Table {selectedTable}: The kitchen has received your order.</p>
                  <button 
                    onClick={() => setShowSuccess(false)}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold"
                  >
                      Okay, got it
                  </button>
              </div>
          </div>
      )}

      {/* Glass Header */}
      <header className="glass sticky top-0 z-20 px-4 py-3">
        <div className="flex justify-between items-center mb-4 pt-2">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{restaurantName}</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Dine-in Menu
                </p>
            </div>
        </div>
        
        {/* Categories Pills */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 font-medium text-sm ${
                        selectedCategory === cat.id 
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105' 
                        : 'bg-white text-slate-500 border border-stone-200 hover:border-slate-300'
                    }`}
                >
                    <span>{cat.name}</span>
                </button>
            ))}
        </div>
      </header>

      {/* Menu Grid */}
      <main className="p-4 pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {filteredItems.map(item => (
            <MenuCard key={item.id} item={item} onAdd={addToCart} />
        ))}
      </main>

      {/* Floating Cart Bar */}
      {cartCount > 0 && (
          <div className="fixed bottom-6 left-6 right-6 z-30">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="w-full bg-slate-900/90 backdrop-blur-md text-white p-2 pl-4 pr-2 rounded-[2rem] shadow-2xl shadow-slate-900/30 flex justify-between items-center animate-in slide-in-from-bottom-10 fade-in duration-300 border border-white/10"
              >
                  <div className="flex items-center gap-3">
                      <div className="bg-brand-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-brand-500/40">
                          {cartCount}
                      </div>
                      <div className="flex flex-col items-start leading-tight">
                        <span className="font-bold text-sm">View Order</span>
                        <span className="text-[10px] text-slate-400">Ready to checkout?</span>
                      </div>
                  </div>
                  <div className="bg-white/10 px-5 py-3 rounded-full font-bold text-sm">
                    ${cartTotal.toFixed(2)}
                  </div>
              </button>
          </div>
      )}
    </div>
  );
};