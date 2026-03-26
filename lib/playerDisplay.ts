import { Player } from '../types';
import { formatCurrency } from '../constants';

export const CAPTAIN_SUFFIX = ' (C)';

export const isCaptain = (player: Player) => player.name.endsWith(CAPTAIN_SUFFIX);

export const getPlayerDisplayName = (player: Player) =>
  isCaptain(player) ? player.name.slice(0, -CAPTAIN_SUFFIX.length) : player.name;

export const getPlayerDisplayRole = (player: Player) => player.role;

export const getPlayerAcquisitionLabel = (player: Player) =>
  player.soldPrice && player.soldPrice > 0 ? formatCurrency(player.soldPrice) : '';
