import { Balloon, Star, Confetti } from "../hooks/useCelebration";

interface CelebrationLayerProps {
  showBalloons: boolean;
  balloons: Balloon[];
  stars: Star[];
  confetti: Confetti[];
  onBalloonPop: (balloonId: number, e: React.MouseEvent) => void;
}

export const CelebrationLayer = ({
  showBalloons,
  balloons,
  stars,
  confetti,
  onBalloonPop,
}: CelebrationLayerProps) => {
  const balloonColors = [
    { body: "#ff6b6b", knot: "#dc2626", gradient: "url(#gradientRed)" },
    { body: "#60a5fa", knot: "#3b82f6", gradient: "url(#gradientBlue)" },
    { body: "#fbbf24", knot: "#f59e0b", gradient: "url(#gradientYellow)" },
    { body: "#34d399", knot: "#10b981", gradient: "url(#gradientGreen)" }
  ];

  return (
    <>
      {/* CELEBRATION BALLOONS */}
      {showBalloons && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {balloons.filter(b => !b.popped).map((balloon, index) => {
            const color = balloonColors[index % 4];
            
            return (
              <div
                key={balloon.id}
                onClick={(e) => onBalloonPop(balloon.id, e)}
                className="pointer-events-auto cursor-pointer"
                style={{
                  position: 'fixed',
                  left: `${balloon.x}%`,
                  bottom: '-100px',
                  animation: `floatUpSlow 15s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                  animationDelay: `${index * 0.4}s`,
                  width: '120px',
                  height: '200px',
                }}
              >
                <div className="relative w-full h-full flex flex-col items-center group hover:scale-110 transition-transform">
                  {/* Balloon SVG */}
                  <svg width="120" height="140" viewBox="0 0 120 140" className="drop-shadow-2xl flex-shrink-0">
                    {/* Balloon body */}
                    <ellipse 
                      cx="60" 
                      cy="60" 
                      rx="50" 
                      ry="58" 
                      fill={color.gradient}
                      stroke="#fff"
                      strokeWidth="2"
                      className="filter drop-shadow-lg"
                    />
                    {/* Shine effect */}
                    <ellipse 
                      cx="42" 
                      cy="35" 
                      rx="20" 
                      ry="28" 
                      fill="rgba(255, 255, 255, 0.35)"
                    />
                    {/* Balloon knot */}
                    <path 
                      d="M 60 118 Q 55 125 60 130 Q 65 125 60 118" 
                      fill={color.knot}
                    />
                    <defs>
                      <radialGradient id="gradientRed" cx="40%" cy="40%">
                        <stop offset="0%" stopColor="#ff8080" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </radialGradient>
                      <radialGradient id="gradientBlue" cx="40%" cy="40%">
                        <stop offset="0%" stopColor="#93c5fd" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </radialGradient>
                      <radialGradient id="gradientYellow" cx="40%" cy="40%">
                        <stop offset="0%" stopColor="#fcd34d" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </radialGradient>
                      <radialGradient id="gradientGreen" cx="40%" cy="40%">
                        <stop offset="0%" stopColor="#6ee7b7" />
                        <stop offset="100%" stopColor="#10b981" />
                      </radialGradient>
                    </defs>
                  </svg>
                  
                  {/* String */}
                  <div className="w-1 h-16 bg-gradient-to-b from-gray-400 to-gray-600 flex-shrink-0"></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CELEBRATION STARS */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="fixed pointer-events-none z-50 animate-starBurst"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
          }}
        >
          <span className="text-4xl">⭐</span>
        </div>
      ))}

      {/* CONFETTI BURST */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            animation: `confettiFall 2s ease-in forwards`,
            opacity: 1,
            transform: `translate(${piece.vx * 20}px, ${piece.vy * 20}px) rotate(${Math.random() * 360}deg)`,
          }}
        >
          <span className="text-2xl">{['🎉', '✨', '🌟', '💫', '🎊'][Math.floor(Math.random() * 5)]}</span>
        </div>
      ))}
    </>
  );
};
