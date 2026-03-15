import React, { useState, useMemo } from "react";
import dataService from "../Service/DataService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getExpandedRowModel,
  ColumnDef,
  Row,
  CellContext,
} from "@tanstack/react-table";
import { AxiosError } from "axios";
import shoesSizeModel from "../models/shoesSizeModel";
import { FaBoxes, FaChevronDown, FaChevronUp, FaEdit, FaCheck, FaTimes, FaLightbulb } from "react-icons/fa";

// --- ממשקים ---
interface RawSupplyItem extends shoesSizeModel {
  title: string;
}

interface GroupedShoeSupply {
  shoesId: number;
  title: string;
  totalStock: number;
  sizes: {
    sizeId: number;
    stock: number;
  }[];
}

interface UpdatedStockData {
  shoesId: number;
  sizeId: number;
  stock: number;
}

interface StockAlert {
  shoesId: number;
  title: string;
  currentStock: number;
  dailyVelocity: number;
  daysLeft: number;
  suggestedOrder: number;
  message: string;
  severity: 'critical' | 'warning';
}

function MySupply() {
  const queryClient = useQueryClient();
  const [editingStockShoeId, setEditingStockShoeId] = useState<number | null>(null);
  const [editingStockSizeId, setEditingStockSizeId] = useState<number | null>(null);
  const [newStockValue, setNewStockValue] = useState<string>("");

  const { data: rawSupplyData, isLoading: isTableLoading } = useQuery<RawSupplyItem[], AxiosError>({
    queryKey: ["mySupply"],
    queryFn: async () => {
      const response = await dataService.getAllMySupply();
      return response as RawSupplyItem[];
    },
  });

  const { data: alerts } = useQuery<StockAlert[]>({
    queryKey: ["inventoryAlerts"],
    queryFn: async () => await dataService.getInventoryAlerts(),
  });

  const updateStockMutation = useMutation<any, Error, UpdatedStockData>({
    mutationFn: (updatedData) => dataService.updateShoeSizeStock(updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySupply"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryAlerts"] });
      setEditingStockShoeId(null);
      setEditingStockSizeId(null);
      alert("Stock level updated.");
    },
  });

  const groupedSupply = useMemo<GroupedShoeSupply[]>(() => {
    if (!rawSupplyData || !Array.isArray(rawSupplyData)) return [];
    const acc: { [key: number]: GroupedShoeSupply } = {};
    rawSupplyData.forEach(item => {
      if (!acc[item.shoesId]) {
        acc[item.shoesId] = { shoesId: item.shoesId, title: item.title, totalStock: 0, sizes: [] };
      }
      acc[item.shoesId].sizes.push({ sizeId: item.sizeId, stock: item.stock });
      acc[item.shoesId].totalStock += item.stock;
    });
    return Object.values(acc);
  }, [rawSupplyData]);

  const columns = useMemo<ColumnDef<GroupedShoeSupply>[]>(() => [
    { accessorKey: "shoesId", header: "#", cell: (info) => info.row.index + 1 },
    { accessorKey: "title", header: "SHOE NAME", cell: (info) => <span style={{fontWeight: 800}}>{String(info.getValue())}</span> },
    { accessorKey: "totalStock", header: "TOTAL STOCK", cell: (info) => (
        <span className={`stock-badge ${Number(info.getValue()) < 10 ? 'low' : 'good'}`}>
            {String(info.getValue())} Units
        </span>
    )},
    {
      id: "details",
      header: "MANAGE SIZES",
      cell: (info) => (
        <button className="expand-btn" onClick={info.row.getToggleExpandedHandler()}>
          {info.row.getIsExpanded() ? <><FaChevronUp /> Collapse</> : <><FaChevronDown /> View Sizes</>}
        </button>
      ),
    },
  ], []);

  const table = useReactTable({
    data: groupedSupply,
    columns,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  function renderSubComponent({ row }: { row: Row<GroupedShoeSupply> }) {
    return (
      <div className="sub-table-container">
        <table className="sub-table">
          <thead>
            <tr><th>Size</th><th>Current Stock</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {row.original.sizes.map((sizeItem) => (
              <tr key={sizeItem.sizeId}>
                <td><strong>{sizeItem.sizeId}</strong></td>
                <td>
                  {editingStockShoeId === row.original.shoesId && editingStockSizeId === sizeItem.sizeId ? (
                    <input type="number" value={newStockValue} onChange={(e) => setNewStockValue(e.target.value)} className="sub-input" />
                  ) : sizeItem.stock}
                </td>
                <td>
                  {editingStockShoeId === row.original.shoesId && editingStockSizeId === sizeItem.sizeId ? (
                    <div style={{display:'flex', gap:'5px', justifyContent:'center'}}>
                      <button className="btn-mini-save" onClick={() => updateStockMutation.mutate({ shoesId: editingStockShoeId, sizeId: editingStockSizeId!, stock: Number(newStockValue) })}><FaCheck /></button>
                      <button className="btn-mini-cancel" onClick={() => setEditingStockShoeId(null)}><FaTimes /></button>
                    </div>
                  ) : (
                    <button className="btn-edit-stock" onClick={() => { setEditingStockShoeId(row.original.shoesId); setEditingStockSizeId(sizeItem.sizeId); setNewStockValue(sizeItem.stock.toString()); }}>
                        <FaEdit /> Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (isTableLoading) return <div className="loading-state">FETCHING INVENTORY...</div>;

  return (
    <div className="supply-wrapper-full">
      <style>{supplyStyles}</style>
      
      <header className="supply-header">
          <div className="header-icon-box"><FaBoxes size={30}/></div>
          <h1>SHOE SUPPLY MANAGEMENT</h1>
      </header>

      {alerts && alerts.length > 0 && (
          <div className="alerts-container">
              <h3 className="alerts-title">🪄 Demand Forecasting</h3>
              <div className="alerts-grid">
                  {alerts.map(alert => (
                      <div key={alert.shoesId} className={`alert-card ${alert.severity}`}>
                          <div className="alert-header">
                              <strong>{alert.title}</strong>
                              <span>{alert.severity === 'critical' ? '🚨' : '⚠️'}</span>
                          </div>
                          <p className="alert-msg">{alert.message}</p>
                          <div className="alert-stats">
                              <span>Velocity: <b>{alert.dailyVelocity}</b>/day</span>
                              <span>Days Left: <b>{alert.daysLeft}</b></span>
                          </div>
                          <div className="alert-suggestion">
                              <FaLightbulb /> Suggested Order: {alert.suggestedOrder} Pairs
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      <div className="supply-table-card">
          <table className="main-supply-table">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>{hg.headers.map(h => <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <React.Fragment key={row.id}>
                  <tr className="main-row">
                    {row.getVisibleCells().map(cell => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr><td colSpan={columns.length} style={{padding:0}}>{renderSubComponent({ row })}</td></tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}

const supplyStyles = `
  .supply-wrapper-full { padding: 40px 2%; min-height: 100vh; background: #f9f9f9; font-family: 'Inter', sans-serif; }
  
  .supply-header { display: flex; flex-direction: column; align-items: center; margin-bottom: 50px; }
  .header-icon-box { background: #000; color: #fff; padding: 15px; border-radius: 20px; margin-bottom: 15px; }
  .supply-header h1 { font-size: 3rem; font-weight: 950; letter-spacing: -2px; margin: 0; }

  /* 🎯 Alerts Styling */
  .alerts-container { margin-bottom: 40px; background: #fff; padding: 30px; border-radius: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }
  .alerts-title { font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; border-left: 5px solid #000; padding-left: 15px; }
  .alerts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
  
  .alert-card { padding: 20px; border-radius: 15px; border: 1px solid transparent; }
  .alert-card.critical { background: #fff5f5; border-color: #feb2b2; }
  .alert-card.warning { background: #fffaf0; border-color: #fbd38d; }
  
  .alert-header { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 1.1rem; }
  .alert-msg { font-size: 0.9rem; color: #4a5568; margin-bottom: 15px; }
  .alert-stats { display: flex; justify-content: space-between; font-size: 0.85rem; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 10px; }
  .alert-suggestion { margin-top: 15px; font-weight: 800; color: #2b6cb0; display: flex; align-items: center; gap: 8px; font-size: 0.9rem; }

  /* 🎯 Main Table Styling */
  .supply-table-card { background: #fff; border-radius: 30px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.05); width: 100%; }
  .main-supply-table { width: 100%; border-collapse: collapse; text-align: center; }
  .main-supply-table th { background: #000; color: #fff; padding: 25px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; }
  .main-supply-table td { padding: 25px; border-bottom: 1px solid #f0f0f0; transition: 0.3s; }
  
  .main-row { transition: 0.3s; cursor: pointer; }
  .main-row:hover { background: #fff !important; transform: scale(1.002); box-shadow: inset 8px 0 0 0 #000, 0 10px 30px rgba(0,0,0,0.05); }

  .stock-badge { padding: 8px 16px; border-radius: 50px; font-weight: 900; font-size: 0.85rem; }
  .stock-badge.good { background: #e6fffa; color: #2c7a7b; }
  .stock-badge.low { background: #fff5f5; color: #c53030; }

  .expand-btn { background: #f7fafc; border: 1px solid #edf2f7; padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; margin: 0 auto; transition: 0.3s; }
  .expand-btn:hover { background: #000; color: #fff; }

  /* 🎯 Sub-Table Sizes */
  .sub-table-container { background: #fafafa; padding: 30px; border-bottom: 2px solid #eee; }
  .sub-table { width: 100%; max-width: 800px; margin: 0 auto; background: #fff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
  .sub-table th { background: #f1f1f1; padding: 15px; font-size: 0.75rem; color: #666; }
  .sub-table td { padding: 15px; border-bottom: 1px solid #eee; text-align: center; }
  
  .btn-edit-stock { background: #000; color: #fff; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 5px; margin: 0 auto; }
  .sub-input { width: 70px; padding: 5px; border: 2px solid #000; border-radius: 5px; text-align: center; font-weight: 700; }
  .btn-mini-save { background: #48bb78; color: #fff; border: none; padding: 8px; border-radius: 5px; cursor: pointer; }
  .btn-mini-cancel { background: #e2e8f0; color: #4a5568; border: none; padding: 8px; border-radius: 5px; cursor: pointer; }

  .loading-state { text-align: center; padding: 100px; font-weight: 900; font-size: 1.5rem; letter-spacing: 3px; color: #ccc; }
`;

export default MySupply;