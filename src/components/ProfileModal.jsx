import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, Calendar, Heart, Star } from "lucide-react";

const IMAGE_FALLBACK = "https://placehold.co/400x600?text=KLP48";

export default function ProfileModal({ member, isOpen, onClose }) {
  if (!member) return null;

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
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, rotate: -3 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.85, opacity: 0, rotate: 3 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="relative w-full max-w-lg sticker bg-cream rounded-3xl overflow-hidden font-sans"
          >
            {/* Washi tape */}
            <div className="washi-tape -top-3 left-6 sm:left-12 transform -rotate-6 z-30" />
            <div className="washi-tape -top-3 right-6 sm:right-12 transform rotate-3 z-30" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 p-2 bg-white border-2 border-ink rounded-full shadow-[2px_2px_0_#064e3b] text-ink hover:bg-sakura-100 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Image — polaroid style */}
              <div className="w-full md:w-1/2 p-4 pt-8 md:pt-6">
                <div className="bg-white border-2 border-ink shadow-[4px_4px_0_#064e3b] p-2 pb-6 rounded-sm">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { e.target.src = IMAGE_FALLBACK; }}
                    className="w-full aspect-[3/4] object-cover bg-cream"
                  />
                  <div className="text-center font-script text-lg text-ink mt-2">
                    {member.name}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="w-full md:w-1/2 p-5 pt-4 md:pt-8 space-y-4">
                <div>
                  <h2 className="font-kawaii font-bold text-2xl sm:text-3xl text-emerald-700 leading-tight">
                    {member.name}
                  </h2>
                  <p className="font-script text-base text-ink/60">{member.fullName}</p>
                </div>

                <div className="space-y-2.5 text-sm font-sans">
                  <InfoRow icon={Star}     label="Nickname"   value={member.nickname || member.name} />
                  <InfoRow icon={Calendar} label="Birth Date" value={member.birthDate || "N/A"} />
                  <InfoRow icon={Heart}    label="Hobbies"    value={member.hobbies || "N/A"} />

                  {member.instagram && (
                    <a
                      href={`https://instagram.com/${member.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sakura-600 hover:text-sakura-700 font-kawaii font-bold transition pt-1"
                    >
                      <Instagram className="w-4 h-4" />
                      @{member.instagram}
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="sticker bg-white px-3 py-1 rounded-full text-xs font-kawaii font-bold text-emerald-700">
                    Gen {member.generation}
                  </span>
                  <span className={`sticker-pink bg-white px-3 py-1 rounded-full text-xs font-kawaii font-bold ${
                    member.status === "active" ? "text-emerald-700" : "text-ink/60"
                  }`}>
                    {member.status === "active" ? "💚 Active" : "🎓 Graduated"}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer button */}
            <div className="bg-sakura-100 border-t-2 border-ink p-4">
              <button
                onClick={onClose}
                className="btn-pop w-full bg-white py-2.5 rounded-full font-kawaii font-bold text-ink"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2 text-ink/80">
      <Icon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
      <div>
        <span className="font-kawaii font-bold text-ink">{label}:</span>{" "}
        <span>{value}</span>
      </div>
    </div>
  );
}
