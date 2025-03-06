
import React from "react";
interface HeaderProps {
  updateGridLayout: (selectedLayout: number) => void;
}

const Header: React.FC<HeaderProps> = ({ updateGridLayout }) => {
  return (
    
    <div className="header">
      <h1>VIDEO PLAYBACK</h1>
      <div className="layout-buttons">
        
        <button
          onClick={() => updateGridLayout(1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <button
          onClick={() => updateGridLayout(2)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16M8 6v12M16 6v12"
            />
          </svg>
        </button>
        <button
          onClick={() => updateGridLayout(3)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16M8 6v12M12 6v12M16 6v12"
            />
          </svg>
        </button>
        <button
          onClick={() => updateGridLayout(4)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16M8 6v12M12 6v12M16 6v12M20 6v12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Header;
