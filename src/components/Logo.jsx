import VerinestLogo from "/assets/verinestlogo.svg";

function Logo() {
  return (
      <div className="flex items-center justify-center space-x-2">
        <img
          src={VerinestLogo}
          alt="VeriNest logo featuring a modern, minimalist design with a stylized house icon. The text VeriNest is displayed in bold, professional font next to the icon."
        />
      </div>
    
  );
}

export default Logo;
