
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, type }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    description: '',
    experience: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (type === 'signup') {
        const result = await authService.register(formData);
        toast({
          title: "Success",
          description: "Account created successfully!"
        });
        // Navigate based on role
        switch (formData.role) {
          case 'donor':
            navigate('/donor-dashboard');
            break;
          case 'ngo':
            navigate('/ngo-dashboard');
            break;
          case 'orphanage':
            navigate('/orphanage-dashboard');
            break;
        }
      } else {
        const result = await authService.login({
          email: formData.email,
          password: formData.password
        });
        toast({
          title: "Success",
          description: "Logged in successfully!"
        });
        // Navigate based on user role
        switch (result.user.role) {
          case 'donor':
            navigate('/donor-dashboard');
            break;
          case 'ngo':
            navigate('/ngo-dashboard');
            break;
          case 'orphanage':
            navigate('/orphanage-dashboard');
            break;
        }
      }
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || `${type === 'login' ? 'Login' : 'Registration'} failed`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {type === 'login' ? 'Welcome Back' : 'Join ImpactBridge'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'signup' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => handleInputChange('role', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="donor">Donor</SelectItem>
                    <SelectItem value="ngo">NGO</SelectItem>
                    <SelectItem value="orphanage">Orphanage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
          </div>
          
          {type === 'signup' && formData.role === 'ngo' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="Years of experience"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your NGO's mission and activities"
                  required
                />
              </div>
            </>
          )}
          
          {type === 'signup' && formData.role === 'orphanage' && (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your orphanage and its needs"
                required
              />
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : (type === 'login' ? 'Login' : 'Sign Up')}
          </Button>
        </form>
        
        <div className="text-center text-sm text-gray-600">
          {type === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => onClose()}
            className="text-blue-600 hover:underline font-semibold"
          >
            {type === 'login' ? 'Sign up' : 'Login'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
