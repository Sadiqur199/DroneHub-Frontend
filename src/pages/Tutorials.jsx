import React, { useState, useEffect } from 'react';
import { tutorialsApi } from '../services/api';
import { 
  Play, BookOpen, Clock, Tag, Search, Filter, 
  ExternalLink, CheckCircle, Video, ShieldCheck, X 
} from 'lucide-react';

export const Tutorials = ({ onNavigate }) => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  const categories = ['All', 'Getting Started', 'Operations', 'Maintenance', 'Troubleshooting'];

  useEffect(() => {
    fetchTutorials();
  }, [selectedCategory]);

  const fetchTutorials = async () => {
    setLoading(true);
    try {
      const res = await tutorialsApi.getAll({
        category: selectedCategory === 'All' ? '' : selectedCategory,
        search: searchQuery
      });
      if (res.success) {
        setTutorials(res.data);
      }
    } catch (err) {
      console.error('Error fetching tutorials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTutorials();
  };

  return (
    <div
      className="w-full min-h-screen py-10 px-4 sm:px-8 text-slate-100 selection:bg-cyan-500 selection:text-white relative overflow-hidden"
      style={{ backgroundColor: '#0F172A' }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/60 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-700/80">
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>DroneHab Flight Academy &amp; Technical Workshop</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              Commercial Drone Tutorials &amp; Operational Guides
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Step-by-step video instructions for DJI Agras T50, Matrice 350 RTK calibration, spray rate setup, field pump maintenance, and CASA compliance standards.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                    : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-80">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guide by keyword..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-xl transition-colors border border-slate-600"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Tutorials Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-medium text-slate-400">Loading flight tutorials from database...</p>
          </div>
        ) : tutorials.length === 0 ? (
          <div className="py-20 bg-slate-800/40 rounded-3xl border border-dashed border-slate-700 text-center space-y-4">
            <Video className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Tutorials Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No tutorials match your selected category or query. You can add new tutorials from the Admin Dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/60 hover:bg-slate-800 rounded-2xl border border-slate-700/80 hover:border-cyan-500/50 overflow-hidden transition-all group flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-cyan-500/5"
              >
                <div>
                  {/* Thumbnail / Video Preview Area */}
                  <div
                    onClick={() => setActiveVideo(item)}
                    className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.thumbnail || '/drone.png'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/drone.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-cyan-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[11px] font-mono text-white flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.duration}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description || 'Comprehensive step-by-step guide provided by certified DroneHab technicians.'}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setActiveVideo(item)}
                    className="w-full py-2.5 rounded-xl bg-slate-700/50 hover:bg-cyan-600 text-slate-300 hover:text-white text-xs font-semibold border border-slate-600/60 hover:border-cyan-600 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Tutorial</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Player Modal */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl relative">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between text-white">
                <div>
                  <span className="text-[11px] font-bold uppercase text-cyan-400 block">
                    {activeVideo.category} • {activeVideo.duration}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    {activeVideo.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Container */}
              <div className="relative aspect-video bg-black">
                {activeVideo.video_url.includes('youtube.com') || activeVideo.video_url.includes('youtu.be') ? (
                  <iframe
                    src={activeVideo.video_url}
                    title={activeVideo.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={activeVideo.video_url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support HTML5 video.
                  </video>
                )}
              </div>

              {/* Video Description */}
              <div className="p-5 text-xs text-slate-300 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
                <p className="max-w-2xl">{activeVideo.description}</p>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold text-xs transition-colors shrink-0"
                >
                  Close Video
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
