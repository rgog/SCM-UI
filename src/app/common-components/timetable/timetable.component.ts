import {
  Component,
  OnInit,
  NgModule,
  EventEmitter,
  Output,
  Inject
} from "@angular/core";
import {
  MatDialogRef,
  MatIcon,
  MatGridTile,
  MAT_DIALOG_DATA
} from "@angular/material";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl
} from "@angular/forms";
import { ThrowStmt } from '@angular/compiler';

@NgModule({
  declarations: [TimetableComponent],
  imports: [MatIcon, MatGridTile],
  providers: []
})
@Component({
  selector: "app-timetable",
  templateUrl: "./timetable.component.html",
  styleUrls: ["./timetable.component.css"]
})
export class TimetableComponent implements OnInit {

  targetStation = [];
  targetInfo = [];
  name: ''

  constructor(
    public dialogRef: MatDialogRef<TimetableComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data.type === "irishrailstop") {
      this.handleIrishRailData();
    }
  }

  handleIrishRailData() {
    let stationData = JSON.parse(localStorage.getItem("irishrailstopTimetable"))[
      "schedule"
    ];
    this.name = this.data.name;
    for (let i = 0; i < stationData.length; i++) {
      let currentStation = stationData[i]['ArrayOfObjStationData']['objStationData'];
      if (currentStation && Array.isArray(currentStation)) {
        if (currentStation[0]["Stationfullname"].toLowerCase().trim() ===
          this.data.name.toLowerCase().trim()) {
          this.targetStation.push(currentStation);
        }
      }
    }
    console.log("Target station:", this.targetStation);
    this.extractInfoFromTargetStation();
  }

  extractInfoFromTargetStation() {
    if (this.targetStation && this.targetStation.length > 0) {
      this.targetInfo = this.targetStation[0].map((node, index) => {
        return {
          origin: node["Origin"],
          originTime: node["Origintime"],
          dest: node["Destination"],
          destTime: node["Destinationtime"],
          dueIn: node["Duein"],
          late: node["Late"],
          image: node["Traintype"].toLowerCase().trim() == 'dart' ? "../../../assets/images/dart.png" : "../../../assets/images/irail.png"
        };
      });
    }
  }

}

