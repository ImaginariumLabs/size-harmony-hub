import React, { useState, useEffect } from 'react';
import '../../styles/components/widgets/FloatingWidget.css';
import { getApiCost, isElectron } from '../../services/electronService';

const FloatingWidget: React.FC = () => {
  const [cost, setCost] = useState(24.56);
  const [change, setChange] = useState(1.2);
  const [isIncrease, setIsIncrease] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Fetch data from Electron or use mock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getApiCost();
        setCost(data.total);
        setChange(data.change);
        setIsIncrease(data.changeType === 'increase');
      } catch (error) {
        console.error('Error fetching API cost data:', error);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for updates
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    // Add global mouse event listeners
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div 
      className="floating-widget"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="widget-header">
        <h1 className="widget-title">API COST (THIS MONTH)</h1>
        <div className="widget-controls">
          <button
            className="widget-button expand"
            onClick={() => {
              if (isElectron()) {
                window.electronAPI.toggleMainWindow();
              }
            }}
          >
            +
          </button>
          <button
            className="widget-button close"
            onClick={() => {
              if (isElectron()) {
                window.electronAPI.closeWidget();
              }
            }}
          >
            ×
          </button>
        </div>
      </div>
      <div className="widget-content">
        <p className="cost-value">${cost.toFixed(2)}</p>
        <p className={`cost-change ${isIncrease ? 'cost-increase' : 'cost-decrease'}`}>
          {isIncrease ? '↑' : '↓'} ${change.toFixed(2)} ({(change / cost * 100).toFixed(1)}%)
        </p>
      </div>
      <div className="widget-footer">
        Updated just now
      </div>
    </div>
  );
};

export default FloatingWidget;
