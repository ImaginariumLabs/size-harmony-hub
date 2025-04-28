# APIwidget Troubleshooting Guide

This guide provides solutions for common issues encountered when developing and using the APIwidget application.

## Development Issues

### 1. Port Conflicts

**Symptoms:**
- Error message: "Port 5174 is already in use"
- Development server fails to start
- Electron app shows blank screen

**Solutions:**
1. Change the port in `vite.config.ts`:
   ```ts
   server: {
     port: 5175, // Change to an available port
     strictPort: false, // Allow fallback to another port
   }
   ```

2. Update port references in `electron/main.js`:
   ```js
   mainWindow.loadURL('http://localhost:5175');
   ```

3. Kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5174
   taskkill /F /PID <PID>
   
   # macOS/Linux
   lsof -i :5174
   kill -9 <PID>
   ```

### 2. Black Screen in Electron

**Symptoms:**
- Electron window shows black screen
- No errors in console
- Web version works fine

**Solutions:**
1. Check port configuration in `vite.config.ts` and `electron/main.js`

2. Ensure CSS is properly imported in `main.tsx`:
   ```tsx
   import './index.css';
   import './styles/electron.css';
   ```

3. Add Electron-specific styles:
   ```css
   /* src/styles/electron.css */
   html, body, #root {
     height: 100%;
     width: 100%;
     margin: 0;
     padding: 0;
     overflow: hidden;
   }
   ```

4. Check webPreferences in `electron/main.js`:
   ```js
   webPreferences: {
     nodeIntegration: false,
     contextIsolation: true,
     preload: path.join(__dirname, 'preload.js')
   }
   ```

5. Verify the correct HTML file is being loaded:
   ```js
   if (process.env.NODE_ENV === 'development') {
     mainWindow.loadURL('http://localhost:5175');
   } else {
     mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
   }
   ```

### 3. Electron API Not Available

**Symptoms:**
- Error: "Cannot read properties of undefined (reading 'electronAPI')"
- Electron features don't work
- No communication between renderer and main process

**Solutions:**
1. Check preload script in `electron/preload.js`:
   ```js
   contextBridge.exposeInMainWorld('electronAPI', {
     // API methods
   });
   ```

2. Ensure preload script is correctly referenced in `electron/main.js`:
   ```js
   webPreferences: {
     preload: path.join(__dirname, 'preload.js')
   }
   ```

3. Add proper type definitions in `src/types/electron.d.ts`:
   ```ts
   interface Window {
     electronAPI?: {
       toggleWidgetVisibility: () => Promise<boolean>;
       // Other API methods
     };
   }
   ```

4. Use proper detection in code:
   ```ts
   const isElectron = () => {
     return window.electronAPI !== undefined;
   };
   
   // Usage with fallback
   const toggleWidget = async () => {
     if (window.electronAPI) {
       return window.electronAPI.toggleWidgetVisibility();
     } else {
       // Web fallback
       return Promise.resolve(true);
     }
   };
   ```

### 4. CSS Not Applied Correctly

**Symptoms:**
- Styles missing or inconsistent
- Layout issues
- Elements not positioned correctly

**Solutions:**
1. Check CSS import order in `main.tsx` and `widget.tsx`:
   ```tsx
   // Import order matters
   import './index.css';
   import './styles/global.css';
   import './styles/electron.css';
   ```

2. Verify CSS specificity:
   ```css
   /* More specific selector */
   .electron-app .content-area {
     height: calc(100vh - 64px);
     overflow-y: auto;
   }
   ```

3. Add CSS debugging:
   ```css
   /* Temporary for debugging */
   * {
     outline: 1px solid red;
   }
   ```

4. Check for conflicting styles:
   ```css
   /* Override conflicting styles */
   body {
     display: block !important;
     margin: 0 !important;
   }
   ```

### 5. TypeScript Errors

**Symptoms:**
- Build fails with TypeScript errors
- IDE shows red squiggly lines
- Type errors in console

**Solutions:**
1. Update type definitions:
   ```ts
   // src/types/electron.d.ts
   interface Window {
     electronAPI?: ElectronAPI;
   }
   
   interface ElectronAPI {
     toggleWidgetVisibility: () => Promise<boolean>;
     // Add other methods
   }
   ```

2. Fix non-null assertions:
   ```tsx
   // Instead of this:
   const root = document.getElementById('root')!;
   
   // Do this:
   const root = document.getElementById('root');
   if (root) {
     // Use root
   }
   ```

3. Add proper component typing:
   ```tsx
   interface Props {
     title?: string;
     onClose?: () => void;
   }
   
   const Component: React.FC<Props> = ({ title = 'Default', onClose }) => {
     // Component code
   };
   ```

4. Check tsconfig.json settings:
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "jsx": "react-jsx",
       "esModuleInterop": true
     }
   }
   ```

## Runtime Issues

### 1. Widget Not Draggable

**Symptoms:**
- Widget doesn't move when dragged
- Dragging starts but widget jumps to incorrect position
- Dragging works in web but not in Electron

**Solutions:**
1. Check CSS for draggable elements:
   ```css
   .glass-widget-header {
     -webkit-app-region: drag;
     cursor: grab;
   }
   
   .glass-widget-header .glass-widget-controls {
     -webkit-app-region: no-drag;
   }
   ```

2. Verify event handlers:
   ```tsx
   const handleMouseDown = (e: React.MouseEvent) => {
     // Ignore if clicking on interactive elements
     if (e.target instanceof HTMLElement &&
         (e.target.className.includes('button') ||
          e.target.className.includes('control'))) {
       return;
     }
     
     setIsDragging(true);
     setDragOffset({
       x: e.clientX - position.x,
       y: e.clientY - position.y
     });
   };
   ```

3. Add logging for debugging:
   ```tsx
   console.log('Drag start:', {
     clientX: e.clientX,
     clientY: e.clientY,
     position,
     offset: {
       x: e.clientX - position.x,
       y: e.clientY - position.y
     }
   });
   ```

### 2. Widget Position Not Saved

**Symptoms:**
- Widget position resets on app restart
- Position saved in web but not in Electron
- Position saved but not restored correctly

**Solutions:**
1. Check position saving in Electron:
   ```js
   // In electron/main.js
   widgetWindow.on('moved', () => {
     const position = widgetWindow.getPosition();
     store.set('widget.position', position);
   });
   ```

2. Verify position loading:
   ```js
   // Get saved position or use default
   const savedPosition = store.get('widget.position', defaultPosition);
   
   // Create widget window with position
   widgetWindow = new BrowserWindow({
     x: savedPosition[0],
     y: savedPosition[1],
     // Other options
   });
   ```

3. Add fallback for web environment:
   ```ts
   // In src/services/settingsService.ts
   export const savePosition = (position: { x: number, y: number }) => {
     if (window.electronAPI) {
       return window.electronAPI.setSetting('widget.position', position);
     } else {
       localStorage.setItem('widget.position', JSON.stringify(position));
       return Promise.resolve(true);
     }
   };
   ```

### 3. Performance Issues

**Symptoms:**
- UI feels sluggish
- High CPU usage
- Slow animations
- Memory leaks

**Solutions:**
1. Use React.memo for pure components:
   ```tsx
   const WidgetDisplay = React.memo(({ cost, change }: Props) => {
     return (
       <div className="widget-display">
         <div className="cost-value">${cost.toFixed(2)}</div>
         <div className="cost-change">{change}%</div>
       </div>
     );
   });
   ```

2. Optimize useEffect dependencies:
   ```tsx
   // Instead of this:
   useEffect(() => {
     // Effect code
   }, [prop1, prop2, prop3, prop4, prop5]);
   
   // Do this:
   const memoizedValue = useMemo(() => {
     return { prop1, prop2 };
   }, [prop1, prop2]);
   
   useEffect(() => {
     // Effect code
   }, [memoizedValue, prop3]);
   ```

3. Debounce frequent updates:
   ```tsx
   const debouncedSavePosition = useCallback(
     debounce((position) => {
       saveSettings({ position });
     }, 200),
     []
   );
   ```

4. Use proper cleanup in useEffect:
   ```tsx
   useEffect(() => {
     const interval = setInterval(() => {
       fetchData();
     }, 30000);
     
     return () => clearInterval(interval);
   }, [fetchData]);
   ```

### 4. API Integration Issues

**Symptoms:**
- No data displayed
- Error messages in console
- Incorrect data format
- Authentication failures

**Solutions:**
1. Check API key management:
   ```tsx
   const getApiKey = async (provider: string) => {
     if (window.electronAPI) {
       return window.electronAPI.getApiKey(provider);
     } else {
       return localStorage.getItem(`apiKey_${provider}`);
     }
   };
   ```

2. Add proper error handling:
   ```tsx
   try {
     const data = await getApiCost(provider);
     setApiData(data);
   } catch (error) {
     console.error('Error fetching API data:', error);
     setError('Failed to fetch API data. Please try again.');
     
     // Fallback to mock data
     setApiData(getMockData(provider));
   }
   ```

3. Verify data transformation:
   ```tsx
   const transformApiData = (rawData) => {
     return {
       cost: parseFloat(rawData.total_cost || '0'),
       change: parseFloat(rawData.change_percentage || '0'),
       isIncrease: rawData.change_type === 'increase'
     };
   };
   ```

4. Add request/response logging:
   ```tsx
   console.log('API Request:', {
     provider,
     endpoint,
     headers
   });
   
   console.log('API Response:', response);
   ```

## Build and Deployment Issues

### 1. Build Failures

**Symptoms:**
- Build process fails
- Error messages during build
- Incomplete build output

**Solutions:**
1. Check build configuration in `vite.config.ts`:
   ```ts
   build: {
     rollupOptions: {
       input: {
         main: resolve(__dirname, 'index.html'),
         widget: resolve(__dirname, 'widget.html')
       }
     }
   }
   ```

2. Verify dependencies in `package.json`:
   ```json
   "dependencies": {
     "react": "^19.0.0",
     "react-dom": "^19.0.0"
   },
   "devDependencies": {
     "electron": "^29.4.6",
     "vite": "^6.3.1"
   }
   ```

3. Clean build artifacts and node_modules:
   ```bash
   rm -rf dist node_modules
   npm cache clean --force
   npm install
   ```

4. Check for TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

### 2. Packaging Issues

**Symptoms:**
- Electron app packaging fails
- Missing files in packaged app
- App crashes on startup after packaging

**Solutions:**
1. Check electron-builder configuration:
   ```json
   "build": {
     "appId": "com.apiwidget.app",
     "files": [
       "dist/**/*",
       "electron/**/*"
     ],
     "directories": {
       "buildResources": "assets",
       "output": "release"
     }
   }
   ```

2. Verify file paths in packaged app:
   ```js
   // Use path.join for cross-platform compatibility
   const indexPath = path.join(__dirname, '../dist/index.html');
   ```

3. Add extra logging for packaged app:
   ```js
   console.log('App starting in production mode');
   console.log('Current directory:', process.cwd());
   console.log('__dirname:', __dirname);
   console.log('Looking for index.html at:', path.join(__dirname, '../dist/index.html'));
   ```

4. Check for asar issues:
   ```json
   "build": {
     "asar": false
   }
   ```

## Conclusion

This troubleshooting guide covers the most common issues encountered when developing and using the APIwidget application. If you encounter an issue not covered in this guide, please report it on the project's GitHub repository.

For more detailed information, refer to the following resources:
- [Electron Documentation](https://www.electronjs.org/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
