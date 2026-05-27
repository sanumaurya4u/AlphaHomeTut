// ==========================================
// Status Enums
// ==========================================

export const DEMO_STATUS = {
  PENDING: 'Pending',
  CONTACTED: 'Contacted',
  TUTOR_ASSIGNED: 'Tutor Assigned',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const TUTOR_STATUS = {
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
};

export const ASSIGNMENT_STATUS = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const MEMBERSHIP_STATUS = {
  ACTIVE: 'Active',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled',
};

export const NOTIFICATION_TYPES = {
  NEW_DEMO_REQUEST: 'new_demo_request',
  NEW_TUTOR: 'new_tutor',
  NEW_CONTACT: 'new_contact',
  TUTOR_VERIFIED: 'tutor_verified',
  TUTOR_ASSIGNED: 'tutor_assigned',
  MEMBERSHIP_PURCHASED: 'membership_purchased',
};

// ==========================================
// Sidebar Menu Items
// ==========================================

export const ADMIN_MENU_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/admin/dashboard' },
  { key: 'demo-requests', label: 'Demo Requests', icon: 'ClipboardList', path: '/admin/demo-requests' },
  { key: 'tutors', label: 'Tutor Registrations', icon: 'GraduationCap', path: '/admin/tutors' },
  { key: 'memberships', label: 'Membership Plans', icon: 'Crown', path: '/admin/memberships' },
  { key: 'assignments', label: 'Assigned Tutors', icon: 'UserCheck', path: '/admin/assignments' },
  { key: 'contacts', label: 'Contact Messages', icon: 'MessageSquare', path: '/admin/contacts' },
  { key: 'notifications', label: 'Notifications', icon: 'Bell', path: '/admin/notifications' },
  { key: 'payments', label: 'Payments', icon: 'CreditCard', path: '/admin/payments' },
  { key: 'settings', label: 'Settings', icon: 'Settings', path: '/admin/settings' },
];

// ==========================================
// Form Options
// ==========================================

export const CLASS_OPTIONS = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12',
];

export const SUBJECT_OPTIONS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
  'Hindi', 'Accounts', 'Economics', 'Computer Science',
  'Social Science', 'All Subjects',
];

export const QUALIFICATION_OPTIONS = [
  'B.A.', 'B.Sc.', 'B.Com.', 'B.Tech.', 'BCA', 'BBA',
  'M.A.', 'M.Sc.', 'M.Com.', 'M.Tech.', 'MCA', 'MBA',
  'B.Ed.', 'Ph.D.', 'Other',
];

export const EXPERIENCE_OPTIONS = [
  'Fresher', '6 months-1 year', '1-2 Years', '2-5 Years', '5-10 Years', '10+ Years',
];

export const TIMING_OPTIONS = [
  'Morning (6-9 AM)', 'Forenoon (9-12 PM)', 'Afternoon (12-3 PM)',
  'Evening (3-6 PM)', 'Night (6-9 PM)',
];

export const BUDGET_OPTIONS = [
  '₹1,000-2,000', '₹2,000-3,000', '₹3,000-5,000', '₹5,000-8,000', '₹8,000+',
];

export const MODE_OPTIONS = [
  { value: 'home', label: 'Home Tuition' },
  { value: 'online', label: 'Online Classes' },
  { value: 'both', label: 'Both' },
];

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export const MEMBERSHIP_PLANS = [
  {
    id: 'silver',
    name: 'Silver',
    price: 500,
    validity: '1 Year',
    features: [
      'Salary Range: ₹1,500–₹2,500/tuition',
      'Multiple Tuitions Access',
      'Guaranteed Tuition',
      'Document Verification',
      'WhatsApp & Email Support',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 1000,
    badge: 'Most Popular',
    validity: '1 Year',
    features: [
      'Salary Range: ₹3,000+/tuition',
      'Multiple Tuitions Access',
      'Guaranteed Tuition',
      'Document Verification',
      'WhatsApp & Email Support',
      'Priority Assignment',
      'High-Paying Opportunities',
      'Certificate of Appreciation',
    ],
  },
];

// ==========================================
// Pagination
// ==========================================

export const PAGE_SIZE_OPTIONS = [10, 25, 50];
export const DEFAULT_PAGE_SIZE = 10;

// ==========================================
// File Upload Limits
// ==========================================

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const ALLOWED_DOC_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

// ==========================================
// Status Colors (Tailwind classes)
// ==========================================

export const STATUS_COLORS = {
  Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  Contacted: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  'Tutor Assigned': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  Completed: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },
  Cancelled: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  Verified: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  Rejected: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  Active: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  Expired: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
};
