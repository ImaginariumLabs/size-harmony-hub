// This is a placeholder file that will be replaced by the build process
// In development mode, Vite will serve the widget.tsx file directly
console.log('Loading widget bundle...');

// Create a simple widget for testing
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('widget-root');
  
  if (root) {
    root.innerHTML = `
      <div style="
        background: rgba(30, 30, 30, 0.7);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 15px;
        color: white;
        font-family: Arial, sans-serif;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; font-size: 14px;">OpenAI API USAGE</h3>
          <div style="display: flex; gap: 8px;">
            <button style="
              width: 16px;
              height: 16px;
              border-radius: 50%;
              border: none;
              background: #10a37f;
              cursor: pointer;
            "></button>
          </div>
        </div>
        
        <div style="text-align: center; margin: 15px 0;">
          <p style="font-size: 24px; font-weight: bold; margin: 0;">$45.28</p>
          <p style="color: #4caf50; margin: 5px 0;">
            <span>↑</span> $2.15 (4.9%)
          </p>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 12px; opacity: 0.7;">Updated: just now</div>
          <div style="
            width: 16px;
            height: 16px;
            cursor: nwse-resize;
            position: relative;
          ">
            <div style="
              position: absolute;
              right: 4px;
              bottom: 4px;
              width: 6px;
              height: 6px;
              border-right: 2px solid rgba(255, 255, 255, 0.3);
              border-bottom: 2px solid rgba(255, 255, 255, 0.3);
            "></div>
          </div>
        </div>
      </div>
    `;
  }
});
