import { useState } from 'react';
import { Plus, Download, Users, CheckCircle, Phone, XCircle } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { useLeadFilterStore } from '@/store/leadFilterStore';
import { useAuthStore } from '@/store/authStore';
import { Lead, CreateLeadDto, UpdateLeadDto, LeadStatus } from '@/types';
import StatCard from '@/components/ui/StatCard';
import LeadFilters from '@/components/leads/LeadFilters';
import LeadsTable from '@/components/leads/LeadsTable';
import LeadForm from '@/components/leads/LeadForm';
import LeadDetail from '@/components/leads/LeadDetail';
import toast from 'react-hot-toast';

export default function LeadsPage() {
  const user = useAuthStore((s) => s.user);
  const { setPage } = useLeadFilterStore();

  const {
    leads, pagination, stats, isLoading, statsLoading,
    createLead, updateLead, deleteLead,
    isCreating, isUpdating, exportCSV,
  } = useLeads();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);

  const handleFormSubmit = (data: CreateLeadDto | UpdateLeadDto) => {
    if (editingLead) {
      updateLead({ id: editingLead._id, data: data as UpdateLeadDto });
    } else {
      createLead(data as CreateLeadDto);
    }
    setIsFormOpen(false);
    setEditingLead(null);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsFormOpen(true);
    setDetailLead(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLead(null);
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl mb-1" style={{ color: 'var(--text)' }}>
            Smart Leads Dashboard
          </h1>
          <p className="text-sm" style={{ color: 'var(--text3)' }}>
            Welcome back, {user?.name} · {user?.role}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={exportCSV} className="btn-ghost">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={() => setIsFormOpen(true)} className="btn-primary">
            <Plus size={14} /> Add Lead
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Leads" value={statsLoading ? 0 : (stats?.total ?? 0)}
          change="↑ 12% this month" icon={<Users size={16} />} color="blue"
        />
        <StatCard
          label="Qualified" value={statsLoading ? 0 : (stats?.byStatus[LeadStatus.QUALIFIED] ?? 0)}
          change="↑ 8% conversion" icon={<CheckCircle size={16} />} color="green"
        />
        <StatCard
          label="Contacted" value={statsLoading ? 0 : (stats?.byStatus[LeadStatus.CONTACTED] ?? 0)}
          change="↑ 3% this week" icon={<Phone size={16} />} color="amber"
        />
        <StatCard
          label="Lost" value={statsLoading ? 0 : (stats?.byStatus[LeadStatus.LOST] ?? 0)}
          change="↓ 2% churn rate" icon={<XCircle size={16} />} color="red"
        />
      </div>

      {/* Filters */}
      <LeadFilters />

      {/* Table section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>All Leads</span>
          {pagination && (
            <span className="text-xs" style={{ color: 'var(--text3)' }}>
              {pagination.totalCount} total result{pagination.totalCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <LeadsTable
          leads={leads}
          pagination={pagination}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRowClick={(lead) => setDetailLead(lead)}
          onPageChange={setPage}
        />
      </div>

      {/* Add/Edit Modal */}
      <LeadForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
        editLead={editingLead}
      />

      {/* Detail Panel */}
      <LeadDetail
        lead={detailLead}
        onClose={() => setDetailLead(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
