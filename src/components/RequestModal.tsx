
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  ngo: any;
  onRequestComplete: () => void;
}

const RequestModal: React.FC<RequestModalProps> = ({ isOpen, onClose, ngo, onRequestComplete }) => {
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
    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    
    const newRequest = {
      id: Date.now(),
      orphanageId: currentUser.id,
      ngoId: ngo.id,
      type: formData.type,
      amount: formData.type === 'money' ? parseFloat(formData.amount) : null,
      itemName: formData.type === 'item' ? formData.itemName : null,
      quantity: formData.type === 'item' ? parseInt(formData.quantity) : null,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    requests.push(newRequest);
    localStorage.setItem('requests', JSON.stringify(requests));
    
    toast({
      title: "Success",
      description: "Request submitted successfully!"
    });
    
    setFormData({ type: '', amount: '', itemName: '', quantity: '' });
    onRequestComplete();
    onClose();
  };

  if (!ngo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Request from {ngo.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Request Type</Label>
            <Select onValueChange={(value) => handleInputChange('type', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select request type" />
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
                placeholder="Enter amount needed"
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
                  placeholder="Enter item name needed"
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
                  placeholder="Enter quantity needed"
                  required
                />
              </div>
            </>
          )}
          
          <Button type="submit" className="w-full">
            Submit Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestModal;
