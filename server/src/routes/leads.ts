import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/leadController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/errorHandler';
import { UserRole } from '../types';

const router = Router();

// ─── All routes require authentication ────────────────────────────────────────
router.use(authenticate);

// ─── GET /api/leads/stats ─────────────────────────────────────────────────────
router.get(
  '/stats',
  authorize(UserRole.ADMIN), // only admin can see stats
  getLeadStats
);

// ─── GET /api/leads/export/csv ────────────────────────────────────────────────
router.get(
  '/export/csv',
  authorize(UserRole.ADMIN), // restrict export
  exportLeadsCSV
);

// ─── GET /api/leads ───────────────────────────────────────────────────────────
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be 1–50'),
    query('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
    query('source').optional().isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
    query('sort').optional().isIn(['latest', 'oldest', 'name_asc', 'name_desc']).withMessage('Invalid sort'),
  ],
  validate,
  getLeads
);

// ─── GET /api/leads/:id ───────────────────────────────────────────────────────
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid lead ID')],
  validate,
  getLeadById
);

// ─── POST /api/leads ──────────────────────────────────────────────────────────
router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.SALES), // both can create
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be 2–100 characters'),

    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email')
      .normalizeEmail(),

    body('status')
      .optional()
      .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
      .withMessage('Invalid status'),

    body('source')
      .notEmpty()
      .withMessage('Source is required')
      .isIn(['Website', 'Instagram', 'Referral'])
      .withMessage('Invalid source'),

    body('notes')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Notes cannot exceed 1000 characters'),
  ],
  validate,
  createLead
);

// ─── PUT /api/leads/:id ───────────────────────────────────────────────────────
router.put(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.SALES), // both can update
  [
    param('id').isMongoId().withMessage('Invalid lead ID'),

    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be 2–100 characters'),

    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Invalid email')
      .normalizeEmail(),

    body('status')
      .optional()
      .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
      .withMessage('Invalid status'),

    body('source')
      .optional()
      .isIn(['Website', 'Instagram', 'Referral'])
      .withMessage('Invalid source'),

    body('notes')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Notes cannot exceed 1000 characters'),
  ],
  validate,
  updateLead
);

// ─── DELETE /api/leads/:id ────────────────────────────────────────────────────
router.delete(
  '/:id',
  authorize(UserRole.ADMIN), // only admin can delete
  [param('id').isMongoId().withMessage('Invalid lead ID')],
  validate,
  deleteLead
);

export default router;