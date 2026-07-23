import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PortfolioItem,
  CategoryItem,
  BookingItem,
  TestimonialItem,
  MessageItem,
  ServiceItem,
  WebsiteContent,
  ProjectStatus
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
  // Load from localStorage or defaults
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('jhvz_portfolio');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PORTFOLIO;
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem('jhvz_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_CATEGORIES;
  });

  const [bookings, setBookings] = useState<BookingItem[]>(() => {
    const saved = localStorage.getItem('jhvz_bookings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_BOOKINGS;
  });

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    const saved = localStorage.getItem('jhvz_testimonials');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_TESTIMONIALS;
  });

  const [messages, setMessages] = useState<MessageItem[]>(() => {
    const saved = localStorage.getItem('jhvz_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_MESSAGES;
  });

  const [services] = useState<ServiceItem[]>(INITIAL_SERVICES);

  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(() => {
    const saved = localStorage.getItem('jhvz_content');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_WEBSITE_CONTENT;
  });

  // UI state
  const [viewMode, setViewModeState] = useState<'public' | 'admin'>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('jhvz_admin_authed') === 'true';
  });
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('jhvz_admin_pass') || 'admin123';
  });

  const [activeAdminTab, setActiveAdminTab] = useState<string>('portfolio');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedProjectForModal, setSelectedProjectForModal] = useState<PortfolioItem | null>(null);
  const [selectedProjectForBooking, setSelectedProjectForBooking] = useState<PortfolioItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState<boolean>(false);
  const [projectToEdit, setProjectToEdit] = useState<PortfolioItem | null>(null);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('jhvz_portfolio', JSON.stringify(portfolio)); }, [portfolio]);
  useEffect(() => { localStorage.setItem('jhvz_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('jhvz_bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('jhvz_testimonials', JSON.stringify(testimonials)); }, [testimonials]);
  useEffect(() => { localStorage.setItem('jhvz_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('jhvz_content', JSON.stringify(websiteContent)); }, [websiteContent]);
  useEffect(() => { localStorage.setItem('jhvz_admin_pass', adminPassword); }, [adminPassword]);

  // URL route handling for /admin
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

  // Actions
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

  // CRUD Portfolio
  const addProject = (projectData: Omit<PortfolioItem, 'id' | 'createdDate' | 'updatedDate' | 'views' | 'likes'>) => {
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

    // Ensure category exists in categories list if custom
    if (projectData.category) {
      setCategories((prevCats) => {
        const exists = prevCats.some(c => c.name.toLowerCase() === projectData.category.toLowerCase());
        if (!exists) {
          return [
            ...prevCats,
            {
              id: 'cat-' + Date.now(),
              name: projectData.category,
              slug: projectData.category.toLowerCase().replace(/\s+/g, '-'),
              order: prevCats.length + 1
            }
          ];
        }
        return prevCats;
      });
    }
  };

  const updateProject = (id: string, projectData: Partial<PortfolioItem>) => {
    const today = new Date().toISOString().split('T')[0];
    setPortfolio((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...projectData, updatedDate: today }
          : item
      )
    );
  };

  const deleteProject = (id: string) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
    if (selectedProjectForModal?.id === id) setSelectedProjectForModal(null);
  };

  const archiveProject = (id: string) => {
    updateProject(id, { status: 'archived' });
  };

  const duplicateProject = (id: string) => {
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
  };

  const toggleLike = (id: string) => {
    setPortfolio((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
    if (selectedProjectForModal?.id === id) {
      setSelectedProjectForModal((prev) => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };

  const incrementViews = (id: string) => {
    setPortfolio((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, views: item.views + 1 } : item
      )
    );
  };

  const toggleFeatured = (id: string) => {
    const target = portfolio.find((item) => item.id === id);
    if (target) {
      updateProject(id, { featured: !target.featured });
    }
  };

  // Categories
  const addCategory = (categoryName: string) => {
    if (!categoryName.trim()) return;
    const trimmed = categoryName.trim();
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) return;

    setCategories((prev) => [
      ...prev,
      {
        id: 'cat-' + Date.now(),
        name: trimmed,
        slug: trimmed.toLowerCase().replace(/\s+/g, '-'),
        order: prev.length + 1
      }
    ]);
  };

  const updateCategory = (id: string, categoryName: string) => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name: trimmed, slug: trimmed.toLowerCase().replace(/\s+/g, '-') } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const reorderCategories = (newCats: CategoryItem[]) => {
    setCategories(newCats);
  };

  // Bookings
  const addBooking = (bookingData: Omit<BookingItem, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: BookingItem = {
      ...bookingData,
      id: 'book-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: BookingItem['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  // Testimonials
  const addTestimonial = (testData: Omit<TestimonialItem, 'id' | 'createdAt'>) => {
    const newTest: TestimonialItem = {
      ...testData,
      id: 'test-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTestimonials((prev) => [newTest, ...prev]);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  // Messages
  const addMessage = (msgData: Omit<MessageItem, 'id' | 'date' | 'status'>) => {
    const newMsg: MessageItem = {
      ...msgData,
      id: 'msg-' + Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'unread'
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const updateMessageStatus = (id: string, status: MessageItem['status']) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  // Content
  const updateWebsiteContent = (contentData: Partial<WebsiteContent>) => {
    setWebsiteContent((prev) => ({ ...prev, ...contentData }));
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
