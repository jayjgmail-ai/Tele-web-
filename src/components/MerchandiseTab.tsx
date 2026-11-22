import { useState, useRef, useEffect } from 'react';
import { MerchandiseItem, NotificationCategory, ExtraDetailItem } from '../types';
import { SiteContent } from '../data/siteContent';
import { ShoppingBag, Plus, X, CheckCircle2, Tag, Edit3, Trash2, Check } from 'lucide-react';
import ImageField from './ImageField';
import RichTextRenderer from './RichTextRenderer';
import RichTextEditor from './RichTextEditor';
import { StringListEditor, ExtraFieldsEditor } from './ExtraFieldsEditor';

interface MerchandiseTabProps {
  siteContent: SiteContent;
  merchandise: MerchandiseItem[];
  setMerchandise: (items: MerchandiseItem[]) => void;
  isAdmin: boolean;
  onOpenCms: () => void;
  onAddNotification: (
    category: NotificationCategory,
    title: string,
    subtitle: string,
    details: string,
    targetTab: string,
    amount?: string
  ) => void;
}

export default function MerchandiseTab({
  siteContent,
  merchandise,
  setMerchandise,
  isAdmin,
  onOpenCms,
  onAddNotification,
}: MerchandiseTabProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MerchandiseItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cart, setCart] = useState<MerchandiseItem[]>([]);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [lastAddedItem, setLastAddedItem] = useState<MerchandiseItem | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const btnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (btnTimerRef.current) clearTimeout(btnTimerRef.current);
    };
  }, []);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Apparel');
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState(2500);
  const [inStock, setInStock] = useState(true);
  const [sizes, setSizes] = useState<string[]>([]);
  const [extraDetails, setExtraDetails] = useState<ExtraDetailItem[]>([]);
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&q=80&w=500'
  );
  const [description, setDescription] = useState('');

  const m = siteContent.merchandise;
  const baseCategories = m.categories || ['Apparel', 'Footwear', 'Equipment', 'Accessories'];
  const allCategories = Array.from(
    new Set([...baseCategories, ...merchandise.map((it) => it.category).filter(Boolean)])
  );

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setCategory(allCategories[0] || 'Apparel');
    setCustomCategory('');
    setPrice(2500);
    setInStock(true);
    setSizes(['S', 'M', 'L', 'XL']);
    setExtraDetails([]);
    setExtraPhotos([]);
    setImage('https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&q=80&w=500');
    setDescription('');
    setSuccessMsg(false);
    setShowUploadModal(true);
  };

  const openEditModal = (item: MerchandiseItem) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setCustomCategory('');
    setPrice(item.price);
    setInStock(item.inStock);
    setSizes(item.sizes ? [...item.sizes] : []);
    setExtraDetails(item.extraDetails ? [...item.extraDetails] : []);
    setExtraPhotos(item.extraPhotos ? [...item.extraPhotos] : []);
    setImage(item.image);
    setDescription(item.description);
    setSuccessMsg(false);
    setShowUploadModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    const finalCategory = (category === '__custom__' ? customCategory.trim() : category) || 'Apparel';
    const cleanSizes = sizes.map((s) => s.trim()).filter(Boolean);
    const cleanExtraDetails = extraDetails.filter((d) => d.label.trim() && d.value.trim());
    const cleanExtraPhotos = extraPhotos.map((u) => u.trim()).filter(Boolean);

    if (editingId) {
      setMerchandise(
        merchandise.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: name.trim(),
                category: finalCategory,
                price: Number(price),
                image,
                description,
                sizes: cleanSizes.length ? cleanSizes : undefined,
                inStock,
                extraDetails: cleanExtraDetails,
                extraPhotos: cleanExtraPhotos,
              }
            : item
        )
      );
      setShowUploadModal(false);
    } else {
      const newItem: MerchandiseItem = {
        id: `merch-${Date.now()}`,
        name: name.trim(),
        category: finalCategory,
        price: Number(price),
        image,
        description,
        sizes: cleanSizes.length ? cleanSizes : undefined,
        inStock,
        extraDetails: cleanExtraDetails,
        extraPhotos: cleanExtraPhotos,
      };

      setMerchandise([newItem, ...merchandise]);
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setShowUploadModal(false);
        setName('');
        setDescription('');
      }, 1500);
    }
  };

  const handleDeleteItem = (id: string) => {
    setMerchandise(merchandise.filter((item) => item.id !== id));
    setCart(cart.filter((item) => item.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const addToCart = (item: MerchandiseItem) => {
    setCart((prev) => [...prev, item]);
    setJustAddedId(item.id);
    setLastAddedItem(item);

    if (btnTimerRef.current) clearTimeout(btnTimerRef.current);
    btnTimerRef.current = setTimeout(() => {
      setJustAddedId((curr) => (curr === item.id ? null : curr));
    }, 1800);

    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setLastAddedItem(null);
    }, 4500);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const itemSummary = cart.map((i) => i.name).join(', ');
    onAddNotification(
      'purchases',
      `Merchandise Order: ${buyerName.trim() || 'Academy Customer'}`,
      `${cart.length} item(s) purchased`,
      `Items: ${itemSummary}${buyerEmail ? ` | Email: ${buyerEmail}` : ''}`,
      'merchandise',
      `Ksh ${cartTotal.toLocaleString()}`
    );
    setCart([]);
    setBuyerName('');
    setBuyerEmail('');
    setCheckoutSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-white text-slate-900">
      {isAdmin && (
        <div className="flex justify-end">
          <button
            onClick={onOpenCms}
            className="px-4 py-2 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs shadow-sm hover:bg-yellow-300 transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Page
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl bg-pink-50/50 p-8 sm:p-12 border border-pink-200 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            {m.badge?.trim() && (
              <span className="inline-block px-3.5 py-1.5 rounded-md bg-pink-600 text-white font-black text-xs uppercase tracking-wider shadow-xs">
                {m.badge}
              </span>
            )}
            {m.heading?.trim() && (
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight">
                <RichTextRenderer text={m.heading} inline />
              </h1>
            )}
            {m.subheading?.trim() && (
              <div className="text-slate-600 text-base leading-relaxed">
                <RichTextRenderer text={m.subheading} />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {isAdmin && (
              <button
                onClick={openAddModal}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-sm shadow-lg shadow-pink-600/20 hover:from-pink-500 hover:to-purple-600 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-yellow-300" />
                Upload New Merch
              </button>
            )}

            <button
              onClick={() => {
                setCheckoutSuccess(false);
                setCheckoutModal(true);
              }}
              className="relative px-6 py-4 rounded-xl bg-slate-900 text-white font-black text-sm shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 border border-slate-700"
            >
              <ShoppingBag className="w-4 h-4 text-yellow-300" />
              {m.cartLabel || 'Cart'} ({cart.length})
            </button>
          </div>
        </div>
      </div>

      {/* Merchandise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {merchandise.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-pink-50 border border-pink-100 hover:border-pink-500 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div
                onClick={() => setSelectedItem(item)}
                className="relative min-h-[8rem] overflow-hidden bg-slate-50 flex items-center justify-center cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-auto block group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-white/95 backdrop-blur-md text-[10px] font-extrabold text-pink-700 border border-pink-200 uppercase shadow-xs">
                  {item.category}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-pink-600 text-white text-xs font-black shadow-xs tabular-nums">
                  Ksh {item.price.toLocaleString()}
                </div>
                {!item.inStock && (
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 text-yellow-300 text-[10px] font-black uppercase">
                    Out of Stock
                  </div>
                )}
              </div>

              <div className="p-5 space-y-2.5">
                <h3
                  onClick={() => setSelectedItem(item)}
                  className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors cursor-pointer"
                >
                  {item.name}
                </h3>
                <div className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                  <RichTextRenderer text={item.description} />
                </div>
                {item.sizes && item.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.sizes.map((sz, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-pink-50 border border-pink-200 text-[10px] font-bold text-pink-900"
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 pt-0 space-y-2">
              {(() => {
                const qtyInCart = cart.filter((c) => c.id === item.id).length;
                const isJustAdded = justAddedId === item.id;
                return (
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.inStock}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border disabled:opacity-50 ${
                      isJustAdded
                        ? 'bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-600/20'
                        : 'bg-pink-50 hover:bg-pink-600 hover:text-white text-pink-900 border-pink-200'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-4 h-4 text-yellow-300 stroke-[3]" />
                        <span>Added ({qtyInCart} in {m.cartLabel || 'Cart'})</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>
                          {m.addToCartText || 'Add To Cart'} - Ksh {item.price.toLocaleString()}
                          {qtyInCart > 0 ? ` (${qtyInCart})` : ''}
                        </span>
                      </>
                    )}
                  </button>
                );
              })()}

              {isAdmin && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex-1 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-bold text-xs border border-red-200 flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative bg-slate-50 flex items-center justify-center">
              <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-auto block" />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-slate-800 flex items-center justify-center hover:bg-slate-100 shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-lg bg-pink-100 text-pink-800 text-xs font-extrabold uppercase">
                  {selectedItem.category}
                </span>
                <span className="text-xl font-black text-pink-600 tabular-nums">
                  Ksh {selectedItem.price.toLocaleString()}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">{selectedItem.name}</h2>
              <div className="text-sm text-slate-600 leading-relaxed">
                <RichTextRenderer text={selectedItem.description} />
              </div>

              {selectedItem.sizes && selectedItem.sizes.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1.5">Available Sizes</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.sizes.map((sz, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-pink-50 border border-pink-200 text-xs font-bold text-pink-900"
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.extraDetails && selectedItem.extraDetails.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedItem.extraDetails.map((ed, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">{ed.label}</div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">{ed.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {selectedItem.extraPhotos && selectedItem.extraPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2.5">
                  {selectedItem.extraPhotos.map((pUrl, idx) => (
                    <img
                      key={idx}
                      src={pUrl}
                      alt={`${selectedItem.name} ${idx + 1}`}
                      className="w-full h-auto object-contain rounded-xl border border-pink-100 bg-slate-50"
                    />
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    addToCart(selectedItem);
                    setSelectedItem(null);
                  }}
                  disabled={!selectedItem.inStock}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-sm shadow-lg disabled:opacity-50"
                >
                  {m.addToCartText || 'Add To Cart'} - Ksh {selectedItem.price.toLocaleString()}
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Upload / Edit Merchandise Modal */}
      {isAdmin && showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
                <Tag className="w-5 h-5 text-pink-600" />
                {editingId ? 'Edit Merchandise Item' : 'Upload New Merchandise'}
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-pink-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-600/20">
                  <CheckCircle2 className="w-8 h-8 text-yellow-300" />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase">Item Uploaded Successfully!</h3>
                <p className="text-slate-600 text-sm">Now available in the academy store catalog.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Item Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Telesports Training Tracksuit"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
                    <select
                      value={allCategories.includes(category) ? category : '__custom__'}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                    >
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__custom__">+ Add Custom Category...</option>
                    </select>
                    {category === '__custom__' && (
                      <input
                        type="text"
                        required
                        placeholder="Type new category..."
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full bg-white border border-pink-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price (Ksh) *</label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-pink-600 shadow-xs"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer bg-pink-50/60 p-3 rounded-xl border border-pink-100">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 accent-pink-600 rounded"
                  />
                  Item currently in stock &amp; available for purchase
                </label>

                <StringListEditor
                  label="Sizes / Variants (Optional)"
                  items={sizes}
                  onChange={setSizes}
                  addButtonText="Add Extra Size"
                  placeholder="e.g. XL"
                />

                <ImageField
                  label="Product Photo"
                  value={image}
                  onChange={setImage}
                  required
                />

                <RichTextEditor
                  label="Description *"
                  rows={3}
                  placeholder="Enter item materials, sizing, and features..."
                  value={description}
                  onChange={setDescription}
                />

                <ExtraFieldsEditor
                  extraDetails={extraDetails}
                  onChangeDetails={setExtraDetails}
                  extraPhotos={extraPhotos}
                  onChangePhotos={setExtraPhotos}
                />

                <div className="pt-4 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-sm shadow-lg hover:from-pink-500 hover:to-purple-600"
                  >
                    {editingId ? 'Save Changes' : 'Upload Item'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Cart Checkout Modal */}
      {checkoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-pink-600" />
                Shopping {m.cartLabel || 'Cart'} ({cart.length} items)
              </h2>
              <button
                onClick={() => setCheckoutModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutSuccess ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-pink-600 text-white flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-yellow-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase">
                  {m.orderSuccessTitle || 'Order Placed Successfully!'}
                </h3>
                <p className="text-slate-600 text-sm">
                  {m.orderSuccessMessage ||
                    'Thank you for supporting Telesports Academy. Your order confirmation has been recorded.'}
                </p>
                <button
                  onClick={() => {
                    setCheckoutSuccess(false);
                    setCheckoutModal(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-pink-600 text-white font-bold text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                Your cart is empty. Add official merchandise to proceed.
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="space-y-3 max-h-52 overflow-y-auto">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <div className="text-sm font-bold text-slate-900">{item.name}</div>
                          <div className="text-xs text-pink-600 font-bold tabular-nums">
                            Ksh {item.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-pink-600"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-base font-black text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-pink-600 tabular-nums">Ksh {cartTotal.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-sm shadow-lg shadow-pink-600/20 hover:from-pink-500 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                >
                  {m.checkoutBtnText || 'Proceed to Secure Checkout'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Floating Add-To-Cart Confirmation Toast */}
      {lastAddedItem && !checkoutModal && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-40 bg-slate-900 text-white border border-pink-400/60 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={lastAddedItem.image}
              alt={lastAddedItem.name}
              className="w-11 h-11 rounded-xl object-cover border border-pink-400/40 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-yellow-300">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Added to {m.cartLabel || 'Cart'}</span>
              </div>
              <div className="text-sm font-bold text-white truncate">{lastAddedItem.name}</div>
              <div className="text-[11px] text-slate-300 tabular-nums">
                Ksh {lastAddedItem.price.toLocaleString()} • {cart.length} item{cart.length === 1 ? '' : 's'} (Ksh{' '}
                {cartTotal.toLocaleString()})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setLastAddedItem(null);
                setCheckoutSuccess(false);
                setCheckoutModal(true);
              }}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-xs hover:from-pink-500 hover:to-purple-600 shadow-md whitespace-nowrap"
            >
              View {m.cartLabel || 'Cart'}
            </button>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setLastAddedItem(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
