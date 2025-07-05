
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Users, ArrowRight } from 'lucide-react';
import AuthModal from '@/components/AuthModal';

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthType(type);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Heart className="h-8 w-8 text-red-500 fill-current" />
                <Shield className="h-4 w-4 text-blue-600 absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-bold text-gray-800">SafeHaven</span>
            </div>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">
                ImpactBridge
              </h1>
              <p className="text-sm text-gray-600">Connecting Hearts, Creating Hope</p>
            </div>

            {/* Auth Buttons */}
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => handleAuthClick('login')}
                className="hover:bg-blue-50"
              >
                Login
              </Button>
              <Button 
                onClick={() => handleAuthClick('signup')}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* First Row */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1">
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Donation and helping hands" 
              className="rounded-lg shadow-2xl w-full h-64 object-cover"
            />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-4xl font-bold text-gray-800 leading-tight">
              Transparent Donations, <span className="text-blue-600">Real Impact</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              ImpactBridge revolutionizes charitable giving by creating a transparent, 
              trackable ecosystem where donors can see exactly how their contributions 
              reach orphanages through trusted NGOs. Every donation is tracked, every 
              impact is measured, and every life touched is celebrated. Join us in 
              building a world where generosity meets transparency.
            </p>
            <div className="flex items-center space-x-2 text-blue-600">
              <ArrowRight className="h-5 w-5" />
              <span className="font-semibold">Track every donation's journey</span>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-800 leading-tight">
              Three Pillars of <span className="text-green-600">Change</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our platform connects three essential actors in the donation ecosystem. 
              Generous donors provide resources, experienced NGOs ensure proper distribution, 
              and orphanages receive exactly what they need. This triangular approach 
              eliminates waste, maximizes impact, and builds lasting relationships that 
              transform communities one donation at a time.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-white rounded-lg shadow-md">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <span className="text-sm font-semibold text-gray-700">Donors</span>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-md">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <span className="text-sm font-semibold text-gray-700">NGOs</span>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-md">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <span className="text-sm font-semibold text-gray-700">Orphanages</span>
              </div>
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Community support and collaboration" 
              className="rounded-lg shadow-2xl w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h3>
            <p className="text-xl mb-6">Join thousands of donors, NGOs, and orphanages already making an impact</p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => handleAuthClick('signup')}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        type={authType}
      />
    </div>
  );
};

export default Index;
