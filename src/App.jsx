import React, { useState, Suspense } from 'react';

const App = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'ModelA':
        const ModelAApp = React.lazy(() => import('./ModelA'));
        return <ModelAApp />;
      case 'ModelB':
        const ModelBApp = React.lazy(() => import('./ModelB'));
        return <ModelBApp />;
      case 'Ideal':
        const IdealApp = React.lazy(() => import('./Ideal'));
        return <IdealApp />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {activeComponent ? (
        <Suspense fallback={<div className="text-2xl">Loading...</div>}>
          <div className="h-screen w-screen">
            {renderComponent()}
          </div>
        </Suspense>
      ) : (
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold mb-8">Choose Model</h1>
          <div className="space-y-4 flex flex-col space-y-2">
            <button
              className="bg-white text-blue-500 font-semibold py-2 px-4 rounded shadow-md hover:bg-blue-100 transition"
              onClick={() => setActiveComponent('ModelA')}
            >
              Show Model A
            </button>
            <button
              className="bg-white text-blue-500 font-semibold py-2 px-4 rounded shadow-md hover:bg-blue-100 transition"
              onClick={() => setActiveComponent('ModelB')}
            >
              Show Model B
            </button>
            <button
              className="bg-white text-blue-500 font-semibold py-2 px-4 rounded shadow-md hover:bg-blue-100 transition"
              onClick={() => setActiveComponent('Ideal')}
            >
              Show Ideal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
