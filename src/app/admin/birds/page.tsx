'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Bird, Plus, Edit, Trash2, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';
import { BirdItem } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminBirdsPage() {
  const [birds, setBirds] = useState<BirdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBird, setEditingBird] = useState<BirdItem | null>(null);

  // Form State
  const [birdCode, setBirdCode] = useState('');
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Budgerigar / Parakeet');
  const [color, setColor] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState<'AVAILABLE' | 'RESERVED' | 'SOLD' | 'COMING_SOON'>('AVAILABLE');
  const [healthStatus, setHealthStatus] = useState('Active & Vet Checked');
  const [healthInfo, setHealthInfo] = useState('');
  const [careLevel, setCareLevel] = useState('Beginner Friendly');
  const [dietRecommendation, setDietRecommendation] = useState('');
  const [temperament, setTemperament] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchBirds();
  }, []);

  const fetchBirds = async () => {
    try {
      const res = await fetch('/api/birds');
      const data = await res.json();
      if (data.birds) {
        setBirds(data.birds);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingBird(null);
    setBirdCode(`BIRD-${Math.floor(100 + Math.random() * 900)}`);
    setName('');
    setSpecies('Budgerigar / Parakeet');
    setColor('Sky Blue & White');
    setAge('4 Months');
    setGender('Male');
    setPrice('1200');
    setStatus('AVAILABLE');
    setHealthStatus('Active & Vet Checked');
    setHealthInfo('De-wormed and vet checked.');
    setCareLevel('Beginner Friendly');
    setDietRecommendation('Millet seeds and calcium block');
    setTemperament('Playful');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1000&q=80');
    setModalOpen(true);
  };

  const handleOpenEditModal = (bird: BirdItem) => {
    setEditingBird(bird);
    setBirdCode(bird.birdCode);
    setName(bird.name);
    setSpecies(bird.species);
    setColor(bird.color);
    setAge(bird.age);
    setGender(bird.gender);
    setPrice(String(bird.price));
    setStatus(bird.status as any);
    setHealthStatus(bird.healthStatus);
    setHealthInfo(bird.healthInfo || '');
    setCareLevel(bird.careLevel);
    setDietRecommendation(bird.dietRecommendation || '');
    setTemperament(bird.temperament || '');
    setDescription(bird.description);
    let img = 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1000&q=80';
    try {
      const parsed = typeof bird.images === 'string' ? JSON.parse(bird.images) : bird.images;
      if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
    } catch (e) {}
    setImageUrl(img);
    setModalOpen(true);
  };

  const handleSaveBird = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      birdCode,
      name,
      species,
      color,
      age,
      gender,
      price: parseFloat(price),
      status,
      healthStatus,
      healthInfo,
      careLevel,
      dietRecommendation,
      temperament,
      description,
      images: [imageUrl],
    };

    if (editingBird) {
      await fetch(`/api/birds/${editingBird.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/birds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    setModalOpen(false);
    fetchBirds();
  };

  const handleDeleteBird = async (id: string) => {
    if (confirm('Are you sure you want to delete this bird from the inventory?')) {
      await fetch(`/api/birds/${id}`, { method: 'DELETE' });
      fetchBirds();
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Live Inventory</span>
          <h1 className="text-3xl font-black text-white mt-1">Bird Management</h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Bird</span>
        </button>
      </div>

      {/* Birds Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-700">
            <tr>
              <th className="p-4">Bird</th>
              <th className="p-4">Species & Color</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Gender & Age</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-medium">
            {birds.map((b) => {
              let img = 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=400&q=80';
              try {
                const parsed = typeof b.images === 'string' ? JSON.parse(b.images) : b.images;
                if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
              } catch (e) {}

              return (
                <tr key={b.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 relative overflow-hidden shrink-0 border border-slate-700">
                      <Image src={img} alt={b.name} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-emerald-400 font-bold block">{b.birdCode}</span>
                      <span className="font-extrabold text-white text-sm block">{b.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-white block font-semibold">{b.species}</span>
                    <span className="text-[11px] text-slate-400">{b.color}</span>
                  </td>
                  <td className="p-4 font-black text-white text-sm">{formatCurrency(b.price)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        b.status === 'AVAILABLE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : b.status === 'SOLD'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {b.gender} • {b.age}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(b)}
                      className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl hover:bg-slate-700"
                      title="Edit Bird"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBird(b.id)}
                      className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl"
                      title="Delete Bird"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Bird Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">
                {editingBird ? `Edit Bird [${editingBird.birdCode}]` : 'Add New Bird to Inventory'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBird} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Bird Code *</label>
                  <input
                    type="text"
                    required
                    value={birdCode}
                    onChange={(e) => setBirdCode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Bird Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sky Blue Budgie"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Species *</label>
                  <input
                    type="text"
                    required
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RESERVED">RESERVED</option>
                    <option value="SOLD">SOLD</option>
                    <option value="COMING_SOON">COMING_SOON</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Color</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Age</label>
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Pair">Pair</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 text-slate-950 font-black py-3 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Save Bird
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
