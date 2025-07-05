
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MatchOrphanageModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: any;
  onMatchComplete: () => void;
}

const MatchOrphanageModal: React.FC<MatchOrphanageModalProps> = ({ 
  isOpen, 
  onClose, 
  donation, 
  onMatchComplete 
}) => {
  const { toast } = useToast();
  const [matchingRequests, setMatchingRequests] = useState<any[]>([]);

  useEffect(() => {
    if (donation && isOpen) {
      // Find matching requests based on type
      const allRequests = JSON.parse(localStorage.getItem('requests') || '[]');
      const matching = allRequests.filter((request: any) => 
        request.ngoId === donation.ngoId && 
        request.type === donation.type &&
        request.status === 'pending'
      );
      
      // Add orphanage names
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const requestsWithNames = matching.map((request: any) => {
        const orphanage = users.find((u: any) => u.id === request.orphanageId);
        return {
          ...request,
          orphanageName: orphanage?.name || 'Unknown'
        };
      });
      
      setMatchingRequests(requestsWithNames);
    }
  }, [donation, isOpen]);

  const handleAccept = (request: any) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const donor = users.find((u: any) => u.id === donation.donorId);

    // Create distribution record
    const distributions = JSON.parse(localStorage.getItem('distributions') || '[]');
    const newDistribution = {
      id: Date.now(),
      donationId: donation.id,
      requestId: request.id,
      ngoId: currentUser.id,
      donorId: donation.donorId,
      orphanageId: request.orphanageId,
      donorName: donor?.name || 'Unknown',
      orphanageName: request.orphanageName,
      type: donation.type,
      amount: donation.amount,
      itemName: donation.itemName,
      quantity: donation.quantity,
      createdAt: new Date().toISOString()
    };
    distributions.push(newDistribution);
    localStorage.setItem('distributions', JSON.stringify(distributions));

    // Update donation status
    const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    const updatedDonations = allDonations.map((d: any) => 
      d.id === donation.id ? { ...d, status: 'distributed' } : d
    );
    localStorage.setItem('donations', JSON.stringify(updatedDonations));

    // Update request status
    const allRequests = JSON.parse(localStorage.getItem('requests') || '[]');
    const updatedRequests = allRequests.map((r: any) => 
      r.id === request.id ? { ...r, status: 'accepted' } : r
    );
    localStorage.setItem('requests', JSON.stringify(updatedRequests));

    toast({
      title: "Success",
      description: "Donation matched and distributed successfully!"
    });

    onMatchComplete();
    onClose();
  };

  const handleReject = (request: any) => {
    const allRequests = JSON.parse(localStorage.getItem('requests') || '[]');
    const updatedRequests = allRequests.map((r: any) => 
      r.id === request.id ? { ...r, status: 'rejected' } : r
    );
    localStorage.setItem('requests', JSON.stringify(updatedRequests));

    toast({
      title: "Request Rejected",
      description: "The request has been rejected."
    });

    // Refresh matching requests
    const matching = allRequests.filter((request: any) => 
      request.ngoId === donation.ngoId && 
      request.type === donation.type &&
      request.status === 'pending' &&
      request.id !== request.id
    );
    setMatchingRequests(matching);
  };

  if (!donation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Match Orphanages for Donation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Donation Info */}
          <Card>
            <CardHeader>
              <CardTitle>Donation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">Type:</span>
                  <Badge className="ml-2">{donation.type}</Badge>
                </div>
                {donation.type === 'money' ? (
                  <div>
                    <span className="font-semibold">Amount:</span>
                    <span className="ml-2">${donation.amount}</span>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="font-semibold">Item:</span>
                      <span className="ml-2">{donation.itemName}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Quantity:</span>
                      <span className="ml-2">{donation.quantity}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Matching Requests */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Matching Requests</h3>
            {matchingRequests.length === 0 ? (
              <p className="text-gray-600">No matching requests found.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {matchingRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        <span>{request.orphanageName}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">Type:</span>
                          <Badge>{request.type}</Badge>
                        </div>
                        {request.type === 'money' ? (
                          <div className="flex justify-between">
                            <span className="font-semibold">Amount:</span>
                            <span>${request.amount}</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span className="font-semibold">Item:</span>
                              <span>{request.itemName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold">Quantity:</span>
                              <span>{request.quantity}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleAccept(request)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => handleReject(request)}
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchOrphanageModal;
