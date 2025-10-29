'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      
        
          

            <form onSubmit={handleSubmit}>
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                />
              </FormControl>

              <FormControl sx={{ mb: 3 }}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </FormControl>

              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                fullWidth
                variant="contained"
                startIcon={<PersonIcon />}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
    </Box>
  );
}