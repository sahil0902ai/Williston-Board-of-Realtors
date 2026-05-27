'use client';
import { useState } from 'react';
import { MapPin, Search, Calendar as CalendarIcon, CheckCircle2, ShieldCheck, Zap, Wifi, Key, X } from 'lucide-react';
import { FadeUp, FadeUpItem } from '@/components/FadeUp';

type selectedDuration = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

const amenities2Bed = ['WiFi', 'AC', 'Generator', 'Water', 'Security', 'Parking', 'Kitchen', 'TV', 'Washing Machine'];
const amenities3Bed = ['WiFi', '3 AC Units', '24/7 Power', 'Water', 'Security', '2 Parking', 'Full Kitchen', '3 Smart TVs', 'Washing Machine', 'Balcony', 'DSTV'];

const pricing2Bed = {
  Daily: { price: '$300 / night', save: '—' },
  Weekly: { price: '$700 / week', save: 'Save $1,400' },
  Monthly: { price: '$2,000 / month', save: 'Save $7,000' },
  Yearly: { price: '$24,000 / year', save: 'Save $84,000' }
};

const pricing3Bed = {
  Daily: { price: '$500 / night', save: '—' },
  Weekly: { price: '$900 / week', save: 'Save $2,600' },
  Monthly: { price: '$3,000 / month', save: 'Save $12,000' },
  Yearly: { price: '$36,000 / year', save: 'Save $144,000' }
};

export default function Rentals() {
  const [duration, setDuration] = useState<selectedDuration>('Monthly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState('');
  
  // Booking Form State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'success'>('idle');

  const openBooking = (apt: string) => {
    setSelectedApt(apt);
    setIsModalOpen(true);
    setBookingStatus('idle');
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('success');
    setTimeout(() => {
      setIsModalOpen(false);
    }, 3000);
  };

  return (
    <div className="bg-[#02050E]">
      {/* Hero Strip */}
      <section className="bg-navy border-b border-border-subtle pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 object-cover pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://picsum.photos/seed/apartment/1920/1080?grayscale')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Furnished Apartments for Rent</h1>
          <p className="text-gray-text text-lg max-w-2xl mx-auto mb-10">
            Premium short-stay and long-term furnished apartments in Houston. Daily, weekly, monthly and yearly rates available.
          </p>

          {/* Search Bar */}
          <div className="bg-navy-mid border border-border-gold p-2 rounded-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2 shadow-2xl shadow-gold/5">
            <div className="flex-1 relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
              <input type="text" placeholder="Location (e.g. GRA, Houston)" className="w-full bg-navy border border-border-subtle rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-gold transition-colors placeholder-gray-text" />
            </div>
            <div className="flex-1 relative">
              <select className="w-full bg-navy border border-border-subtle rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-gold appearance-none">
                <option value="">Apartment Type</option>
                <option value="2bed">2 Bedroom Apartment</option>
                <option value="3bed">3 Bedroom Apartment</option>
              </select>
            </div>
            <div className="flex-1 relative">
              <select className="w-full bg-navy border border-border-subtle rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-gold appearance-none">
                <option value="">Duration</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <button className="bg-gold text-navy font-bold rounded-xl py-3 px-8 hover:bg-white transition-colors flex items-center justify-center gap-2">
              <Search size={18} /> Search
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Controls */}
        <div className="flex flex-col items-center mb-16">
          <div className="inline-flex items-center p-1.5 bg-navy-mid border border-border-subtle rounded-full mb-4 overflow-x-auto max-w-full hide-scrollbar">
            {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((d) => (
              <button 
                key={d}
                onClick={() => setDuration(d as selectedDuration)}
                className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${duration === d ? 'bg-gold text-navy shadow-md shadow-gold/20' : 'text-gray-text hover:text-white'}`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-text bg-navy border border-border-subtle px-4 py-2 rounded-lg flex items-center gap-2">
            📌 Minimum short stay: 2 nights | Minimum long stay: 3 months | All utilities included
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-24">
          
          {/* 2 Bedroom Apartment */}
          <div className="bg-navy border border-border-subtle rounded-2xl overflow-hidden flex flex-col group hover:border-gold/30 transition-colors">
            <div className="relative h-64 bg-navy-mid overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity duration-500" style={{ backgroundImage: "url('https://picsum.photos/seed/interior2/800/600')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
              <div className="absolute top-4 left-4 bg-[rgba(4,9,26,0.97)] backdrop-blur border border-border-subtle text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-widest">
                2 Bedroom Apartment
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-2xl font-serif text-white mb-2 flex items-center gap-2">
                Williston Residences
              </h3>
              <div className="flex items-center text-gray-text text-sm mb-4 gap-1">
                <MapPin size={16} className="text-gold" /> River Oaks District, Houston, TX
              </div>
              <p className="text-gray-text text-sm mb-6 leading-relaxed">
                Fully furnished 2-bedroom serviced apartment with modern kitchen, air conditioning, 24/7 electricity (solar + generator backup), fast WiFi, and dedicated parking. Ideal for professionals, couples, and small families.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {amenities2Bed.map((amenity, i) => (
                  <span key={i} className="bg-navy-light text-gray-300 text-[10px] px-2 py-1 rounded border border-border-subtle uppercase tracking-wider">
                    {amenity}
                  </span>
                ))}
              </div>

              {/* Pricing Table */}
              <div className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden mb-8 mt-auto">
                {Object.entries(pricing2Bed).map(([key, val]) => (
                  <div key={key} className={`flex items-center justify-between p-4 border-b border-border-subtle last:border-0 ${duration === key ? 'bg-gold/10 relative' : ''}`}>
                    {duration === key && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold"></div>}
                    <div className="font-semibold text-white w-20">{key}</div>
                    <div className="flex-1 px-4">
                      <div className={`font-serif text-lg ${duration === key ? 'text-gold' : 'text-gray-300'}`}>{val.price}</div>
                    </div>
                    <div className="text-right w-28">
                      {val.save !== '—' ? (
                        <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap uppercase">
                          {val.save}
                        </span>
                      ) : <span className="text-gray-600 text-xs">—</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => openBooking('2 Bedroom Apartment')} className="flex-1 bg-gold text-navy font-bold py-3 px-4 rounded-xl hover:bg-white transition-colors text-sm text-center">
                  Book This Apartment
                </button>
                <button className="flex-1 bg-transparent border border-green-500 text-green-400 font-bold py-3 px-4 rounded-xl hover:bg-green-500/10 transition-colors text-sm text-center">
                  WhatsApp Inquiry
                </button>
              </div>
            </div>
          </div>

          {/* 3 Bedroom Apartment */}
          <div className="bg-navy border border-border-subtle rounded-2xl overflow-hidden flex flex-col group hover:border-gold/30 transition-colors relative">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold/10 rounded-full blur-[40px] z-0 pointer-events-none"></div>
            
            <div className="relative h-64 bg-navy-mid overflow-hidden z-10">
              <div className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity duration-500" style={{ backgroundImage: "url('https://picsum.photos/seed/interior3/800/600')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-[rgba(4,9,26,0.97)] backdrop-blur border border-border-subtle text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-widest">
                  3 Bedroom Apartment
                </span>
                <span className="bg-gold text-navy text-xs font-bold px-3 py-1.5 rounded uppercase tracking-widest hidden sm:inline-block">
                  Spacious
                </span>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col z-10">
              <h3 className="text-2xl font-serif text-white mb-2 flex items-center gap-2">
                Williston Executive Suites
              </h3>
              <div className="flex items-center text-gray-text text-sm mb-4 gap-1">
                <MapPin size={16} className="text-gold" /> GRA, Houston
              </div>
              <p className="text-gray-text text-sm mb-6 leading-relaxed">
                Spacious fully furnished 3-bedroom executive apartment perfect for families, corporate clients, and extended stays. Features a large living area, modern chef&apos;s kitchen, 3 en-suite bathrooms, and a private balcony.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {amenities3Bed.map((amenity, i) => (
                  <span key={i} className="bg-navy-light text-gray-300 text-[10px] px-2 py-1 rounded border border-border-subtle uppercase tracking-wider">
                    {amenity}
                  </span>
                ))}
              </div>

              {/* Pricing Table */}
              <div className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden mb-8 mt-auto">
                {Object.entries(pricing3Bed).map(([key, val]) => (
                  <div key={key} className={`flex items-center justify-between p-4 border-b border-border-subtle last:border-0 ${duration === key ? 'bg-gold/10 relative' : ''}`}>
                    {duration === key && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold"></div>}
                    <div className="font-semibold text-white w-20">{key}</div>
                    <div className="flex-1 px-4">
                      <div className={`font-serif text-lg ${duration === key ? 'text-gold' : 'text-gray-300'}`}>{val.price}</div>
                    </div>
                    <div className="text-right w-28">
                      {val.save !== '—' ? (
                        <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap uppercase">
                          {val.save}
                        </span>
                      ) : <span className="text-gray-600 text-xs">—</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => openBooking('3 Bedroom Apartment')} className="flex-1 bg-gold text-navy font-bold py-3 px-4 rounded-xl hover:bg-white transition-colors text-sm text-center">
                  Book This Apartment
                </button>
                <button className="flex-1 bg-transparent border border-green-500 text-green-400 font-bold py-3 px-4 rounded-xl hover:bg-green-500/10 transition-colors text-sm text-center">
                  WhatsApp Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Why Rent With Us */}
        <div className="mb-24">
          <h2 className="text-3xl font-serif text-center mb-12">Why Rent With Williston</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-navy-mid border border-border-subtle rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4 border border-gold/20">
                <Key size={24} />
              </div>
              <h4 className="text-white font-medium mb-2">Instant Move-In</h4>
              <p className="text-gray-text text-sm">All utilities included, zero setup stress. Just bring your luggage.</p>
            </div>
            <div className="bg-navy-mid border border-border-subtle rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4 border border-gold/20">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-white font-medium mb-2">100% Secure</h4>
              <p className="text-gray-text text-sm">Gated estate with 24/7 manned security and comprehensive CCTV coverage.</p>
            </div>
            <div className="bg-navy-mid border border-border-subtle rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4 border border-gold/20">
                <Zap size={24} />
              </div>
              <h4 className="text-white font-medium mb-2">24/7 Power</h4>
              <p className="text-gray-text text-sm">Solar + diesel generator backup. Never worry about NEPA interruptions again.</p>
            </div>
            <div className="bg-navy-mid border border-border-subtle rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4 border border-gold/20">
                <Wifi size={24} />
              </div>
              <h4 className="text-white font-medium mb-2">Fast WiFi</h4>
              <p className="text-gray-text text-sm">High-speed reliable internet included in all rental packages.</p>
            </div>
          </div>
        </div>

        {/* Availability Calendar */}
        <div className="bg-navy-mid border border-border-subtle rounded-2xl p-8 max-w-4xl mx-auto overflow-hidden">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                 <h3 className="text-2xl font-serif text-white flex items-center gap-2">
                   <CalendarIcon className="text-gold" /> Check Availability
                 </h3>
                 <p className="text-sm text-gray-text">Current month overview</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                 <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-500/20 border border-green-500"></div> Available</span>
                 <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-500/20 border border-red-500"></div> Booked</span>
                 <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500"></div> Pending</span>
              </div>
           </div>

           <div className="overflow-x-auto hide-scrollbar">
              <div className="min-w-[700px]">
                 <div className="mb-4">
                    <div className="text-xs text-gray-text uppercase tracking-widest font-semibold mb-2">2 Bedroom Apartment</div>
                    <div className="flex gap-1">
                      {Array.from({ length: 30 }).map((_, i) => {
                        const isBooked = [3, 4, 5, 12, 13, 14, 15, 22].includes(i);
                        const isPending = [6, 7].includes(i);
                        return (
                          <div 
                            key={i} 
                            className={`flex-1 h-8 rounded border ${isBooked ? 'bg-red-500/20 border-red-500/50' : isPending ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-green-500/10 border-green-500/30'} flex items-center justify-center text-[10px] text-gray-text`}
                          >
                            {i + 1}
                          </div>
                        )
                      })}
                    </div>
                 </div>
                 
                 <div>
                    <div className="text-xs text-gray-text uppercase tracking-widest font-semibold mb-2">3 Bedroom Apartment</div>
                    <div className="flex gap-1">
                      {Array.from({ length: 30 }).map((_, i) => {
                        const isBooked = [1, 2, 3, 4, 18, 19, 20, 21, 22].includes(i);
                        const isPending = [25, 26, 27].includes(i);
                        return (
                          <div 
                            key={i} 
                            className={`flex-1 h-8 rounded border ${isBooked ? 'bg-red-500/20 border-red-500/50' : isPending ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-green-500/10 border-green-500/30'} flex items-center justify-center text-[10px] text-gray-text`}
                          >
                            {i + 1}
                          </div>
                        )
                      })}
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </section>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(4,9,26,0.97)]  z-50 flex items-center justify-center p-4">
          <div className="bg-navy-mid border border-border-gold rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-text hover:text-white bg-navy border border-border-subtle rounded-full p-1"
            >
              <X size={20} />
            </button>
            
            <div className="p-8">
              {bookingStatus === 'success' ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-serif text-white">Request Received!</h3>
                  <p className="text-gray-text">
                    We&apos;ve received your booking request for the <strong className="text-white">{selectedApt}</strong>.
                    <br /><br />
                    We&apos;ll confirm availability within 2 hours via WhatsApp.
                  </p>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-full mt-6 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-serif text-white mb-2">Booking Inquiry</h3>
                  <p className="text-sm text-gray-text mb-8">Provide your details and we&apos;ll confirm availability shortly.</p>
                  
                  <form onSubmit={handleBook} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-text uppercase tracking-widest font-semibold">Apartment Selected</label>
                      <input type="text" value={selectedApt} disabled className="w-full bg-navy border border-border-gold text-gold rounded-lg py-3 px-4 text-sm font-medium opacity-80 cursor-not-allowed" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-text uppercase tracking-widest font-semibold">Full Name</label>
                        <input type="text" required placeholder="John Doe" className="w-full bg-navy border border-border-subtle rounded-lg py-3 px-4 text-white text-sm focus:border-gold focus:outline-none placeholder-gray-text/50" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-text uppercase tracking-widest font-semibold">WhatsApp Number</label>
                        <input type="tel" required placeholder="+1..." className="w-full bg-navy border border-border-subtle rounded-lg py-3 px-4 text-white text-sm focus:border-gold focus:outline-none placeholder-gray-text/50" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-text uppercase tracking-widest font-semibold">Email Address</label>
                      <input type="email" required placeholder="john@example.com" className="w-full bg-navy border border-border-subtle rounded-lg py-3 px-4 text-white text-sm focus:border-gold focus:outline-none placeholder-gray-text/50" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-text uppercase tracking-widest font-semibold">Check-in Date</label>
                        <input 
                          type="date" 
                          required 
                          value={checkIn}
                          onChange={e => setCheckIn(e.target.value)}
                          className="w-full bg-navy border border-border-subtle rounded-lg py-3 px-4 text-white text-sm focus:border-gold focus:outline-none" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-text uppercase tracking-widest font-semibold">Check-out Date</label>
                        <input 
                          type="date" 
                          required 
                          value={checkOut}
                          onChange={e => setCheckOut(e.target.value)}
                          className="w-full bg-navy border border-border-subtle rounded-lg py-3 px-4 text-white text-sm focus:border-gold focus:outline-none" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-text uppercase tracking-widest font-semibold">Special Requests (Optional)</label>
                      <textarea rows={3} placeholder="Any specific requirements?" className="w-full bg-navy border border-border-subtle rounded-lg py-3 px-4 text-white text-sm focus:border-gold focus:outline-none placeholder-gray-text/50 resize-none"></textarea>
                    </div>

                    {(checkIn && checkOut) && (
                      <div className="p-4 bg-gold/10 border border-gold/30 rounded-xl my-4 text-sm text-center">
                        <div className="text-gray-300">Estimated stay: <span className="font-bold text-white">Selected Duration</span></div>
                        <div className="text-xs text-gold mt-1">Total price will be confirmed based on final dates.</div>
                      </div>
                    )}

                    <div className="pt-4">
                      <button type="submit" className="w-full py-4 bg-gold text-navy font-bold rounded-xl hover:bg-white transition-colors">
                        Send Booking Request
                      </button>
                      <p className="text-center text-xs text-gray-400 mt-4">We&apos;ll confirm availability within 2 hours via WhatsApp or Telegram</p>
                      <p className="text-center text-xs mt-2 text-gray-400">
                        Prefer to message us directly? 
                        <br className="md:hidden" />
                        <a href="mailto:willistonboardofrealtors@gmail.com" className="text-gold hover:underline">📧 willistonboardofrealtors@gmail.com</a> | <a href="https://t.me/willistonboardofrealtors" target="_blank" rel="noopener" className="text-[#0088cc] hover:underline">✈️ @willistonboardofrealtors</a>
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
