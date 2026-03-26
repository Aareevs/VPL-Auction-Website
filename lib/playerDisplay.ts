import { Player } from '../types';

export const CAPTAIN_SUFFIX = ' (C)';

export const isCaptain = (player: Player) => player.name.endsWith(CAPTAIN_SUFFIX);

export const getPlayerDisplayName = (player: Player) =>
  isCaptain(player) ? player.name.slice(0, -CAPTAIN_SUFFIX.length) : player.name;

export const getPlayerDisplayRole = (player: Player) =>
  isCaptain(player) ? `${player.role} • Captain` : player.role;
