
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, TrendingUp, LogOut } from 'lucide-react';
import DonationModal from '@/components/DonationModal';

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [ngos, setNgos] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState<any>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user.id || user.role !== 'donor') {
      navigate('/');
      return;
    }
    setCurrentUser(user);

    // Load NGOs
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const ngoUsers = users.filter((u: any) => u.role === 'ngo');
    setNgos(ngoUsers);

    // Load donations
    const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    const userDonations = allDonations.filter((d: any) => d.donorId === user.id);
    setDonations(userDonations);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleDonate = (ngo: any) => {
    setSelectedNgo(ngo);
    setShowDonationModal(true);
  };

  const getDonationImpact = () => {
    const distributions = JSON.parse(localStorage.getItem('distributions') || '[]');
    return donations.map(donation => {
      const distribution = distributions.find((d: any) => d.donationId === donation.id);
      return {
        ...donation,
        status: distribution ? 'Distributed' : 'Pending',
        orphanage: distribution ? distribution.orphanageName : null
      };
    });
  };

  if (!currentUser) return null;

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
              {donations.map((donation) => {
                const ngo = ngos.find(n => n.id === donation.ngoId);
                return (
                  <Card key={donation.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Donation to {ngo?.name}
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
                            <span>{donation.itemName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Quantity:</span>
                            <span>{donation.quantity}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="font-semibold">Date:</span>
                        <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getDonationImpact().map((donation) => {
                const ngo = ngos.find(n => n.id === donation.ngoId);
                return (
                  <Card key={donation.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Impact Status</span>
                        <Badge variant={donation.status === 'Distributed' ? 'default' : 'secondary'}>
                          {donation.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">NGO:</span>
                        <span>{ngo?.name}</span>
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
                          <span>{donation.itemName} x{donation.quantity}</span>
                        </div>
                      )}
                      {donation.status === 'Distributed' && donation.orphanage && (
                        <div className="flex justify-between">
                          <span className="font-semibold">Received by:</span>
                          <span className="text-green-600 font-semibold">{donation.orphanage}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        ngo={selectedNgo}
        onDonationComplete={() => {
          // Refresh donations
          const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
          const userDonations = allDonations.filter((d: any) => d.donorId === currentUser.id);
          setDonations(userDonations);
        }}
      />
    </div>
  );
};

export default DonorDashboard;
