'use client';
import { useState, useEffect } from 'react';
import { 
  Building, Map as MapIcon, List, Bell, Download, ChevronDown, ChevronUp, MapPin, CheckCircle2, Phone, X
} from 'lucide-react';
import Image from 'next/image';

type PropertyStatus = 'Under Development' | 'Ready / Completed' | 'Rented / Occupied' | 'Pending Title Transfer' | 'Title Transferred';
type PropertyType = 'Residential' | 'Commercial' | 'Land';

interface Property {
  id: string;
  name: string;
  address: string;
  type: PropertyType;
  status: PropertyStatus;
  progress: number;
  estCompletion: string;
  price: string;
  purchaseDate: string;
  agentName: string;
  legalStatus: string;
  insurance: string;
  tax: string;
  docs: { name: string; status: 'ready' | 'pending' }[];
  timeline: { date: string; title: string; desc?: string; status: 'completed' | 'in-progress' | 'upcoming' }[];
  rent?: { monthly: string; status: string; end: string; lastReceived: string; amount: string; history: { month: string; amount: string; date: string; status: string }[] };
  lat: number;
  lng: number;
  neighborhood: string;
  landmarks: string[];
}

const mockProperties: Property[] = [
  {
    id: 'WBR-PROP-2025-0042',
    name: 'Williston Heights — River Oaks, Unit 4B',
    address: '1204 River Oaks Blvd, Houston, TX 77019',
    type: 'Residential',
    status: 'Under Development',
    progress: 65,
    estCompletion: 'August 15, 2025',
    price: '$85,000',
    purchaseDate: 'January 2025',
    agentName: 'John Williams',
    legalStatus: 'Deed in Processing',
    insurance: 'Insured',
    tax: 'Paid through 2025',
    docs: [
      { name: 'Purchase Agreement', status: 'ready' },
      { name: 'Deed of Sale', status: 'pending' },
      { name: 'Title Insurance', status: 'ready' },
      { name: 'Property Inspection Report', status: 'ready' },
      { name: 'Investment Certificate', status: 'ready' },
    ],
    timeline: [
      { date: 'Jan 15, 2025', title: 'Payment of $85,000 confirmed', status: 'completed' },
      { date: 'Jan 20, 2025', title: 'Purchase agreement signed digitally', status: 'completed' },
      { date: 'Feb 1, 2025', title: 'Title search initiated', status: 'completed' },
      { date: 'Feb 28, 2025', title: 'Foundation work completed', status: 'completed' },
      { date: 'Mar 15, 2025', title: 'Framing and structure', status: 'in-progress' },
      { date: 'Apr 2025', title: 'Electrical and plumbing', status: 'upcoming' },
      { date: 'Jun 2025', title: 'Interior finishing', status: 'upcoming' },
      { date: 'Aug 2025', title: 'Final inspection and handover', status: 'upcoming' },
    ],
    lat: 29.7558,
    lng: -95.3995,
    neighborhood: 'River Oaks',
    landmarks: ['River Oaks Elementary', 'Buffalo Bayou Park', 'Hwy 59'],
  },
  {
    id: 'WBR-PROP-2024-0118',
    name: 'The Williston Residences, Unit 12A',
    address: '8842 Westheimer Rd, Houston, TX 77063',
    type: 'Residential',
    status: 'Rented / Occupied',
    progress: 100,
    estCompletion: 'Completed',
    price: '$120,000',
    purchaseDate: 'June 2024',
    agentName: 'Sarah Jenkins',
    legalStatus: 'Title Transferred',
    insurance: 'Insured',
    tax: 'Paid through 2025',
    docs: [
      { name: 'Purchase Agreement', status: 'ready' },
      { name: 'Deed of Sale', status: 'ready' },
      { name: 'Title Insurance', status: 'ready' },
      { name: 'Property Inspection Report', status: 'ready' },
      { name: 'Investment Certificate', status: 'ready' },
      { name: 'Lease Agreement', status: 'ready' },
    ],
    timeline: [
      { date: 'Jun 10, 2024', title: 'Property purchase finalized', status: 'completed' },
      { date: 'Jul 5, 2024', title: 'Title transferred to owner', status: 'completed' },
      { date: 'Aug 1, 2024', title: 'Tenant lease signed', status: 'completed' },
    ],
    rent: {
      monthly: '$2,500/month',
      status: 'Occupied',
      end: 'December 31, 2025',
      lastReceived: 'March 1, 2025',
      amount: '$2,500',
      history: [
        { month: 'March 2025', amount: '$2,500', date: 'Mar 1, 2025', status: 'Received' },
        { month: 'February 2025', amount: '$2,500', date: 'Feb 1, 2025', status: 'Received' },
        { month: 'January 2025', amount: '$2,500', date: 'Jan 2, 2025', status: 'Received' },
      ]
    },
    lat: 29.7368,
    lng: -95.5134,
    neighborhood: 'Mid West / Galleria',
    landmarks: ['The Galleria', 'Tanglewood Park', 'Westheimer Center'],
  }
];

const getStatusColor = (status: PropertyStatus) => {
  switch(status) {
    case 'Under Development': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    case 'Ready / Completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Rented / Occupied': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Pending Title Transfer': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Title Transferred': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getStatusEmoji = (status: PropertyStatus) => {
  switch(status) {
    case 'Under Development': return '🟡';
    case 'Ready / Completed': return '🟢';
    case 'Rented / Occupied': return '🔵';
    case 'Pending Title Transfer': return '🟠';
    case 'Title Transferred': return '✅';
    default: return '';
  }
};

const progressSteps = [
  'Payment Confirmed',
  'Documents Signed',
  'Title Search Completed',
  'Construction/Renovation',
  'Final Inspection',
  'Title Transfer',
  'Keys Handover'
];

const getStepStatus = (progress: number, stepNum: number) => {
  if (progress === 100) return 'completed';
  if (stepNum <= 3) return 'completed';
  if (stepNum === 4) return 'in-progress';
  return 'upcoming';
};

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
}

function PropertyCard({ 
  property, 
  isReminderActive, 
  onSetReminderClick 
}: { 
  property: Property; 
  isReminderActive: boolean; 
  onSetReminderClick: () => void; 
}) {
  const [activeTab, setActiveTab] = useState<'details'|'docs'|'timeline'|'rent'>('timeline');
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-navy-mid border border-border-subtle rounded-2xl overflow-hidden mb-6 shadow-lg hover:border-gold/25 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Section with Property Image and Overlay */}
      <div className="relative h-64 w-full overflow-hidden">
         <Image 
            src={`https://picsum.photos/seed/${property.id}/800/400`} 
            alt={property.name}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            referrerPolicy="no-referrer"
         />
         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-navy-mid via-navy-mid/40 to-transparent z-10"></div>
         
         {/* Top Badges */}
         <div className="absolute top-4 left-4 z-20 flex gap-2">
            <span className="px-3 py-1 text-[11px] uppercase tracking-wider font-bold bg-navy-mid/80 backdrop-blur-md rounded-md border border-white/10 text-white">
               {property.type}
            </span>
            <span className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md border backdrop-blur-md flex items-center gap-1 bg-navy-mid/80 ${getStatusColor(property.status)}`}>
               {getStatusEmoji(property.status)} {property.status}
            </span>
         </div>

         {/* Bottom Address/Name Overlay */}
         <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 bg-gradient-to-t from-navy-mid to-transparent z-20">
            <h3 className="text-xl md:text-2xl font-serif text-white mb-1.5 drop-shadow-lg font-semibold leading-tight">
               {property.name}
            </h3>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-navy-mid/60 backdrop-blur-sm border border-white/5 rounded-lg text-sm text-gray-200">
               <MapPin size={14} className="text-gold" />
               <span>{property.address}</span>
            </div>
         </div>
      </div>

      {/* Set Reminder Section */}
      <div className="bg-navy p-4 flex items-center justify-between border-y border-border-subtle gap-4">
         <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isReminderActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gold/10 text-gold border border-gold/20'}`}>
               <Bell size={18} />
            </div>
            <div>
               <div className="text-sm text-white font-medium">Tracking Notifications</div>
               <div className="text-xs text-gray-text hidden sm:block">Request updates on milestones</div>
            </div>
         </div>
         <button 
            onClick={onSetReminderClick}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${isReminderActive ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20' : 'bg-navy-light text-white hover:text-gold border-border-subtle hover:border-gold/30'}`}
         >
            {isReminderActive ? '✅ Reminders Active' : 'Set Reminder'}
         </button>
      </div>

      <div className="p-5 md:p-6">
         {/* Progress Bar & Estimation */}
         <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
               <span className="text-sm font-bold text-white bg-navy-light px-3 py-1 rounded-full border border-border-subtle">
                  {property.progress}% Complete
               </span>
               <span className="text-xs text-gold font-semibold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                  Est. {property.estCompletion}
               </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-navy h-2.5 rounded-full overflow-hidden border border-border-subtle mb-5">
               <div 
                  className="bg-gradient-to-r from-gold/70 to-gold h-full rounded-full transition-all duration-1000"
                  style={{ width: `${property.progress}%` }}
               ></div>
            </div>
            
            {/* Steps visual */}
            <div className="space-y-3 bg-navy-light/10 p-5 rounded-xl border border-border-subtle">
               {progressSteps.map((step, idx) => {
                  const stepNum = idx + 1;
                  const state = getStepStatus(property.progress, stepNum);
                  
                  let emoji = '⏳';
                  let statusText = '';
                  if (state === 'completed') {
                     emoji = '✅';
                  } else if (state === 'in-progress') {
                     emoji = '🔄';
                     statusText = ` (In Progress — ${property.progress}%)`;
                  }

                  return (
                     <div key={idx} className="flex items-center gap-3">
                        <div className="flex-1 flex items-center justify-between text-sm">
                           <div className="flex items-center gap-2">
                              <span className="text-gray-500 font-mono text-xs">Step {stepNum}:</span>
                              <span className="text-base">{emoji}</span>
                              <span className={`font-medium ${
                                 state === 'completed' ? 'text-gray-300 font-semibold' :
                                 state === 'in-progress' ? 'text-white font-bold' :
                                 'text-gray-600'
                              }`}>
                                 {step}{statusText}
                              </span>
                           </div>
                           {state === 'in-progress' && (
                              <span className="text-[10px] uppercase font-bold tracking-wider text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20 animate-pulse">Active</span>
                           )}
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>

         {/* Tabs Toggle */}
         <div className="border border-border-subtle rounded-xl overflow-hidden shadow-inner">
            <button 
               onClick={() => setExpanded(!expanded)}
               className="w-full flex items-center justify-between p-4 bg-navy-light text-left hover:bg-navy-light/80 transition"
            >
               <span className="font-semibold text-white flex items-center gap-2">
                  <List size={18} className="text-gold" />
                  Property Information & Activity
               </span>
               {expanded ? <ChevronUp size={20} className="text-gray-text" /> : <ChevronDown size={20} className="text-gray-text" />}
            </button>

            {expanded && (
               <div className="bg-navy border-t border-border-subtle animate-in slide-in-from-top-2 duration-300">
                  <div className="flex overflow-x-auto border-b border-border-subtle scrollbar-hide">
                     {['timeline', 'details', 'docs'].map(t => (
                        <button
                           key={t}
                           onClick={() => setActiveTab(t as any)}
                           className={`px-5 py-3.5 text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-colors border-r border-border-subtle/50 ${activeTab === t ? 'text-gold border-b-2 border-gold bg-gold/5' : 'text-gray-text hover:text-white'}`}
                        >
                           {t === 'timeline' ? 'Updates / Timeline' : t === 'details' ? 'Details' : 'Documents'}
                        </button>
                     ))}
                     {property.rent && (
                        <button
                           onClick={() => setActiveTab('rent')}
                           className={`px-5 py-3.5 text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-colors ${activeTab === 'rent' ? 'text-gold border-b-2 border-gold bg-gold/5' : 'text-gray-text hover:text-white'}`}
                        >
                           Rental Income
                        </button>
                     )}
                  </div>

                  <div className="p-5">
                     {/* TIMELINE TAB */}
                     {activeTab === 'timeline' && (
                        <div className="space-y-3.5 bg-navy-light/10 p-4 rounded-xl border border-border-subtle">
                           {property.timeline.map((item, idx) => {
                              let emoji = '⏳';
                              let suffix = ' (upcoming)';
                              if (item.status === 'completed') {
                                 emoji = '🟢';
                                 suffix = '';
                              } else if (item.status === 'in-progress') {
                                 emoji = '🔄';
                                 suffix = ' — IN PROGRESS';
                              }
                              return (
                                 <div key={idx} className="flex items-start gap-2.5 text-sm">
                                    <span className="text-base leading-none shrink-0">{emoji}</span>
                                    <div className="text-gray-300 leading-normal">
                                       <span className="font-semibold text-white">{item.date}</span>
                                       <span className="mx-2 text-gray-500">—</span>
                                       <span>{item.title}{suffix}</span>
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     )}

                     {/* DETAILS TAB */}
                     {activeTab === 'details' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                           <div className="space-y-1 pb-3 border-b border-border-subtle">
                              <div className="text-gray-text text-xs">Purchase Price</div>
                              <div className="font-semibold text-white">{property.price}</div>
                           </div>
                           <div className="space-y-1 pb-3 border-b border-border-subtle">
                              <div className="text-gray-text text-xs">Date Purchased</div>
                              <div className="font-semibold text-white">{property.purchaseDate}</div>
                           </div>
                           <div className="space-y-1 pb-3 border-b border-border-subtle">
                              <div className="text-gray-text text-xs">Property ID</div>
                              <div className="font-mono text-white text-xs">{property.id}</div>
                           </div>
                           <div className="space-y-1 pb-3 border-b border-border-subtle">
                              <div className="text-gray-text text-xs">Legal Status</div>
                              <div className="font-semibold text-white">{property.legalStatus}</div>
                           </div>
                           <div className="space-y-1 pb-3 border-b border-border-subtle">
                              <div className="text-gray-text text-xs">Insurance Status</div>
                              <div className="font-semibold text-white flex items-center gap-1.5">
                                 <span>✅ {property.insurance}</span>
                              </div>
                           </div>
                           <div className="space-y-1 pb-3 border-b border-border-subtle">
                              <div className="text-gray-text text-xs">Property Tax</div>
                              <div className="font-semibold text-white">{property.tax}</div>
                           </div>
                           <div className="space-y-1 col-span-1 sm:col-span-2 pt-1">
                              <div className="text-gray-text text-xs">Assigned Agent</div>
                              <div className="flex items-center gap-3 mt-1.5">
                                 <div className="font-semibold text-white">{property.agentName}</div>
                                 <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-light hover:bg-gold/10 hover:text-gold border border-border-subtle text-xs rounded-lg transition-colors text-white font-semibold">
                                    <Phone size={12} /> Contact
                                 </button>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* DOCS TAB */}
                     {activeTab === 'docs' && (
                        <div className="space-y-2">
                           {property.docs.map((doc, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-navy-light/30 hover:bg-navy-light transition-colors">
                                 <div className="flex items-center gap-3">
                                    <span className="text-base shrink-0">📄</span>
                                    <div className={`text-sm ${doc.status === 'ready' ? 'text-white font-medium' : 'text-gray-500'}`}>{doc.name}</div>
                                 </div>
                                 {doc.status === 'ready' ? (
                                    <button className="flex items-center gap-1 text-xs font-semibold text-gold hover:text-white transition">
                                       Download ↓
                                    </button>
                                 ) : (
                                    <span className="text-xs text-gray-500 bg-navy px-2 py-0.5 rounded border border-border-subtle font-semibold">Pending</span>
                                 )}
                              </div>
                           ))}
                        </div>
                     )}

                     {/* RENTAL TAB */}
                     {activeTab === 'rent' && property.rent && (
                        <div className="space-y-5">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-navy-light/30 p-3.5 rounded-xl border border-border-subtle">
                                 <span className="text-gray-400 text-xs block mb-1">Monthly Rent</span>
                                 <span className="text-white font-semibold">{property.rent.monthly}</span>
                              </div>
                              <div className="bg-navy-light/30 p-3.5 rounded-xl border border-border-subtle">
                                 <span className="text-gray-400 text-xs block mb-1">Tenant Status</span>
                                 <span className="text-blue-400 font-semibold">{property.rent.status}</span>
                              </div>
                              <div className="bg-navy-light/30 p-3.5 rounded-xl border border-border-subtle">
                                 <span className="text-gray-400 text-xs block mb-1">Lease End</span>
                                 <span className="text-white font-semibold">{property.rent.end}</span>
                              </div>
                              <div className="bg-navy-light/30 p-3.5 rounded-xl border border-border-subtle">
                                 <span className="text-gray-400 text-xs block mb-1">Last Rent Received</span>
                                 <span className="text-green-400 font-semibold">{property.rent.lastReceived} — {property.rent.amount} ✅</span>
                              </div>
                           </div>

                           <div>
                              <h4 className="text-sm font-semibold text-white mb-3">Rent History</h4>
                              <div className="border border-border-subtle rounded-xl overflow-hidden">
                                 <table className="w-full text-sm">
                                    <thead className="bg-navy-light/50 text-gray-text text-xs text-left">
                                       <tr>
                                          <th className="p-3 font-medium">Month</th>
                                          <th className="p-3 font-medium">Amount</th>
                                          <th className="p-3 font-medium">Received Date</th>
                                          <th className="p-3 font-medium border-l border-border-subtle text-center">Status</th>
                                       </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-subtle bg-navy-mid/20">
                                       {property.rent.history.map((row, idx) => (
                                          <tr key={idx} className="hover:bg-navy-light/20 transition-colors">
                                             <td className="p-3 text-white font-semibold">{row.month}</td>
                                             <td className="p-3 text-white">{row.amount}</td>
                                             <td className="p-3 text-gray-400">{row.date}</td>
                                             <td className="p-3 text-center border-l border-border-subtle">
                                                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full border border-green-500/20">
                                                   ✅ {row.status}
                                                </span>
                                             </td>
                                          </tr>
                                       ))}
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}

function PropertyMapCard({ property }: { property: Property }) {
   return (
      <div className="bg-navy-mid border border-border-subtle rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-300 shadow-xl animate-in fade-in zoom-in-95 duration-500 flex flex-col justify-between">
         <div>
            {/* Styled map placeholder container */}
            <div className="h-52 relative bg-navy flex items-center justify-center overflow-hidden border-b border-border-subtle">
               <img 
                  src={"https://maps.googleapis.com/maps/api/staticmap?center=" + encodeURIComponent(property.address) + "&zoom=14&size=600x300&maptype=roadmap&style=element:geometry|color:0x242f3e|element:labels.text.stroke|color:0x242f3e|element:labels.text.fill|color:0x746855"} 
                  alt="Property Location Map"
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                  referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-navy-mid via-navy-mid/20 to-transparent"></div>
               
               <div className="relative z-10 w-12 h-12 bg-gold/10 backdrop-blur-md border border-gold/30 rounded-full flex items-center justify-center shadow-lg">
                  <MapPin size={22} className="text-gold animate-bounce" />
               </div>
            </div>

            <div className="p-5 space-y-4">
               {/* Address displayed prominently */}
               <div>
                  <span className="text-[10px] uppercase font-bold text-gold tracking-wider block mb-1">Property Address</span>
                  <p className="text-lg text-white font-serif font-medium leading-snug">{property.address}</p>
                  <p className="text-xs text-gray-400 mt-1">{property.name}</p>
               </div>

               {/* Neighborhood / district label */}
               <div className="bg-navy/50 rounded-xl p-3.5 border border-border-subtle space-y-3">
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-gray-400 text-xs font-medium">Neighborhood/District</span>
                     <span className="text-white font-semibold bg-navy-light px-2.5 py-0.5 rounded-full border border-border-subtle text-xs">
                        {property.neighborhood}
                     </span>
                  </div>

                  {/* Nearby landmarks */}
                  <div className="border-t border-border-subtle/50 pt-2.5">
                     <span className="text-gray-400 text-xs font-medium block mb-2">Nearby Landmarks (Schools, Highways, Commercial Areas)</span>
                     <div className="flex flex-wrap gap-1.5">
                        {property.landmarks.map(l => (
                           <span key={l} className="px-2.5 py-1 bg-navy-light text-xs rounded-lg text-gray-200 border border-border-subtle/40">
                              📍 {l}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Google Maps link button at the bottom */}
         <div className="px-5 pb-5 pt-2">
            <a 
               href={`https://maps.google.com/?q=${encodeURIComponent(property.address)}`}
               target="_blank"
               rel="noopener noreferrer"
               className="w-full py-2.5 bg-navy-light hover:bg-gold/15 hover:text-gold border border-border-subtle hover:border-gold/30 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-1.5 transition-all"
            >
               Open in Google Maps →
            </a>
         </div>
      </div>
   );
}

export default function MyPropertiesTab() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const data = await res.json();
          setProperties(data || []);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const displayedProperties = properties.length > 0 ? properties : mockProperties;
  const [propertiesReminders, setPropertiesReminders] = useState<{
     [id: string]: {
        active: boolean;
        prefs: { construction100: boolean; titleReady: boolean; keysConfirmed: boolean; }
     }
  }>({});
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [activeReminderProperty, setActiveReminderProperty] = useState<Property | null>(null);
  const [reminderPrefs, setReminderPrefs] = useState({
     construction100: false,
     titleReady: false,
     keysConfirmed: false
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleOpenReminderModal = (property: Property) => {
     setActiveReminderProperty(property);
     const current = propertiesReminders[property.id];
     if (current) {
        setReminderPrefs({ ...current.prefs });
     } else {
        setReminderPrefs({
           construction100: false,
           titleReady: false,
           keysConfirmed: false
        });
     }
     setShowReminderModal(true);
  };

  const handleSaveReminderPrefs = () => {
     if (!activeReminderProperty) return;

     const hasActivePrefs = reminderPrefs.construction100 || reminderPrefs.titleReady || reminderPrefs.keysConfirmed;

     setPropertiesReminders(prev => ({
        ...prev,
        [activeReminderProperty.id]: {
           active: hasActivePrefs,
           prefs: { ...reminderPrefs }
        }
     }));

     if (hasActivePrefs) {
        const cleanName = activeReminderProperty.name.split(' — ')[0];
        const msg = `Your ${cleanName} unit is now ${activeReminderProperty.progress}% complete. Est. completion: ${activeReminderProperty.estCompletion}.`;
        
        const newNotif: Notification = {
           id: Math.random().toString(),
           message: msg,
           timestamp: new Date()
        };
        setNotifications(prev => [newNotif, ...prev]);
     }

     setShowReminderModal(false);
     setActiveReminderProperty(null);
  };

  const dismissNotification = (id: string) => {
     setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="px-6 py-8 md:py-10 bg-navy-mid border-b border-border-subtle sticky top-0 lg:top-0 z-20">
         <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">Track Your Properties</h1>
               <p className="text-gray-text text-sm max-w-xl leading-relaxed">
                  Real-time updates on every property you&apos;ve invested in or purchased.
               </p>
            </div>
            <div className="flex bg-navy p-1 rounded-xl border border-border-subtle shrink-0 self-start md:self-auto shadow-inner">
               <button 
                  onClick={() => setView('list')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${view === 'list' ? 'bg-navy-mid text-gold shadow-lg border border-border-subtle font-semibold' : 'text-gray-text hover:text-white'}`}
               >
                  📋 List View
               </button>
               <button 
                  onClick={() => setView('map')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${view === 'map' ? 'bg-navy-mid text-gold shadow-lg border border-border-subtle font-semibold' : 'text-gray-text hover:text-white'}`}
               >
                  🗺️ Map View
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
         {/* Live Notification Banners */}
         {notifications.map((notif) => (
            <div 
               key={notif.id} 
               className="bg-navy-mid border border-gold/30 text-white rounded-2xl p-4 mb-6 flex items-start justify-between gap-4 shadow-xl animate-in slide-in-from-top duration-300"
            >
               <div className="flex gap-3">
                  <span className="text-xl">🏠</span>
                  <div>
                     <div className="text-xs uppercase font-bold text-gold tracking-wider mb-0.5">Property Update</div>
                     <p className="text-sm font-medium text-gray-200">{notif.message}</p>
                  </div>
               </div>
               <button 
                  onClick={() => dismissNotification(notif.id)}
                  className="text-gray-400 hover:text-white text-xs font-semibold px-2.5 py-1 bg-navy-light/80 border border-border-subtle rounded-lg transition-colors shrink-0"
               >
                  Dismiss
               </button>
            </div>
         ))}

         {view === 'list' ? (
            <div className="space-y-2">
               {displayedProperties.map(prop => (
                  <PropertyCard 
                     key={prop.id} 
                     property={prop} 
                     isReminderActive={!!propertiesReminders[prop.id]?.active}
                     onSetReminderClick={() => handleOpenReminderModal(prop)}
                  />
               ))}
               {displayedProperties.length === 0 && (
                  <div className="text-center py-20 bg-navy-mid border border-border-subtle rounded-2xl shadow-md">
                     <Building size={48} className="mx-auto text-gray-text mb-4 opacity-50" />
                     <h3 className="text-xl text-white font-semibold mb-2">No Properties Yet</h3>
                     <p className="text-gray-text text-sm">When you invest in or purchase a property, it will appear here.</p>
                  </div>
               )}
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {displayedProperties.map(prop => (
                  <PropertyMapCard key={prop.id} property={prop} />
               ))}
            </div>
         )}
      </div>

      {/* Reminder Preference Modal */}
      {showReminderModal && activeReminderProperty && (
         <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9990] flex items-center justify-center p-4">
            <div className="bg-navy-mid border border-border-subtle rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">
               <button 
                  onClick={() => {
                     setShowReminderModal(false);
                     setActiveReminderProperty(null);
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
               >
                  <X size={18} />
               </button>
               
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-gold">
                     <Bell size={20} />
                  </div>
                  <div>
                     <h3 className="text-lg font-serif text-white font-semibold leading-tight">Set Reminder Preferences</h3>
                     <p className="text-xs text-gray-text mt-0.5">{activeReminderProperty.name}</p>
                  </div>
               </div>

               <p className="text-sm text-gray-300 mb-5 leading-relaxed">
                  Select the milestones you would like to be notified about. We will send you an email and dashboard notification.
               </p>

               <div className="space-y-3 mb-6">
                  <label className="flex items-start gap-3 p-3 bg-navy rounded-xl border border-border-subtle cursor-pointer hover:border-gold/25 transition">
                     <input 
                        type="checkbox" 
                        checked={reminderPrefs.construction100}
                        onChange={(e) => setReminderPrefs({...reminderPrefs, construction100: e.target.checked})}
                        className="mt-1 w-4 h-4 rounded text-gold bg-navy border-border-subtle focus:ring-0 focus:ring-offset-0 cursor-pointer"
                     />
                     <div>
                        <div className="text-sm font-semibold text-white">Construction Hits 100%</div>
                        <div className="text-xs text-gray-text mt-0.5">Receive an alert when construction/renovation is completed.</div>
                     </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-navy rounded-xl border border-border-subtle cursor-pointer hover:border-gold/25 transition">
                     <input 
                        type="checkbox" 
                        checked={reminderPrefs.titleReady}
                        onChange={(e) => setReminderPrefs({...reminderPrefs, titleReady: e.target.checked})}
                        className="mt-1 w-4 h-4 rounded text-gold bg-navy border-border-subtle focus:ring-0 focus:ring-offset-0 cursor-pointer"
                     />
                     <div>
                        <div className="text-sm font-semibold text-white">Title is Ready</div>
                        <div className="text-xs text-gray-text mt-0.5">Notification when title search finishes and title is ready for transfer.</div>
                     </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-navy rounded-xl border border-border-subtle cursor-pointer hover:border-gold/25 transition">
                     <input 
                        type="checkbox" 
                        checked={reminderPrefs.keysConfirmed}
                        onChange={(e) => setReminderPrefs({...reminderPrefs, keysConfirmed: e.target.checked})}
                        className="mt-1 w-4 h-4 rounded text-gold bg-navy border-border-subtle focus:ring-0 focus:ring-offset-0 cursor-pointer"
                     />
                     <div>
                        <div className="text-sm font-semibold text-white">Keys Handover Confirmed</div>
                        <div className="text-xs text-gray-text mt-0.5">Get notified immediately once your handover appointment is scheduled.</div>
                     </div>
                  </label>
               </div>

               <div className="flex gap-3">
                  <button 
                     onClick={() => {
                        setShowReminderModal(false);
                        setActiveReminderProperty(null);
                     }}
                     className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-navy border border-border-subtle hover:bg-navy-light transition"
                  >
                     Cancel
                  </button>
                  <button 
                     onClick={handleSaveReminderPrefs}
                     className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-black bg-gold hover:bg-gold-light transition"
                  >
                     Save Preferences
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
