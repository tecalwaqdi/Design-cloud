"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function Gallery({ items }: { items: { url: string; caption: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const isVideo = (u: string) => /\.(mp4|webm|mov)(\?|$)/i.test(u);
  return (
    <>
      <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {items.map((it, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.1 }}
            onClick={() => setOpen(i)}
            className="glass group relative block w-full overflow-hidden rounded-2xl p-1.5"
          >
            {isVideo(it.url) ? (
              <video src={it.url} className="w-full rounded-xl" muted loop autoPlay playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.url} alt={it.caption} loading="lazy" className="w-full rounded-xl transition duration-700 group-hover:scale-[1.04]" />
            )}
            {it.caption && (
              <span className="absolute inset-x-1.5 bottom-1.5 rounded-b-xl bg-gradient-to-t from-[#7d6238]/75 to-transparent p-3 text-start text-xs text-white opacity-0 transition group-hover:opacity-100">
                {it.caption}
              </span>
            )}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[#f6f1e6]/92 p-6 backdrop-blur-sm"
          >
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }} className="max-h-full max-w-5xl">
              {isVideo(items[open].url) ? (
                <video src={items[open].url} className="max-h-[85vh] rounded-2xl" controls autoPlay />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={items[open].url} alt={items[open].caption} className="max-h-[85vh] rounded-2xl" />
              )}
              {items[open].caption && <p className="mt-3 text-center text-sm text-navy">{items[open].caption}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
