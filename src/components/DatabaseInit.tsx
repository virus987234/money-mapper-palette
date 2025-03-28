
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import { testConnection, initializeDatabase } from '@/services/db';

interface DatabaseInitProps {
  children: React.ReactNode;
}

const DatabaseInit: React.FC<DatabaseInitProps> = ({ children }) => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const connectToDb = async () => {
      try {
        // Test the connection
        const isConnected = await testConnection();
        
        if (isConnected) {
          // Initialize database schema
          const isInitialized = await initializeDatabase();
          
          if (isInitialized) {
            setStatus('connected');
          } else {
            setStatus('error');
            setErrorMessage('Failed to initialize database schema');
          }
        } else {
          setStatus('error');
          setErrorMessage('Failed to connect to the database');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown database error');
        console.error('Database connection error:', error);
      }
    };

    connectToDb();
  }, []);

  if (status === 'loading') {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg">Initializing database...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="h-screen w-screen flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Database Connection Error</AlertTitle>
          <AlertDescription>
            <p className="mt-2">{errorMessage}</p>
            <p className="mt-4">
              Note: This application is using a browser-compatible mock database for demonstration.
              In a production environment, you would need a backend server to handle database operations.
            </p>
            <button 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              onClick={() => window.location.reload()}
            >
              Retry Connection
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};

export default DatabaseInit;
