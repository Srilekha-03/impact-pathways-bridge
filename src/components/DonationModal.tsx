
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ngo: any;
  onDonationComplete: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, ngo, onDonationComplete }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    itemName: '',
    quantity: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    
    const newDonation = {
      id: Date.now(),
      donorId: currentUser.id,
      ngoId: ngo.id,
      type: formData.type,
      amount: formData.type === 'money' ? parseFloat(formData.amount) : null,
      itemName: formData.type === 'item' ? formData.itemName : null,
      quantity: formData.type === 'item' ? parseInt(formData.quantity) : null,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    donations.push(newDonation);
    localStorage.setItem('donations', JSON.stringify(donations));
    
    toast({
      title: "Success",
      description: "Donation submitted successfully!"
    });
    
    setFormData({ type: '', amount: '', itemName: '', quantity: '' });
    onDonationComplete();
    onClose();
  };

  if (!ngo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Donate to {ngo.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Donation Type</Label>
            <Select onValueChange={(value) => handleInputChange('type', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select donation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="money">Money</SelectItem>
                <SelectItem value="item">Item</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.type === 'money' && (
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>
          )}
          
          {formData.type === 'item' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  value={formData.itemName}
                  onChange={(e) => handleInputChange('itemName', e.target.value)}
                  placeholder="Enter item name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
              </div>
            </>
          )}
          
          <Button type="submit" className="w-full">
            Submit Donation
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
