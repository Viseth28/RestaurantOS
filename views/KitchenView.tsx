import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { CheckCircle, Clock, ChefHat, DollarSign, QrCode, X, Printer, Flame, Bell, Wifi, ArrowUpRight } from 'lucide-react';

interface KitchenViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  tables: number[];
}

export const KitchenView: React.FC<KitchenViewProps> = ({ orders, onUpdateStatus, tables }) => {
  const [showQrCodes, setShowQrCodes] = useState(false);
  const [printOrder, setPrintOrder] = useState<Order | null>(null);

  // Filter out paid orders
  const activeOrders = orders.filter(o => o.status !== OrderStatus.PAID);

  // Group by Table
  const ordersByTable = activeOrders.reduce((acc, order) => {
    if (!acc[order.tableId]) {
      acc[order.tableId] = [];
    }
    acc[order.tableId].push(order);
    return acc;
  }, {} as Record<number, Order[]>);

  // Sort tables by oldest active order timestamp
  const sortedTableIds = Object.keys(ordersByTable).map(Number).sort((a, b) => {
     const oldestA = Math.min(...ordersByTable[a].map(o => o.timestamp));
     const oldestB = Math.min(...ordersByTable[b].map(o => o.timestamp));
     return oldestA - oldestB;
  });

  const handleBatchUpdate = (ordersToUpdate: Order[], newStatus: OrderStatus) => {
    ordersToUpdate.forEach(o => onUpdateStatus(o.id, newStatus));
  };

  const handlePrint = (order: Order) => {
    setPrintOrder(order);
    setTimeout(() => {
        window.print();
        setPrintOrder(null);
    }, 100);
  };

  const currentUrl = window.location.href.split('?')[0];

  return (
    <>
      {/* Hidden Print Template */}
      {printOrder && (
          <div className="printable-ticket p-4 font-mono text-sm">
              <div className="text-center mb-4">
                  <h1 className="text-xl font-bold">KITCHEN TICKET</h1>
                  <p>{new Date(printOrder.timestamp).toLocaleString()}</p>
              </div>
              <div className="text-lg font-bold mb-4 border-b-2 border-black pb-2">
                  TABLE {printOrder.tableId} <span className="float-right">#{printOrder.id.slice(-4)}</span>
              </div>
              <ul className="space-y-2 mb-6">
                  {printOrder.items.map((item, i) => (
                      <li key={i} className="flex justify-between text-lg">
                          <span className="font-bold">{item.quantity}x</span>
                          <span>{item.name}</span>
                      </li>
                  ))}
              </ul>
              <div className="text-center border-t-2 border-black pt-2 mt-4">
                  *** END OF TICKET ***
              </div>
          </div>
      )}

      <div className="h-full bg-slate-900 rounded-2xl p-6 overflow-y-auto border border-slate-800">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-800">
          <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="bg-brand-500 p-2 rounded-lg text-white">
                    <ChefHat size={24} />
                  </div>
                  Kitchen Display System
              </h2>
              <p className="text-slate-400 mt-1">
                 Local Orders View • Notification System: Telegram
              </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
               <button 
                  onClick={() => setShowQrCodes(true)}
                  className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 font-medium transition-colors"
              >
                  <QrCode size={18} /> QR Codes
              </button>
          </div>
        </header>

        {/* QR Code Modal */}
        {showQrCodes && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
                  <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                          <Printer size={20} /> Table QR Codes
                      </h2>
                      <button onClick={() => setShowQrCodes(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-slate-500">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="p-8 overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-6 bg-white">
                      {tables.map(tableId => {
                          const qrUrl = `${currentUrl}?table=${tableId}`;
                          const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrUrl)}`;
                          return (
                              <div key={tableId} className="border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl hover:border-brand-200 transition-all">
                                  <h3 className="font-bold text-xl mb-3 text-slate-900">Table {tableId}</h3>
                                  <img src={qrImageSrc} alt={`QR Code for Table ${tableId}`} className="mb-4 rounded-lg" />
                                  <div className="text-[10px] text-gray-400 break-all bg-gray-50 p-2 rounded w-full font-mono text-center">
                                      ?table={tableId}
                                  </div>
                                  <a href={qrUrl} target="_blank" className="mt-2 text-xs text-brand-600 font-bold hover:underline flex items-center gap-1">Test Link <ArrowUpRight size={10}/></a>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTableIds.length === 0 && (
              <div className="col-span-full text-center py-32 text-slate-600 flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
                  <Clock size={64} className="mb-4 opacity-20" />
                  <p className="font-bold text-xl text-slate-500">No local active orders</p>
                  <p className="text-sm">Orders from other devices are sent to Telegram.</p>
              </div>
          )}

          {sortedTableIds.map(tableId => {
              const tableOrders = ordersByTable[tableId];
              const pendingOrders = tableOrders.filter(o => o.status === OrderStatus.PENDING);
              const preparingOrders = tableOrders.filter(o => o.status === OrderStatus.PREPARING);
              const readyOrders = tableOrders.filter(o => o.status === OrderStatus.READY);
              const servedOrders = tableOrders.filter(o => o.status === OrderStatus.SERVED);
              
              const isTableClosable = pendingOrders.length === 0 && preparingOrders.length === 0 && readyOrders.length === 0;

              return (
                <div key={tableId} className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                  <div className="bg-slate-950 p-4 flex justify-between items-center border-b border-slate-700">
                    <div>
                      <h3 className="font-bold text-xl text-white">Table {tableId}</h3>
                      <span className="text-xs text-slate-400 font-medium">Items: {tableOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)}</span>
                    </div>
                    <div className="text-xs bg-slate-800 text-brand-400 border border-slate-700 px-3 py-1.5 rounded-full font-mono font-bold">
                      {new Date(Math.min(...tableOrders.map(o => o.timestamp))).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>

                  <div className="p-4 flex-grow space-y-4">
                    
                    {/* PENDING SECTION */}
                    {pendingOrders.length > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl overflow-hidden">
                            <div className="px-4 py-2 bg-amber-500/20 text-amber-500 text-xs font-bold flex justify-between items-center tracking-wider">
                                <span className="flex items-center gap-2"><Clock size={12} /> NEW</span>
                                <button onClick={() => handlePrint(pendingOrders[0])} className="hover:text-white transition-colors" title="Print Ticket"><Printer size={12} /></button>
                            </div>
                            <div className="p-3 space-y-2">
                                {pendingOrders.flatMap(o => o.items).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                                        <span className="font-bold text-amber-500 text-lg bg-amber-950/30 w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0">{item.quantity}</span>
                                        <span className="font-medium leading-tight">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                            <button 
                               onClick={() => handleBatchUpdate(pendingOrders, OrderStatus.PREPARING)}
                               className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 text-sm font-bold transition-colors flex justify-center items-center gap-2"
                            >
                               Start Cooking
                            </button>
                        </div>
                    )}

                    {/* PREPARING SECTION */}
                    {preparingOrders.length > 0 && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl overflow-hidden">
                            <div className="px-4 py-2 bg-blue-500/20 text-blue-400 text-xs font-bold flex justify-between items-center tracking-wider">
                                <span className="flex items-center gap-2"><Flame size={12} /> PREPARING</span>
                            </div>
                            <div className="p-3 space-y-2">
                                {preparingOrders.flatMap(o => o.items).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                                        <span className="font-bold text-blue-400 text-lg bg-blue-950/30 w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0">{item.quantity}</span>
                                        <span className="font-medium leading-tight">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                            <button 
                               onClick={() => handleBatchUpdate(preparingOrders, OrderStatus.READY)}
                               className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 text-sm font-bold transition-colors flex justify-center items-center gap-2"
                            >
                               Mark Ready
                            </button>
                        </div>
                    )}

                    {/* READY SECTION */}
                    {readyOrders.length > 0 && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl overflow-hidden">
                            <div className="px-4 py-2 bg-green-500/20 text-green-400 text-xs font-bold flex justify-between items-center tracking-wider">
                                <span className="flex items-center gap-2"><Bell size={12} /> READY</span>
                            </div>
                            <div className="p-3 space-y-2">
                                {readyOrders.flatMap(o => o.items).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                                        <span className="font-bold text-green-400 text-lg bg-green-950/30 w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0">{item.quantity}</span>
                                        <span className="font-medium leading-tight">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                            <button 
                               onClick={() => handleBatchUpdate(readyOrders, OrderStatus.SERVED)}
                               className="w-full bg-green-600 hover:bg-green-500 text-white py-3 text-sm font-bold transition-colors flex justify-center items-center gap-2"
                            >
                               Complete
                            </button>
                        </div>
                    )}

                    {/* SERVED SECTION (Summary) */}
                    {servedOrders.length > 0 && (
                        <div className="text-xs p-3 border border-slate-700 rounded-xl bg-slate-800/50 opacity-50">
                            <div className="font-bold text-slate-500 mb-2 uppercase tracking-wider text-[10px]">Served</div>
                            <div className="flex flex-wrap gap-2">
                               {servedOrders.flatMap(o => o.items).map((item, idx) => (
                                   <span key={idx} className="text-slate-400 bg-slate-700 px-2 py-1 rounded-md border border-slate-600">
                                       {item.quantity}x {item.name}
                                   </span>
                               ))}
                            </div>
                        </div>
                    )}

                  </div>

                  <div className="p-4 bg-slate-800 border-t border-slate-700">
                       <button 
                       onClick={() => handleBatchUpdate(servedOrders, OrderStatus.PAID)}
                       disabled={!isTableClosable || servedOrders.length === 0}
                       className="w-full bg-slate-700 hover:bg-white hover:text-slate-900 text-slate-300 py-3 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed"
                     >
                       <DollarSign size={16}/> 
                       {!isTableClosable ? 'Finish Pending' : 'Clear & Close Table'}
                     </button>
                  </div>
                </div>
              );
          })}
        </div>
      </div>
    </>
  );
};