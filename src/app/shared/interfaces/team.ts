import { Player } from './player';
import { Countries } from '../enum/countries.enum';

export interface Team {
  $key?: string;
  name: string;
  country: Countries;
  players: Player[];
}
