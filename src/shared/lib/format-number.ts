const NUMBER_FORMATTER = new Intl.NumberFormat('ko-KR', {
  maximumFractionDigits: 0,
});

function formatPoints(value: number) {
  return `${NUMBER_FORMATTER.format(value)} pt`;
}

function formatNumber(value: number) {
  return NUMBER_FORMATTER.format(value);
}

function formatRank(value: number) {
  if (value <= 0) {
    return 'Rank #-';
  }

  return `Rank #${value}`;
}

function formatWinRate(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const clamped = Math.min(100, Math.max(0, Math.round(safeValue)));
  return `${clamped}%`;
}

export { formatNumber, formatPoints, formatRank, formatWinRate };
