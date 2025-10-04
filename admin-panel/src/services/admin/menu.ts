import { MenuItem, MenuFormData } from '@/types/admin';

// Mock data for development
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    title: 'Главная',
    url: '/',
    icon: 'HomeIcon',
    order: 0,
    parentId: null,
    isVisible: true,
    pageId: '1',
    isExternal: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'О нас',
    url: '/about',
    icon: 'InformationCircleIcon',
    order: 1,
    parentId: null,
    isVisible: true,
    pageId: '2',
    isExternal: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'Контакты',
    url: '/contacts',
    icon: 'PhoneIcon',
    order: 2,
    parentId: null,
    isVisible: true,
    pageId: '3',
    isExternal: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    title: 'Документы',
    url: '/documents',
    icon: 'DocumentTextIcon',
    order: 3,
    parentId: null,
    isVisible: true,
    pageId: null,
    isExternal: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    title: 'Новости',
    url: '/news',
    icon: 'NewspaperIcon',
    order: 4,
    parentId: null,
    isVisible: true,
    pageId: null,
    isExternal: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const menuService = {
  getMenuItems: async (): Promise<MenuItem[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Sort by order
    return [...mockMenuItems].sort((a, b) => a.order - b.order);
  },

  getMenuItemById: async (id: string): Promise<MenuItem> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const item = mockMenuItems.find(item => item.id === id);
    if (!item) {
      throw new Error('Пункт меню не найден');
    }
    
    return item;
  },

  createMenuItem: async (data: MenuFormData): Promise<MenuItem> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newItem: MenuItem = {
      id: (mockMenuItems.length + 1).toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockMenuItems.push(newItem);
    return newItem;
  },

  updateMenuItem: async (id: string, data: Partial<MenuFormData>): Promise<MenuItem> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const itemIndex = mockMenuItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new Error('Пункт меню не найден');
    }
    
    const updatedItem = {
      ...mockMenuItems[itemIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    mockMenuItems[itemIndex] = updatedItem;
    return updatedItem;
  },

  deleteMenuItem: async (id: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const itemIndex = mockMenuItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new Error('Пункт меню не найден');
    }
    
    mockMenuItems.splice(itemIndex, 1);
  },

  reorderMenuItems: async (items: MenuItem[]): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update order for each item
    items.forEach((item, index) => {
      const itemIndex = mockMenuItems.findIndex(mockItem => mockItem.id === item.id);
      if (itemIndex !== -1) {
        mockMenuItems[itemIndex].order = index;
        mockMenuItems[itemIndex].updatedAt = new Date().toISOString();
      }
    });
  }
};
