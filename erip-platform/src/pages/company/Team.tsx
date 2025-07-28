import React from 'react';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const Team: React.FC = () => {
  const teamMembers = [
    {
      name: "Samuel Chege",
      role: "Founder & CEO",
      image: "/api/placeholder/150/150",
      bio: "Trust intelligence pioneer with 15+ years in compliance automation",
      linkedin: "https://linkedin.com/in/samuel-chege",
      twitter: "https://twitter.com/samuelchege",
      email: "samuel@digitalsecurityinsights.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the trust intelligence experts building the future of compliance automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
              <div className="flex justify-center gap-3">
                <a href={member.linkedin} className="text-gray-400 hover:text-blue-600">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href={member.twitter} className="text-gray-400 hover:text-blue-600">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-blue-600">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
