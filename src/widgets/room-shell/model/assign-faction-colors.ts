import { getRoomFactionColor } from '@/entities/room/config/constants';
import type { TeamFaction } from '@/entities/team/types/team-faction';

function assignFactionColors(factions: TeamFaction[]) {
  const colorized = factions.map((faction, index) => ({
    ...faction,
    color: faction.color ?? getRoomFactionColor(index),
  }));

  const colorMap = colorized.reduce<Record<string, string>>((acc, faction) => {
    acc[faction.id] = faction.color ?? getRoomFactionColor(0);
    return acc;
  }, {});

  return { colorized, colorMap };
}

export { assignFactionColors };
