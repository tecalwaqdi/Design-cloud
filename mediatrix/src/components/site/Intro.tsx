import { Logomark } from "../art/Logo";
import { Wordmark } from "../art/Wordmark";

// First-visit splash: the heartbeat draws itself, then the curtain lifts.
// Hidden instantly on later page views via the `intro-seen` class set in <head>.
export function Intro({ name }: { name: string }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem('mtx_intro'))document.documentElement.classList.add('intro-seen');else sessionStorage.setItem('mtx_intro','1')}catch(e){}`,
        }}
      />
      <div id="intro" className="bg-ice fixed inset-0 z-[100] flex items-center justify-center" aria-hidden="true">
        <div className="flex flex-col items-center" dir="ltr">
          <Logomark className="h-20 w-48 md:h-24 md:w-56" id="lm-intro" />
          <span className="intro-word mt-5">
            {name.toLowerCase() === "mediatrix" ? (
              <Wordmark uid="wm-intro" className="text-6xl md:text-7xl" />
            ) : (
              <span className="font-logo text-4xl font-bold text-navy md:text-6xl">{name}</span>
            )}
          </span>
        </div>
      </div>
      <style>{`
        html.intro-seen #intro{display:none}
        #intro{animation:introOut .9s cubic-bezier(.7,0,.3,1) 2.3s forwards}
        .intro-word{opacity:0;transform:scale(.92);filter:blur(6px);animation:introWord 1.1s cubic-bezier(.22,1,.36,1) .9s forwards}
        @keyframes introWord{to{opacity:1;transform:none;filter:none}}
        @keyframes introOut{to{opacity:0;visibility:hidden;transform:translateY(-3%)}}
        @media (prefers-reduced-motion: reduce){#intro{display:none}}
      `}</style>
    </>
  );
}
