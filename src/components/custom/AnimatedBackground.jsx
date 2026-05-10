const monuments = [
  {
    src: "/icons/eiffel.svg",
    className: "top-[10%] left-[5%] w-24 animate-floatSlow",
  },
  {
    src: "/icons/tajmahal.svg",
    className: "top-[60%] left-[15%] w-28 animate-float",
  },
  {
    src: "/icons/pisa.svg",
    className: "top-[20%] right-[10%] w-20 animate-floatFast",
  },
  {
    src: "/icons/charminar.svg",
    className: "bottom-[10%] right-[20%] w-24 animate-floatSlow",
  },
  {
    src: "/icons/liberty.svg",
    className: "bottom-[25%] left-[40%] w-20 animate-float",
  },
];

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1020] via-[#111827] to-[#050816]" />

      {/* Glow blobs */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-3xl rounded-full" />

      {/* Monuments */}
      {monuments.map((item, index) => (
        <img
          key={index}
          src={item.src}
          alt=""
          className={`absolute opacity-[0.06] blur-[1px] select-none ${item.className}`}
        />
      ))}
    </div>
  );
}

export default AnimatedBackground;