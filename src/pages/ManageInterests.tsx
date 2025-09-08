import React, { useMemo, useState } from 'react';
import { Plus, Search, Eye, EyeOff, Image } from 'lucide-react';
import { useCreateInterest, useDeleteInterest, useUpdateInterest } from '@/api/mutations/interests';
import { useInterests } from '@/api/queries/interests';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import api from '@/api/api';

export const ManageInterests: React.FC = () => {
  const { data: interests, isLoading } = useInterests();
  const createMutation = useCreateInterest();
  const updateMutation = useUpdateInterest();
  const deleteMutation = useDeleteInterest();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  const [addOpen, setAddOpen] = useState(false);
  const [addData, setAddData] = useState({ name: '', icon: null as File | null });

  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: '', isActive: true, icon: null as File | null });

  const filteredInterests = useMemo(() => {
    if (!interests) return [];
    return interests.filter(interest => {
      const matchesSearch = interest.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterActive === 'all' ||
        (filterActive === 'active' && interest.isActive) ||
        (filterActive === 'inactive' && !interest.isActive);
      return matchesSearch && matchesFilter;
    });
  }, [interests, searchTerm, filterActive]);

  const stats = useMemo(() => {
    if (!interests) return { total: 0, active: 0, inactive: 0 };
    return {
      total: interests.length,
      active: interests.filter(i => i.isActive).length,
      inactive: interests.filter(i => !i.isActive).length,
    };
  }, [interests]);

  const isBusy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addData.name.trim() || !addData.icon) {
      alert('Please fill all fields');
      return;
    }
    try {
      await createMutation.mutateAsync({
        name: addData.name,
        isActive: 'true',
        icon: addData.icon,
      });
      setAddOpen(false);
      setAddData({ name: '', icon: null });
      alert('Interest added successfully!');
    } catch (error) {
      console.error('Error adding interest:', error);
      alert('Failed to add interest');
    }
  };

  const openEdit = (id: string) => {
    const current = interests?.find(i => i._id === id);
    if (!current) return;
    setEditingId(id);
    setEditData({ name: current.name, isActive: current.isActive, icon: null });
    setEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      await updateMutation.mutateAsync({
        id: editingId,
        data: {
          name: editData.name,
          isActive: String(editData.isActive),
          icon: editData.icon ?? undefined,
        },
      });
      setEditOpen(false);
      setEditingId(null);
      alert('Interest updated');
    } catch (error) {
      console.error('Error updating interest', error);
      alert('Failed to update interest');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this interest?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      alert('Interest deleted');
    } catch (error) {
      console.error('Delete interest failed', error);
      alert('Failed to delete interest');
    }
  };

  const renderIcon = (interest: any) => {
    if (interest.icon) {
      if (typeof interest.icon === 'string') {
        const src = new URL(interest.icon, api.defaults.baseURL).toString();
        return (
          <img
            src={src}
            alt={interest.name}
            className="w-6 h-6 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.removeAttribute('style');
            }}
          />
        );
      } else if (interest.icon instanceof File) {
        const url = URL.createObjectURL(interest.icon);
        return <img src={url} alt={interest.name} className="w-6 h-6 object-contain" />;
      }
    }
    return <Image className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Interests</h1>
            <p className="text-gray-600 mt-1">{stats.total} interests total</p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Interest
          </button>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <span className="text-blue-600 font-medium">{stats.total} Total</span>
          <span className="text-green-600 font-medium">{stats.active} Active</span>
          <span className="text-gray-600 font-medium">{stats.inactive} Inactive</span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Interests</h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search interests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
                  />
                </div>
                <select
                  value={filterActive}
                  onChange={(e) => setFilterActive(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Loading...</span>
              </div>
            ) : !filteredInterests.length ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {interests?.length === 0 ? 'No interests created yet.' : 'No interests match your search.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredInterests.map((interest) => (
                  <div key={interest._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {renderIcon(interest)}
                        <Image className="w-5 h-5 text-gray-400 hidden" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{interest.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {interest.isActive ? (
                            <>
                              <Eye className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-green-600">Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-500">Inactive</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(interest._id)}
                        disabled={isBusy}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(interest._id)}
                        disabled={isBusy}
                        className="px-3 py-1 text-sm border border-red-200 rounded-lg hover:bg-red-50 text-red-600 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Interest</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Name *</label>
                <input
                  type="text"
                  value={addData.name}
                  onChange={(e) => setAddData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SVG Icon *</label>
                <input
                  type="file"
                  accept=".svg, image/svg+xml, image/*"
                  onChange={(e) => setAddData(prev => ({ ...prev, icon: e.target.files?.[0] || null }))}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700"
                  required
                />
              </div>
              <DialogFooter className="flex gap-2">
                <button type="button" onClick={() => setAddOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50">
                  {createMutation.isPending ? 'Adding...' : 'Add Interest'}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Interest</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editData.isActive}
                  onChange={(e) => setEditData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4"
                />
                <label className="text-sm text-gray-700">Active</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Replace Icon (optional)</label>
                <input
                  type="file"
                  accept=".svg, image/svg+xml, image/*"
                  onChange={(e) => setEditData(prev => ({ ...prev, icon: e.target.files?.[0] || null }))}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700"
                />
              </div>
              <DialogFooter className="flex gap-2">
                <button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={updateMutation.isPending} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};