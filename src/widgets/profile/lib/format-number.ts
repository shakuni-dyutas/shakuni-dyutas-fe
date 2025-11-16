const POINTS_FORMATTER = new Intl.NumberFormat('ko-KR', {
  maximumFractionDigits: 0,
});

function formatPoints(value: number) {
  return `${POINTS_FORMATTER.format(value)} pt`;
}

function formatNumber(value: number) {
  return POINTS_FORMATTER.format(value);
}

function formatRank(value: number) {
  if (value <= 0) {
    return 'Rank #-';
  }

  return `Rank #${value}`;
}

export { formatNumber, formatPoints, formatRank };
