import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Team } from 'src/app/shared/interfaces/team';
import { Countries } from 'src/app/shared/enum/countries.enum';
import { SquadNumber } from 'src/app/shared/enum/squad-number.enum';
import { PlayerService } from 'src/app/shared/services/player.service';
import { TeamService } from 'src/app/shared/services/team.service';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { Player } from 'src/app/shared/interfaces/player';

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.scss'],
})
export class PlayerDialogComponent implements OnInit {
  @Input() player: Player;
  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter();
  private team: Team;
  public countries;
  public squadNumber;
  constructor(private playerService: PlayerService, private teamService: TeamService) {
    this.countries = Object.keys(Countries).map((countreyKey) => ({
      label: countreyKey,
      key: Countries[countreyKey],
    }));
    this.squadNumber = Object.keys(SquadNumber)
      .slice(Object.keys(SquadNumber).length / 2)
      .map((squadkey) => ({
        label: squadkey,
        key: SquadNumber[squadkey],
      }));
  }

  ngOnInit(): void {
    this.teamService
      .getTeams()
      .pipe(take(1))
      .subscribe((teams) => {
        if (teams.length > 0) {
          this.team = teams[0];
        }
      });
  }

  private editPlayer(playerFormValue) {
    const playerFormValueKey = { ...playerFormValue, $key: this.player.$key };
    const playerFormValueFormattedKey = { ...playerFormValue, key: this.player.$key };

    delete playerFormValueFormattedKey.$key;

    const modifiedPlayers = this.team.players
      ? this.team.players.map((player: any) => {
          return player.key === this.player.$key ? playerFormValueFormattedKey : player;
        })
      : this.team.players;
    const formattedTeam = {
      ...this.team,
      players: [...(modifiedPlayers ? modifiedPlayers : [playerFormValueFormattedKey])],
    };
    this.playerService.editPlayer(playerFormValueKey);
    this.teamService.editTeam(formattedTeam);
  }

  private newPlayer(playerFormValue) {
    const key = this.playerService.addPlayer(playerFormValue).key;
    const playerFormValueKey = {
      ...playerFormValue,
      key,
    };
    const formattedTeam = {
      ...this.team,
      players: [...(this.team.players ? this.team.players : []), playerFormValueKey],
    };

    this.teamService.editTeam(formattedTeam);
  }

  onClose() {
    this.closeDialog.emit(true);
  }

  onSubmit(playerForm: NgForm) {
    const playerFormValue = { ...playerForm.value };
    playerFormValue.leftFooted = !!playerFormValue.leftFooted ? playerFormValue.leftFooted : false;
    if (this.player) {
      this.editPlayer(playerFormValue);
    } else {
      this.newPlayer(playerFormValue);
    }

    window.location.replace('#');
  }
}
