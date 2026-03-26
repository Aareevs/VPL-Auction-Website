import { AuctionValueMode, Player } from '../types';
import { formatAuctionValue } from '../constants';

export const CAPTAIN_SUFFIX = ' (C)';

export const isCaptain = (player: Player) => player.name.endsWith(CAPTAIN_SUFFIX);

export const getPlayerDisplayName = (player: Player) =>
  isCaptain(player) ? player.name.slice(0, -CAPTAIN_SUFFIX.length) : player.name;

export const getPlayerDisplayRole = (player: Player) => (isCaptain(player) ? '' : player.role);

export const getPlayerAcquisitionLabel = (player: Player, mode: AuctionValueMode) =>
  !isCaptain(player) && player.soldPrice && player.soldPrice > 0 ? formatAuctionValue(player.soldPrice, mode) : '';
