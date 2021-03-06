import { Component, OnInit } from "@angular/core";
import { PollutionService } from "../../services/pollution.service";
import { BikesService } from "../../services/bikes.service";
import { TrafficService } from "../../services/traffic.service";
import { LuasStopService } from "../../services/luasstop.service";
import { BusStopService } from "../../services/busstop.service";
import { IrishRailStopService } from "../../services/irishrailstop.service";
import { TimetablesService } from "../../services/timetables.service";
import { NgxXml2jsonService } from "ngx-xml2json";
@Component({
  selector: "app-dashboard-tracker",
  templateUrl: "./dashboard-tracker.component.html",
  styleUrls: ["./dashboard-tracker.component.css"],
})
export class DashboardTrackerComponent implements OnInit {
  mapsData: Object = {};
  alertListData = [];
  latLongList;
  pollutionDetails;
  bikesDetails;
  busstopDetails;
  luasstopDetails;
  irishrailstopDetails;
  interval;
  selected = "traffic";
  pollutionObject = [];

  constructor(
    private pollutionService: PollutionService,
    private bikesService: BikesService,
    private trafficService: TrafficService,
    private luasstopService: LuasStopService,
    private busstopService: BusStopService,
    private irishrailstopService: IrishRailStopService,
    private timetablesService: TimetablesService,
    private ngxXml2jsonService: NgxXml2jsonService
  ) {}

  ngOnInit() {
    let coordinates = [
      [53.3895286, -6.1190612],
      [52.3895286, -6.1190612],
    ];
    // this.fetchLatestPollutionDetails();
    this.loadMapSection();
    // this.interval = setInterval(() => {
    //   this.fetchLatestPollutionDetails();
    // }, 1800000);
  }

  loadMapSection() {
    if (localStorage.getItem("role") == "admin") {
      this.fetchTrafficData();
    } else {
      var permits = JSON.parse(localStorage.getItem("permits"));
      if (permits) {
        const keys = Object.keys(permits);
        var permissions = [];
        for (var i = 0; i < keys.length; i++) {
          if (permits[keys[i]] == true) {
            if (keys[i] == "bike") {
              this.fetchLatestBikesData();
            } else if (keys[i] == "dart") {
              this.fetchIrishRailStopData();
            } else if (keys[i] == "luas") {
              this.fetchLuasStopData();
            } else if (keys[i] == "bus") {
              this.fetchBusStopData();
            } else {
              this.fetchTrafficData();
            }
          }
        }
      }
    }
  }

  fetchAllLatLong() {
    this.pollutionService.fetchAllPollutionLatLongs().subscribe((response) => {
      this.latLongList = response;
    });
  }

  fetchLatestPollutionDetails() {
    if (!this.getSavedObjects("pollution")) {
      this.selected = "pollution";
      this.pollutionService.fetchPollutionDetails().subscribe((response) => {
        this.pollutionDetails = response;
        let pCoordinates = [];
        for (var i = 0; i < this.pollutionDetails.length; i++) {
          pCoordinates.push({
            cordinate: [
              this.pollutionDetails[i].lat,
              this.pollutionDetails[i].long,
            ],
            msg: this.pollutionDetails[i].index_irl_epa.category,
            color: this.pollutionDetails[i].index_irl_epa.color,
            aqi_display: this.pollutionDetails[i].index_irl_epa.aqi_display,
          });
        }
        let mapsJson = {
          coordinates: pCoordinates,
          changeTypeAPI: true,
          type: "pollution",
        };
        let tempJSON = {
          coordinates: pCoordinates,
          timestamp: new Date().valueOf(),
        };
        this.alertListData = [
          {
            id: "42343243",
            time: "23/10/2019 12:00:43",
            desc: "Test Test Test Test",
            criticality: "High",
            action: "Test",
          },
          {
            id: "74553423",
            time: "23/10/2019 12:00:43",
            desc: "Test Test Test Test",
            criticality: "High",
            action: "Test",
          },
          {
            id: "324346",
            time: "23/10/2019 12:00:43",
            desc: "Test Test Test Test",
            criticality: "High",
            action: "Test",
          },
          {
            id: "324346",
            time: "23/10/2019 12:00:43",
            desc: "Test Test Test Test",
            criticality: "High",
            action: "Test",
          },
          {
            id: "324346",
            time: "23/10/2019 12:00:43",
            desc: "Test Test Test Test",
            criticality: "High",
            action: "Test",
          },
          {
            id: "324346",
            time: "23/10/2019 12:00:43",
            desc: "Test Test Test Test",
            criticality: "High",
            action: "Test",
          },
        ];

        if (
          document.querySelector(".tab.selected").textContent == " Pollution "
        ) {
          this.mapsData = mapsJson;
          localStorage.setItem("pollutionObjectList", JSON.stringify(tempJSON));
        } else {
          localStorage.setItem("pollutionObjectList", JSON.stringify(tempJSON));
        }
      });
    }
  }
  getSavedObjects(objectType: string) {
    this.selected = objectType;
    var savedObjects = JSON.parse(
      localStorage.getItem(objectType + "ObjectList")
    );
    if (savedObjects != null) {
      let mapsJson = {
        coordinates: savedObjects.coordinates,
        changeTypeAPI: false,
        type: objectType,
      };
      this.mapsData = mapsJson;
      if (objectType == "irishrailstop") {
        this.saveTimeTableData(objectType, savedObjects.coordinates);
      }
      let d = new Date().valueOf();
      let lastUpdate = (d - savedObjects.timestamp) / 60000;
      if (lastUpdate > 15) {
        if (
          objectType == "irishrailstop" ||
          objectType == "luasstop" ||
          objectType == "busstop"
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  fetchLatestBikesData() {
    //localStorage.removeItem("bikeObjectList");
    if (!this.getSavedObjects("bike")) {
      this.selected = "bike";
      this.bikesService.fetchBikeDetails().subscribe((response) => {
        this.bikesDetails = response;
        let bCoordinates = [];
        for (var i = 0; i < this.bikesDetails.length; i++) {
          bCoordinates.push({
            standName: this.bikesDetails[i].name,
            cordinate: [this.bikesDetails[i].lat, this.bikesDetails[i].long],
            status: this.bikesDetails[i].status,
            availableBikes: this.bikesDetails[i].available_bikes,
            availableBikeStands: this.bikesDetails[i].available_bike_stands,
            bikeStands: this.bikesDetails[i].bike_stands,
          });
        }
        let mapsJson = {
          coordinates: bCoordinates,
          changeTypeAPI: true,
          type: "bike",
        };
        let tempJSON = {
          coordinates: bCoordinates,
          timestamp: new Date().valueOf(),
        };
        this.alertListData = [];
        if (document.querySelector(".tab.selected").textContent == " Bikes ") {
          this.mapsData = mapsJson;
          localStorage.setItem("bikeObjectList", JSON.stringify(tempJSON));
        } else {
          localStorage.setItem("bikeObjectList", JSON.stringify(tempJSON));
        }
      });
    }
  }

  fetchLuasStopData() {
    this.selected = "luasstop";
    if (!this.getSavedObjects("luasstop")) {
      this.luasstopService.fetchLuasStopDetails().subscribe((response) => {
        this.luasstopDetails = response;
        let lsCoordinates = [];
        for (var i = 0; i < this.luasstopDetails.length; i++) {
          lsCoordinates.push({
            cordinate: [
              this.luasstopDetails[i].lat,
              this.luasstopDetails[i].long,
            ],
            standName: this.luasstopDetails[i].StopName,
          });
        }
        let mapsJson = {
          coordinates: lsCoordinates,
          changeTypeAPI: true,
          type: "luasstop",
        };
        let tempJSON = {
          coordinates: lsCoordinates,
          timestamp: new Date().valueOf(),
        };
        this.alertListData = [];
        if (
          document.querySelector(".tab.selected").textContent == " Luas Stops "
        ) {
          this.mapsData = mapsJson;
          localStorage.setItem("luasstopObjectList", JSON.stringify(tempJSON));
        } else {
          localStorage.setItem("luasstopObjectList", JSON.stringify(tempJSON));
        }
      });
    }
  }

  fetchBusStopData() {
    this.selected = "busstop";
    if (!this.getSavedObjects("busstop")) {
      this.busstopService.fetchBusStopDetails().subscribe((response) => {
        this.busstopDetails = response;
        let bsCoordinates = [];
        for (var i = 0; i < this.busstopDetails.length; i++) {
          bsCoordinates.push({
            cordinate: [
              this.busstopDetails[i].lat,
              this.busstopDetails[i].long,
            ],
            standName: this.busstopDetails[i].StopName,
            stopId: this.busstopDetails[i].StopID,
          });
        }
        let mapsJson = {
          coordinates: bsCoordinates,
          changeTypeAPI: true,
          type: "busstop",
        };
        let tempJSON = {
          coordinates: bsCoordinates,
          timestamp: new Date().valueOf(),
        };
        this.alertListData = [];
        if (
          document.querySelector(".tab.selected").textContent == " Bus Stops "
        ) {
          this.mapsData = mapsJson;
          localStorage.setItem("busstopObjectList", JSON.stringify(tempJSON));
        } else {
          localStorage.setItem("busstopObjectList", JSON.stringify(tempJSON));
        }
      });
    }
  }

  retrievetimetable(serviceType: string) {
    let savedObjects = JSON.parse(
      localStorage.getItem(serviceType + "Timetable")
    );
    if (savedObjects != null) {
      let d = new Date().valueOf();
      let lastUpdate = (d - savedObjects.timestamp) / 60000;
      if (lastUpdate < 15) {
        return savedObjects.schedule;
      } else {
        return null;
      }
    } else {
      return savedObjects;
    }
  }

  saveTimeTableData(markerType: string, coordinates) {
    let savedTimeTable = this.retrievetimetable(markerType);
    if (savedTimeTable == null) {
      let timetable = [];
      var XML;
      if (coordinates) {
        for (let i = 0; i < coordinates.length; i++) {
          this.timetablesService
            .fetchTimetable(markerType, coordinates[i].standName)
            .subscribe((response) => {
              XML = new DOMParser().parseFromString(response, "text/xml");
              let jsonObj = this.ngxXml2jsonService.xmlToJson(XML);
              timetable.push(jsonObj);
              let tempJSON = {
                schedule: timetable,
                timestamp: new Date().valueOf(),
              };
              localStorage.setItem(
                markerType + "Timetable",
                JSON.stringify(tempJSON)
              );
            });
        }
      }
    }
  }

  fetchIrishRailStopData() {
    if (!this.getSavedObjects("irishrailstop")) {
      this.selected = "irishrailstop";
      this.irishrailstopService
        .fetchIrishRailStopDetails()
        .subscribe((response) => {
          this.irishrailstopDetails = response;
          let irsCoordinates = [];
          for (var i = 0; i < this.irishrailstopDetails.length; i++) {
            irsCoordinates.push({
              cordinate: [
                this.irishrailstopDetails[i].lat,
                this.irishrailstopDetails[i].long,
              ],
              standName: this.irishrailstopDetails[i].StopName,
            });
          }
          let mapsJson = {
            coordinates: irsCoordinates,
            changeTypeAPI: true,
            type: "irishrailstop",
          };
          let tempJSON = {
            coordinates: irsCoordinates,
            timestamp: new Date().valueOf(),
          };
          this.alertListData = [];
          if (
            document.querySelector(".tab.selected").textContent ==
            " Dart Stations "
          ) {
            this.mapsData = mapsJson;
            localStorage.setItem(
              "irishrailstopObjectList",
              JSON.stringify(tempJSON)
            );
          } else {
            localStorage.setItem(
              "irishrailstopObjectList",
              JSON.stringify(tempJSON)
            );
          }
          this.saveTimeTableData("irishrailstop", irsCoordinates);
        });
    }
  }

  fetchTrafficData() {
    if (!this.getSavedObjects("traffic")) {
      this.selected = "traffic";
      this.trafficService.fetchTrafficDetails().subscribe((response) => {
        let mapsJson = {
          coordinates: response,
          changeTypeAPI: true,
          type: "traffic",
        };
        let tempJSON = {
          coordinates: response,
          timestamp: new Date().valueOf(),
        };
        if (
          document.querySelector(".tab.selected").textContent == " Traffic "
        ) {
          this.mapsData = mapsJson;
          localStorage.setItem("trafficObjectList", JSON.stringify(tempJSON));
        } else {
          localStorage.setItem("trafficObjectList", JSON.stringify(tempJSON));
        }
        this.alertListData = [];
      });
    }
  }
}
