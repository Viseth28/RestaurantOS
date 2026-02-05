import React from 'react';
import { MenuItem } from '../types';
import { Plus, Flame, Leaf, Award } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onAdd }) => {
  return (
    <div className="group bg-white rounded-3xl shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden border border-gray-100 hover:border-brand-200">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {item.popular && (
                <div className="bg-white/90 backdrop-blur-sm text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Award size={10} /> POPULAR
                </div>
            )}
            {item.spicy && <span title="Spicy" className="bg-red-500/90 text-white backdrop-blur-sm p-1.5 rounded-full"><Flame size={12} /></span>}
            {item.vegan && <span title="Vegan" className="bg-green-500/90 text-white backdrop-blur-sm p-1.5 rounded-full"><Leaf size={12} /></span>}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow relative">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-brand-600 transition-colors">{item.name}</h3>
        </div>
        
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 font-medium leading-relaxed">{item.description}</p>
        
        <div className="mt-auto flex items-center justify-between">
            <span className="font-bold text-xl text-slate-900">${item.price}</span>
            
            <button 
                onClick={() => onAdd(item)}
                className="bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-500 hover:shadow-brand-500/30 transition-all active:scale-90"
            >
                <Plus size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};