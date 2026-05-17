import { Response, NextFunction } from 'express';
import { FilterQuery } from 'mongoose';
import Lead from '../models/Lead';
import {
  AuthenticatedRequest,
  CreateLeadDto,
  UpdateLeadDto,
  LeadQueryParams,
  ILeadDocument,
  LeadStatus,
  LeadSource,
  SortOrder,
  UserRole,
} from '../types';
import { AppError } from '../middleware/errorHandler';

// ─── Helper: Build Sort Object ────────────────────────────────────────────────

const buildSortObject = (sort?: SortOrder): Record<string, 1 | -1> => {
  switch (sort) {
    case SortOrder.OLDEST:
      return { createdAt: 1 };
    case SortOrder.NAME_ASC:
      return { name: 1 };
    case SortOrder.NAME_DESC:
      return { name: -1 };
    case SortOrder.LATEST:
    default:
      return { createdAt: -1 };
  }
};

// ─── GET /leads ───────────────────────────────────────────────────────────────

export const getLeads = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const {
      page = '1',
      limit = '10',
      status,
      source,
      search,
      sort,
    } = req.query as LeadQueryParams;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // ─── Build Filter Query ───────────────────────────────────────────────────
    const filter: FilterQuery<ILeadDocument> = {};

    // Sales users can only see their own leads
    if (req.user.role === UserRole.SALES) {
      filter.createdBy = req.user.userId;
    }

    if (status && Object.values(LeadStatus).includes(status as LeadStatus)) {
      filter.status = status;
    }

    if (source && Object.values(LeadSource).includes(source as LeadSource)) {
      filter.source = source;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const sortObj = buildSortObject(sort as SortOrder);

    // ─── Execute Queries in Parallel ──────────────────────────────────────────
    const [leads, totalCount] = await Promise.all([
      Lead.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email role')
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /leads/:id ───────────────────────────────────────────────────────────

export const getLeadById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .lean();

    if (!lead) throw new AppError('Lead not found', 404);

    // Sales users can only view their own leads
    if (
      req.user.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user.userId
    ) {
      throw new AppError('Access denied. You can only view your own leads.', 403);
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// ─── POST /leads ──────────────────────────────────────────────────────────────

export const createLead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const { name, email, status, source, notes } = req.body as CreateLeadDto;

    const lead = await Lead.create({
      name,
      email,
      status: status ?? LeadStatus.NEW,
      source,
      notes,
      createdBy: req.user.userId,
    });

    const populated = await lead.populate('createdBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /leads/:id ───────────────────────────────────────────────────────────

export const updateLead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new AppError('Lead not found', 404);

    // Sales users can only update their own leads
    if (
      req.user.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user.userId
    ) {
      throw new AppError('Access denied. You can only update your own leads.', 403);
    }

    const updates: UpdateLeadDto = req.body;
    const allowedFields: (keyof UpdateLeadDto)[] = ['name', 'email', 'status', 'source', 'notes'];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        (lead as any)[field] = updates[field];
      }
    });

    await lead.save();
    const populated = await lead.populate('createdBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /leads/:id ────────────────────────────────────────────────────────

export const deleteLead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new AppError('Lead not found', 404);

    // Only Admin or the lead creator can delete
    if (
      req.user.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user.userId
    ) {
      throw new AppError('Access denied. You can only delete your own leads.', 403);
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /leads/export/csv ────────────────────────────────────────────────────

export const exportLeadsCSV = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const filter: FilterQuery<ILeadDocument> = {};
    if (req.user.role === UserRole.SALES) {
      filter.createdBy = req.user.userId;
    }

    const { status, source, search } = req.query as LeadQueryParams;

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const leads = await Lead.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created By', 'Created At'];
    const rows = leads.map((lead) => [
      lead.name,
      lead.email,
      lead.status,
      lead.source,
      lead.notes ?? '',
      (lead.createdBy as any)?.name ?? '',
      new Date(lead.createdAt).toLocaleDateString('en-IN'),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads_export.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// ─── GET /leads/stats ─────────────────────────────────────────────────────────

export const getLeadStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const matchStage: FilterQuery<ILeadDocument> =
      req.user.role === UserRole.SALES ? { createdBy: req.user.userId } : {};

    const stats = await Lead.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Lead.countDocuments(matchStage);

    const formatted = Object.values(LeadStatus).reduce(
      (acc, status) => {
        const found = stats.find((s) => s._id === status);
        acc[status] = found ? found.count : 0;
        return acc;
      },
      {} as Record<string, number>
    );

    res.status(200).json({
      success: true,
      data: { total, byStatus: formatted },
    });
  } catch (error) {
    next(error);
  }
};
