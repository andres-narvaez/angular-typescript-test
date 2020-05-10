import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/shared/services/team.service';
import { Observable } from 'rxjs';
import { Team } from 'src/app/shared/interfaces/team';
import { take } from 'rxjs/operators';
import { Countries } from 'src/app/shared/enum/countries.enum';
import { TeamsTableHeaders } from '../../shared/services/team.service';

@Component({
  selector: 'app-team-table',
  templateUrl: './team-table.component.html',
  styleUrls: ['./team-table.component.scss'],
})
export class TeamTableComponent implements OnInit {
  public teams$: Observable<Team[]>;
  public tableHeader = TeamsTableHeaders;

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.teams$ = this.teamService.getTeams();
    this.teamService
      .getTeams()
      .pipe(take(1))
      .subscribe((teams) => {
        if (teams.length === 0) {
          const team: Team = {
            name: 'My amazing team',
            country: Countries.Colombia,
            players: null,
          };

          this.teamService.addTeam(team)
        }
      });
  }
}
