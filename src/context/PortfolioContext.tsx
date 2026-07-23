import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocFromServer
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  PortfolioItem,
  CategoryItem,
  BookingItem,
  TestimonialItem,
  MessageItem,
  ServiceItem,
  WebsiteContent
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PORTFOLIO,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_BOOKINGS,
  INITIAL_MESSAGES,
  INITIAL_WEBSITE_CONTENT
} from '../data/initialData';

export interface TrashedItem {
  id: string;
  title: string;
  type: 'project' | 'booking' | 'testimonial' | 'message';
  collectionName: 'projects' | 'bookings' | 'testimonials' | 'messages';
  trashedAt: string;
  originalData: PortfolioItem | BookingItem | TestimonialItem | MessageItem;
}

interface PortfolioContextType {
  // State
  portfolio: PortfolioItem[];
  categories: CategoryItem[];
  bookings: BookingItem[];
  testimonials: TestimonialItem[];
  messages: MessageItem[];
  services: ServiceItem[];
  websiteContent: WebsiteContent;
  trashItems: TrashedItem[];
  
  viewMode: 'public' | 'admin';
  isAdminAuthenticated: boolean;
  adminPassword: string;
  activeAdminTab: string;
  selectedCategory: string;
  searchQuery: string;
  isSyncing: boolean;
  
  selectedProjectForModal: PortfolioItem | null;
  selectedProjectForBooking: PortfolioItem | null;
  isBookingModalOpen: boolean;
  isAddEditModalOpen: boolean;
  projectToEdit: PortfolioItem | null;

  // Actions
  setViewMode: (mode: 'public' | 'admin') => void;
  loginAdmin: (inputPass: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (newPass: string) => void;
  setActiveAdminTab: (tab: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  
  setSelectedProjectForModal: (project: PortfolioItem | null) => void;
  openBookingModalWithProject: (project?: PortfolioItem | null) => void;
  closeBookingModal: () => void;
  
  openAddProjectModal: () => void;
  openEditProjectModal: (project: PortfolioItem) => void;
  closeAddEditModal: () => void;
  
  // CRUD Portfolio
  addProject: (project: Omit<PortfolioItem, 'id' | 'createdDate' | 'updatedDate' | 'views' | 'likes'>) => void;
  updateProject: (id: string, project: Partial<PortfolioItem>) => void;
  deleteProject: (id: string) => void;
  archiveProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  toggleLike: (id: string) => void;
  incrementViews: (id: string) => void;
  toggleFeatured: (id: string) => void;
  
  // Categories
  addCategory: (categoryName: string) => void;
  updateCategory: (id: string, categoryName: string) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (newCats: CategoryItem[]) => void;
  
  // Bookings
  addBooking: (booking: Omit<BookingItem, 'id' | 'createdAt' | 'status'>) => void;
  updateBooking: (id: string, booking: Partial<BookingItem>) => void;
  updateBookingStatus: (id: string, status: BookingItem['status']) => void;
  deleteBooking: (id: string) => void;
  
  // Testimonials
  addTestimonial: (test: Omit<TestimonialItem, 'id' | 'createdAt'>) => void;
  updateTestimonial: (id: string, test: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: string) => void;
  
  // Messages
  addMessage: (msg: Omit<MessageItem, 'id' | 'date' | 'status'>) => void;
  updateMessageStatus: (id: string, status: MessageItem['status']) => void;
  deleteMessage: (id: string) => void;
  
  // Content
  updateWebsiteContent: (content: Partial<WebsiteContent>) => void;

  // Recycle Bin / Trash Actions
  restoreFromTrash: (collectionName: 'projects' | 'bookings' | 'testimonials' | 'messages', id: string) => void;
  permanentlyDelete: (collectionName: 'projects' | 'bookings' | 'testimonials' | 'messages', id: string) => void;
  emptyTrash: () => void;
  
  // System
  resetAllData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local initial states (fallback to localStorage if present, else initialData)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem('jhvz_portfolio');
      return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO;
    } catch {
      return INITIAL_PORTFOLIO;
    }
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('jhvz_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [bookings, setBookings] = useState<BookingItem[]>(() => {
    try {
      const saved = localStorage.getItem('jhvz_bookings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    try {
      const saved = localStorage.getItem('jhvz_testimonials');
      return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  });

  const [messages, setMessages] = useState<MessageItem[]>(() => {
    try {
      const saved = localStorage.getItem('jhvz_messages');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [services] = useState<ServiceItem[]>(INITIAL_SERVICES);

  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(() => {
    try {
      const saved = localStorage.getItem('jhvz_content');
      return saved ? JSON.parse(saved) : INITIAL_WEBSITE_CONTENT;
    } catch {
      return INITIAL_WEBSITE_CONTENT;
    }
  });

  // Raw states from Firestore (includes trashed items)
  const [rawProjects, setRawProjects] = useState<PortfolioItem[]>([]);
  const [rawBookings, setRawBookings] = useState<BookingItem[]>([]);
  const [rawTestimonials, setRawTestimonials] = useState<TestimonialItem[]>([]);
  const [rawMessages, setRawMessages] = useState<MessageItem[]>([]);

  // UI state
  const [viewMode, setViewModeState] = useState<'public' | 'admin'>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('jhvz_admin_authed') === 'true';
    } catch {
      return false;
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('jhvz_admin_pass') || 'jhvz2025';
    } catch {
      return 'jhvz2025';
    }
  });

  const [activeAdminTab, setActiveAdminTab] = useState<string>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  // Modals
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<PortfolioItem | null>(null);
  const [selectedProjectForBooking, setSelectedProjectForBooking] = useState<PortfolioItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState<boolean>(false);
  const [projectToEdit, setProjectToEdit] = useState<PortfolioItem | null>(null);

  // Save state to localStorage as secondary backup
  useEffect(() => {
    try { localStorage.setItem('jhvz_portfolio', JSON.stringify(portfolio)); } catch (e) { console.warn(e); }
  }, [portfolio]);

  useEffect(() => {
    try { localStorage.setItem('jhvz_categories', JSON.stringify(categories)); } catch (e) { console.warn(e); }
  }, [categories]);

  useEffect(() => {
    try { localStorage.setItem('jhvz_bookings', JSON.stringify(bookings)); } catch (e) { console.warn(e); }
  }, [bookings]);

  useEffect(() => {
    try { localStorage.setItem('jhvz_testimonials', JSON.stringify(testimonials)); } catch (e) { console.warn(e); }
  }, [testimonials]);

  useEffect(() => {
    try { localStorage.setItem('jhvz_messages', JSON.stringify(messages)); } catch (e) { console.warn(e); }
  }, [messages]);

  useEffect(() => {
    try { localStorage.setItem('jhvz_content', JSON.stringify(websiteContent)); } catch (e) { console.warn(e); }
  }, [websiteContent]);

  // Firestore connection validation & system initialization check
  useEffect(() => {
    const initDatabaseSystem = async () => {
      try {
        const sysDocRef = doc(db, 'metadata', 'system');
        const sysDocSnap = await getDoc(sysDocRef);

        if (!sysDocSnap.exists()) {
          console.log('Initializing database seed records in Firestore for the first time...');
          
          // Seed Projects
          for (const item of INITIAL_PORTFOLIO) {
            await setDoc(doc(db, 'projects', item.id), item);
          }
          // Seed Categories
          for (const cat of INITIAL_CATEGORIES) {
            await setDoc(doc(db, 'categories', cat.id), cat);
          }
          // Seed Bookings
          for (const b of INITIAL_BOOKINGS) {
            await setDoc(doc(db, 'bookings', b.id), b);
          }
          // Seed Messages
          for (const m of INITIAL_MESSAGES) {
            await setDoc(doc(db, 'messages', m.id), m);
          }
          // Seed Testimonials
          for (const t of INITIAL_TESTIMONIALS) {
            await setDoc(doc(db, 'testimonials', t.id), t);
          }
          // Seed Content
          await setDoc(doc(db, 'content', 'main'), INITIAL_WEBSITE_CONTENT);

          // Mark database system as initialized so deleted items will NEVER be re-seeded!
          await setDoc(sysDocRef, { initialized: true, initializedAt: new Date().toISOString() });
          console.log('Database system initialized successfully.');
        }
      } catch (err) {
        console.warn('System initialization check error:', err);
      }
    };

    initDatabaseSystem();
  }, []);

  // Real-time Firestore sync listeners
  useEffect(() => {
    setIsSyncing(true);

    // 1. Sync Projects
    const unsubProjects = onSnapshot(
      collection(db, 'projects'),
      (snapshot) => {
        const items: PortfolioItem[] = snapshot.docs.map((d) => d.data() as PortfolioItem);
        items.sort((a, b) => new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime());
        setRawProjects(items);
        setPortfolio(items.filter(p => !p.isTrash));
        setIsSyncing(false);
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'projects')
    );

    // 2. Sync Categories
    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const items: CategoryItem[] = snapshot.docs.map((d) => d.data() as CategoryItem);
        items.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCategories(items);
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'categories')
    );

    // 3. Sync Bookings
    const unsubBookings = onSnapshot(
      collection(db, 'bookings'),
      (snapshot) => {
        const items: BookingItem[] = snapshot.docs.map((d) => d.data() as BookingItem);
        items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setRawBookings(items);
        setBookings(items.filter(b => !b.isTrash));
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'bookings')
    );

    // 4. Sync Messages
    const unsubMessages = onSnapshot(
      collection(db, 'messages'),
      (snapshot) => {
        const items: MessageItem[] = snapshot.docs.map((d) => d.data() as MessageItem);
        items.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        setRawMessages(items);
        setMessages(items.filter(m => !m.isTrash));
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'messages')
    );

    // 5. Sync Testimonials
    const unsubTestimonials = onSnapshot(
      collection(db, 'testimonials'),
      (snapshot) => {
        const items: TestimonialItem[] = snapshot.docs.map((d) => d.data() as TestimonialItem);
        setRawTestimonials(items);
        setTestimonials(items.filter(t => !t.isTrash));
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'testimonials')
    );

    // 6. Sync Website Content
    const unsubContent = onSnapshot(
      doc(db, 'content', 'main'),
      (docSnap) => {
        if (docSnap.exists()) {
          setWebsiteContent(docSnap.data() as WebsiteContent);
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'content/main')
    );

    return () => {
      unsubProjects();
      unsubCategories();
      unsubBookings();
      unsubMessages();
      unsubTestimonials();
      unsubContent();
    };
  }, []);

  // Compute Trash Items across all collections
  const trashItems: TrashedItem[] = [
    ...rawProjects.filter(p => p.isTrash).map(p => ({
      id: p.id,
      title: p.title,
      type: 'project' as const,
      collectionName: 'projects' as const,
      trashedAt: p.trashedAt || 'Recently',
      originalData: p
    })),
    ...rawBookings.filter(b => b.isTrash).map(b => ({
      id: b.id,
      title: `Booking: ${b.clientName} (${b.serviceType})`,
      type: 'booking' as const,
      collectionName: 'bookings' as const,
      trashedAt: b.trashedAt || 'Recently',
      originalData: b
    })),
    ...rawTestimonials.filter(t => t.isTrash).map(t => ({
      id: t.id,
      title: `Review: ${t.clientName} (${t.company})`,
      type: 'testimonial' as const,
      collectionName: 'testimonials' as const,
      trashedAt: t.trashedAt || 'Recently',
      originalData: t
    })),
    ...rawMessages.filter(m => m.isTrash).map(m => ({
      id: m.id,
      title: `Message: ${m.name} - ${m.subject}`,
      type: 'message' as const,
      collectionName: 'messages' as const,
      trashedAt: m.trashedAt || 'Recently',
      originalData: m
    }))
  ];

  // Navigation / View mode
  const setViewMode = (mode: 'public' | 'admin') => {
    setViewModeState(mode);
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (mode === 'admin') {
      if (path !== '/admin' && hash !== '#admin') {
        try {
          window.history.pushState(null, '', '/admin');
        } catch {
          window.location.hash = '#admin';
        }
      }
    } else {
      if (path === '/admin' || hash === '#admin') {
        try {
          window.history.pushState(null, '', '/');
        } catch {
          window.location.hash = '';
        }
      }
    }
  };

  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin') || hash === '#admin' || hash === '#/admin') {
        setViewModeState('admin');
      } else {
        setViewModeState('public');
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);

    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const loginAdmin = (inputPass: string): boolean => {
    if (inputPass.trim() === adminPassword) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('jhvz_admin_authed', 'true');
      setViewMode('admin');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('jhvz_admin_authed');
    setViewMode('public');
  };

  const changeAdminPassword = (newPass: string) => {
    if (!newPass.trim()) return;
    setAdminPassword(newPass.trim());
    localStorage.setItem('jhvz_admin_pass', newPass.trim());
  };

  // Modals
  const openBookingModalWithProject = (project?: PortfolioItem | null) => {
    setSelectedProjectForBooking(project || null);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedProjectForBooking(null);
  };

  const openAddProjectModal = () => {
    setProjectToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const openEditProjectModal = (project: PortfolioItem) => {
    setProjectToEdit(project);
    setIsAddEditModalOpen(true);
  };

  const closeAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setProjectToEdit(null);
  };

  // Helper to remove undefined fields before sending to Firestore
  const cleanData = <T extends Record<string, any>>(obj: T): T => {
    const clean: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] !== undefined) {
        clean[key] = obj[key];
      }
    }
    return clean as T;
  };

  // CRUD Portfolio
  const addProject = async (projectData: Omit<PortfolioItem, 'id' | 'createdDate' | 'updatedDate' | 'views' | 'likes'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newProject: PortfolioItem = {
      ...projectData,
      id: 'proj-' + Date.now(),
      createdDate: today,
      updatedDate: today,
      views: 1,
      likes: 0,
      isTrash: false
    };

    const payload = cleanData(newProject);
    setPortfolio((prev) => [payload, ...prev]);

    try {
      await setDoc(doc(db, 'projects', payload.id), payload);
    } catch (error) {
      console.error('Firestore addProject error:', error);
      handleFirestoreError(error, OperationType.WRITE, `projects/${payload.id}`);
    }

    if (projectData.category) {
      const exists = categories.some(c => c.name.toLowerCase() === projectData.category.toLowerCase());
      if (!exists) {
        addCategory(projectData.category);
      }
    }
  };

  const updateProject = async (id: string, projectData: Partial<PortfolioItem>) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedFields = cleanData({ ...projectData, updatedDate: today });

    setPortfolio((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );

    try {
      await updateDoc(doc(db, 'projects', id), updatedFields);
    } catch (error) {
      console.error('Firestore updateProject error:', error);
      handleFirestoreError(error, OperationType.UPDATE, `projects/${id}`);
    }
  };

  // Soft delete project (Move to Recycle Bin)
  const deleteProject = async (id: string) => {
    const nowStr = new Date().toLocaleString();
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
    if (selectedProjectForModal?.id === id) setSelectedProjectForModal(null);

    try {
      await updateDoc(doc(db, 'projects', id), { isTrash: true, trashedAt: nowStr });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${id}`);
    }
  };

  const archiveProject = (id: string) => {
    updateProject(id, { status: 'archived' });
  };

  const duplicateProject = async (id: string) => {
    const target = portfolio.find((item) => item.id === id);
    if (!target) return;
    const today = new Date().toISOString().split('T')[0];
    const copy: PortfolioItem = {
      ...target,
      id: 'proj-' + Date.now(),
      title: `${target.title} (Copy)`,
      createdDate: today,
      updatedDate: today,
      views: 0,
      likes: 0,
      status: 'draft',
      isTrash: false
    };

    const payload = cleanData(copy);
    setPortfolio((prev) => [payload, ...prev]);

    try {
      await setDoc(doc(db, 'projects', payload.id), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `projects/${payload.id}`);
    }
  };

  const toggleLike = async (id: string) => {
    const target = portfolio.find(p => p.id === id);
    const newLikes = (target?.likes || 0) + 1;

    setPortfolio((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: newLikes } : item))
    );

    if (selectedProjectForModal?.id === id) {
      setSelectedProjectForModal((prev) => prev ? { ...prev, likes: newLikes } : null);
    }

    try {
      await updateDoc(doc(db, 'projects', id), { likes: newLikes });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${id}`);
    }
  };

  const incrementViews = async (id: string) => {
    const target = portfolio.find(p => p.id === id);
    const newViews = (target?.views || 0) + 1;

    setPortfolio((prev) =>
      prev.map((item) => (item.id === id ? { ...item, views: newViews } : item))
    );

    try {
      await updateDoc(doc(db, 'projects', id), { views: newViews });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${id}`);
    }
  };

  const toggleFeatured = (id: string) => {
    const target = portfolio.find((item) => item.id === id);
    if (target) {
      updateProject(id, { featured: !target.featured });
    }
  };

  // Categories
  const addCategory = async (categoryName: string) => {
    if (!categoryName.trim()) return;
    const trimmed = categoryName.trim();
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) return;

    const newCat: CategoryItem = {
      id: 'cat-' + Date.now(),
      name: trimmed,
      slug: trimmed.toLowerCase().replace(/\s+/g, '-'),
      order: categories.length + 1
    };

    const payload = cleanData(newCat);
    setCategories((prev) => [...prev, payload]);

    try {
      await setDoc(doc(db, 'categories', payload.id), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `categories/${payload.id}`);
    }
  };

  const updateCategory = async (id: string, categoryName: string) => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    const updated = cleanData({ name: trimmed, slug: trimmed.toLowerCase().replace(/\s+/g, '-') });

    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updated } : cat))
    );

    try {
      await updateDoc(doc(db, 'categories', id), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `categories/${id}`);
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));

    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    }
  };

  const reorderCategories = (newCats: CategoryItem[]) => {
    setCategories(newCats);
    newCats.forEach(async (cat, idx) => {
      try {
        await updateDoc(doc(db, 'categories', cat.id), { order: idx + 1 });
      } catch (e) {
        console.warn('Reorder failed for cat:', cat.id, e);
      }
    });
  };

  // Bookings
  const addBooking = async (bookingData: Omit<BookingItem, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: BookingItem = {
      ...bookingData,
      id: 'book-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isTrash: false
    };

    const payload = cleanData(newBooking);
    setBookings((prev) => [payload, ...prev]);

    try {
      await setDoc(doc(db, 'bookings', payload.id), payload);
      console.log('✅ Booking successfully saved to Firestore:', payload.id);
    } catch (error) {
      console.error('❌ Error saving booking to Firestore:', error);
      handleFirestoreError(error, OperationType.WRITE, `bookings/${payload.id}`);
    }
  };

  const updateBooking = async (id: string, bookingData: Partial<BookingItem>) => {
    const payload = cleanData(bookingData);
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...payload } : b))
    );

    try {
      await updateDoc(doc(db, 'bookings', id), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
    }
  };

  const updateBookingStatus = async (id: string, status: BookingItem['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );

    try {
      await updateDoc(doc(db, 'bookings', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
    }
  };

  // Soft delete booking (Move to Recycle Bin)
  const deleteBooking = async (id: string) => {
    const nowStr = new Date().toLocaleString();
    setBookings((prev) => prev.filter((b) => b.id !== id));

    try {
      await updateDoc(doc(db, 'bookings', id), { isTrash: true, trashedAt: nowStr });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
    }
  };

  // Testimonials
  const addTestimonial = async (testData: Omit<TestimonialItem, 'id' | 'createdAt'>) => {
    const newTest: TestimonialItem = {
      ...testData,
      id: 'test-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      isTrash: false
    };

    const payload = cleanData(newTest);
    setTestimonials((prev) => [payload, ...prev]);

    try {
      await setDoc(doc(db, 'testimonials', payload.id), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `testimonials/${payload.id}`);
    }
  };

  const updateTestimonial = async (id: string, testData: Partial<TestimonialItem>) => {
    const payload = cleanData(testData);
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...payload } : t))
    );

    try {
      await updateDoc(doc(db, 'testimonials', id), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `testimonials/${id}`);
    }
  };

  // Soft delete testimonial (Move to Recycle Bin)
  const deleteTestimonial = async (id: string) => {
    const nowStr = new Date().toLocaleString();
    setTestimonials((prev) => prev.filter((t) => t.id !== id));

    try {
      await updateDoc(doc(db, 'testimonials', id), { isTrash: true, trashedAt: nowStr });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `testimonials/${id}`);
    }
  };

  // Messages
  const addMessage = async (msgData: Omit<MessageItem, 'id' | 'date' | 'status'>) => {
    const newMsg: MessageItem = {
      ...msgData,
      id: 'msg-' + Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'unread',
      isTrash: false
    };

    const payload = cleanData(newMsg);
    setMessages((prev) => [payload, ...prev]);

    try {
      await setDoc(doc(db, 'messages', payload.id), payload);
      console.log('✅ Message successfully saved to Firestore:', payload.id);
    } catch (error) {
      console.error('❌ Error saving message to Firestore:', error);
      handleFirestoreError(error, OperationType.WRITE, `messages/${payload.id}`);
    }
  };

  const updateMessageStatus = async (id: string, status: MessageItem['status']) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );

    try {
      await updateDoc(doc(db, 'messages', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `messages/${id}`);
    }
  };

  // Soft delete message (Move to Recycle Bin)
  const deleteMessage = async (id: string) => {
    const nowStr = new Date().toLocaleString();
    setMessages((prev) => prev.filter((m) => m.id !== id));

    try {
      await updateDoc(doc(db, 'messages', id), { isTrash: true, trashedAt: nowStr });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `messages/${id}`);
    }
  };

  // Website Content
  const updateWebsiteContent = async (contentData: Partial<WebsiteContent>) => {
    const updated = { ...websiteContent, ...contentData };
    setWebsiteContent(updated);

    try {
      await setDoc(doc(db, 'content', 'main'), updated, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'content/main');
    }
  };

  // Recycle Bin Actions
  const restoreFromTrash = async (collectionName: 'projects' | 'bookings' | 'testimonials' | 'messages', id: string) => {
    try {
      await updateDoc(doc(db, collectionName, id), { isTrash: false, trashedAt: null });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${id}`);
    }
  };

  const permanentlyDelete = async (collectionName: 'projects' | 'bookings' | 'testimonials' | 'messages', id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
    }
  };

  const emptyTrash = async () => {
    for (const item of trashItems) {
      try {
        await deleteDoc(doc(db, item.collectionName, item.id));
      } catch (e) {
        console.warn('Error purging item:', item.id, e);
      }
    }
  };

  // Reset
  const resetAllData = () => {
    localStorage.removeItem('jhvz_portfolio');
    localStorage.removeItem('jhvz_categories');
    localStorage.removeItem('jhvz_bookings');
    localStorage.removeItem('jhvz_testimonials');
    localStorage.removeItem('jhvz_messages');
    localStorage.removeItem('jhvz_content');

    setPortfolio(INITIAL_PORTFOLIO);
    setCategories(INITIAL_CATEGORIES);
    setBookings(INITIAL_BOOKINGS);
    setTestimonials(INITIAL_TESTIMONIALS);
    setMessages(INITIAL_MESSAGES);
    setWebsiteContent(INITIAL_WEBSITE_CONTENT);
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        categories,
        bookings,
        testimonials,
        messages,
        services,
        websiteContent,
        trashItems,
        viewMode,
        isAdminAuthenticated,
        adminPassword,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        activeAdminTab,
        selectedCategory,
        searchQuery,
        isSyncing,
        selectedProjectForModal,
        selectedProjectForBooking,
        isBookingModalOpen,
        isAddEditModalOpen,
        projectToEdit,
        setViewMode,
        setActiveAdminTab,
        setSelectedCategory,
        setSearchQuery,
        setSelectedProjectForModal,
        openBookingModalWithProject,
        closeBookingModal,
        openAddProjectModal,
        openEditProjectModal,
        closeAddEditModal,
        addProject,
        updateProject,
        deleteProject,
        archiveProject,
        duplicateProject,
        toggleLike,
        incrementViews,
        toggleFeatured,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        addBooking,
        updateBooking,
        updateBookingStatus,
        deleteBooking,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addMessage,
        updateMessageStatus,
        deleteMessage,
        updateWebsiteContent,
        restoreFromTrash,
        permanentlyDelete,
        emptyTrash,
        resetAllData
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
