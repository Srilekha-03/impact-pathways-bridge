
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, type }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === 'signup') {
      // Store user data in localStorage for demo
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((user: any) => user.email === formData.email);
      
      if (existingUser) {
        toast({
          title: "Error",
          description: "User already exists with this email",
          variant: "destructive"
        });
        return;
      }
      
      const newUser = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    } else {
      // Login logic
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
      
      if (!user) {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive"
        });
        return;
      }
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      setFormData({ role: user.role, name: user.name, email: user.email, password: user.password, description: user.description, experience: user.experience });
    }

    toast({
      title: "Success",
      description: `${type === 'login' ? 'Logged in' : 'Account created'} successfully!`
    });

    // Navigate based on role
    const userRole = type === 'login' ? 
      JSON.parse(localStorage.getItem('currentUser') || '{}').role : 
      formData.role;
      
    switch (userRole) {
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
    
    onClose();
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
          
          <Button type="submit" className="w-full">
            {type === 'login' ? 'Login' : 'Sign Up'}
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
