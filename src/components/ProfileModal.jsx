import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, Calendar, Heart, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const IMAGE_FALLBACK = "https://placehold.co/400x600?text=KLP48";
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ProfileModal({ member, isOpen, onClose }) {
  const { t } = useTranslation();
  const modalRef = useRef(null);

  // Focus management: trap Tab inside the modal, close on Esc, and
  // restore focus to the previously-focused element on close.
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement;

    // Defer the initial focus until after framer-motion has mounted the node.
    const focusTimer = setTimeout(() => {
      const root = modalRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusables.length > 0) focusables[0].focus();
    }, 0);

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = modalRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      // Restore focus to whoever opened the modal.
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, onClose]);

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
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
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
              aria-label={t("profile.close")}
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
                  <h2 id="profile-modal-title" className="font-kawaii font-bold text-2xl sm:text-3xl text-emerald-700 leading-tight">
                    {member.name}
                  </h2>
                  <p className="font-script text-base text-ink/60">{member.fullName}</p>
                </div>

                <div className="space-y-2.5 text-sm font-sans">
                  <InfoRow icon={Star}     label={t("profile.nickname")}   value={member.nickname || member.name} />
                  <InfoRow icon={Calendar} label={t("profile.birthDate")}  value={member.birthDate || t("profile.notAvailable")} />
                  <InfoRow icon={Heart}    label={t("profile.hobbies")}    value={member.hobbies || t("profile.notAvailable")} />

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
                    {t("generationLabel", { gen: member.generation })}
                  </span>
                  <span className={`sticker-pink bg-white px-3 py-1 rounded-full text-xs font-kawaii font-bold ${
                    member.status === "active" ? "text-emerald-700" : "text-ink/60"
                  }`}>
                    {member.status === "active" ? t("profile.activeBadge") : t("profile.graduatedBadge")}
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
                {t("profile.close")}
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
