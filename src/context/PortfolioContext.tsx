import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
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

interface PortfolioContextType {
  // State
  portfolio: PortfolioItem[];
  categories: CategoryItem[];
  bookings: BookingItem[];
  testimonials: TestimonialItem[];
  messages: MessageItem[];
  services: ServiceItem[];
  websiteContent: WebsiteContent;
  
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
  updateBookingStatus: (id: string, status: BookingItem['status']) => void;
  deleteBooking: (id: string) => void;
  
  // Testimonials
  addTestimonial: (test: Omit<TestimonialItem, 'id' | 'createdAt'>) => void;
  deleteTestimonial: (id: string) => void;
  
  // Messages
  addMessage: (msg: Omit<MessageItem, 'id' | 'date' | 'status'>) => void;
  updateMessageStatus: (id: string, status: MessageItem['status']) => void;
  deleteMessage: (id: string) => void;
  
  // Content
  updateWebsiteContent: (content: Partial<WebsiteContent>) => void;
  
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

  // Firestore connection validation on startup
  useEffect(() => {
    const testFirestore = async () => {
      try {
        await getDocFromServer(doc(db, 'content', 'main'));
      } catch (err) {
        if (err instanceof Error && err.message.includes('offline')) {
          console.warn('Firestore is currently offline or connecting...');
        }
      }
    };
    testFirestore();
  }, []);

  // Real-time Firestore sync
  useEffect(() => {
    setIsSyncing(true);

    // 1. Sync Projects
    const unsubProjects = onSnapshot(
      collection(db, 'projects'),
      async (snapshot) => {
        if (snapshot.empty) {
          // Seed initial projects into Firestore if empty
          for (const item of INITIAL_PORTFOLIO) {
            try {
              await setDoc(doc(db, 'projects', item.id), item);
            } catch (e) {
              console.warn('Seeding project failed:', e);
            }
          }
        } else {
          const items: PortfolioItem[] = snapshot.docs.map((d) => d.data() as PortfolioItem);
          // Sort by updatedDate or createdDate descending
          items.sort((a, b) => new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime());
          setPortfolio(items);
        }
        setIsSyncing(false);
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'projects')
    );

    // 2. Sync Categories
    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      async (snapshot) => {
        if (snapshot.empty) {
          for (const cat of INITIAL_CATEGORIES) {
            try {
              await setDoc(doc(db, 'categories', cat.id), cat);
            } catch (e) {
              console.warn('Seeding category failed:', e);
            }
          }
        } else {
          const items: CategoryItem[] = snapshot.docs.map((d) => d.data() as CategoryItem);
          items.sort((a, b) => (a.order || 0) - (b.order || 0));
          setCategories(items);
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'categories')
    );

    // 3. Sync Bookings (Real-time client bookings across all devices!)
    const unsubBookings = onSnapshot(
      collection(db, 'bookings'),
      async (snapshot) => {
        if (snapshot.empty) {
          for (const b of INITIAL_BOOKINGS) {
            try {
              await setDoc(doc(db, 'bookings', b.id), b);
            } catch (e) {
              console.warn('Seeding booking failed:', e);
            }
          }
        } else {
          const items: BookingItem[] = snapshot.docs.map((d) => d.data() as BookingItem);
          items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setBookings(items);
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'bookings')
    );

    // 4. Sync Messages
    const unsubMessages = onSnapshot(
      collection(db, 'messages'),
      async (snapshot) => {
        if (snapshot.empty) {
          for (const m of INITIAL_MESSAGES) {
            try {
              await setDoc(doc(db, 'messages', m.id), m);
            } catch (e) {
              console.warn('Seeding message failed:', e);
            }
          }
        } else {
          const items: MessageItem[] = snapshot.docs.map((d) => d.data() as MessageItem);
          items.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
          setMessages(items);
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'messages')
    );

    // 5. Sync Testimonials
    const unsubTestimonials = onSnapshot(
      collection(db, 'testimonials'),
      async (snapshot) => {
        if (snapshot.empty) {
          for (const t of INITIAL_TESTIMONIALS) {
            try {
              await setDoc(doc(db, 'testimonials', t.id), t);
            } catch (e) {
              console.warn('Seeding testimonial failed:', e);
            }
          }
        } else {
          const items: TestimonialItem[] = snapshot.docs.map((d) => d.data() as TestimonialItem);
          setTestimonials(items);
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'testimonials')
    );

    // 6. Sync Website Content
    const unsubContent = onSnapshot(
      doc(db, 'content', 'main'),
      async (docSnap) => {
        if (!docSnap.exists()) {
          try {
            await setDoc(doc(db, 'content', 'main'), INITIAL_WEBSITE_CONTENT);
          } catch (e) {
            console.warn('Seeding content failed:', e);
          }
        } else {
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

  // CRUD Portfolio (Real-time Firestore persistence)
  const addProject = async (projectData: Omit<PortfolioItem, 'id' | 'createdDate' | 'updatedDate' | 'views' | 'likes'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newProject: PortfolioItem = {
      ...projectData,
      id: 'proj-' + Date.now(),
      createdDate: today,
      updatedDate: today,
      views: 1,
      likes: 0
    };

    setPortfolio((prev) => [newProject, ...prev]);

    try {
      await setDoc(doc(db, 'projects', newProject.id), newProject);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `projects/${newProject.id}`);
    }

    // Ensure category exists
    if (projectData.category) {
      const exists = categories.some(c => c.name.toLowerCase() === projectData.category.toLowerCase());
      if (!exists) {
        addCategory(projectData.category);
      }
    }
  };

  const updateProject = async (id: string, projectData: Partial<PortfolioItem>) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedFields = { ...projectData, updatedDate: today };

    setPortfolio((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );

    try {
      await updateDoc(doc(db, 'projects', id), updatedFields);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${id}`);
    }
  };

  const deleteProject = async (id: string) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
    if (selectedProjectForModal?.id === id) setSelectedProjectForModal(null);

    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
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
      status: 'draft'
    };

    setPortfolio((prev) => [copy, ...prev]);

    try {
      await setDoc(doc(db, 'projects', copy.id), copy);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `projects/${copy.id}`);
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

    setCategories((prev) => [...prev, newCat]);

    try {
      await setDoc(doc(db, 'categories', newCat.id), newCat);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `categories/${newCat.id}`);
    }
  };

  const updateCategory = async (id: string, categoryName: string) => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    const updated = { name: trimmed, slug: trimmed.toLowerCase().replace(/\s+/g, '-') };

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

  // Bookings (Saves directly to Firestore for multi-device live sync!)
  const addBooking = async (bookingData: Omit<BookingItem, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: BookingItem = {
      ...bookingData,
      id: 'book-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setBookings((prev) => [newBooking, ...prev]);

    try {
      await setDoc(doc(db, 'bookings', newBooking.id), newBooking);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `bookings/${newBooking.id}`);
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

  const deleteBooking = async (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));

    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `bookings/${id}`);
    }
  };

  // Testimonials
  const addTestimonial = async (testData: Omit<TestimonialItem, 'id' | 'createdAt'>) => {
    const newTest: TestimonialItem = {
      ...testData,
      id: 'test-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTestimonials((prev) => [newTest, ...prev]);

    try {
      await setDoc(doc(db, 'testimonials', newTest.id), newTest);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `testimonials/${newTest.id}`);
    }
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `testimonials/${id}`);
    }
  };

  // Messages
  const addMessage = async (msgData: Omit<MessageItem, 'id' | 'date' | 'status'>) => {
    const newMsg: MessageItem = {
      ...msgData,
      id: 'msg-' + Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'unread'
    };

    setMessages((prev) => [newMsg, ...prev]);

    try {
      await setDoc(doc(db, 'messages', newMsg.id), newMsg);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `messages/${newMsg.id}`);
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

  const deleteMessage = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));

    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `messages/${id}`);
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
        updateBookingStatus,
        deleteBooking,
        addTestimonial,
        deleteTestimonial,
        addMessage,
        updateMessageStatus,
        deleteMessage,
        updateWebsiteContent,
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
