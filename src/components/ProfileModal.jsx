import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, Calendar, Heart, Star } from "lucide-react";
import { Button } from "./ui/button";

export default function ProfileModal({ member, isOpen, onClose }) {
  if (!member) return null;

  const IMAGE_FALLBACK = "https://placehold.co/400x600?text=KLP48";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-100"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info Section */}
              <div className="w-full md:w-1/2 p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-black text-emerald-700">{member.name}</h2>
                  <p className="text-sm text-gray-500 font-medium">{member.fullName}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Star className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold">Nickname:</span> {member.nickname || member.name}
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold">Birth Date:</span> {member.birthDate || "N/A"}
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <Heart className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold">Hobbies:</span> {member.hobbies || "N/A"}
                  </div>

                  {member.instagram && (
                    <a
                      href={`https://instagram.com/${member.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold transition pt-2"
                    >
                      <Instagram className="w-4 h-4" />
                      @{member.instagram}
                    </a>
                  )}
                </div>

                <div className="pt-4">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    Generation {member.generation}
                  </span>
                  <span className={`ml-2 inline-block px-3 py-1 text-xs font-bold rounded-full ${
                    member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {member.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="bg-emerald-50 p-4">
               <Button onClick={onClose} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">
                 Close Profile
               </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
