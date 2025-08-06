import React from 'react';
import HeaderBox from '@/components/HeaderBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const About = () => {
  const features = [
    {
      icon: "🏦",
      title: "Ethiopian Banking Integration",
      description: "Seamlessly connect with all major Ethiopian banks including CBE, Dashen Bank, Bank of Abyssinia, and more."
    },
    {
      icon: "💳",
      title: "Multiple Payment Methods",
      description: "Support for bank transfers, bill payments, mobile money, and QR code payments all in one platform."
    },
    {
      icon: "🔒",
      title: "Bank-Grade Security",
      description: "Advanced encryption and security measures compliant with Ethiopian banking regulations."
    },
    {
      icon: "📱",
      title: "Mobile-First Design",
      description: "Optimized for mobile devices with responsive design for seamless banking on the go."
    },
    {
      icon: "🌍",
      title: "Local Language Support",
      description: "Available in English, Amharic, Oromiffa, and Tigrinya to serve all Ethiopians."
    },
    {
      icon: "⚡",
      title: "Instant Transfers",
      description: "Real-time money transfers between Ethiopian banks with immediate confirmation."
    }
  ];

  const team = [
    {
      name: "Eden Solomon",
      role: "Frontend Developer",
      description: "Specialized in creating responsive and intuitive user interfaces for modern web applications.",
      image: "👨‍💻"
    },
    {
      name: "Kidist Haile",
      role: "UI Designer",
      description: "Expert in user interface design with a focus on Ethiopian cultural aesthetics and user experience.",
      image: "👩‍🎨"
    },
    {
      name: "Eldana Ashenafi",
      role: "Backend / API Developer",
      description: "Backend specialist focused on secure API development and database architecture.",
      image: "👩‍💻"
    },
    {
      name: "Nolawit Solomon",
      role: "UX Researcher",
      description: "User experience researcher dedicated to understanding Ethiopian banking user needs.",
      image: "👩‍🔬"
    },
    {
      name: "Natnael Gezahegn",
      role: "Backend Developer",
      description: "Backend developer specializing in scalable systems and financial technology solutions.",
      image: "👨‍💻"
    }
  ];

  const stats = [
    { number: "10+", label: "Ethiopian Banks Connected" },
    { number: "50K+", label: "Active Users" },
    { number: "1M+", label: "Transactions Processed" },
    { number: "99.9%", label: "Uptime Reliability" }
  ];

  return (
    <section className="flex w-full flex-col gap-8 p-6 max-w-6xl mx-auto">
      <HeaderBox
        title="About Nile Pay"
        subtext="Revolutionizing Ethiopian digital banking and payments"
      />

      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <span>🇪🇹</span>
                Empowering Ethiopian Banking
              </h2>
              <p className="text-lg opacity-90 mb-6">
                Nile Pay is Ethiopia's premier digital payment gateway, connecting all major Ethiopian banks 
                and providing secure, instant financial services to millions of Ethiopians.
              </p>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">2025</div>
                  <div className="text-sm opacity-80">Founded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">Addis Ababa</div>
                  <div className="text-sm opacity-80">Headquarters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm opacity-80">Team Members</div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4">🏛️</div>
              <p className="text-sm opacity-80">
                Secure Ethiopian Digital Banking Platform
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>🎯</span>
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              To democratize financial services in Ethiopia by providing secure, accessible, and 
              innovative digital banking solutions that connect every Ethiopian to the modern economy.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>👁️</span>
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              To become the leading digital payment platform in Ethiopia, fostering financial inclusion 
              and economic growth through cutting-edge technology and exceptional customer service.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <span>📊</span>
            Our Impact in Numbers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>⭐</span>
            What Makes Us Special
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Innovative features designed specifically for Ethiopian banking needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leadership Team */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>👥</span>
            Development Team
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Meet the experienced professionals who developed Nile Pay
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {team.map((member, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-4xl mb-3">{member.image}</div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {member.name}
                </h4>
                <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                  {member.role}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 border border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>📍</span>
            Get in Touch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl mb-2">🏢</div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Headquarters</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bole Road, Addis Ababa<br />
                Ethiopia
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📧</div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Email</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                info@nilepay.et<br />
                support@nilepay.et
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📞</div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Phone</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                +251-11-XXX-XXXX<br />
                Customer Support
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default About;
