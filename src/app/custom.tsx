import Image from "next/image";
import logo from "./logo.png";

function GameInfo() {
  return (
    <div className="game-info-container">
      <img src={logo.src} alt="Logo" className="game-info-img" />
      <h1 className="game-info-header">Welcome to the War of the Elector!</h1>
      <p className="game-info-description">
        {" "}
        This is a web app I (klaus) am making for Noah's new game. Functionality
        is limited, but I will add more as we go along. Current functionalities
        in development for release in first issue are:
        <ul>
          <li>
            <strong>User Authentication:</strong> Implement user functionality
          </li>
          <li>
            <strong>Resource Management:</strong> View and manage your
            resources/money (send and recieve)
          </li>
        </ul>
        <ul>
          <li>More features will be added as we go along.</li>
        </ul>
      </p>
    </div>
  );
}

export default GameInfo;
