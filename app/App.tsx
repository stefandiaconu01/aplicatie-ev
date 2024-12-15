import { AuthProvider } from './context/AuthContext';
import { Slot } from 'expo-router';

export default function App() {
  return (
    <AuthProvider>
      <Slot /> {/* Manages navigation and layout */}
    </AuthProvider>
  );
}
