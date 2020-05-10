import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from 'src/app/shared/interfaces/player';
import { PlayerService } from 'src/app/shared/services/player.service';
import { TeamService } from 'src/app/shared/services/team.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-player-table',
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.scss'],
})
export class PlayerTableComponent implements OnInit {
  public players$: Observable<Player[]>;
  public selectedPlayer: Player;
  public showModal = false;

  constructor(private playerService: PlayerService, private teamService: TeamService) {}

  ngOnInit(): void {
    this.players$ = this.playerService.getPlayers();
  }

  newPlayer() {
    this.showModal = true;
    this.selectedPlayer = null;
    setTimeout(() => {
      window.location.replace('#open-modal');
    });
  }

  editPlayer(Player: Player) {
    this.selectedPlayer = { ...Player };
    this.showModal = true;
    setTimeout(() => {
      window.location.replace('#open-modal');
    });
  }

  deletePlayer(player: Player) {
    this.teamService
      .getTeams()
      .pipe(take(1))
      .subscribe((teams) => {
        const modifiedPlayers = teams[0].players ? teams[0].players.filter((player: any) => {
              return player.$key !== player.$key;
            })
          : teams[0].players;
        const formattedTeam = {
          ...teams[0],
          players: [...modifiedPlayers]
        }
        this.playerService.deletePlayer(player.$key)
        this.teamService.editTeam(formattedTeam)
      });
  }

  closeDialog() {
    this.showModal = false;
  }
}
