
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, TrendingUp, LogOut } from 'lucide-react';
import DonationModal from '@/components/DonationModal';
import { donorService } from '@/services/donorService';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface NGO {
  id: number;
  name: string;
  description: string;
  experience: string;
}

interface Donation {
  id: number;
  ngo_name: string;
  type: 'money' | 'item';
  amount?: number;
  item_name?: string;
  quantity?: number;
  created_at: string;
}

interface DonationImpact {
  id: number;
  ngo_name: string;
  type: 'money' | 'item';
  amount?: number;
  item_name?: string;
  quantity?: number;
  status: 'pending' | 'distributed';
  orphanage_name?: string;
}

const DonorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donationImpact, setDonationImpact] = useState<DonationImpact[]>([]);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState<NGO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user.id || user.role !== 'donor') {
      navigate('/');
      return;
    }
    setCurrentUser(user);
    loadData(user.id);
  }, [navigate]);

  const loadData = async (donorId: number) => {
    try {
      setLoading(true);
      const [ngosData, donationsData, impactData] = await Promise.all([
        donorService.getNGOs(),
        donorService.getDonationHistory(donorId),
        donorService.getDonationImpact(donorId)
      ]);
      
      setNgos(ngosData);
      setDonations(donationsData);
      setDonationImpact(impactData);
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

  const handleDonate = (ngo: NGO) => {
    setSelectedNgo(ngo);
    setShowDonationModal(true);
  };

  if (!currentUser || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">Donor Dashboard</span>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-800">{currentUser.name}</h2>
              <p className="text-sm text-gray-600">Making a Difference</p>
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
        <Tabs defaultValue="ngos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ngos">NGOs</TabsTrigger>
            <TabsTrigger value="history">Donation History</TabsTrigger>
            <TabsTrigger value="impact">Donation Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="ngos" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ngos.map((ngo) => (
                <Card key={ngo.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span>{ngo.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{ngo.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{ngo.experience} years experience</Badge>
                    </div>
                    <Button 
                      onClick={() => handleDonate(ngo)}
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    >
                      Donate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map((donation) => (
                <Card key={donation.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Donation to {donation.ngo_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
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
                    <div className="flex justify-between">
                      <span className="font-semibold">Date:</span>
                      <span>{new Date(donation.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donationImpact.map((donation) => (
                <Card key={donation.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Impact Status</span>
                      <Badge variant={donation.status === 'distributed' ? 'default' : 'secondary'}>
                        {donation.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">NGO:</span>
                      <span>{donation.ngo_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Type:</span>
                      <span>{donation.type}</span>
                    </div>
                    {donation.type === 'money' ? (
                      <div className="flex justify-between">
                        <span className="font-semibold">Amount:</span>
                        <span>${donation.amount}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span className="font-semibold">Item:</span>
                        <span>{donation.item_name} x{donation.quantity}</span>
                      </div>
                    )}
                    {donation.status === 'distributed' && donation.orphanage_name && (
                      <div className="flex justify-between">
                        <span className="font-semibold">Received by:</span>
                        <span className="text-green-600 font-semibold">{donation.orphanage_name}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        ngo={selectedNgo}
        onDonationComplete={() => {
          if (currentUser) {
            loadData(currentUser.id);
          }
        }}
      />
    </div>
  );
};

export default DonorDashboard;
