interface CalcExpectedReturnOptions {
  stake: number;
  myTeamPool: number;
  otherTeamPool: number;
}

function calcExpectedReturn({
  stake,
  myTeamPool,
  otherTeamPool,
}: CalcExpectedReturnOptions): number {
  if (stake <= 0) {
    return 0;
  }

  const denominator = myTeamPool + stake;

  if (denominator === 0) {
    return 0;
  }

  const totalPool = myTeamPool + otherTeamPool + stake;

  return (stake / denominator) * totalPool;
}

export { calcExpectedReturn };
