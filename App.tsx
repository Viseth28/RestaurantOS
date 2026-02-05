import React, { useState, useEffect } from 'react';
import { INITIAL_MENU_ITEMS, INITIAL_CATEGORIES } from './data/initialData';
import { db, DB_KEYS } from './services/db';
import { CustomerView } from './views/CustomerView';
import { AdminView } from './views/AdminView';
import { LoginView } from './views/LoginView';
import { CartItem, Order, OrderStatus, MenuItem, Category, TelegramConfig } from './types';
import { ChefHat, Settings, Utensils } from 'lucide-react';
import { sendTelegramNotification } from './services/telegramService';

// Custom Hook to connect React State to our "DB"
const useDatabase = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    return db.load(key, defaultValue);
  });

  useEffect(() => {
    db.save(key, value);
  }, [key, value]);

  return [value, setValue];
};

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'customer' | 'admin' | 'login'>('landing');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [hasStartedOrder, setHasStartedOrder] = useState(false);
  
  // Connect to Database
  const [restaurantName, setRestaurantName] = useDatabase<string>(DB_KEYS.RESTAURANT_NAME, 'TableSwift');
  const [menuItems, setMenuItems] = useDatabase<MenuItem[]>(DB_KEYS.MENU, INITIAL_MENU_ITEMS);
  const [categories, setCategories] = useDatabase<Category[]>(DB_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  const [telegramConfig, setTelegramConfig] = useDatabase<TelegramConfig>(DB_KEYS.TELEGRAM, { botToken: '', chatId: '' });

  const handleStartOrder = () => {
    setHasStartedOrder(true);
    setView('customer');
  };

  const handlePlaceOrder = async (items: CartItem[], tableId: number) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      tableId: tableId, 
      items,
      status: OrderStatus.PENDING,
      total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      timestamp: Date.now()
    };

    // Send to Telegram (Kitchen Notification)
    if (telegramConfig.botToken && telegramConfig.chatId) {
        await sendTelegramNotification(newOrder, telegramConfig.botToken, telegramConfig.chatId);
    } else {
        console.log("Telegram not configured. Order details:", newOrder);
    }
  };

  const handleAdminAuth = (success: boolean) => {
    if (success) {
      setIsAdminAuthenticated(true);
      setView('admin');
    }
  };

  const openAdminPanel = () => {
    if (isAdminAuthenticated) {
      setView('admin');
    } else {
      setView('login');
    }
  };

  return (
    <div>
      {/* Navigation Toggle */}
      {view !== 'landing' && view !== 'login' && (
          <div className="fixed top-0 right-0 p-3 z-50 flex gap-2">
            <button 
                onClick={() => {
                   setView('landing');
                   setHasStartedOrder(false);
                   window.history.pushState({}, '', window.location.pathname);
                }}
                className="bg-slate-900/10 text-slate-500 hover:text-white hover:bg-slate-900 px-3 py-1.5 text-xs rounded-full backdrop-blur-md transition-all font-medium"
            >
                Exit
            </button>
          </div>
      )}

      {view === 'landing' && (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
          
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

          <button 
            onClick={openAdminPanel}
            className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all backdrop-blur-sm border border-white/10"
            title="Admin Settings"
          >
            <Settings size={20} className="text-white/80" />
          </button>

          <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-10 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold tracking-wider uppercase">
                   <ChefHat size={12} /> Restaurant OS
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
                  {restaurantName}
                </h1>
                <p className="text-xl text-slate-400 max-w-lg mx-auto leading-relaxed">
                  The seamless dining experience.
                </p>
            </div>

            <div className="w-full max-w-sm">
                <button 
                    onClick={handleStartOrder}
                    className="w-full bg-brand-500 text-white py-4 rounded-2xl font-bold text-xl shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                    <Utensils size={24} /> Tap to Order
                </button>
            </div>
          </div>
        </div>
      )}

      {view === 'login' && (
        <LoginView 
          onLogin={handleAdminAuth} 
          onCancel={() => setView('landing')} 
        />
      )}

      {view === 'customer' && hasStartedOrder && (
        <CustomerView 
            tableId={1} 
            restaurantName={restaurantName}
            onPlaceOrder={handlePlaceOrder}
            menuItems={menuItems}
            categories={categories}
        />
      )}

      {view === 'admin' && isAdminAuthenticated && (
        <AdminView 
          restaurantName={restaurantName}
          onUpdateRestaurantName={setRestaurantName}
          telegramConfig={telegramConfig}
          onUpdateTelegramConfig={setTelegramConfig}
          menuItems={menuItems}
          categories={categories}
          onUpdateMenu={setMenuItems}
          onUpdateCategories={setCategories}
          onClose={() => setView('landing')}
        />
      )}
    </div>
  );
};

export default App;