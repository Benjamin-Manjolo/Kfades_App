import { useState } from "react";

const styles = `
  .neu-bg { background: #e0e5ec; } 
  .neu {
    box-shadow: 6px 6px 12px #b8bec7, -6px -6px 12px #ffffff;
  }
  .neu-inset {
    box-shadow: inset 6px 6px 12px #b8bec7, inset -6px -6px 12px #ffffff;
  }
  .neu-soft {
    box-shadow: 3px 3px 8px #b8bec7, -3px -3px 8px #ffffff;
  }
  .neu-btn:active {
    box-shadow: inset 4px 4px 8px #b8bec7, inset -4px -4px 8px #ffffff;
  }
  .toggle-on {
    box-shadow: inset 4px 4px 8px #b8bec7, inset -4px -4px 8px #ffffff;
  }
`;

export default function NeumorphismDemo() {
  const [toggled, setToggled] = useState(false);
  const [sliderVal, setSliderVal] = useState(60);
  const [pressed, setPressed] = useState(false);

  return (
    <>
      <style>{styles}</style>
      <div className="neu-bg min-h-screen flex items-center justify-center p-10 font-sans">
        <div className="neu rounded-3xl p-10 w-full max-w-md space-y-8">
          <h1 className="text-2xl font-bold text-gray-500 tracking-wide text-center">
            Neumorphism UI
          </h1>
          <div className="neu rounded-xl p-4 text-orange-500 font-bold text-lg">button</div>
          <div className="neu-inset rounded-xl text-gray-500 px-4 py-3 font-semibold ">Input text</div>
          <div className="neu rounded-2xl p-6 space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Balance</p>
            <p className="text-4xl font-bold text-gray-600">$4,820.00</p>
            <p className="text-xs text-green-400">↑ 12.4% this month</p>
          </div>
          <div className="neu-inset rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-gray-400">🔍</span>
            <input
              className="bg-transparent outline-none text-gray-500 placeholder-gray-400 w-full text-sm"
              placeholder="Search transactions..."
            />
          </div>
          <button
            className="neu-btn neu w-full rounded-xl py-3 text-gray-500 font-semibold tracking-wide transition-all duration-150"
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
          >
            {pressed ? "Processing..." : "Send Payment"}
          </button>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Dark Mode</span>
            <button
              onClick={() => setToggled(!toggled)}
              className={`w-14 h-7 rounded-full relative transition-all duration-300 neu ${toggled ? "toggle-on" : ""}`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 ${
                  toggled ? "left-8 bg-blue-400 shadow-md" : "left-1 bg-gray-300 shadow-md"
                }`}
              />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Volume</span>
              <span>{sliderVal}%</span>
            </div>
            <div className="neu-inset rounded-full h-3 relative">
              <input
                type="range" min="0" max="100" value={sliderVal}
                onChange={(e:any) => setSliderVal(e.target.value)}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
              />
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-300 to-blue-400 transition-all"
                style={{ width: `${sliderVal}%` }}
              />
            </div>
          </div>
          <div className="flex justify-around">
            {["💳", "📊", "🔔", "⚙️"].map((icon, i) => (
              <button key={i} className="neu neu-btn w-12 h-12 rounded-xl text-xl transition-all duration-150">
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}