/**
 * Advanced Modal and Drawer System for Component Page Template
 * Supports modals, drawers, overlays with animations and advanced features
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Maximize2, Minimize2, Move } from 'lucide-react';
import { ModalConfig, DrawerConfig } from '@/types/componentTemplate';

interface ModalSystemProps {
  modals: Record<string, ModalConfig>;
  drawers: Record<string, DrawerConfig>;
  activeModal?: string | null;
  activeDrawer?: string | null;
  onModalChange?: (modalId: string | null) => void;
  onDrawerChange?: (drawerId: string | null) => void;
  className?: string;
}

interface ModalState {
  isOpen: boolean;
  isMaximized: boolean;
  isDragging: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface DrawerState {
  isOpen: boolean;
  size: number | string;
}

const MODAL_SIZES = {
  sm: { width: 400, height: 300 },
  md: { width: 600, height: 400 },
  lg: { width: 800, height: 600 },
  xl: { width: 1000, height: 700 },
  full: { width: '90vw', height: '90vh' }
};

const DRAWER_SIZES = {
  left: { default: 320, max: '50vw' },
  right: { default: 320, max: '50vw' },
  top: { default: 240, max: '50vh' },
  bottom: { default: 240, max: '50vh' }
};

export const ModalSystem: React.FC<ModalSystemProps> = ({
  modals,
  drawers,
  activeModal,
  activeDrawer,
  onModalChange,
  onDrawerChange,
  className
}) => {
  const [modalStates, setModalStates] = useState<Record<string, ModalState>>({});
  const [drawerStates, setDrawerStates] = useState<Record<string, DrawerState>>({});
  const [dragData, setDragData] = useState<{
    isDragging: boolean;
    startX: number;
    startY: number;
    modalId: string | null;
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    modalId: null
  });

  const modalRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Initialize modal states
  useEffect(() => {
    const newStates: Record<string, ModalState> = {};
    Object.entries(modals).forEach(([id, config]) => {
      if (!modalStates[id]) {
        const size = typeof config.size === 'string' ? MODAL_SIZES[config.size] : MODAL_SIZES.md;
        newStates[id] = {
          isOpen: false,
          isMaximized: false,
          isDragging: false,
          position: { 
            x: (window.innerWidth - (size.width as number)) / 2, 
            y: (window.innerHeight - (size.height as number)) / 2 
          },
          size
        };
      }
    });
    if (Object.keys(newStates).length > 0) {
      setModalStates(prev => ({ ...prev, ...newStates }));
    }
  }, [modals, modalStates]);

  // Initialize drawer states
  useEffect(() => {
    const newStates: Record<string, DrawerState> = {};
    Object.entries(drawers).forEach(([id, config]) => {
      if (!drawerStates[id]) {
        const defaultSize = config.size || DRAWER_SIZES[config.position || 'right'].default;
        newStates[id] = {
          isOpen: false,
          size: defaultSize
        };
      }
    });
    if (Object.keys(newStates).length > 0) {
      setDrawerStates(prev => ({ ...prev, ...newStates }));
    }
  }, [drawers, drawerStates]);

  // Handle modal open/close
  const handleModalToggle = useCallback((modalId: string) => {
    setModalStates(prev => ({
      ...prev,
      [modalId]: {
        ...prev[modalId],
        isOpen: !prev[modalId]?.isOpen
      }
    }));
    onModalChange?.(modalStates[modalId]?.isOpen ? null : modalId);
  }, [modalStates, onModalChange]);

  // Handle drawer open/close
  const handleDrawerToggle = useCallback((drawerId: string) => {
    setDrawerStates(prev => ({
      ...prev,
      [drawerId]: {
        ...prev[drawerId],
        isOpen: !prev[drawerId]?.isOpen
      }
    }));
    onDrawerChange?.(drawerStates[drawerId]?.isOpen ? null : drawerId);
  }, [drawerStates, onDrawerChange]);

  // Handle modal maximize/minimize
  const handleModalMaximize = useCallback((modalId: string) => {
    setModalStates(prev => ({
      ...prev,
      [modalId]: {
        ...prev[modalId],
        isMaximized: !prev[modalId]?.isMaximized,
        position: prev[modalId]?.isMaximized 
          ? prev[modalId].position 
          : { x: 0, y: 0 },
        size: prev[modalId]?.isMaximized 
          ? prev[modalId].size 
          : { width: window.innerWidth - 40, height: window.innerHeight - 40 }
      }
    }));
  }, []);

  // Handle modal dragging
  const handleMouseDown = useCallback((e: React.MouseEvent, modalId: string) => {
    if ((e.target as HTMLElement).closest('.modal-header')) {
      setDragData({
        isDragging: true,
        startX: e.clientX - modalStates[modalId]?.position.x,
        startY: e.clientY - modalStates[modalId]?.position.y,
        modalId
      });
    }
  }, [modalStates]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragData.isDragging && dragData.modalId) {
      const newX = e.clientX - dragData.startX;
      const newY = e.clientY - dragData.startY;
      
      setModalStates(prev => ({
        ...prev,
        [dragData.modalId!]: {
          ...prev[dragData.modalId!],
          position: { x: newX, y: newY }
        }
      }));
    }
  }, [dragData]);

  const handleMouseUp = useCallback(() => {
    setDragData(prev => ({ ...prev, isDragging: false, modalId: null }));
  }, []);

  // Add event listeners for dragging
  useEffect(() => {
    if (dragData.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragData.isDragging, handleMouseMove, handleMouseUp]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModal) {
          handleModalToggle(activeModal);
        }
        if (activeDrawer) {
          handleDrawerToggle(activeDrawer);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [activeModal, activeDrawer, handleModalToggle, handleDrawerToggle]);

  // Render modal
  const renderModal = (modalId: string, config: ModalConfig) => {
    const state = modalStates[modalId];
    if (!state?.isOpen) return null;

    const modal = (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        {config.backdrop !== false && (
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => config.closable !== false && handleModalToggle(modalId)}
          />
        )}
        
        {/* Modal */}
        <div
          ref={el => modalRefs.current[modalId] = el}
          className={`relative bg-white rounded-lg shadow-2xl €{config.className || ''}`}
          style={{
            transform: `translate(€{state.position.x}px, €{state.position.y}px)`,
            width: state.size.width,
            height: state.size.height,
            maxWidth: '95vw',
            maxHeight: '95vh',
            cursor: dragData.isDragging && dragData.modalId === modalId ? 'grabbing' : 'default'
          }}
          onMouseDown={(e) => handleMouseDown(e, modalId)}
        >
          {/* Header */}
          <div className="modal-header flex items-center justify-between p-4 border-b border-slate-200 cursor-move">
            <div className="flex items-center gap-3">
              <Move className="h-4 w-4 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-900">{config.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleModalMaximize(modalId)}
                className="h-8 w-8 p-0"
              >
                {state.isMaximized ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              {config.closable !== false && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleModalToggle(modalId)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 overflow-auto" style={{ height: 'calc(100% - 120px)' }}>
            {config.content}
          </div>
          
          {/* Actions */}
          {config.actions && (
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200">
              {config.actions}
            </div>
          )}
        </div>
      </div>
    );

    return createPortal(modal, document.body);
  };

  // Render drawer
  const renderDrawer = (drawerId: string, config: DrawerConfig) => {
    const state = drawerStates[drawerId];
    if (!state?.isOpen) return null;

    const position = config.position || 'right';
    const size = state.size;
    
    const drawerStyles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 40,
      backgroundColor: 'white',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: 'transform 0.3s ease-in-out',
    };

    switch (position) {
      case 'left':
        drawerStyles.left = 0;
        drawerStyles.top = 0;
        drawerStyles.bottom = 0;
        drawerStyles.width = size;
        break;
      case 'right':
        drawerStyles.right = 0;
        drawerStyles.top = 0;
        drawerStyles.bottom = 0;
        drawerStyles.width = size;
        break;
      case 'top':
        drawerStyles.top = 0;
        drawerStyles.left = 0;
        drawerStyles.right = 0;
        drawerStyles.height = size;
        break;
      case 'bottom':
        drawerStyles.bottom = 0;
        drawerStyles.left = 0;
        drawerStyles.right = 0;
        drawerStyles.height = size;
        break;
    }

    const drawer = (
      <div className="fixed inset-0 z-40">
        {/* Overlay */}
        {config.overlay !== false && (
          <div 
            className="absolute inset-0 bg-black/25 backdrop-blur-sm"
            onClick={() => handleDrawerToggle(drawerId)}
          />
        )}
        
        {/* Drawer */}
        <div style={drawerStyles} className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-lg font-semibold text-slate-900">{config.title}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDrawerToggle(drawerId)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-4 overflow-auto">
            {config.content}
          </div>
          
          {/* Actions */}
          {config.actions && (
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50">
              {config.actions}
            </div>
          )}
        </div>
      </div>
    );

    return createPortal(drawer, document.body);
  };

  return (
    <div className={`modal-system €{className || ''}`}>
      {/* Render all modals */}
      {Object.entries(modals).map(([modalId, config]) => 
        renderModal(modalId, config)
      )}
      
      {/* Render all drawers */}
      {Object.entries(drawers).map(([drawerId, config]) => 
        renderDrawer(drawerId, config)
      )}
    </div>
  );
};

// Hook for managing modals and drawers
export const useModalSystem = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  const openModal = useCallback((modalId: string) => {
    setActiveModal(modalId);
  }, []);

  const closeModal = useCallback((modalId?: string) => {
    setActiveModal(null);
  }, []);

  const openDrawer = useCallback((drawerId: string) => {
    setActiveDrawer(drawerId);
  }, []);

  const closeDrawer = useCallback((drawerId?: string) => {
    setActiveDrawer(null);
  }, []);

  const isModalOpen = useCallback((modalId: string) => {
    return activeModal === modalId;
  }, [activeModal]);

  const isDrawerOpen = useCallback((drawerId: string) => {
    return activeDrawer === drawerId;
  }, [activeDrawer]);

  const closeAll = useCallback(() => {
    setActiveModal(null);
    setActiveDrawer(null);
  }, []);

  return {
    activeModal,
    activeDrawer,
    openModal,
    closeModal,
    openDrawer,
    closeDrawer,
    isModalOpen,
    isDrawerOpen,
    closeAll
  };
};

export default ModalSystem;