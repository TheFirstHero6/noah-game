import Image from "next/image";
import logo from "./logo.png";
import { currentUser, User } from "@clerk/nextjs/server";

async function GameInfo() {
  const user = await currentUser();
  const username = user?.firstName;

  const welcomeSuffix = username ? `, ${username}` : "";

  return (
    <div className="game-info-container">
      <Image src={logo} alt="Logo" className="game-info-img" />
      <h1 className="game-info-header">
        Welcome to the War of the Elector{welcomeSuffix}!
      </h1>

      <p className="game-info-description">
        {" "}
        This is a web app I (klaus) am making for Noah's new game. Functionality
        is limited, but I will add more as we go along. Current functionalities
        in development for release in first issue are:
      </p>
      <ul className="game-info-description">
        <li>
          <strong>User Authentication:</strong> Implement user functionality
        </li>
        <li>
          <strong>Resource Management:</strong> View and manage your
          resources/money (send and recieve)
        </li>
        More features will be added as we go along.
      </ul>
    </div>
  );
}

export default GameInfo;
