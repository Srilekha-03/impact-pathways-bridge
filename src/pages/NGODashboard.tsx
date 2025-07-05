
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, LogOut, Heart, Users, TrendingUp } from 'lucide-react';
import MatchOrphanageModal from '@/components/MatchOrphanageModal';
import ProfileModal from '@/components/ProfileModal';
import { ngoService } from '@/services/ngoService';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  description?: string;
  experience?: string;
}

interface Donation {
  id: number;
  donor_name: string;
  type: 'money' | 'item';
  amount?: number;
  item_name?: string;
  quantity?: number;
  status: 'pending' | 'distributed';
  created_at: string;
}

interface Request {
  id: number;
  orphanage_name: string;
  type: 'money' | 'item';
  amount?: number;
  item_name?: string;
  quantity?: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

interface Distribution {
  id: number;
  donor_name: string;
  orphanage_name: string;
  type: 'money' | 'item';
  amount?: number;
  item_name?: string;
  quantity?: number;
  created_at: string;
}

const NGODashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user.id || user.role !== 'ngo') {
      navigate('/');
      return;
    }
    setCurrentUser(user);
    loadData(user.id);
  }, [navigate]);

  const loadData = async (ngoId: number) => {
    try {
      setLoading(true);
      const [donationsData, requestsData, distributionsData] = await Promise.all([
        ngoService.getDonations(ngoId),
        ngoService.getRequests(ngoId),
        ngoService.getDistributions(ngoId)
      ]);
      
      setDonations(donationsData);
      setRequests(requestsData);
      setDistributions(distributionsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleMatchOrphanages = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowMatchModal(true);
  };

  if (!currentUser || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-800">NGO Dashboard</span>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-800">{currentUser.name}</h2>
              <p className="text-sm text-gray-600">Bridging Hearts</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="donations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="requests">Request Logs</TabsTrigger>
            <TabsTrigger value="history">Distribution History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="donations" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.filter(d => d.status === 'pending').map((donation) => (
                <Card key={donation.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span>From {donation.donor_name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-semibold">Type:</span>
                      <Badge variant={donation.type === 'money' ? 'default' : 'secondary'}>
                        {donation.type}
                      </Badge>
                    </div>
                    {donation.type === 'money' ? (
                      <div className="flex justify-between">
                        <span className="font-semibold">Amount:</span>
                        <span>${donation.amount}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="font-semibold">Item:</span>
                          <span>{donation.item_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Quantity:</span>
                          <span>{donation.quantity}</span>
                        </div>
                      </>
                    )}
                    <Button 
                      onClick={() => handleMatchOrphanages(donation)}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      Match Orphanages
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.filter(r => r.status === 'pending').map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <span>{request.orphanage_name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Type:</span>
                      <Badge variant={request.type === 'money' ? 'default' : 'secondary'}>
                        {request.type}
                      </Badge>
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
                    <div className="flex justify-between">
                      <span className="font-semibold">Date:</span>
                      <span>{new Date(request.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {distributions.map((distribution) => (
                <Card key={distribution.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span>Distribution Record</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Donor:</span>
                      <span>{distribution.donor_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Orphanage:</span>
                      <span>{distribution.orphanage_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Type:</span>
                      <span>{distribution.type}</span>
                    </div>
                    {distribution.type === 'money' ? (
                      <div className="flex justify-between">
                        <span className="font-semibold">Amount:</span>
                        <span>${distribution.amount}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span className="font-semibold">Item:</span>
                        <span>{distribution.item_name} x{distribution.quantity}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-semibold">Date:</span>
                      <span>{new Date(distribution.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold">Name:</span>
                    <p>{currentUser.name}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span>
                    <p>{currentUser.email}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Experience:</span>
                    <p>{currentUser.experience} years</p>
                  </div>
                  <div>
                    <span className="font-semibold">Role:</span>
                    <Badge>{currentUser.role}</Badge>
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Description:</span>
                  <p className="mt-1">{currentUser.description}</p>
                </div>
                <Button 
                  onClick={() => setShowProfileModal(true)}
                  className="w-full"
                >
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <MatchOrphanageModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        donation={selectedDonation}
        onMatchComplete={() => {
          if (currentUser) {
            loadData(currentUser.id);
          }
        }}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={currentUser}
        onUpdateComplete={() => {
          const updatedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          setCurrentUser(updatedUser);
        }}
      />
    </div>
  );
};

export default NGODashboard;
