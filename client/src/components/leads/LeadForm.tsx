import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Lead, CreateLeadDto, UpdateLeadDto, LeadStatus, LeadSource } from '@/types';

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeadDto | UpdateLeadDto) => void;
  isLoading: boolean;
  editLead?: Lead | null;
}

export default function LeadForm({ isOpen, onClose, onSubmit, isLoading, editLead }: LeadFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateLeadDto>();

  useEffect(() => {
    if (editLead) {
      reset({ name: editLead.name, email: editLead.email, status: editLead.status, source: editLead.source, notes: editLead.notes ?? '' });
    } else {
      reset({ name: '', email: '', status: LeadStatus.NEW, source: LeadSource.WEBSITE, notes: '' });
    }
  }, [editLead, isOpen, reset]);

  const handleClose = () => { reset(); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editLead ? 'Edit Lead' : 'Add New Lead'}>
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text2)' }}>Full Name *</label>
          <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
            placeholder="e.g. Rahul Sharma" className="input-field" />
          {errors.name && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text2)' }}>Email Address *</label>
          <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
            type="email" placeholder="e.g. rahul@company.com" className="input-field" />
          {errors.email && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text2)' }}>Status</label>
            <select {...register('status')} className="input-field">
              {Object.values(LeadStatus).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text2)' }}>Source *</label>
            <select {...register('source', { required: 'Source is required' })} className="input-field">
              {Object.values(LeadSource).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.source && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.source.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text2)' }}>Notes</label>
          <textarea {...register('notes')} rows={3} placeholder="Optional notes about this lead…"
            className="input-field resize-none" />
        </div>

        <div className="flex gap-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <button type="button" onClick={handleClose} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button type="submit" disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
            style={{ background: 'var(--accent)' }}>
            {isLoading ? <><Loader2 size={14} className="animate-spin" />{editLead ? 'Updating…' : 'Creating…'}</> : editLead ? 'Update Lead' : 'Create Lead'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
