
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ngoService } from '@/services/ngoService';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (donation && isOpen) {
      loadMatchingRequests();
    }
  }, [donation, isOpen]);

  const loadMatchingRequests = async () => {
    try {
      setLoading(true);
      const requests = await ngoService.getRequests(donation.ngo_id);
      const matching = requests.filter((request: any) => 
        request.type === donation.type && request.status === 'pending'
      );
      setMatchingRequests(matching);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load matching requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (request: any) => {
    try {
      await ngoService.matchDonationToRequest({
        donationId: donation.id,
        requestId: request.id
      });

      toast({
        title: "Success",
        description: "Donation matched and distributed successfully!"
      });

      onMatchComplete();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to match donation",
        variant: "destructive"
      });
    }
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
        
        {loading ? (
          <div className="text-center py-8">Loading matching requests...</div>
        ) : (
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
                        <span className="ml-2">{donation.item_name}</span>
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
                          <span>{request.orphanage_name}</span>
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
                                <span>{request.item_name}</span>
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
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MatchOrphanageModal;
