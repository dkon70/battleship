import { LeaderBoardType } from "../types/types";

const leaderBoard: LeaderBoardType[] = [];

function addWinner(name: string) {
  for (let i = 0; i < leaderBoard.length; i++) {
    if (leaderBoard[i].name === name) {
      leaderBoard[i].wins += 0.5;
      return;
    }
  }
  leaderBoard.push({ name: name, wins: 0.5 });
  return;
}

function getWinners() {
  return leaderBoard;
}

export { addWinner, getWinners };