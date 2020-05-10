import { SquadNumber } from '../enum/squad-number.enum';
import { Countries } from '../enum/countries.enum';

export interface Player {
  $key?: string;
  name: string;
  lastName: string;
  position: SquadNumber;
  weight: number;
  height: number;
  nationality: Countries;
  leftFooted: boolean;
}
