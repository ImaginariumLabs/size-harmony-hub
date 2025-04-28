// Enhanced widget bundle with dragging support
console.log('Loading enhanced widget bundle...');

// Create a draggable widget for testing
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('widget-root');

  // Check if the widget is already rendered by React
  if (root && root.children.length === 0) {
    console.log('Creating fallback widget...');

    // Create the widget container
    const widget = document.createElement('div');
    widget.id = 'glass-widget';
    widget.style.cssText = `
      background: rgba(30, 30, 30, 0.7);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 0;
      color: white;
      font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      width: 240px;
      height: 140px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      user-select: none;
    `;

    // Create the widget header (draggable area)
    const header = document.createElement('div');
    header.className = 'widget-header';
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      height: 24px;
      cursor: grab;
      -webkit-app-region: drag;
    `;

    // Create the widget title
    const title = document.createElement('h3');
    title.style.cssText = `
      color: rgba(255, 255, 255, 0.9);
      font-size: 11px;
      font-weight: 600;
      margin: 0;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    `;
    title.textContent = 'OpenAI API USAGE';

    // Create the widget controls
    const controls = document.createElement('div');
    controls.style.cssText = `
      display: flex;
      gap: 8px;
      -webkit-app-region: no-drag;
    `;

    // Create the status button
    const statusButton = document.createElement('button');
    statusButton.style.cssText = `
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: none;
      background: #10a37f;
      cursor: pointer;
      -webkit-app-region: no-drag;
    `;

    // Add elements to the header
    controls.appendChild(statusButton);
    header.appendChild(title);
    header.appendChild(controls);

    // Create the widget content
    const content = document.createElement('div');
    content.style.cssText = `
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-grow: 1;
    `;

    // Create the cost value
    const costValue = document.createElement('p');
    costValue.style.cssText = `
      color: white;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      text-align: center;
    `;
    costValue.textContent = '$45.28';

    // Create the cost change
    const costChange = document.createElement('p');
    costChange.style.cssText = `
      color: #4caf50;
      font-size: 14px;
      margin: 5px 0 0;
      text-align: center;
    `;
    costChange.innerHTML = '<span>↑</span> $2.15 (4.9%)';

    // Add elements to the content
    content.appendChild(costValue);
    content.appendChild(costChange);

    // Create the widget footer
    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 0 16px 12px;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.5);
      display: flex;
      justify-content: space-between;
    `;

    // Create the updated text
    const updated = document.createElement('div');
    updated.textContent = 'Updated: just now';

    // Add elements to the footer
    footer.appendChild(updated);

    // Add all sections to the widget
    widget.appendChild(header);
    widget.appendChild(content);
    widget.appendChild(footer);

    // Add the widget to the root
    root.appendChild(widget);

    // Make the widget draggable
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    header.addEventListener('mousedown', function(e) {
      isDragging = true;
      dragOffsetX = e.clientX - widget.offsetLeft;
      dragOffsetY = e.clientY - widget.offsetTop;
      document.body.style.cursor = 'grabbing';
      console.log('Drag started', { x: e.clientX, y: e.clientY, offsetX: dragOffsetX, offsetY: dragOffsetY });
    });

    document.addEventListener('mousemove', function(e) {
      if (isDragging) {
        const newX = e.clientX - dragOffsetX;
        const newY = e.clientY - dragOffsetY;
        widget.style.left = newX + 'px';
        widget.style.top = newY + 'px';
        console.log('Dragging', { x: newX, y: newY });
      }
    });

    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = '';
        console.log('Drag ended', { x: widget.offsetLeft, y: widget.offsetTop });
      }
    });

    console.log('Fallback widget created successfully');
  } else {
    console.log('Widget already rendered, skipping fallback');
  }
});
