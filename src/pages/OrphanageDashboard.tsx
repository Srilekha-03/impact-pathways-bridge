
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Heart, LogOut, Shield, History, CheckCircle } from 'lucide-react';
import RequestModal from '@/components/RequestModal';
import ProfileModal from '@/components/ProfileModal';
import { orphanageService } from '@/services/orphanageService';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

const OrphanageDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [ngos, setNgos] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<any[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user.id || user.role !== 'orphanage') {
      navigate('/');
      return;
    }
    setCurrentUser(user);
    loadData(user.id);
  }, [navigate]);

  const loadData = async (orphanageId: number) => {
    try {
      setLoading(true);
      const [ngosData, requestsData, acceptedData] = await Promise.all([
        orphanageService.getNGOs(),
        orphanageService.getRequestHistory(orphanageId),
        orphanageService.getAcceptedRequests(orphanageId)
      ]);
      
      setNgos(ngosData);
      setRequests(requestsData);
      setAcceptedRequests(acceptedData);
    } catch (error: any) {
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

  const handleRequest = (ngo: any) => {
    setSelectedNgo(ngo);
    setShowRequestModal(true);
  };

  if (!currentUser || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold text-gray-800">Orphanage Dashboard</span>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-800">{currentUser.name}</h2>
              <p className="text-sm text-gray-600">Building Futures</p>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ngos">NGOs</TabsTrigger>
            <TabsTrigger value="history">Request History</TabsTrigger>
            <TabsTrigger value="accepted">Requests Accepted</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="ngos" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ngos.map((ngo) => (
                <Card key={ngo.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-green-500" />
                      <span>{ngo.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{ngo.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{ngo.experience} years experience</Badge>
                    </div>
                    <Button 
                      onClick={() => handleRequest(ngo)}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                    >
                      Request
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <History className="h-5 w-5 text-blue-500" />
                        <span>Request</span>
                      </div>
                      <Badge variant={
                        request.status === 'accepted' ? 'default' : 
                        request.status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {request.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">NGO:</span>
                      <span>{request.ngo_name}</span>
                    </div>
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

          <TabsContent value="accepted" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {acceptedRequests.map((distribution) => (
                <Card key={distribution.id} className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Received Donation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Donor:</span>
                      <span className="text-blue-600 font-semibold">{distribution.donor_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">NGO:</span>
                      <span className="text-green-600 font-semibold">{distribution.ngo_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Type:</span>
                      <Badge variant={distribution.type === 'money' ? 'default' : 'secondary'}>
                        {distribution.type}
                      </Badge>
                    </div>
                    {distribution.type === 'money' ? (
                      <div className="flex justify-between">
                        <span className="font-semibold">Amount:</span>
                        <span className="text-green-600 font-bold">${distribution.amount}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="font-semibold">Item:</span>
                          <span>{distribution.item_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Quantity:</span>
                          <span className="text-green-600 font-bold">{distribution.quantity}</span>
                        </div>
                      </>
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

      <RequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        ngo={selectedNgo}
        onRequestComplete={() => {
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

export default OrphanageDashboard;
